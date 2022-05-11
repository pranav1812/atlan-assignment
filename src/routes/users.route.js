const express= require('express');

const {
    createUser,
    linkGoogleAccount,
    callback,
    signin,
}= require('../controllers/users.controllers')

const {
    verifyUser
}= require('../middlewares/auth.middleware');

const router= express.Router();

router.post('/createUser', createUser); // create a new user <username and password, only>

router.post('/signin', signin);

router.get('/linkGoogleAccount', verifyUser, linkGoogleAccount); // link google account to user

router.get('/callback/:uid', callback); // callback from google -> convert temporary code to access token 

module.exports= router;