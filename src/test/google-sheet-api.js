const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const compute = google.compute('v1');

// get link for oauth
const poc= async()=> {
    try {
        console.log("123456")
        
        // const auth = new google.auth.GoogleAuth({
        //     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        //     keyFile: '../../credentials.json'
        // });
        // authentication with oauth 2 client
        const clientId= "603286156054-l0751ppjpnff1sislgt8iq2l8ttvsa00.apps.googleusercontent.com"
        const clientSecret= "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"
        const redirectUri= "http://localhost:5001/callback"
        const oAuth2Client  = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );
        const scope= [
            'https://www.googleapis.com/auth/spreadsheets',
        ];
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope,
        });
        console.log(`authUrl: ${url}`);
        
        // const client= await auth.getClient();

        // const googleSheet= google.sheets({version: 'v4', auth: client});

        // const sampleMetaData= await googleSheet.spreadsheets.get({
        //     spreadsheetId: '1VtChI_lEuKghlU_bk859gAhcBQz1n12HUnRniy-ppUs',
        // });
        // console.log(sampleMetaData.data);
        // create a new spreadsheet called collectResponses and the sheet should be publically visible
        // const newSheet= await googleSheet.spreadsheets.create({
        //     resource: {
        //         properties: {
        //             title: 'collectResponses'
        //         }
        //     }
        // });
        // console.log(newSheet.data);


    } catch (error) {
        console.log(error);
    }
}

// get user tokens from temporary code
const poc2= async()=> {
    try {
        const code= "4/0AX4XfWifizwvC229FBe0x_b46TB-QVoW9fSwUBn3E0JC1AAwW864aNJ8ks-aPiC5pe6Y1g"
        const clientId= "603286156054-l0751ppjpnff1sislgt8iq2l8ttvsa00.apps.googleusercontent.com"
        const clientSecret= "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"
        const redirectUri= "http://localhost:5001/callback"

        const oAuth2Client  = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );

        
        const { tokens } = await oAuth2Client.getToken(code);
        console.log(tokens);
        fs.writeFileSync('./google-oauth-token.json', JSON.stringify(tokens));
        
    } catch (error) {
        console.log(error);
    }
}

const poc3= async()=> {
    try {
        const clientId= "603286156054-l0751ppjpnff1sislgt8iq2l8ttvsa00.apps.googleusercontent.com"
        const clientSecret= "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"
        const redirectUri= "http://localhost:5001/callback"
        
        const oAuth2Client = new google.auth.OAuth2(
            clientId, clientSecret, redirectUri
        );
        const token = fs.readFileSync('./google-oauth-token.json', 'utf-8');
        oAuth2Client.setCredentials(JSON.parse(token));

        const googleSheet = google.sheets({ version: 'v4', auth: oAuth2Client })

        const newSheet= await googleSheet.spreadsheets.create({
            resource: {
                properties: {
                    title: 'collectResponses'
                }
            }
        });
        console.log(newSheet.data);
    } catch (error) {
        console.log(error)
    }
}

poc3().then(()=> {console.log('PASSED')}).catch((_)=>{console.log('FAILED')})