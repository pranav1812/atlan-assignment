const {google} = require('googleapis');

const {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: redirectUri,
}= require('../../googleToken.json')['web']
const redirectUri= redirectUri[0]

const createUser= async(req, res)=> {
    try {
        const {uid}= req.user;
        const oAuth2Client  = new google.auth.OAuth2(
            clientId,
            clientSecret,
            `${redirectUri}/${uid}`
        );
        const scope= [
            'https://www.googleapis.com/auth/spreadsheets',
        ];
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope,
        });
        console.log(`authUrl: ${url}`);
        res.status(200).redirect(url);
    } catch (error) {
        console.log(`Error while generating google auth url: ${error}`);
    }
}

const linkGoogleAccount= async(req, res)=> {}

const callback= async(req, res)=> {}

const signin= async(req, res)=> {}

module.exports= {
    createUser,
    linkGoogleAccount,
    callback,
    signin
}