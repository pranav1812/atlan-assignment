const express= require('express');

const {
    pluginsController,
}= require('../controllers/plugin.controllers');

const {
    verifyUser
}= require('../middlewares/auth.middleware');

const router= express.Router();

router.post('/', verifyUser, pluginsController);

module.exports= router;