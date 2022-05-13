const fs = require('fs');
const {google} = require('googleapis');

const {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris,
}= require('../../googleToken.json')['web']
const redirectUri= redirect_uris[0]

const exportToGoogleSheets= async(accessInfo, formObj, metaData)=> {
    try {
        const tokenObj= accessInfo.googleSheetCredentials;
        const oAuth2Client = new google.auth.OAuth2(
            clientId, clientSecret, redirectUri
        );
        oAuth2Client.setCredentials(JSON.parse(tokenObj));
        const googleSheet = google.sheets({version: 'v4', auth: oAuth2Client});
        // create a new sheet and add to it all rows from formObj
        const newSheet= await googleSheet.spreadsheets.create({
            resource: {
                properties: {
                    title: metaData.response_link,
                },
            },
        });
        // extract sheet id from response 
        const sheetId= newSheet.data.spreadsheetId;
        // 


    } catch (error) {
        
    }
}