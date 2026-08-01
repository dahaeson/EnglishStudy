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

function speakSentence() {

    const text = document.getElementById("sentence").textContent;

    if (!text) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = speechSynthesis.getVoices();

    // 영어 음성만 추출
    const englishVoices = voices.filter(
        voice => voice.lang.startsWith("ja")
    );

    console.log("영어 음성 목록:", englishVoices);

    // 여성 음성 우선 선택
    let selectedVoice =
        englishVoices.find(v =>
            v.name.toLowerCase().includes("female")
        ) ||
        englishVoices.find(v =>
            v.name.includes("Kyoko")
        ) ||
        englishVoices[0];

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    utterance.lang = "ja-JP";
    utterance.rate = 0.95;
    utterance.pitch = 1.3; // 높을수록 여성 느낌

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

            <div class="jp">
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
