const express= require('express');

const router= express.Router();

router.post('/createUser'); // create a new user <username and password, only>

router.get('/linkGoogleAccount');

router.get('/callback'); // callback from google -> convert temporary code to access token 

module.exports= router;