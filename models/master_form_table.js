const { Model } = require('sequelize');

module.exports= (sequelize, Sequelize)=> {
    class MasterFormTable extends Model {
        static associate({ User }) {
            MasterFormTable.belongsTo(User, { foreignKey: 'id' });
        }
    }
    MasterFormTable.init({
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        owner: {
            type: Sequelize.UUID,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "Untitled Form"
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        response_link: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        table: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        table_schema: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        columns: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        meta_data: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        spread_sheet_link: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        validation_script: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        extras: {
            type: Sequelize.TEXT,
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'MasterFormTable',
        timestamps: true,
        tableName: 'master_form_table',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return MasterFormTable;
}