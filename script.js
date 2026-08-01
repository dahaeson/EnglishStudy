let sentences = [
{
    english:"Reading outdoors felt a little awkward at first",
    korean:" 처음에는 야외에서 책을 읽는 것이 좀 어색했다.."
},
{
    english:"   I really felt reenergized after my vacation.",
    korean:" 휴가를 다녀왔더니 한껏 힘이 다시 솟아났다."
},
{
    english:"   I need to be alone to relax and clear my mind.",
    korean:"나는 마음을 편안하게 하기 위해 혼자만의 시간이 필요하다."
}
];

let currentIndex = 0;

function displaySentence(){

    if(sentences.length === 0){

        document.getElementById("sentence").innerText =
        "문장이 없습니다.";

        document.getElementById("meaning").innerText =
        "";

        return;
    }

    document.getElementById("sentence").innerText =
    sentences[currentIndex].english;

    document.getElementById("meaning").innerText =
    sentences[currentIndex].korean;
}

function nextSentence(){

    if(sentences.length===0) return;

    currentIndex++;

    if(currentIndex >= sentences.length){
        currentIndex = 0;
    }

    displaySentence();
}

function randomSentence(){

    if(sentences.length===0) return;

    currentIndex =
    Math.floor(Math.random()*sentences.length);

    displaySentence();
}

// 음성 목록을 미리 저장할 변수
let availableVoices = [];

// 브라우저가 음성 목록을 로드했을 때 저장
function loadVoices() {
    availableVoices = speechSynthesis.getVoices();
}

// 음성 로드 이벤트 등록 (Chrome, Safari 등 대응)
speechSynthesis.onvoiceschanged = function() {
    loadVoices();
    displaySentence();
};

// 즉시 실행도 시도 (이미 로드된 경우 대응)
loadVoices();

function speakSentence() {
    const text = document.getElementById("sentence").textContent;
    if (!text) return;

    speechSynthesis.cancel(); // 이전 재생 중단

    // 최신 음성 목록 재확인
    if (availableVoices.length === 0) {
        availableVoices = speechSynthesis.getVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // 1. 영어(en) 음성 필터링 (대소문자 구분 없이 처리)
    const englishVoices = availableVoices.filter(
        voice => voice.lang.toLowerCase().startsWith("en")
    );

    console.log("영어 음성 목록:", englishVoices);

    // 2. 우선순위에 따라 영어 음성 지정
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
        // 영어 전용 음성이 없으면 언어 코드가 en으로 지정된 아무 음성이나 선택
        selectedVoice = availableVoices.find(v => v.lang.includes("en"));
    }

    // 3. 음성 및 언어 강제 지정
    if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang; // 선택된 음성의 언어 코드 사용
    } else {
        utterance.lang = "en-US"; // 음성 개체를 못 찾아도 언어 속성을 미국 영어로 강제
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0; // 여성/남성 호환성을 위해 1.0 권장 (필요시 조절)

    speechSynthesis.speak(utterance);
}
function addSentence(){

    const english =
    document.getElementById("newenglish").value.trim();

    const korean =
    document.getElementById("newKorean").value.trim();

    if(!english || !korean){

        alert("내용을 입력하세요.");
        return;
    }

    sentences.push({
        english,
        korean
    });

    renderList();

    document.getElementById("newenglish").value="";
    document.getElementById("newKorean").value="";
}

function renderList(){

    const list =
    document.getElementById("sentenceList");

    if(sentences.length===0){

        list.innerHTML=
        "<div class='empty'>문장이 없습니다.</div>";

        return;
    }

    let html="";

    sentences.forEach((item,index)=>{

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

function deleteSentence(index){

    sentences.splice(index,1);

    if(currentIndex >= sentences.length){
        currentIndex = 0;
    }

    renderList();
    displaySentence();
}

function deleteAllSentences(){

    if(!confirm("전체 삭제할까요?")){
        return;
    }

    sentences = [];

    currentIndex = 0;

    renderList();
    displaySentence();
}

function importCSV(){

    const file =
    document.getElementById("csvFile").files[0];

    if(!file){
        alert("CSV 파일 선택");
        return;
    }

    const reader =
    new FileReader();

    reader.onload = function(e){

        const rows =
        e.target.result.split("\n");

        rows.forEach(row=>{

            const cols =
            row.split(",");

            if(cols.length >= 2){

                sentences.push({

                    english:
                    cols[0].trim(),

                    korean:
                    cols[1].trim()

                });

            }

        });

        renderList();
        displaySentence();

        alert("CSV 업로드 완료");
    };

    reader.readAsText(file);
}

speechSynthesis.onvoiceschanged =
function(){
    displaySentence();
};

renderList();
displaySentence();
