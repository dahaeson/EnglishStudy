let sentences = [
  {
    english: "Reading outdoors felt a little awkward at first",
    korean: " 처음에는 야외에서 책을 읽는 것이 좀 어색했다.."
  },
  {
    english: "I really felt reenergized after my vacation.",
    korean: " 휴가를 다녀왔더니 한껏 힘이 다시 솟아났다."
  },
  {
    english: "I need to be alone to relax and clear my mind.",
    korean: "나는 마음을 편안하게 하기 위해 혼자만의 시간이 필요하다."
  }
];

let currentIndex = 0;

function displaySentence() {
  const sentenceEl = document.getElementById("sentence");
  const meaningEl = document.getElementById("meaning");

  if (!sentenceEl || !meaningEl) return;

  if (sentences.length === 0) {
    sentenceEl.innerText = "문장이 없습니다.";
    meaningEl.innerText = "";
    return;
  }

  sentenceEl.innerText = sentences[currentIndex].english;
  meaningEl.innerText = sentences[currentIndex].korean;
}

function nextSentence() {
  if (sentences.length === 0) return;

  currentIndex++;

  if (currentIndex >= sentences.length) {
    currentIndex = 0;
  }

  displaySentence();
}

function randomSentence() {
  if (sentences.length === 0) return;

  currentIndex = Math.floor(Math.random() * sentences.length);
  displaySentence();
}

// ==================== 음성 합성 (TTS) 로직 ====================
let availableVoices = [];

function loadVoices() {
  availableVoices = speechSynthesis.getVoices();
}

// 이벤트 등록 (중복 제거 후 통합)
speechSynthesis.onvoiceschanged = function () {
  loadVoices();
  displaySentence();
};

loadVoices();

function speakSentence() {
  const textEl = document.getElementById("sentence");
  if (!textEl) return;
  const text = textEl.textContent;
  if (!text || text === "문장이 없습니다.") return;

  speechSynthesis.cancel(); // 이전 재생 중단

  if (availableVoices.length === 0) {
    availableVoices = speechSynthesis.getVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  const englishVoices = availableVoices.filter(
    voice => voice.lang.toLowerCase().startsWith("en")
  );

  let selectedVoice = null;

  if (englishVoices.length > 0) {
    selectedVoice =
      englishVoices.find(v => v.name.toLowerCase().includes("female")) ||
      englishVoices.find(v =>
        v.name.includes("Samantha") ||
        v.name.includes("Google US English") ||
        v.name.includes("Karen") ||
        v.name.includes("Victoria")
      ) ||
      englishVoices[0];
  } else if (availableVoices.length > 0) {
    selectedVoice = availableVoices.find(v => v.lang.includes("en"));
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  } else {
    utterance.lang = "en-US";
  }

  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  speechSynthesis.speak(utterance);
}

// ==================== 문장 추가 / 삭제 / CSV 로직 ====================
function addSentence() {
  // ID 대소문자 문제 방지를 위해 안전하게 요소를 가져옵니다.
  const englishInput = document.getElementById("newenglish") || document.getElementById("newEnglish");
  const koreanInput = document.getElementById("newKorean") || document.getElementById("newkorean");

  if (!englishInput || !koreanInput) {
    console.error("입력창 ID를 찾을 수 없습니다.");
    return;
  }

  const english = englishInput.value.trim();
  const korean = koreanInput.value.trim();

  if (!english || !korean) {
    alert("내용을 입력하세요.");
    return;
  }

  sentences.push({ english, korean });

  // 목록 새로고침 및 메인 카드 업데이트
  renderList();
  displaySentence();

  // 입력창 초기화
  englishInput.value = "";
  koreanInput.value = "";
}

function renderList() {
  const list = document.getElementById("sentenceList");
  if (!list) return;

  if (sentences.length === 0) {
    list.innerHTML = "<div class='empty'>문장이 없습니다.</div>";
    return;
  }

  let html = "";

  sentences.forEach((item, index) => {
    html += `
    <div class="list-item">
        <div class="US">
            ${item.english}
        </div>
        <div class="kr">
            ${item.korean}
        </div>
        <button
            class="delete-btn"
            onclick="deleteSentence(${index})">
            삭제
        </button>
    </div>
    `;
  });

  list.innerHTML = html;
}

function deleteSentence(index) {
  sentences.splice(index, 1);

  if (currentIndex >= sentences.length) {
    currentIndex = 0;
  }

  renderList();
  displaySentence();
}

function deleteAllSentences() {
  if (!confirm("전체 삭제할까요?")) {
    return;
  }

  sentences = [];
  currentIndex = 0;

  renderList();
  displaySentence();
}

function importCSV() {
  const fileInput = document.getElementById("csvFile");
  if (!fileInput || !fileInput.files[0]) {
    alert("CSV 파일 선택");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const rows = e.target.result.split("\n");

    rows.forEach(row => {
      const cols = row.split(",");

      if (cols.length >= 2) {
        const english = cols[0].trim();
        const korean = cols[1].trim();
        if (english && korean) {
          sentences.push({ english, korean });
        }
      }
    });

    renderList();
    displaySentence();

    alert("CSV 업로드 완료");
  };

  reader.readAsText(file);
}

// 최초 화면 렌더링
renderList();
displaySentence();
