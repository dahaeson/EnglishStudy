// 기본 문장 데이터
let sentences = [
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

let currentIndex = 0;

// 1. 현재 선택된 문장 화면 표시
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

// 2. 다음 문장 이동
function nextSentence() {
  if (sentences.length === 0) return;

  currentIndex++;
  if (currentIndex >= sentences.length) {
    currentIndex = 0;
  }

  displaySentence();
}

// 3. 랜덤 문장 이동
function randomSentence() {
  if (sentences.length === 0) return;

  currentIndex = Math.floor(Math.random() * sentences.length);
  displaySentence();
}

// 4. 음성 합성 (TTS) 설정
let availableVoices = [];

function loadVoices() {
  availableVoices = speechSynthesis.getVoices();
}

// 브라우저 음성 로드 이벤트 등록 (통합)
speechSynthesis.onvoiceschanged = function () {
  loadVoices();
  displaySentence();
};

loadVoices();

// 5. 음성 읽어주기 함수
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

// 6. 새 문장 추가
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

  // 목록 및 메인 화면 갱신
  renderList();
  displaySentence();

  // 입력창 초기화
  englishInput.value = "";
  koreanInput.value = "";
}

// 7. 저장된 문장 목록 렌더링
function renderList() {
  const list = document.getElementById("sentenceList");
  if (!list) return;

  if (sentences.length === 0) {
    list.innerHTML = "<div class='empty'>저장된 문장이 없습니다.</div>";
    return;
  }

  let html = "";

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

// 8. 특정 문장 삭제
function deleteSentence(index) {
  sentences.splice(index, 1);

  if (currentIndex >= sentences.length) {
    currentIndex = 0;
  }

  renderList();
  displaySentence();
}

// 9. 문장 전체 삭제
function deleteAllSentences() {
  if (sentences.length === 0) return;

  if (!confirm("저장된 모든 문장을 삭제할까요?")) {
    return;
  }

  sentences = [];
  currentIndex = 0;

  renderList();
  displaySentence();
}

// 10. CSV 파일 불러오기
function importCSV() {
  const fileInput = document.getElementById("csvFile");
  if (!fileInput || !fileInput.files[0]) {
    alert("CSV 파일을 선택해주세요.");
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

    // 파일 선택창 초기화
    fileInput.value = "";
    alert("CSV 업로드가 완료되었습니다.");
  };

  reader.readAsText(file);
}

// 최초 화면 실행
renderList();
displaySentence();
