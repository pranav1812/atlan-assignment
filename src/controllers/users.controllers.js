const {google} = require('googleapis');
const bcrypt= require('bcrypt');

const {
    signToken,
}= require('../utility/jwt');

const {
    createUserRepo,
    findUserByQueryRepo,
    updateUserByQueryRepo,
}= require('../repository/user.repository')

const {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris,
}= require('../../googleToken.json')['web']

const redirectUri= redirect_uris[0]
const scope= [
    'https://www.googleapis.com/auth/spreadsheets',
];

const createUser= async(req, res)=> {
    try {
        const {username, password}= req.body;
        // hash password
        let hashedPassword= bcrypt.hashSync(password, 10);
        // create user
        let access_info= JSON.stringify({})
        const [err, createdUser]= await createUserRepo({
            username,
            hashedPassword,
            access_info
        });
        if (err){
            return res.status(500).json({
                error: err,
                message: 'Failed to create user',
                code: 500
            });
        }
        console.log(`Created user: ${createdUser}`);
        const accessToken= signToken({
            id: createdUser.id,
            username: createdUser.username,
        });
        return res.status(200).json({
            message: 'User created successfully',
            code: 200,
            error: null,
            data: {
                accessToken
            }
        });

    } catch (error) {
        console.log(`Error while creating user: ${error.message}`);
        return res.status(500).json({
            error: error.message,
            message: 'Failed to create user',
            code: 500
        });
    }
}

const linkGoogleAccount= async(req, res)=> {
    try {
        const {uid}= req.user;
        const oAuth2Client  = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );
        
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope,
            state: uid
        });
        console.log(`authUrl: ${url}`);
        res.status(200).redirect(url);
    } catch (error) {
        console.log(`Error while generating google auth url: ${error}`);
    }
}

const callback= async(req, res)=> {
    try {
        const {state, code, scope: scp}= req.query;
        if (scp != scope){
            return res.status(500).json({
                error: 'Invalid scope',
                message: null,
                code: 500
            })
        }
        const oAuth2Client  = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );
        const {tokens} = await oAuth2Client.getToken(code);
        // store tokens in database corresponnding to user_id: state
        const [err, user]= await findUserByQueryRepo({
            id: state
        });
        if (err){
            return res.status(404).json({
                error: err,
                message: 'Failed to find user',
                code: 404
            });
        }
        const access_info= JSON.parse(user.access_info);
        access_info.googleSheet= tokens;
        const [err2, updatedUser]= await updateUserByQueryRepo({
            id: state
        }, {
            access_info
        });
        if (err2){
            return res.status(500).json({
                error: err2,
                message: 'Failed to update user',
                code: 500
            });
        }
        return res.status(200).json({
            error: null,
            message: 'Successfully linked google account with google sheets access',
            code: 200
        })

    } catch (error) {
        console.log(`Error while getting tokens from google temporary code: ${error}`);
        return res.status(500).json({
            error: 'Error while getting tokens from google temporary code',
            message: null,
            code: 500
        })
    }
}

const signin= async(req, res)=> {
    try {
        const {username, password}= req.body;
        const [err, user]= await findUserByQueryRepo({
            username    
        });
        if (err || !user){
            return res.status(404).json({
                error: err,
                message: 'Failed to find user',
                code: 404
            });
        }
        const isPasswordValid= bcrypt.compareSync(password, user.password);
        if (!isPasswordValid){
            return res.status(401).json({
                error: 'Invalid password',
                message: null,
                code: 401
            });
        }
        const accessToken= signToken({
            id: user.id,
            username: user.username,
        });
        return res.status(200).json({
            error: null,
            message: 'Successfully signed in',
            code: 200,
            data: {
                accessToken
            }
        });
    } catch (error) {
        console.log(`Error while signing in: ${error}`);
        return res.status(500).json({
            error: 'Error while signing in',
            message: null,
            code: 500
        })
    }
}

module.exports= {
    createUser,
    linkGoogleAccount,
    callback,
    signin
}