const { Op } = require('sequelize');

const { User }= require('../../models/');

const createUserRepo= async(userObj)=> {
    try {
        const createdUser= await User.create(userObj);
        return [null, JSON.parse(JSON.stringify(createdUser))];
    } catch (error) {
        return [error.message, null];
    }
}

const findUserByQueryRepo= async(query)=> {
    try {
        const user= await User.findOne({
            where: query
        });
        return [null, JSON.parse(JSON.stringify(user))];
    } catch (error) {
        return [error.message, null];
    }
}

const updateUserByQueryRepo= async(query, updateObj)=> {
    try {
        const user= await User.update(updateObj, {
            where: query
        });
        return [null, JSON.parse(JSON.stringify(user))];
    } catch (error) {
        return [error.message, null];
    }
}

module.exports= {
    createUserRepo,
    findUserByQueryRepo,
    updateUserByQueryRepo,
}

