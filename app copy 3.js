function start() {
  gapi.load('client', function() {
    gapi.client.setApiKey('AIzaSyBGVBkEXJc3KkCsBDCmusiAhY8PEUbpNhI');
    gapi.client.load('sheets', 'v4', function() {
      getData();
    });
  });
}


document.addEventListener('DOMContentLoaded', function() {
  start();
});

async function loadHTML(url, containerId) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;
  } catch (err) {
    console.error('Error loading ' + url, err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadHTML('header.html', 'header-container');
  loadHTML('footer.html', 'footer-container');
});

function getData() {
  var range = 'text!A1:A'; // 이 부분을 수정하여 원하는 시트 및 범위를 가져옵니다.

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '16SA4dMDkNC1skq9FGzfxoRp4Ie7Pq1kg-zFBkw2j2Hs',
    range: range
  }).then(function(response) {
    var numRows = response.result.values.length;
    document.getElementById('data-output').innerHTML = "현재 접수된 신고서 " + numRows + "건";
  }, function(response) {
    console.error('Error occurred: ' + response.result.error.message);
  });
}

function getRandomCellData() {
  var sheetId = '16SA4dMDkNC1skq9FGzfxoRp4Ie7Pq1kg';
  var sheetName = 'text';
  var sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=your_api_key`;

    fetch(sheetUrl)
      .then(response => response.json())
      .then(data => {
        var rows = data.values;
        var randomCells = [];
  
        for (var i = 0; i < 5; i++) {
          var randomRowIndex = Math.floor(Math.random() * rows.length);
          var row = rows[randomRowIndex];
  
          var randomCellIndex = Math.floor(Math.random() * row.length);
          var cell = row[randomCellIndex];
  
          randomCells.push(cell);
        }
  
        createBoxes(randomCells);
      });
  }
  
  // 무작위로 생성된 텍스트를 갖는 상자를 생성
  function createBoxes(cellData) {
    var container = document.getElementById('box');
  
    cellData.forEach((text, index) => {
      var box = document.createElement('div');
      box.classList.add('box');
      box.textContent = text;
  
      var xPos = Math.random() * container.clientWidth;
      var yPos = Math.random() * container.clientHeight;
  
      box.style.transform = `translate(${xPos}px, ${yPos}px)`;
  
      container.appendChild(box);
  
      setTimeout(() => {
        box.classList.add('fade-out');
      }, 5000 - (index * 250));
    });
  }
  
  // DOMContentLoaded 이벤트 리스너 등록
  document.addEventListener('DOMContentLoaded', function() {
    // 초기화 작업을 진행하는 등의 코드
  
    // getRandomCellData() 함수 호출
    getRandomCellData();
  });
  