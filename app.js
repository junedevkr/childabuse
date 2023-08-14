const apiKey = 'AIzaSyB08ejkEhqLAlHYDzSbqkl-25xD8hEnxuE';
const clientId = '749711979920-2t5ip02556cbojn4u2k7q9ar9e8kjtqh.apps.googleusercontent.com';
const discoveryDocs = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  'https://sheets.googleapis.com/$discovery/rest?version=v4'
];
const scope = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets';

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: apiKey,
    clientId: clientId,
    discoveryDocs: discoveryDocs,
    scope: scope
  }).then(() => {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }, (error) => {
    console.error('Error:', error);
  });
}

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    $('#signin').hide();
    $('#pdf-input').show();
    $('#pdf-input').on('change', handleFileUpload);
  } else {
    $('#signin').show();
    $('#signin').on('click', () => {
      gapi.auth2.getAuthInstance().signIn();
    });
  }
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  const folderId = 'YOUR_FOLDER_ID';
  const spreadsheetId = 'YOUR_SPREADSHEET_ID';

  if (!file) return;

  const fileMetadata = {
    'name': file.name,
    'parents': [folderId]
  };

  const response = await gapi.client.request({
    path: '/upload/drive/v3/files',
    method: 'POST',
    params: {
      uploadType: 'media',
      fields: 'id'
    },
    headers: {
      'Content-Type': file.type
    },
    body: file
  });

  if (response.result.id) {
    const timestamp = new Date().toISOString();
    gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: '시트1!A:B',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[timestamp, file.name]]
      },
    }).then((response) => {
      const fileCount = response.result.updates.updatedCells / 2;
      alert(`PDF 파일이 업로드 되었습니다. 현재 ${fileCount}개의 파일이 저장되어 있습니다.`);
    }, (error) => {
      console.error('Error:', error);
    });
  } else {
    alert('파일 업로드에 실패했습니다. 다시 시도해주세요.');
  }
}

$(window).on('load', handleClientLoad);
