// ===================================
// English Study
// Version 1
// ===================================

// 문장 저장 배열
let sentences = [];

// 현재 문장 번호
let currentIndex = 0;

const englishInput =
document.getElementById("englishInput");

const koreanInput =
document.getElementById("koreanInput");

const englishSentence =
document.getElementById("englishSentence");

const koreanSentence =
document.getElementById("koreanSentence");

const addSentenceBtn =
document.getElementById("addSentenceBtn");
function showSentence(){

    if(sentences.length===0){

        englishSentence.innerHTML =
        "영어 문장을 추가하세요.";

        koreanSentence.innerHTML =
        "";

        return;

    }

    englishSentence.innerHTML =
    sentences[currentIndex].english;

    koreanSentence.innerHTML =
    sentences[currentIndex].korean;

}

addSentenceBtn.onclick=function(){

    const english =
    englishInput.value.trim();

    const korean =
    koreanInput.value.trim();

    if(english==="" || korean===""){

        alert("영어와 한국어를 입력하세요.");

        return;

    }

    sentences.push({

        english:english,

        korean:korean

    });

    currentIndex =
    sentences.length-1;

    englishInput.value="";

    koreanInput.value="";

    showSentence();

};
function previousSentence(){

    if(sentences.length===0)
        return;

    currentIndex--;

    if(currentIndex<0){

        currentIndex=
        sentences.length-1;

    }

    showSentence();

}
function previousSentence(){

    if(sentences.length===0)
        return;

    currentIndex--;

    if(currentIndex<0){

        currentIndex=
        sentences.length-1;

    }

    showSentence();

}
function nextSentence(){

    if(sentences.length===0)
        return;

    currentIndex++;

    if(currentIndex>=sentences.length){

        currentIndex=0;

    }

    showSentence();

}

function randomSentence(){

    if(sentences.length===0)
        return;

    currentIndex =
    Math.floor(

        Math.random()
        *sentences.length

    );

    showSentence();

}

// ==========================
// LocalStorage 저장
// ==========================

function saveData(){

    localStorage.setItem(

        "englishStudy",

        JSON.stringify(sentences)

    );

}

// ==========================
// LocalStorage 불러오기
// ==========================

function loadData(){

    const data =

    localStorage.getItem(

        "englishStudy"

    );

    if(data){

        sentences =

        JSON.parse(data);

    }

}





