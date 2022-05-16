const { Sequelize, sequelize } = require('../../models');

const {
    findMasterFormTableByQuery,
}= require('../repository/masterFormData.repository');

const {
    findUserByQueryRepo,
}= require('../repository/user.repository')

const pluginPathMap= {
    googleSheets: require('../functions/googleSheets')
}


const pluginsController= async(req, res) => {
    try {
        const { pluginType, formLink } = req.query;
        const func= pluginPathMap[pluginType];
        if (!func) {
            return res.status(400).json({
                error: `Plugin type ${pluginType} not supported yet!!`,
                message: null,
                code: 400
            });
        }
        const [err, masterFormTableRecord]= await findMasterFormTableByQuery({
            response_link: formLink
        });
        if (err || !masterFormTableRecord) {
            console.log(`Error finding master form table: ${err}`);
            return res.status(404).json({
                error: `Failed to find form: ${err}`,
                message: null,
                code: 404
            });
        }
        // first validate that req.user.uid== owner of the form
        if (req.user.uid != masterFormTableRecord.owner) {
            return res.status(403).json({
                error: `You are not authorized to view this form`,
                message: null,
                code: 403 // forbidden
            });
        }

        const [err2, userRecord]= await findUserByQueryRepo({
            id: req.user.uid
        });
        if (err2 || !userRecord) {
            console.log(`Error finding user: ${err2}`);
            return res.status(404).json({
                error: `Failed to find user: ${err2}`,
                message: null,
                code: 404
            });
        }
        console.log(`TABLE: ${masterFormTableRecord.table}`)
        const records= await sequelize.query(`SELECT * FROM ${masterFormTableRecord.table} ORDER BY createdAt`);
        const metaData= {
            spreadsheetTitle: masterFormTableRecord.response_link,
        }

        var pluginResponse= await func(JSON.parse(userRecord.access_info), records[0], metaData);
        return res.status(pluginResponse.code).json({
            error: pluginResponse.error,
            message: pluginResponse.message,
            code: pluginResponse.code,
            data: pluginResponse.data
        });
    } catch (error) {
        console.log(`Error in plugin function: ${error.message}`);
        return res.status(500).json({
            error: `Error in plugin function: ${error.message}`,
            message: null,
            code: 500
        });
    }
}

module.exports= {
    pluginsController,
}