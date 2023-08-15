function start() {
  gapi.load('client', function() {
    // API를 사용하려면 sheetApi.js 파일에 저장된 API 키를 대체하세요.
    gapi.client.setApiKey('AIzaSyBGVBkEXJc3KkCsBDCmusiAhY8PEUbpNhI');
    gapi.client.load('sheets', 'v4', function() {
      getData();
    });
  });
}

function getData() {
  var range = 'Sheet1!A2:A'; // 이 부분을 수정하여 원하는 시트 및 범위를 가져옵니다.

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1_5nQoggV38Y62T5JQfdOUL1RtxFaO6cdQFhh7IEsOlc',
    range: range
  }).then(function(response) {
    var numRows = response.result.values.length;
    document.getElementById('data-output').innerHTML = "현재 접수된 신고서 " + numRows + " 건";
  }, function(response) {
    console.error('Error occurred: ' + response.result.error.message);
  });
}
