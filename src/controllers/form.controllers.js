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
    integer: Sequelize.INTEGER,
    date: Sequelize.DATE,
    string: Sequelize.STRING,
    boolean: Sequelize.BOOLEAN,
}

const _generateUniqueFormLink= (formName)=> `${Date.now()}_${Math.floor(Math.random()*1000000).toString(16)}_${formName}`;

const _getDate= ()=>{
    // return date time in mysql format
    var today= new Date().toISOString()
    return today.slice(0, 19).replace('T', ' ');
}

const createForm = async(req, res) => {
    try {
        const { uid }= req.user;
        if (!uid) {
            return res.status(400).json({
                error: `User not logged in`,
                message: null,
                code: 400
            });
        }
        var { formName, formSchema, description, metaData } = req.body;
        // replace all '-' with '_' in formName
        formName= formName.replace(/-/g, '_');
        console.log(formName, formSchema, description, metaData)
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

        formSchema['createdAt']= {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
        formSchema['updatedAt']= {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
        keys.push('createdAt');
        keys.push('updatedAt');

        // don't add 's' after table name
        const newTableModel= sequelize.define(formName, formSchema, { 
            freezeTableName: true,
        });
        await newTableModel.sync();
        const  formLink= _generateUniqueFormLink(formName);
        const [err, newMasterFormTableRecord]= await createMasterFormTable({
            title: formName,
            table: formName,
            response_link: formLink,
            description: description,
            meta_data: JSON.stringify(metaData),
            table_schema: JSON.stringify(formSchema),
            columns: JSON.stringify(keys),
            owner: uid
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
            code: 200,
            data: {
                responseLink: `${rootUrl}/forms/fill/${formLink}`,
                viewResponsesLink: `${rootUrl}/forms/viewResponses/${formLink}`
            }
        });
    } catch (error) {
        return res.status(500).json({
            error: `Error in creating new master form table: ${error.message}`,
            message: null,
            code: 500
        });
    }
}

const fillForm = async(req, res) => {
    try {
        const { formLink } = req.params;
        const { data } = req.body;

        // get info about actual table from master record on the basis of formLink
        const [err, masterFormTableRecord]= await findMasterFormTableByQuery({
            response_link: formLink
        });
        if (err || !masterFormTableRecord) {
            console.log(`Error finding master form table: ${err}`);
            return res.status(400).json({
                error: `Error finding master form table: ${err}`,
                message: null,
                code: 400
            });
        }
        console.log(masterFormTableRecord);
        var { columns, table }= masterFormTableRecord;
        columns= JSON.parse(columns);
        var fieldsInData= Object.keys(data);

        var currTime= _getDate();
        
        // console.log(`(${fieldsInData.map(field=> `${data[field]}`).join(',')})`);
        const sqlQuery= `INSERT INTO ${table} (${columns.join(',')}) VALUES (${fieldsInData.map(field=> `'${data[field]}'`).join(',')}, '${currTime}','${currTime}')`;
        // console.log(sqlQuery);

        await sequelize.query(sqlQuery);
        // return the new record
        return res.status(200).json({
            error: null,
            message: `Form filled successfully`,
            code: 200,
            data: {}
        });
    } catch (error) {
        console.log(`Error filling form: ${error}`);
        return res.status(500).json({
            error: `Error filling form: ${error}`,
            message: null,
            code: 500
        });
    }
}

const viewResponses = async(req, res) => {
    try {
        const { formLink } = req.params;
        console.log(formLink);
        // get info about actual table from master record on the basis of formLink
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
        // get all records from the actual table ordered by createdAt 
        console.log(`TABLE: ${masterFormTableRecord.table}`)
        const records= await sequelize.query(`SELECT * FROM ${masterFormTableRecord.table} ORDER BY createdAt`);
        console.log(JSON.stringify(records[0], null, 2));
        // return the records
        return res.status(200).json({
            error: null,
            message: `Form ${formLink} retrieved successfully`,
            code: 200,
            data: records[0]
        });
    } catch (error) {
        console.log(`Error finding master form table: ${error}`);
        return res.status(500).json({
            error: `Error finding master form table: ${error.message}`,
            message: null,
            code: 500
        });
    }
}

module.exports= {
    createForm,
    fillForm,
    viewResponses
}