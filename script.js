// ===============================
// English Study
// Version 1.0
// ===============================

// 문장 저장 배열

let sentences = [

    {
        en:"Hello.",
        ko:"안녕하세요."
    }

];

// 현재 위치

let currentIndex = 0;


// HTML 요소

const english =
document.getElementById("english");

const korean =
document.getElementById("korean");

const input =
document.getElementById("sentenceInput");

const progressBar =
document.getElementById("progressBar");

const progressText =
document.getElementById("progressText");


// 화면 표시

function showSentence(){

    english.textContent =
    sentences[currentIndex].en;

    korean.textContent =
    sentences[currentIndex].ko;

    updateProgress();

}


// 진행률

function updateProgress(){

    progressText.textContent =
    `${currentIndex+1} / ${sentences.length}`;

    progressBar.style.width =
    ((currentIndex+1)/sentences.length*100)+"%";

}


// 입력창 읽기

function loadInput(){

    const lines =
    input.value.trim().split("\n");

    sentences=[];

    lines.forEach(line=>{

        const parts=line.split("|");

        if(parts.length==2){

            sentences.push({

                en:parts[0].trim(),

                ko:parts[1].trim()

            });

        }

    });

    if(sentences.length==0){

        alert("문장을 입력해주세요.");

        return;

    }

    currentIndex=0;

    showSentence();

}


// 다음

document
.getElementById("nextBtn")
.onclick=function(){

    if(currentIndex<sentences.length-1){

        currentIndex++;

        showSentence();

    }

};


// 이전

document
.getElementById("prevBtn")
.onclick=function(){

    if(currentIndex>0){

        currentIndex--;

        showSentence();

    }

};


// 랜덤

document
.getElementById("randomBtn")
.onclick=function(){

    currentIndex=
    Math.floor(
        Math.random()*sentences.length
    );

    showSentence();

};


// TTS

function speakEnglish(text) {

    speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);

    const voices = speechSynthesis.getVoices();

    console.log(voices); // 확인용

    // 가장 좋은 영어 음성 찾기
    let voice =
        voices.find(v => v.name.includes("Jenny")) ||
        voices.find(v => v.name.includes("Aria")) ||
        voices.find(v => v.name.includes("Google US English")) ||
        voices.find(v => v.lang === "en-US") ||
        voices.find(v => v.lang.startsWith("en"));

    if (voice) {
        utter.voice = voice;
        console.log("사용 음성:", voice.name);
    }

    utter.lang = "en-US";
    utter.rate = 0.9;
    utter.pitch = 1;

    speechSynthesis.speak(utter);
}


// 저장 버튼을 누르면 입력창 읽기

document.getElementById("ttsBtn").onclick = () => {
    speakEnglish(sentences[currentIndex].en);
};

// 시작

showSentence();
