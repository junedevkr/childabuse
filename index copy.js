gapi.load('client:auth2', init);

function init() {
  // API 클라이언트 및 인증 라이브러리를 초기화
  gapi.client.init({
    apiKey: 'AIzaSyB08ejkEhqLAlHYDzSbqkl-25xD8hEnxuE',
    clientId: '358944242099-m5acovvciv42aabjup8vi2965oaieso7.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/drive.file',
  }).then(() => {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }, (error) => {
    console.log('구글 클라이언트 라이브러리 초기화 오류:', error);
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    // 사용자가 로그인 되어 있으면, 파일 업로드 기능 활성화
    document.getElementById('pdf-upload').disabled = false;
  } else {
    // 사용자가 로그아웃되어 있는 경우, 구글 로그인을 요청
    gapi.auth2.getAuthInstance().signIn();
  }
}

function uploadPDF() {
    var fileInput = document.getElementById("pdf-upload");
    if (!fileInput.files.length) {
      console.error("파일을 선택해 주세요.");
      return;
    }
    
    var file = fileInput.files[0];
  
    // Google authInstance 확인
    var authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance) {
      console.error("Google authInstance가 없습니다.");
      return;
    }  
  
  const metadata = {
    name: file.name,
    mimeType: file.type,
    parents: ['1Iu-oLGUciErdiDv3qid_gEiN4hubJq_8'],
  };
  

  const accessToken = gapi.auth.getToken().access_token;

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    method: 'POST',
    headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
    body: form,
  }).then(res => {
    return res.json();
  }).then(file => {
    alert('성공적으로 업로드되었습니다!');
  }).then(file => {
    updateSpreadsheet(file);  // 스프레드시트 업데이트 추가
  }, (error) => {
    console.error('파일 업로드 실패:', error);
  });
}

async function updateSpreadsheet(file) {
    const SPREADSHEET_ID = '1TWyJKJ6xBRoVTORFfEC7AAtXYN4WFiAmAVf1iXLNiKs';
  
    try {
      // 기록을 위한 줄을 찾습니다.
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:A',
      });
  
      const numRows = response.result.values ? response.result.values.length : 0;
  
      // 새로운 데이터를 추가합니다.
      await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:A',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        values: [
          [file.name, new Date().toLocaleString()], // 파일 이름과 업로드 시간을 기록합니다.
        ],
      });
  
      // 전체 파일의 수를 반환하여 index.html에 업데이트합니다.
      document.getElementById('file-count').innerText = `전체 파일 수: ${numRows + 1}`;
    } catch (error) {
      console.error('스프레드시트 업데이트 오류:', error);
    }
  }
  