/**
 * Daily Cut Notifier — Korea Autos
 * Genera y envia el corte diario por WhatsApp a las 7pm Guatemala.
 */

const { Op } = require('sequelize')
const sequelize = require('../components/conn_sqlz')
const initModels = require('../src/modelKorea/init-models')
const models = initModels(sequelize)
const { notifyAll } = require('./whatsappNotifier')

const STATUS_LABELS = {
    1: "Recepcion",
    2: "Diagnostico",
    3: "Presupuesto",
    4: "Autorizacion",
    5: "En Proceso",
    6: "Requisicion",
    7: "Repuestos",
    8: "Control Calidad",
    9: "Entregado",
}

const HEALTH_EMOJI = { green: "🟢", yellow: "🟡", red: "🔴" }

async function sendDailyCut() {
    try {
        const now = new Date()
        const cutDate = now.toLocaleDateString('en-CA', { timeZone: 'America/Guatemala' })
        console.log(`[CORTE] Generando corte diario: ${cutDate}`)

        const dayStart = new Date(cutDate + 'T00:00:00')
        const dayEnd = new Date(cutDate + 'T23:59:59')

        const allOrders = await models.Order_Header.findAll({
            where: { status: { [Op.gt]: 0 } },
            include: [
                { model: models.Client, as: 'client', attributes: ['name'] },
                { model: models.Vehicle, as: 'vehicule', attributes: ['plate_id', 'linea'], include: [{ model: models.Vehicle_Brand, as: 'vehicule_brand', attributes: ['name'] }] },
                { model: models.Technical, as: 'technical', attributes: ['name'] },
            ],
            order: [['create_date', 'DESC']]
        })

        // Recibidos hoy
        const recibidos = allOrders.filter(o => {
            const d = o.create_date || o.order_date
            return d && d >= dayStart && d <= dayEnd
        })

        // En proceso
        const enProceso = allOrders.filter(o => o.status >= 1 && o.status < 9)

        // Entregados hoy
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

        // Promedio dias en taller
        let avgDays = 0
        if (enProceso.length > 0) {
            const totalDays = enProceso.reduce((sum, o) => {
                const created = o.create_date || o.order_date
                if (!created) return sum
                return sum + (now - new Date(created)) / (1000 * 60 * 60 * 24)
            }, 0)
            avgDays = Math.round(totalDays / enProceso.length * 10) / 10
        }

        // Estancados (>3 dias sin cambio)
        const recentLogs = await models.Order_Status_Log.findAll({
            where: { end_date: null },
            attributes: ['order_id', 'status', 'start_date']
        })
        const logByOrder = {}
        for (const log of recentLogs) {
            if (!logByOrder[log.order_id]) logByOrder[log.order_id] = log
        }

        const stalled = enProceso.filter(o => {
            const log = logByOrder[o.id]
            if (!log) return false
            return (now - new Date(log.start_date)) / (1000 * 60 * 60 * 24) > 3
        })

        // Salud
        const stalledPct = enProceso.length > 0 ? stalled.length / enProceso.length : 0
        const health = stalledPct > 0.3 ? 'red' : stalledPct > 0.1 ? 'yellow' : 'green'

        // Top tecnicos del mes
        const monthStart = new Date(cutDate.substring(0, 7) + '-01T00:00:00')
        const monthLogs = await models.Order_Status_Log.findAll({
            where: { status: 9, start_date: { [Op.between]: [monthStart, dayEnd] } },
            attributes: ['order_id']
        })
        const monthIds = new Set(monthLogs.map(l => l.order_id))
        const techCounts = {}
        for (const o of allOrders) {
            if (monthIds.has(o.id) && o.technical?.name) {
                techCounts[o.technical.name] = (techCounts[o.technical.name] || 0) + 1
            }
        }
        const topTechs = Object.entries(techCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

        // Formatear mensaje
        let msg = `📊 *CORTE DIARIO — ${cutDate}*\n`
        msg += `${HEALTH_EMOJI[health]} Salud del taller: *${health.toUpperCase()}*\n\n`

        msg += `📥 Recibidos hoy: *${recibidos.length}*\n`
        msg += `🔧 En proceso: *${enProceso.length}*\n`
        msg += `📤 Entregados hoy: *${entregados.length}*\n`
        msg += `⏱️ Promedio dias en taller: *${avgDays}*\n`
        msg += `⚠️ Estancados (>3 dias): *${stalled.length}*\n\n`

        // Desglose por status
        msg += `📋 *Desglose:*\n`
        for (let s = 1; s <= 8; s++) {
            if (statusCounts[s]) {
                msg += `  ${s}. ${STATUS_LABELS[s]}: ${statusCounts[s]}\n`
            }
        }

        // Recibidos hoy detalle
        if (recibidos.length > 0) {
            msg += `\n🚗 *Recibidos hoy:*\n`
            for (const o of recibidos.slice(0, 10)) {
                const plate = o.vehicule?.plate_id || "S/P"
                const brand = o.vehicule?.vehicule_brand?.name || ""
                msg += `  • ${plate} ${brand} — ${o.client?.name || "N/A"}\n`
            }
            if (recibidos.length > 10) msg += `  ... y ${recibidos.length - 10} mas\n`
        }

        // Entregados hoy detalle
        if (entregados.length > 0) {
            msg += `\n✅ *Entregados hoy:*\n`
            for (const o of entregados.slice(0, 10)) {
                const plate = o.vehicule?.plate_id || "S/P"
                const brand = o.vehicule?.vehicule_brand?.name || ""
                msg += `  • ${plate} ${brand} — ${o.client?.name || "N/A"}\n`
            }
            if (entregados.length > 10) msg += `  ... y ${entregados.length - 10} mas\n`
        }

        // Estancados
        if (stalled.length > 0) {
            msg += `\n⚠️ *Estancados:*\n`
            for (const o of stalled.slice(0, 5)) {
                const plate = o.vehicule?.plate_id || "S/P"
                const log = logByOrder[o.id]
                const days = Math.round((now - new Date(log.start_date)) / (1000 * 60 * 60 * 24))
                msg += `  • ${plate} — ${days} dias en ${STATUS_LABELS[o.status] || 'Status ' + o.status}\n`
            }
            if (stalled.length > 5) msg += `  ... y ${stalled.length - 5} mas\n`
        }

        // Top tecnicos
        if (topTechs.length > 0) {
            msg += `\n🏆 *Top tecnicos del mes:*\n`
            const medals = ['🥇', '🥈', '🥉', '4.', '5.']
            for (let i = 0; i < topTechs.length; i++) {
                msg += `  ${medals[i]} ${topTechs[i][0]}: ${topTechs[i][1]} entregas\n`
            }
        }

        msg += `\n🔗 vehiculos.koreautosgt.com`

        await notifyAll(msg)
        console.log(`[CORTE] Enviado exitosamente`)
    } catch (err) {
        console.error(`[CORTE] Error:`, err.message)
    }
}

module.exports = { sendDailyCut }
