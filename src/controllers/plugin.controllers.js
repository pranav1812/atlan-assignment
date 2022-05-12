
const pluginPathMap= {
    googleSheets: require('../functions/googleSheets')
}

const pluginsController= async(req, res) => {
    try {
        const { pluginType } = req.query;
        const func= pluginPathMap[pluginType];
        if (!func) {
            return res.status(400).json({
                error: `Plugin type ${pluginType} not supported yet!!`,
                message: null,
                code: 400
            });
        }
        
    } catch (error) {
        
    }
}

module.exports= {
    pluginsController,
}