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
        const tokenObj= accessInfo.googleSheet;
        const oAuth2Client = new google.auth.OAuth2(
            clientId, clientSecret, redirectUri
        );
        console.log(tokenObj)
        oAuth2Client.setCredentials(tokenObj);
        const googleSheet = google.sheets({version: 'v4', auth: oAuth2Client});
        // create a new sheet and add to it all rows from formObj
        const newSheet= await googleSheet.spreadsheets.create({
            resource: {
                properties: {
                    title: metaData.spreadsheetTitle,
                },
            },
        });
        // extract sheet id from response 
        const sheetId= newSheet.data.spreadsheetId;
        console.log(`Created new sheet with id: ${sheetId}`);
        // 
        return {
            code: 200,
            error: null,
            message: 'Successfully created new sheet',
            data:  newSheet.data
        }

    } catch (error) {
        console.log(`Error while creating new sheet: ${error.message}`);
        return {
            code: 500,
            error: error.message,
            message: 'Failed to create new sheet',
            data: null
        }
    }
}

module.exports= exportToGoogleSheets