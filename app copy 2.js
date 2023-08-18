function start() {
  gapi.load('client', function() {
    // API를 사용하려면 sheetApi.js 파일에 저장된 API 키를 대체하세요.
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
  var range = 'Sheet2!A1:A'; // 이 부분을 수정하여 원하는 시트 및 범위를 가져옵니다.

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1_5nQoggV38Y62T5JQfdOUL1RtxFaO6cdQFhh7IEsOlc',
    range: range
  }).then(function(response) {
    var numRows = response.result.values.length;
    document.getElementById('data-output').innerHTML = "현재 접수된 신고서 " + numRows + "건";
  }, function(response) {
    console.error('Error occurred: ' + response.result.error.message);
  });
}

const apiKey = 'AIzaSyBGVBkEXJc3KkCsBDCmusiAhY8PEUbpNhI'; // 여기에 API 키를 입력하세요.
const sheetId = '1_5nQoggV38Y62T5JQfdOUL1RtxFaO6cdQFhh7IEsOlc'; // 여기에 스프레드 시트 ID를 입력하세요.
const sheetName = 'Sheet2';
const cellRange = 'A1:A';
const bubbleCount = 7;

function fetchData() {
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!${cellRange}?key=${apiKey}`)
    .then(response => response.json())
    .then(json => {
      if (json.error) {
        console.error(json.error);
        return [];
      }
      return json.values;
    });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createBubble(dataList, i) {
  const randomIndex = getRandomInt(0, dataList.length - 1);
  const randomValue = dataList[randomIndex][0];

  var bubble = document.createElement('div');
  bubble.textContent = randomValue;
  bubble.className = 'bubble';

  document.getElementById('bubble-container').appendChild(bubble);

  // 화면 외부에 버블 배치
  bubble.style.transform = 'translateY(100%)';
  bubble.style.opacity = '0';

  const animationDuration = 18; // 애니메이션 지속 시간

  setTimeout(function() {
    const bubbleContainerEl = document.getElementById('bubble-container');
    const maxWidthPercentage = 100 - (bubble.offsetWidth / bubbleContainerEl.offsetWidth) * 100;

    if (i % 2 === 0) {
      bubble.style.left = '0%';
    } else {
      bubble.style.left = 'auto';
      bubble.style.right = '0%';
    }

    bubble.classList.add('animation');
    bubble.style.animationDelay = i * (animationDuration * 1000 + 3000) / 1000 + 's';
    bubble.style.animationDuration = animationDuration + 's';
  }, i === 0 ? 0 : 100); // 첫 번째 버블이면 딜레이 없음

  setTimeout(() => {
    bubble.remove();
    createBubble(dataList, i);
  }, (animationDuration * 1000) + 3000);
}


var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: '9hbQg3kPjlA',
        playerVars: {
          autoplay: 1,
          loop: 0
        }
      });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
}