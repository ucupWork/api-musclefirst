const fs = require("fs");
const { google } = require("googleapis");


const authenticateGoogle = () => {
     const auth = new google.auth.GoogleAuth({
        credentials: {
            "type": "service_account",
            "project_id": process.env.DRIVE_API_PROJECT_ID,
            "private_key_id": process.env.DRIVE_API_PRIVATE_KEY_ID,
            "private_key": `${process.env.DRIVE_API_PRIVATE_KEY}`,
            "client_email": process.env.DRIVE_API_CLIENT_EMAIL,
            "client_id": process.env.DRIVE_API_CLIENT_ID,
            "auth_uri": process.env.DRIVE_API_AUTH_URI,
            "token_uri": process.env.DRIVE_API_TOKEN_URI,
            "auth_provider_x509_cert_url": process.env.DRIVE_API_AUTH_PROVIDER,
            "client_x509_cert_url": process.env.DRIVE_API_CLIENT  
        },
        scopes: "https://www.googleapis.com/auth/drive",
     });
     return auth;
};

const uploadToGoogleDrive = async (file, auth) => {
    const fileMetadata = {
        // name: file.originalname,
        name: new Date().getTime() + '-' + (file.originalname.replace(/ /g, '-')),
        parents: ["1nTRdhOdNO6jpN9Zcv4oYOGG_aca4TU4G"], // Change it according to your parent folder id in drive
    };

    const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
    };

    const driveService = google.drive({ version: "v3", auth });

    const response = await driveService.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
    });
    return response;
};

module.exports = {
    authenticateGoogle,
    uploadToGoogleDrive
}