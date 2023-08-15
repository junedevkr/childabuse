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
  var range = 'Sheet2!A1:A'; // 이 부분을 수정하여 원하는 시트 및 범위를 가져옵니다.

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

var apiKey = 'AIzaSyBGVBkEXJc3KkCsBDCmusiAhY8PEUbpNhI';
var sheetId = '1_5nQoggV38Y62T5JQfdOUL1RtxFaO6cdQFhh7IEsOlc';
var sheetName = 'Sheet2';
var cellRange = 'A2:A12';

function appendBubble(text) {
  var bubble = document.createElement('div');
  bubble.textContent = text;
  bubble.className = 'bubble';
  bubble.style.left = Math.random() * 90 + '%';
  bubble.style.animationDelay = Math.random() * 2 + 's';
  document.getElementById('bubble-container').appendChild(bubble);
}

function showBubbles() {
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!${cellRange}?key=${apiKey}`, {
    method: 'GET',
  }).then(function(response) {
    return response.json();
  }).then(function(responseData) { // 수정된 부분: 변수명을 responseData로 변경
    for (var text of responseData.values) { // 수정된 부분: data를 responseData로 변경
      appendBubble(text[0]);
    }
  }).catch(function(error) {
    console.error(error);
  });
}