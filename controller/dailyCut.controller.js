const crypto = require('crypto')
const { Op } = require('sequelize')
const sequelize = require('../components/conn_sqlz')
const initModels = require('../src/modelKorea/init-models')
const models = initModels(sequelize)

exports.generateDailyCutToken = async (req, res) => {
    try {
        const cutDate = req.body.cut_date || new Date().toISOString().split('T')[0]
        const companyId = req.body.company_id || null
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

        await models.Daily_Cut_Token.update(
            { status: 0 },
            { where: { cut_date: cutDate, company_id: companyId, status: 1 } }
        )

        await models.Daily_Cut_Token.create({
            token, cut_date: cutDate, company_id: companyId, expires_at: expiresAt, status: 1
        })

        res.json({ success: true, payload: { token, cut_date: cutDate, expires_at: expiresAt, url: `/corte/${token}` } })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}

exports.getDailyCutData = async (req, res) => {
    try {
        const { token } = req.params
        const cutToken = await models.Daily_Cut_Token.findOne({
            where: { token, status: 1, expires_at: { [Op.gt]: new Date() } }
        })

        if (!cutToken) {
            return res.status(404).json({ success: false, payload: 'Token invalido o expirado' })
        }

        const cutDate = cutToken.cut_date
        const companyId = cutToken.company_id
        const now = new Date()

        const whereClause = { status: { [Op.gt]: 0 } }
        if (companyId) whereClause.company_id = companyId

        const allOrders = await models.Order_Header.findAll({
            where: whereClause,
            include: [
                { model: models.Client, as: 'client', attributes: ['name', 'nit'] },
                { model: models.Vehicle, as: 'vehicule', attributes: ['plate_id', 'linea'], include: [{ model: models.Vehicle_Brand, as: 'vehicule_brand', attributes: ['name'] }] },
                { model: models.Technical, as: 'technical', attributes: ['name'] },
            ],
            order: [['create_date', 'DESC']]
        })

        const dayStart = new Date(cutDate + 'T00:00:00')
        const dayEnd = new Date(cutDate + 'T23:59:59')

        // Recibidos hoy
        const recibidos = allOrders.filter(o => {
            const d = o.create_date || o.order_date
            return d && d >= dayStart && d <= dayEnd
        })

        // En proceso (status 1-8, sin importar fecha)
        const enProceso = allOrders.filter(o => o.status >= 1 && o.status < 9)

        // Entregados hoy (status log)
        const statusLogs = await models.Order_Status_Log.findAll({
            where: { status: 9, start_date: { [Op.between]: [dayStart, dayEnd] } },
            attributes: ['order_id']
        })
        const entregadoIds = new Set(statusLogs.map(l => l.order_id))
        const entregados = allOrders.filter(o => entregadoIds.has(o.id))

        // Status breakdown
        const statusCounts = {}
        for (const o of enProceso) {
            statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
        }

        // --- METRICAS AVANZADAS ---

        // Tiempo promedio en taller (dias desde create_date para en proceso)
        let avgDays = 0
        if (enProceso.length > 0) {
            const totalDays = enProceso.reduce((sum, o) => {
                const created = o.create_date || o.order_date
                if (!created) return sum
                return sum + (now - new Date(created)) / (1000 * 60 * 60 * 24)
            }, 0)
            avgDays = Math.round(totalDays / enProceso.length * 10) / 10
        }

        // Carros estancados (>3 dias sin cambio de status)
        const recentLogs = await models.Order_Status_Log.findAll({
            where: { end_date: null },
            attributes: ['order_id', 'status', 'start_date'],
            order: [['start_date', 'DESC']]
        })
        const logByOrder = {}
        for (const log of recentLogs) {
            if (!logByOrder[log.order_id]) logByOrder[log.order_id] = log
        }

        const stalled = enProceso.filter(o => {
            const log = logByOrder[o.id]
            if (!log) return false
            const daysSince = (now - new Date(log.start_date)) / (1000 * 60 * 60 * 24)
            return daysSince > 3
        }).map(o => {
            const log = logByOrder[o.id]
            const daysSince = Math.round((now - new Date(log.start_date)) / (1000 * 60 * 60 * 24))
            return { ...formatOrder(o), days_stalled: daysSince, stalled_at_status: o.status }
        })

        // Comparativa vs semana pasada (mismo dia)
        const lastWeekStart = new Date(dayStart)
        lastWeekStart.setDate(lastWeekStart.getDate() - 7)
        const lastWeekEnd = new Date(dayEnd)
        lastWeekEnd.setDate(lastWeekEnd.getDate() - 7)

        const recibidosLastWeek = allOrders.filter(o => {
            const d = o.create_date || o.order_date
            return d && d >= lastWeekStart && d <= lastWeekEnd
        }).length

        const logsLastWeek = await models.Order_Status_Log.findAll({
            where: { status: 9, start_date: { [Op.between]: [lastWeekStart, lastWeekEnd] } },
            attributes: ['order_id']
        })
        const entregadosLastWeek = logsLastWeek.length

        // Top tecnicos del mes (por ordenes cerradas)
        const monthStart = new Date(cutDate.substring(0, 7) + '-01T00:00:00')
        const monthEnd = new Date(dayEnd)
        const monthLogs = await models.Order_Status_Log.findAll({
            where: { status: 9, start_date: { [Op.between]: [monthStart, monthEnd] } },
            attributes: ['order_id']
        })
        const monthEntregadoIds = new Set(monthLogs.map(l => l.order_id))
        const techCounts = {}
        for (const o of allOrders) {
            if (monthEntregadoIds.has(o.id) && o.technical?.name) {
                techCounts[o.technical.name] = (techCounts[o.technical.name] || 0) + 1
            }
        }
        const topTechnicals = Object.entries(techCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }))

        // Indicador de salud
        const stalledPct = enProceso.length > 0 ? stalled.length / enProceso.length : 0
        const health = stalledPct > 0.3 ? 'red' : stalledPct > 0.1 ? 'yellow' : 'green'

        function formatOrder(o) {
            return {
                id: o.id,
                number_pass: o.number_pass,
                status: o.status,
                client: o.client?.name || 'N/A',
                client_nit: o.client?.nit || '',
                vehicle: `${o.vehicule?.vehicule_brand?.name || ''} ${o.vehicule?.linea || ''}`.trim(),
                plate: o.vehicule?.plate_id || '',
                technical: o.technical?.name || 'N/A',
                date: o.create_date || o.order_date,
            }
        }

        res.json({
            success: true,
            payload: {
                cut_date: cutDate,
                health,
                summary: {
                    recibidos: recibidos.length,
                    en_proceso: enProceso.length,
                    entregados: entregados.length,
                    status_counts: statusCounts,
                    avg_days_in_shop: avgDays,
                    stalled_count: stalled.length,
                },
                comparison: {
                    recibidos_last_week: recibidosLastWeek,
                    entregados_last_week: entregadosLastWeek,
                },
                top_technicals: topTechnicals,
                recibidos: recibidos.map(formatOrder),
                entregados: entregados.map(formatOrder),
                stalled: stalled,
            }
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, payload: error.message || error })
    }
}
