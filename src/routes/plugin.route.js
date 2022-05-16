const express= require('express');

const {
    pluginsController,
}= require('../controllers/plugin.controllers');

const {
    verifyUser
}= require('../middlewares/auth.middleware');

const router= express.Router();

router.get('/', (req, res)=>{
    res.send(`Plugins sub route working`)
});
router.get('/run', verifyUser, pluginsController);

module.exports= router;