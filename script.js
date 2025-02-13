//view Keyboard based on language
let letters;
function generateKeyboard(target) {
    letters = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z'],
        ['<i class="fa-solid fa-delete-left"></i>', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter']
    ];

    // Clear the keyboard container
    const keyboardContainer = document.querySelector('#Keyboard > div');
    keyboardContainer.innerHTML = '';

    // Generate keyboard rows
    letters.forEach((arr, ind) => {
        keyboardContainer.insertAdjacentHTML(
            'beforeend',
            `<div class='d-flex justify-content-center align-items-center col-5 col-sm-8 col-md-12 col-lg-12'></div>`
        );
        arr.forEach(letter =>
            keyboardContainer.lastElementChild.insertAdjacentHTML(
                'beforeend',
                `<div class='card ${
                    letter === 'Enter' || letter === '<i class="fa-solid fa-delete-left"></i>' ? 'col-6 col-sm-4 control' : 'col-2 letter'
                } text-center'>${letter}</div>`
            )
        );
    });

    // Reattach event listeners
    attachKeyboardEventListeners();
}

generateKeyboard(document.querySelector('select').value);

//view input field based on letters
const triels = 6;
let letterNum = 4;
function generateWordInput(){
    document.querySelector('#Word > div').innerHTML = '';

    let input = `<input type="text" value='' readonly class='card col-2 col-sm-1'/>`;

    for(let i=0 ; i<triels ; i++){
        document.querySelector('#Word > div').insertAdjacentHTML('beforeend','<div class="rowInput d-flex justify-content-center align-items-center col-4 col-sm-8 col-md-12 col-lg-12"></div>');
        for(let y=0 ; y<letterNum ; y++){
            document.querySelectorAll('#Word > div > div')[i].insertAdjacentHTML('beforeend',input)
        }
    }

    switch(letterNum){
        case 4:
        case 5: 
            document.querySelectorAll('#Word .card').forEach(card=> card.style.cssText='min-width:45px;max-width:100px')
            break;
        case 6:
        case 7:
        case 8:
            document.querySelectorAll('#Word .card').forEach(card=> card.style.cssText='min-width:30px;max-width:80px')
            break;
        case 9: 
            document.querySelectorAll('#Word .card').forEach(card=> card.style.cssText='min-width:25px;max-width:60px')
            break;
        case 10:
        case 11:
            document.querySelectorAll('#Word .card').forEach(card=> card.style.cssText='min-width:20px;max-width:50px')
            break;
    }
}
generateWordInput();

//fetch word from db.json file
let word;
let wordGuess;
let winWord = [];

//generate Random Word from db.json
function GenerateRandomIndx(data) {
    if (winWord.length === 10) {
        winWord = []; 
    }
    do {
        wordGuess = data[document.querySelector('select').value][letterNum][Math.floor(Math.random() * 10)];
    } while (winWord.some(word => word['Word'] === wordGuess['Word']));

    return wordGuess;
}
function getWord(){
    const params = new URLSearchParams(window.location.search);
    if(params.size){
        const challengeEncoded = params.get('challenge');
        const challengeDecoded = atob(challengeEncoded);
        try {
            const challengeObject = JSON.parse(challengeDecoded);
            word = challengeObject;
            document.querySelector('#Hint p').innerHTML = word['Hint']
        } catch (error) {
            console.error("Error parsing challenge value as JSON:", error);
        }
    }else{
    fetch('data.json',{method:'GET',headers:{"text-content":"application/json"}})
        .then(Response=>Response.json())
        .then(data=> {
            word = GenerateRandomIndx(data);
        })
        .then(()=>document.querySelector('#Hint p').innerHTML = word['Hint'])
    }
}


let formQuickMessage = (msg)=>`<p class='mb-0 card text-align-center justify-content-center p-5 pt-4 pb-4 shadow'>${msg}</p>`;
window.addEventListener('load',()=>{
    document.querySelector('#quickMessage > div').innerHTML = formQuickMessage('Guess The First Word!');
    document.querySelector('#quickMessage').classList.toggle('hide');
    setTimeout(()=>{
     document.querySelector('#quickMessage').classList.toggle('hide');
    },1500);
    getWord();
})

//play again
function New_Game(){
    const params = new URLSearchParams(window.location.search);
    if(params.size){
        history.replaceState({},'','./index.html')
    }
    Reset();
    document.querySelector('#messageWindow').classList.add('hide');
        for(letter of document.querySelectorAll('.letter')){
            letter.classList.remove('off-pointer')
    }

    for(control of document.querySelectorAll('.control')){
            control.classList.remove('off-pointer')
    }
}

function closeWindow(location){
    document.querySelector(location).classList.add('hide');

    document.querySelector('.setting').classList.remove('activeHeaderOption');
    document.querySelector('.setting').children[0].classList.remove('activeHeaderOption');

    document.querySelector('.help').classList.remove('activeHeaderOption');
    document.querySelector('.help').children[0].classList.remove('activeHeaderOption');

}

function getTheLink() {
    var currentUrl = window.location.href;
    var challengeValue = btoa(JSON.stringify(word));
    navigator.clipboard.writeText(currentUrl + '?challenge=' + encodeURIComponent(challengeValue)).then(()=>{
        document.querySelector('.copyLink').textContent = 'Link Copy';
        setTimeout(()=>{
            document.querySelector('.copyLink').textContent = 'Copy link to this word';
        },1500);
    })
}

let formWinWindow = (result)=>`<div class="card shadow">
        <div id="Result" class="d-flex justify-content-end align-items-center rounded p-1">
            <h2 class="fw-bolder w-100 text-center d-flex justify-content-center align-items-center">${result} <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAErklEQVR4nO2YX2gcRRzH16pV8cGoIFXEvvhgEHyoFmpFg9Km95vLX9PdDaVQC6HiHyz6JMEaCAVR1OpLqRp6N7Ml0qgpmsRk71KTh4oPVm3986ItaZOZu7a5JDZRmja5jPz2dk9tdnt7lw3dg3xhYO729je/z/x+M/ObU5QVhVxj8chWQclRTskMZ/A3p/ALp7AnzTbfHtgYRuR+zmAf2hYMMoKRU4ISyhnZWLLR4x89erOgcFgwIt2aTOgLMqHLINqCqbuOwSlZ4AwOyKGqm4oGEJTstwxRmOQs8sLZzrr7Rj+pvisVB+AUTi+YmgwSgDPyNac1j3PacLeI1TwkGGnHiOdgIF6c80bNOqQXFC5j/+rnCJEdCMZ5mdDl/ICWHYlV3bpoHAqPcUouWhDxSLVvAE7JB/bsv+/2PBUnT833BxeBuX51znsyodX25VPfAILCCSsHGdko29pWYSSsiGBoac0DnJFjV/rUwAAu96lSGLBbdqk3cgY7c2kL3ejLKKt+MAdAxoqIAIzjS6e7Nt1hAy1azLM9TZeCArjU02QvWpjPj2FAC479+4eRW+zvJooBsAz92qWuxs8jsfoKQSHGGUyjIQxndkD97JqOffOclCfbpUx1Fk6hvqZhTslvuV2HXBCUvO74cj5G1tjZcMF/CjGYwpfOGFvu9fqNNLW9nk6d2i/l+JdSZnpyrWAUtHbLpst2iYvXTqHv/EeAke9zYYw+6Q2g7vB0KPOVlGcP+gcw1e3ek0netbfSd4oAgAN2HrZ6AiS0DZ4ODe+0QXwCJLX1bmNgCnMK55wNxTeAiEcb7UX1gydA77Y7CzrmF2CovsJtjBSL7rK30BNKMcJDhVNyHl8eY/CMJ0RCSy0ZwNS5m208kTmDdG72o2pRADkDsMfevk5iXeQKYOqfBwBweJHdtrZVWFrYqXNMSuWGogFGu9TbOCMjOSOwzx2g+dWlAzS/snjyyJt2MTeDB5lSqkQMnhCMXLFn4o1FAElt/ZIB+rX/1VqcwmvWeUDJApbyJTufhzCgxSojcun03n/Difu2NPWp0gG0SWfvR7uCwV6njBYMXlaCEqfkRed05oyYeAHJQyS0jsIHlWf+f4w20mzzPYJCr1NOYD0UmPN5CBaptW9LeKhMjcXJ87i45YD2dMkACbUK08TZbawizojWKcslLC04hf58wUXJH9yI7pCmxkuY/bRg0eF/bcG3qUNkrbLcwlzlLNqMzjuDT3c3/FUswHR3g1PZTnAGL5V0bVyKrDuzAS2Ckp/TRlRmB/xfcPC3gsEMp+RtvKYq11tY9F38onHQ9+wfaewMheNXSyb0Qz4ADCWskl3qamnqnddyXh7f5VqWhErSbN4629uQxVzHNtvTkJUJ/VmlnDRON6ScXQr7Srkpw9b96ABgXyk3TcYfOeIAYF8pN03FH37LAcC+Um7682Cl7gBgXyk3TXZUrs2nUEfl8tc4QWouuaU+m6w7ly8dknUT80c3bVPCLjlUVZFNwk8y4VYXadJ6NlTl+g9EKCQHazMFS4nB2owSVkmfxZwSNrU2RWUpTQmLVgDCEgF5pt1XC20KyXIHaF1ZxNdJZR+BFSml6x/J4dpjBAxK2QAAAABJRU5ErkJggg==" alt="trophy"></h2>
            <i class="fa-solid fa-xmark me-3" onclick='closeWindow("#messageWindow")'></i>
        </div>
        <div class="d-flex flex-column align-items-center justify-content-center p-2">
            <button class=" text-upperCase fw-bolder text-light p-2 ps-4 pe-4 shadow mb-3 mt-3 fs-5 rounded" onclick='New_Game()'>New Game</button>
            <button class="d-flex justify-content-center align-items-center p-1 ps-2 pe-2 rounded" onclick="getTheLink()">
                <i class="fa-solid fa-link mt-1 me-1"></i>
                <p class="mb-0 copyLink">Copy link to this word</p>
            </button>
        </div>
    </div>`;
let formLostWindow = (result)=>`<div class="card shadow">
    <div id="Result" class="d-flex justify-content-end align-items-center rounded p-1">
        <h2 class="fw-bolder w-100 text-center">${result}</h2>
        <i class="fa-solid fa-xmark me-3" onclick='closeWindow("#messageWindow")'></i>
    </div>
    <div class="d-flex flex-column align-items-center justify-content-center p-2">
        <p>The answer was:</p>
        <p id='word' class="p-2 ps-3 pe-3 text-uppercase fw-bolder fs-4">${word['Word']}</p>
        <a href="">What does this word mean?</a>
        <button class="newGame text-upperCase fw-bolder text-light p-2 ps-4 pe-4 shadow mb-3 mt-3 fs-5 rounded" onclick='New_Game()'>New Game</button>
        <button class="d-flex justify-content-center align-items-center p-1 ps-2 pe-2 rounded" onclick="getTheLink()">
            <i class="fa-solid fa-link mt-1 me-1"></i>
            <p class="mb-0 copyLink">Copy link to this word</p>
        </button>
    </div>
</div>`


//click on letter to add in input 
let trielNum = 0;
function attachKeyboardEventListeners() {
    // Attach click events to letters
    document.querySelectorAll('.letter').forEach(letter =>
        letter.addEventListener('click', e => {
            let Row = document.querySelectorAll('.rowInput')[trielNum];
            let input = Row.children;
            for (let field of input) {
                if (field.value === '') {
                    field.value = e.target.textContent;
                    break;
                }
            }
        })
    );

    handleControlClick();
}
function offControlInput(){
    for(letter of document.querySelectorAll('.letter')){
            letter.classList.add('off-pointer')
    }

    for(control of document.querySelectorAll('.control')){
            control.classList.add('off-pointer')
    }
}
function handleControlClick() {
    document.querySelectorAll('.control').forEach(control=>control.addEventListener('click',(e)=>{
        let Row = document.querySelectorAll('.rowInput')[trielNum];
        let prevRow = document.querySelectorAll('.rowInput')[trielNum - 1]?.children;
        let input = Row.children;
        let keyboardLetter = document.querySelectorAll('.letter');
        let userAnswer = '';
        let Answer = '';

        function CompleteFillInput(){
            //check if all input is full
            for(let field of input){
                if(field.value == ''){
                        document.querySelector('#quickMessage > div').innerHTML = formQuickMessage('Too Short');
                        document.querySelector('#quickMessage').classList.toggle('hide');
                        setTimeout(()=>{
                        document.querySelector('#quickMessage').classList.toggle('hide');
                        },1500);
                    return false;
                }
            }
            return true;
        }
        function CorrectAnswer(){
            // check if correct word
            Answer = word["Word"].toLocaleLowerCase();
            if(Answer == userAnswer){
                winWord.push(word);

                //add correct color of input
                for(field of input){
                    field.classList.add('correctLocation');

                    //add correct color of input
                    for(alph of keyboardLetter){
                        if(alph.textContent == field.value){
                            alph.classList.add('correctLocation')
                        }
                    }
                }
                offControlInput();
                document.querySelector('#messageWindow > div').innerHTML = formWinWindow('You Win!')
                document.querySelector('#messageWindow').classList.remove('hide');

                return true;
            }
            return false
        }
        function checkOnCorretLetterLocation(){
            if(prevRow){
                for(let key in Array.from(prevRow)){
                    if(prevRow[key].classList.contains('correctLocation')){
                        if(input[key].value != prevRow[key].value){
                                document.querySelector('#quickMessage > div').innerHTML  = formQuickMessage(`The Word Must Contain "${prevRow[key].value}" in correct position`);
                                document.querySelector('#quickMessage').classList.remove('hide');
                                setTimeout(()=>{
                                document.querySelector('#quickMessage').classList.add('hide');
                                },1500);
                            return false;
                        }
                    }else if(prevRow[key].classList.contains('notCorrectLocation')){
                        if(! userAnswer.includes(prevRow[key].value.toLocaleLowerCase())){
                                document.querySelector('#quickMessage > div').innerHTML = formQuickMessage(`The Word Must Contain "${prevRow[key].value}"`);
                                document.querySelector('#quickMessage').classList.remove('hide');
                                setTimeout(()=>{
                                document.querySelector('#quickMessage').classList.add('hide');
                                },1500);
                            return false;
                        }
                    }
                }
                return true;
            }
        }

        //Submit Word
        if(e.target.textContent == 'Enter'){
            //concate all letters
            for(field of input){
                userAnswer += field.value.toLocaleLowerCase();
            }


            if(CompleteFillInput()){
                if(checkOnCorretLetterLocation() || checkOnCorretLetterLocation() == undefined){
                    if(!CorrectAnswer()){                
                        for(let key in Array.from(input)){
                            //check if there letter found in word
                            if(Answer.includes(input[key].value.toLocaleLowerCase())){
                                //check of letter location
                                if(Answer.lastIndexOf(input[key].value.toLocaleLowerCase()) == Answer.indexOf(input[key].value.toLocaleLowerCase())){
                                    //if no repeat letter
                                    if(Answer.indexOf(input[key].value.toLocaleLowerCase()) == key){
                                        input[key].classList.add('correctLocation');
                                        //add correct color of input
                                        for(alph of keyboardLetter){
                                            if(alph.textContent == input[key].value){
                                                alph.classList.add('correctLocation')
                                            }
                                        }
                                    }else{
                                        input[key].classList.add('notCorrectLocation');
                                        //add correct color of input
                                        for(alph of keyboardLetter){
                                            if(alph.textContent == input[key].value){
                                                alph.classList.add('notCorrectLocation')
                                            }
                                        }
                                    }
                                }else{
                                    //if repeat letter
                                    if(Answer.indexOf(input[key].value.toLocaleLowerCase()) == key){
                                        input[key].classList.add('correctLocation');
                                        //add correct color of input
                                        for(alph of keyboardLetter){
                                            if(alph.textContent == input[key].value){
                                                alph.classList.add('correctLocation')
                                            }
                                        }
                                    }else{
                                        input[key].classList.add('notCorrectLocation');
                                        //add correct color of input
                                        for(alph of keyboardLetter){
                                            if(alph.textContent == input[key].value){
                                                alph.classList.add('notCorrectLocation')
                                            }
                                        }
                                    }

                                    if(Answer.lastIndexOf(input[key].value.toLocaleLowerCase()) == key){
                                        input[key].classList.add('correctLocation');
                                        //add correct color of input
                                        for(alph of keyboardLetter){
                                            if(alph.textContent == input[key].value){
                                                alph.classList.add('correctLocation')
                                            }
                                        }
                                    }else{
                                        input[key].classList.add('notCorrectLocation');
                                        //add correct color of input
                                        for(alph of keyboardLetter){
                                            if(alph.textContent == input[key].value){
                                                alph.classList.add('notCorrectLocation')
                                            }
                                        }
                                    }
                                }
                            }else{
                                //if letter not found in Answer 
                                input[key].classList.add('notCorrectLetter');
                                //add correct color of input
                                for(alph of keyboardLetter){
                                    if(alph.textContent == input[key].value){
                                        alph.classList.add('notCorrectLetter')
                                    }
                                }
                            }
                        }

                        if(trielNum < triels -1){
                            return trielNum++;
                        }else{
                            winWord.push(word);
                            offControlInput();
                            document.querySelector('#messageWindow > div').innerHTML = formLostWindow('You Lost!')
                            document.querySelector('#messageWindow').classList.remove('hide');
                        }
                    }
                }
            }
        }else{ 
            //Delete Letter
            for(let i = letterNum - 1 ; i >= 0 ; i--){
                if(input[i].value != ''){
                    input[i].value = '';
                    break;
                }
            }
        }
    }))
}

function openCloseSetting(e){
    document.querySelector('#Setting').classList.toggle('hide');
    document.querySelector('#howPlay').classList.add('hide');

    e.classList.toggle('activeHeaderOption')
    e.children[0].classList.toggle('activeHeaderOption')
}
function openCloseHowPlay(e){
    document.querySelector('#howPlay').classList.toggle('hide');
    document.querySelector('#Setting').classList.add('hide');

    e.classList.toggle('activeHeaderOption');
    e.children[0].classList.toggle('activeHeaderOption')
}
//setting
document.querySelectorAll('#letterNum .Num').forEach(num => num.addEventListener('click',(e)=>{
    document.querySelectorAll('#letterNum .Num').forEach(num => num.classList.contains('activeNum') && num.classList.remove('activeNum'))
    !e.target.classList.contains('activeNum') && e.target.classList.add('activeNum')
    letterNum = +e.target.textContent;
    document.querySelector('#Word > div').innerHTML = '';
    Reset();
}))

function Reset(){
    generateWordInput();
    generateKeyboard(document.querySelector('select').value);
    getWord();
    trielNum = 0;
}

function mode(){
    let modeElement = document.querySelector('#darkMode > span');
    let currentMode = modeElement.getAttribute('mode');

    if (currentMode === 'dark') {
        DarkMode();
        modeElement.setAttribute('mode', 'light');
    } else {
        LightMode();
        modeElement.setAttribute('mode', 'dark');
    }
}

function DarkMode(){
    document.documentElement.style.setProperty('--grayish-white', '#13141c');
    document.documentElement.style.setProperty('--dark-blue', '#ededed');
    document.documentElement.style.setProperty('--light-grayish-blue', '#40445c');
    document.documentElement.style.setProperty('--pale-blue-gray', '#656780');
    document.documentElement.style.setProperty('--very-light-blue', '#191a24');
}
function LightMode(){
    document.documentElement.style.setProperty('--grayish-white', '#ededed');
    document.documentElement.style.setProperty('--dark-blue', '#13141c');
    document.documentElement.style.setProperty('--light-grayish-blue', '#dfe2e8');
    document.documentElement.style.setProperty('--pale-blue-gray', '#c2c8d5');
    document.documentElement.style.setProperty('--very-light-blue', '#fbfcff');
}