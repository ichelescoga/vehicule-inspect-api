const sequelize = require('../components/conn_sqlz');
const initModels = require('../src/modelKorea/init-models');
const models = initModels(sequelize);

module.exports = (function() {

    let createQA = async(params) => {
        return await models.Order_QA.create({
            order_id: params.order_id,
            tech_comments: params.tech_comments,
            client_comments: params.client_comments,
            qa_manager_name: params.qa_manager_name,
            decision: 'pending',
            create_date: new Date(),
            status: 1
        })
    }

    let getQAByOrderId = async(orderId) => {
        return await models.Order_QA.findOne({
            where: { order_id: orderId, status: 1 },
            order: [['create_date', 'DESC']],
            include: [{ model: models.QA_File, as: 'QA_Files', where: { status: 1 }, required: false }]
        })
    }

    let updateQA = async(id, params) => {
        return await models.Order_QA.update({
            tech_comments: params.tech_comments,
            client_comments: params.client_comments,
            qa_manager_name: params.qa_manager_name,
            decision: params.decision,
            reject_observations: params.reject_observations,
            signature_s3_path: params.signature_s3_path,
        }, { where: { id: id } })
    }

    let getQAFiles = async(orderId) => {
        return await models.QA_File.findAll({
            where: { order_id: orderId, status: 1 },
            order: [['create_date', 'DESC']]
        })
    }

    let deleteQAFile = async(id) => {
        return await models.QA_File.update({ status: 0 }, { where: { id: id } })
    }

    return {
        createQA,
        getQAByOrderId,
        updateQA,
        getQAFiles,
        deleteQAFile,
    }
})()
