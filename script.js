// 기본 초기 데이터
const defaultSentences = [
  {
    english: "Reading outdoors felt a little awkward at first",
    korean: "처음에는 야외에서 책을 읽는 것이 좀 어색했다.."
  },
  {
    english: "I really felt reenergized after my vacation.",
    korean: "휴가를 다녀왔더니 한껏 힘이 다시 솟아났다."
  },
  {
    english: "I need to be alone to relax and clear my mind.",
    korean: "나는 마음을 편안하게 하기 위해 혼자만의 시간이 필요하다."
  }
];

// 브라우저 저장소(localStorage)에서 불러오고, 없으면 기본 데이터 사용
let sentences = JSON.parse(localStorage.getItem("mySentences")) || defaultSentences;

// 데이터를 저장소에 보관하는 전용 함수 추가
function saveToStorage() {
  localStorage.setItem("mySentences", JSON.stringify(sentences));
}
let currentIndex = 0;
let availableVoices = [];

// 1. 초기화 함수
function init() {
  loadVoices(); // 음성 로드 시도
  renderList();
  displaySentence();
  
  // 버튼 이벤트 리스너 등록
  document.getElementById("nextBtn").addEventListener("click", nextSentence);
  document.getElementById("randomBtn").addEventListener("click", randomSentence);
  document.getElementById("speakBtn").addEventListener("click", speakSentence);
  document.getElementById("addBtn").addEventListener("click", addSentence);
  document.getElementById("importBtn").addEventListener("click", importCSV);
  document.getElementById("deleteAllBtn").addEventListener("click", deleteAllSentences);
}

// 2. 현재 선택된 문장 화면 표시
function displaySentence() {
  const sentenceEl = document.getElementById("sentence");
  const meaningEl = document.getElementById("meaning");
  const speakBtn = document.getElementById("speakBtn");

  if (!sentenceEl || !meaningEl) return;

  if (sentences.length === 0) {
    sentenceEl.innerText = "문장이 없습니다.";
    meaningEl.innerText = "";
    if(speakBtn) speakBtn.disabled = true; // 음성 버튼 비활성화
    return;
  }

  if(speakBtn) speakBtn.disabled = false; // 음성 버튼 활성화

  sentenceEl.innerText = sentences[currentIndex].english;
  meaningEl.innerText = sentences[currentIndex].korean;
}

// 3. 다음 문장 이동
function nextSentence() {
  if (sentences.length === 0) return;

  currentIndex++;
  if (currentIndex >= sentences.length) {
    currentIndex = 0;
  }

  displaySentence();
}

// 4. 랜덤 문장 이동
function randomSentence() {
  if (sentences.length === 0) return;

  currentIndex = Math.floor(Math.random() * sentences.length);
  displaySentence();
}

// 5. 음성 합성 (TTS) 설정 및 로드
function loadVoices() {
  availableVoices = speechSynthesis.getVoices();
}

// 브라우저 음성 로드 이벤트 등록 (통합)
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = function () {
        loadVoices();
        displaySentence(); // 음성이 바뀌면 화면도 다시 그림
    };
} else {
    loadVoices();
}


// 6. 음성 읽어주기 함수
function speakSentence() {
  const sentenceEl = document.getElementById("sentence");
  if (!sentenceEl) return;

  const text = sentenceEl.textContent;
  if (!text || text === "문장이 없습니다.") return;

  speechSynthesis.cancel(); // 이전 재생 중단

  if (availableVoices.length === 0) {
    availableVoices = speechSynthesis.getVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // 영어 음성 필터링
  const englishVoices = availableVoices.filter(
    voice => voice.lang.toLowerCase().startsWith("en")
  );

  let selectedVoice = null;

  if (englishVoices.length > 0) {
    // 우선순위: 여성을 선호하지만, 없으면 첫 번째 영어 음성
    selectedVoice =
      englishVoices.find(v => v.name.toLowerCase().includes("female")) ||
      englishVoices.find(v =>
        v.name.includes("Google US English") ||
        v.name.includes("Samantha") ||
        v.name.includes("Karen")
      ) ||
      englishVoices[0];
  } else if (availableVoices.length > 0) {
    // 영어 전용 음성이 없으면 언어 코드가 en인 아무 음성이나 선택
    selectedVoice = availableVoices.find(v => v.lang.toLowerCase().startsWith("en"));
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  } else {
    // 음성을 전혀 못 찾으면 최후의 보루로 en-US 강제
    utterance.lang = "en-US";
  }

  utterance.rate = 0.95; // 재생 속도 조절
  utterance.pitch = 1.0;

  speechSynthesis.speak(utterance);
}

// 7. 새 문장 추가
function addSentence() {
  const englishInput = document.getElementById("newenglish");
  const koreanInput = document.getElementById("newKorean");

  if (!englishInput || !koreanInput) return;

  const english = englishInput.value.trim();
  const korean = koreanInput.value.trim();

  if (!english || !korean) {
    alert("영어 문장과 한글 뜻을 모두 입력해주세요.");
    return;
  }

  // 배열에 새 문장 추가
  sentences.push({ english, korean });

// 🔥 브라우저 저장소에 저장!
  saveToStorage();

  // 목록 및 메인 화면 갱신
  renderList();
  displaySentence();

  englishInput.value = "";
  koreanInput.value = "";
  
  // 성공 메시지 살짝 표시 (선택사항)
}

// 8. 저장된 문장 목록 렌더링 (CSS 클래스 업데이트)
function renderList() {
  const list = document.getElementById("sentenceList");
  if (!list) return;

  if (sentences.length === 0) {
    list.innerHTML = "<div class='empty'>저장된 문장이 없습니다.</div>";
    return;
  }

  let html = "";

  // 렌더링 성능을 위해 인덱스를 reverse로 돌리는 대신, 그냥 인덱스를 그대로 전달
  sentences.forEach((item, index) => {
    html += `
    <div class="list-item">
        <div class="US">${item.english}</div>
        <div class="kr">${item.korean}</div>
        <button type="button" class="delete-btn" onclick="deleteSentence(${index})">삭제</button>
    </div>
    `;
  });

  list.innerHTML = html;
}

// 9. 특정 문장 삭제
function deleteSentence(index) {
  sentences.splice(index, 1);

  // 🔥 변경사항 저장!
  saveToStorage();

  if (currentIndex >= sentences.length) {
    currentIndex = 0;
  }

  renderList();
  displaySentence();
}

  renderList();
  displaySentence();
}

// 10. 문장 전체 삭제
function deleteAllSentences() {
  if (sentences.length === 0) return;

  if (!confirm("저장된 모든 문장을 삭제할까요?")) {
    return;
  }

  sentences = [];
  currentIndex = 0;

  // 🔥 변경사항 저장 (localStorage 초기화)
  saveToStorage();

  renderList();
  displaySentence();
}

// 11. CSV 파일 불러오기
function importCSV() {
  const fileInput = document.getElementById("csvFile");
  if (!fileInput || !fileInput.files[0]) {
    alert("CSV 파일을 선택해주세요.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    // 텍스트를 줄 단위로 나눔
    const rows = e.target.result.split(/\r?\n/); // Windows/Unix 줄바꿈 모두 대응

    rows.forEach(row => {
      if (!row) return; // 빈 줄 건너뛰기
      
      // 쉼표로 나눔
      const cols = row.split(",");

      if (cols.length >= 2) {
        const english = cols[0].trim();
        const korean = cols[1].trim();

        if (english && korean) {
          sentences.push({ english, korean });
        }
      }
    });

// ... CSV 변환 로직 ...
    
    // 🔥 CSV로 추가된 문장들 저장!
    saveToStorage();

    renderList();
    displaySentence();

    fileInput.value = "";
    alert("CSV 업로드가 완료되었습니다.");
  };
    
    renderList();
    displaySentence();

    // 파일 선택창 초기화
    fileInput.value = "";
    alert("CSV 업로드가 완료되었습니다.");
  };

  reader.readAsText(file);
}

// 최초 화면 실행 (DOM이 로드된 후 실행되도록 이벤트 리스너 사용)
document.addEventListener("DOMContentLoaded", init);
