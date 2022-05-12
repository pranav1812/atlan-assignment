const { Sequelize, sequelize } = require('../../models');

const {
    createMasterFormTable,
    findMasterFormTableByQuery,
    updateMasterFormTableByQuery,
}= require('../repository/masterFormData.repository');

const {
    rootUrl
}= require('../utility/constants');

const dataTypeMap= {
    text: Sequelize.TEXT,
    number: Sequelize.NUMBER,
    date: Sequelize.DATE,
    string: Sequelize.STRING,
    boolean: Sequelize.BOOLEAN,
}

const _generateUniqueFormLink= (formName)=> `${Date.now()}-${Math.floor(Math.random()*1000000).toString(16)}-${formName}`;

const createForm = async(req, res) => {
    try {
        const { formName, formSchema, description, metaData } = req.body;
        // create a new table on the database with the given schema in req.body with 
        // formSchema is an object of objects
        var keys = Object.keys(formSchema);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var newType = dataTypeMap[formSchema[key].type];
            if (!newType) 
                newType= Sequelize.TEXT;
            formSchema[key].type= newType;
        }
        const newTableModel= sequelize.define(formName, formSchema);
        await newTableModel.sync();
        const  formLink= _generateUniqueFormLink(formName);
        const [err, newMasterFormTableRecord]= await createMasterFormTable({
            title: formName,
            table: formName,
            responseLink: formLink,
            description: description,
            meta_data: JSON.stringify(metaData),
            table_schema: JSON.stringify(formSchema),
            columns: JSON.stringify(keys),
        });
        if (err) {
            console.log(`Error creating new master form table: ${err}`);
            return res.status(500).json({
                error: `Error creating new master form table: ${err}`,
                message: null,
                code: 500
            });
        } 
        return res.status(200).json({
            error: null,
            message: `Form ${formName} created successfully`,
            code: 200
        });
    } catch (error) {
        return res.status(500).json({
            error: `Error creating new master form table: ${error.message}`,
            message: null,
            data: {
                link: rootUrl + '/forms/fill' + formLink
            },
            code: 500
        });
    }
}

const fillForm = async(req, res) => {
    try {
        const { formLink } = req.params;
        const { data } = req.body;

        // get info about actual table from master record on the basis of formLink


        // create a new record on the actual table
    } catch (error) {
        
    }
}

const viewResponses = async(req, res) => {
    try {
        const { formLink } = req.params;
        // get info about actual table from master record on the basis of formLink

        // first validate that req.user.uid== owner of the form

        // get all records from the actual table ordered by createdAt desc

        // return the records
    } catch (error) {
        
    }
}

module.exports= {
    createForm,
    fillForm,
    viewResponses
}