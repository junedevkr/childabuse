fetch('./footer.html')
.then(response => response.text())
.then(data => {
  document.getElementById('footerContainer').innerHTML = data;
})
.catch(error => {
  console.error('푸터 파일을 불러오는 데 실패했습니다:', error);
});


let currentDataIndex = 0;
loadInitialData();
const list = document.getElementById("list");
list.addEventListener("scroll", trackScrolling);

async function fetchData(start, count = 1) {
  const response = await fetch(
    `https://script.google.com/macros/s/AKfycbwmZS0tXGIUbKEGl-hY_1VSK7ZcTAZdxcQ6qFlqHDCohwPR8Dp6xHQiupPWgGKIgqwE3A/exec?start=${start}&count=${count}`
  );
  const data = await response.text();
  const items = data.split("\n").filter((item) => item.trim() !== "");
  return items;
}

async function loadInitialData() {
  const items = await fetchData(currentDataIndex, 20);
  items.reverse().forEach((item, index) => { // 데이터 배열을 역순으로 변경합니다.
    displayItem(item, index);
  });
  currentDataIndex += 20;
}


async function fetchDatalist() {
  fetch("https://script.google.com/macros/s/AKfycbwqcM4ef8loJCR6rtpSJe7_67y83WxtEGPIUg8nrH3i-LWnBMYAynP7bJKGsTXDlzFGHw/exec")
      .then(response => response.text())
      .then(data => {
          const resultElement = document.getElementById("result");
          resultElement.textContent = data;
      })
      .catch(error => {
          console.error("Error fetching data:", error);
  });
}

async function start() {
  await loadInitialData();
  await fetchDatalist();
}
start();


function displayItem(item, index) {
  const listItem = document.createElement("li");
  listItem.textContent = item;
  listItem.setAttribute("data-index", index);

  // 홀수/짝수 인덱스에 따라 클래스를 추가합니다.
  if (index % 2 === 0) {
    listItem.classList.add("even");
  } else {
    listItem.classList.add("odd");
  }

  list.appendChild(listItem);
}

let isLoading = false;

async function loadAdditionalData() {
  const lastIndex = parseInt(
    list.lastChild.getAttribute("data-index"),
    10
  );
  const newIndexOdd = lastIndex + 1; // 홀수 인덱스 데이터
  const newIndexEven = lastIndex + 2; // 짝수 인덱스 데이터

  const newItemOdd = await fetchData(newIndexOdd, 1);
  const newItemEven = await fetchData(newIndexEven, 1);

  if (newItemOdd.length > 0) {
    displayItem(newItemOdd[0], newIndexOdd);
  }

  if (newItemEven.length > 0) {
    displayItem(newItemEven[0], newIndexEven);
  }

  isLoading = false;
}

let lastScrollUpdate = 0; 

function trackScrolling() {
  const now = performance.now();
  if (lastScrollUpdate + 1000 > now) {
    return;
  }
  lastScrollUpdate = now;

  const pos = list.lastChild.getBoundingClientRect();

  // 스크롤이 일정 위치에 닿았을 때 박스 추가
  if (pos.bottom <= window.innerHeight * 0.7 && !isLoading) {
    isLoading = true;
    loadAdditionalData().then(() => {
      isLoading = false;
    });
  }
}


list.addEventListener("scroll", trackScrolling);


