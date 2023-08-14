const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

// JSON 키 파일의 경로
const SERVICE_ACCOUNT_JSON_FILE_PATH = './childabuse-395904-b6fa072e7cc1.json';

async function initializeClient() {
  const auth = new GoogleAuth({
    keyFile: SERVICE_ACCOUNT_JSON_FILE_PATH,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const authClient = await auth.getClient();
  google.options({ auth: authClient });

  // 구글 클라이언트가 초기화되었습니다.
  console.log('Google API client initialized.');
}

// 초기화 함수를 실행하여 클라이언트를 설정합니다.
initializeClient();

async function uploadPDF(filePath, fileName) {
    try {
      const drive = google.drive('v3');
      const fileMetadata = {
        name: fileName,
        mimeType: 'application/pdf',
      };
  
      const media = {
        mimeType: 'application/pdf',
        body: fs.createReadStream(filePath),
      };
  
      const uploadedFile = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id',
      });
  
      console.log('File uploaded successfully. File ID:', uploadedFile.data.id);
    } catch (error) {
      console.error('Error uploading the file:', error);
    }
  }

const filePath = './path/to/your-pdf-file.pdf';
const fileName = 'example.pdf';

uploadPDF(filePath, fileName);
