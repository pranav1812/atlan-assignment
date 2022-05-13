const express= require('express');

const {
    createForm,
    fillForm,
    viewResponses
}= require('../controllers/form.controllers');

const {
    verifyUser
}= require('../middlewares/auth.middleware');

const router= express.Router();

router.get('/viewResponses/:formLink', verifyUser, viewResponses);
router.post('/create', verifyUser, createForm);
router.post('/fill/:formLink', fillForm);

module.exports= router