const { Model } = require('sequelize');

module.exports= (sequelize, Sequelize)=> {
    class User extends Model {
        static associate({
            MasterFormTable
        }){
            this.hasMany(MasterFormTable, { foreignKey: 'id' })
        }
    }
    User.init({
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        access_info: {
            type: Sequelize.TEXT,
        }
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true,
        tableName: 'user',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return User;
}