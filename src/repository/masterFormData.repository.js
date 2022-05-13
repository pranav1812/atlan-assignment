const { Op } = require('sequelize');

const { MasterFormTable }= require('../../models');

const createMasterFormTable = async (data)=> {
    try {
        const masterFormTable = await MasterFormTable.create(data);
        return [null, JSON.parse(JSON.stringify(masterFormTable))];
    } catch (error) {
        return [error, null];
    }
}

const findMasterFormTableByQuery = async (query)=> {
    try {
        const masterFormTable = await MasterFormTable.findOne({
            where: query
        });
        return [null, JSON.parse(JSON.stringify(masterFormTable))];
    } catch (error) {
        return [error, null];
    }
}

const updateMasterFormTableByQuery = async (query, updateObj)=> {
    try {
        const masterFormTable = await MasterFormTable.update(updateObj, {
            where: query
        });
        return [null, JSON.parse(JSON.stringify(masterFormTable))];
    } catch (error) {
        return [error, null];
    }
}

module.exports= {
    createMasterFormTable,
    findMasterFormTableByQuery,
    updateMasterFormTableByQuery,
}