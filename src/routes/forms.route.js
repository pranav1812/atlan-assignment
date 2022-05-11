const express= require('express');

const {
    createForm,
    fillForm
}= require('../controllers/form.controllers');

const {
    verifyUser
}= require('../middlewares/auth.middleware');

const router= express.Router();

router.post('/create', verifyUser, createForm);
router.post('/fill', fillForm);

module.exports= router