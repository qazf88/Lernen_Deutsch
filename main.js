{
    let current_wortart = null;
    let current_test = null;
    let current_level = "All";
    let current_antworte = [];
    const setse_per_page = 10;

    let activeTime = 0;
    let lastTime = Date.now();
    let isActive = true;
    let lastInteractionTime = Date.now();
    const inactivityLimit = 3 * 60 * 1000;

    const today = new Date().toISOString().split('T')[0];
    const storageKey = `activeTime_${today}`;

    function setCurrentButton(index, parentElementId) {
        let btns = document.getElementById(parentElementId).children;
        for (i = 0; i < btns.length; i++) {
            if (index === i) {
                btns[i].style.color = "black";
                btns[i].style.fontSize = "26px";
            } else {
                btns[i].style.color = "rgb(85, 86, 85)"
                btns[i].style.fontSize = "20px";
            }
        }
    }

    function changeWortart(val) {

        if (Number(val) > Wortart.length) {
            current_wortart = Wortart[0].name;
        } else {
            if (current_wortart === Number(val)) {
                return;
            } else {
                current_wortart = Number(val);
            }
        }

        document.getElementById("taskContainer").replaceChildren();
        current_test = null;

        let buttonTestContainer = document.getElementById("buttonTestContainer");
        buttonTestContainer.replaceChildren();

        if (Wortart[current_wortart].data.length === 1) {
            changeTest(0);
        } else {
            Wortart[current_wortart].data.forEach((testItem, testIndex) => {
                buttonTestContainer.appendChild(create_button(eval(testItem.name).name, testIndex, "changeTest"));
            })
        }

        setCurrentButton(val, "buttonWortartenContainer");
    }

    function changeTest(val) {

        if (Number(val) > Wortart.length) {
            current_test = eval(Wortart[current_wortart].data[0].name);
        } else {
            Wortart[current_wortart].data.forEach((item, index) => {
                if (Number(val) === Number(index)) {
                    if (current_test === eval(item.name)) {
                        return;
                    } else {
                        current_test = eval(item.name)
                        setCurrentButton(val, "buttonTestContainer");
                        generateTasks();
                    }
                }
            });
        }
    }

    function changeLevel(val) {

        if (current_level === Levels[val].name) {
            return;
        }

        if ((Levels[val].name === undefined) || (Number(val) > Levels.length)) {
            current_level = Levels[0].name;
        } else {
            current_level = Levels[Number(val)].name;
        }
        setCurrentButton(val, "buttonLevelContainer");
        if ((current_test != null) && current_test != null) {
            generateTasks();
        }
    }

    function replaceUmlauts(str) {
        const umlautMap = {
            'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
            'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue'
        };

        return str.replace(/[äöüßÄÖÜ]/g, match => umlautMap[match] || match);
    }

    function generateTasks() {
        current_antworte = [];
        let resElement = document.getElementById("result");
        resElement.innerHTML = "";
        let desk = document.getElementById("deskription");
        desk.innerHTML = current_test.desc;
        let taskContainer = document.getElementById("taskContainer");
        taskContainer.innerHTML = "";
        let levelOneArray;
        if (current_level === "All") {
            levelOneArray = current_test.data;
        } else {
            levelOneArray = current_test.data.filter(item => item.level === current_level);
        }
        let selectedSentences = levelOneArray.toSorted(() => 0.5 - Math.random()).slice(0, levelOneArray.length < setse_per_page ? levelOneArray.length : setse_per_page);
        selectedSentences.forEach((item, index) => {
            let sentenceId = `sentens_${current_test.data.findIndex(e => e.sentence === item.sentence)}`;

            current_antworte.push({ index: index, antwort: item.answer })

            let sentenceWithInputs = item.sentence.replace("___", `<input type='text' id='q${index}_0'>`);
            if (sentenceWithInputs.includes("___")) {
                sentenceWithInputs = sentenceWithInputs.replace("___", `<input type='text' id='q${index + 1}_1'>`);
            }

            let infinitive = "";
            if (Wortart[current_wortart].name === "Pronomen") {
                infinitive = ' &#9755; &#9432;';
            } else {
                if (item.level === "A1" || item.level === "A2" || item.level === "B1") {
                    infinitive = "(" + item.infinitive + ")";
                }
            }

            if (Wortart[current_wortart].name === "Nomen") {
                if (item.level === "A1") {
                    infinitive = "(" + item.infinitive + ")";
                } else {
                    infinitive = ' &#9755; &#9432;';
                }
            }

            if (Wortart[current_wortart].name === "Zahlen") {
                infinitive = "(" + item.ua_infinitiv + " " + item.type + ")";
            }

            let backgraund = "";

            if (index % 2 == 0) {
                backgraund = " style=\" background-color: rgba(168, 168, 166, 0.59);\"";
            }

            let levelInfo = '';
            if (current_level == "All") {
                levelInfo = `<span data-tooltip="${item.level}"> &#9755; &#9432;</span>`;
            }

            let infinitiveDict = item.infinitive.split(",");
            let linksDict = '';
            if (Wortart[current_wortart].name === "Verb" || Wortart[current_wortart].name === "Nomen") {
                linksDict = `<a href="https://dict.com/deutsch-ukrainisch/${infinitiveDict[0]}" target="_blank">dict.com</a> 
                <a href="https://www.duden.de/rechtschreibung/${replaceUmlauts(infinitiveDict[0])}" target="_blank">duden</a>`
            }

            let taskHTML = `
            <p class='task_p' id='${sentenceId}' ${backgraund}>
                ${index + 1}. ${sentenceWithInputs} 
                <span data-tooltip="${item.ua_infinitiv}"> ${infinitive} </span>  
                <span data-tooltip="${item.ua_sentence}"> &#9755; &#9432;</span> 
               ${levelInfo}
               ${linksDict}
                <span class='hint' id='hint${index}'></span> 
              </p>`;
            taskContainer.innerHTML += taskHTML;

        });
    }

    function checkAnswers() {
        let res = 0;
        let sentenceElements = document.getElementById("taskContainer").children;

        for (let i = 0; i < sentenceElements.length; i++) {
            let userAnswer = sentenceElements[i].querySelectorAll("input");
            let hint = document.getElementById(`hint${i}`);

            let ans = [];
            userAnswer.forEach((input, index) => {
                ans.push(input.value.trim());
            });

            let richtig = current_antworte[i].antwort.split(" ");

            if (ans.length === 2) {
                if (ans[0].toLowerCase() === richtig[0].toLowerCase() && ans[1].toLowerCase() === richtig[1].toLowerCase()) {
                    userAnswer[0].style.color = "green";
                    userAnswer[1].style.color = "green";
                    hint.style.display = "none";
                    res++;
                } else {
                    userAnswer[0].style.color = "red";
                    userAnswer[1].style.color = "red";
                    hint.style.display = "inline";
                    hint.textContent = `(${richtig.join(' ')})`;
                }
            }
            else {
                if (ans[0].toLowerCase() === richtig[0].toLowerCase()) {
                    userAnswer[0].style.color = "green";
                    hint.style.display = "none";
                    res++;
                } else {
                    userAnswer[0].style.color = "red";
                    hint.style.display = "inline";
                    hint.textContent = `(${richtig.join(' ')})`;
                }
            }
        }
        let resElement = document.getElementById("result");
        resElement.innerHTML = `Ergebnis: ${res} von ${sentenceElements.length}`;
        if (res === sentenceElements.length) {
            resElement.style.color = "green";
        }
        else if (res >= sentenceElements.length / 2 && res < sentenceElements.length) {
            resElement.style.color = "#FF8C00";
        }
        else {
            resElement.style.color = "red";
        }

        calcScore(res, sentenceElements.length);

    };

    function create_button(name, index, oncFunc) {
        var el = document.createElement("button");
        el.id = "btn_" + index;
        el.innerHTML = name
        el.setAttribute("onClick", oncFunc + "(" + Number(index) + ")")
        return el;
    }

    function initLevel() {
        let buttonLevelContainer = document.getElementById("buttonLevelContainer");
        Levels.forEach((item, index) => {
            buttonLevelContainer.appendChild(create_button(item.name, index, "changeLevel"));
        });
        changeLevel(0);
    }

    function initWortart() {
        let buttonWortartenContainer = document.getElementById("buttonWortartenContainer");
        Wortart.forEach((item, index) => {
            buttonWortartenContainer.appendChild(create_button(item.name, index, "changeWortart"));
        });
    }

    function init() {
        initLevel();
        initWortart();

        document.getElementById("taskContainer").innerHTML = "<p id='wahlen' style='text-align: center;  font-size: 26px;'>Wählen Sie einen Test aus!</p>";

        wievScore()

        const del = document.querySelectorAll(".btnDelete");
        for (let i = 0; i < del.length; i++) {
            del[i].addEventListener("click", function (e) {
                e.preventDefault();
                showbox();
            });
        }

        document.querySelector("#btnYes").addEventListener("click", function (e) {
            hidebox();
            setScore(0, 0);
            wievScore()
            e.returnValue = true;
        });
        document.querySelector("#btnNo").addEventListener("click", function () {
            hidebox();
        });

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", () => { isActive = false; updateTime(); });
        window.addEventListener("focus", () => { isActive = true; lastTime = Date.now(); });

        document.addEventListener("mousemove", resetInactivityTimer);
        document.addEventListener("keydown", resetInactivityTimer);
        document.addEventListener("click", resetInactivityTimer);
        document.addEventListener("scroll", resetInactivityTimer);

        activeTime = parseFloat(localStorage.getItem(storageKey)) || 0;

        document.getElementById("work_time").innerHTML = formatTime(activeTime);

    }

    function checkScore() {

        let total_score = localStorage.getItem("total_score");
        if (total_score == null || !Number.isInteger(Number(total_score))) {
            localStorage.setItem("total_score", 0);
        }

        let percent_score = localStorage.getItem("percent_score");
        if (percent_score == null || !Number.isInteger(Number(percent_score))) {
            localStorage.setItem("percent_score", 0);
        }
    }

    function wievScore() {

        checkScore();

        let scoreElement = document.getElementById("score");
        scoreElement.innerHTML = `<p><span data-tooltip="${localStorage.getItem("total_score")}"> ${localStorage.getItem("percent_score")}% </span></p>`;

        if (wievScore >= 75) {
            scoreElement.style.color = "green";
        } else if (wievScore < 75 && wievScore > 25) {
            scoreElement.style.color = "#FF8C00";
        } else {
            scoreElement.style.color = "red";
        }
    }

    function calcScore(current_score, tests_size) {
        let total_score = Number(localStorage.getItem("total_score"));
        let percent_score = Number(localStorage.getItem("percent_score"));

        let new_percent = (Math.round(100 / tests_size * current_score))

        if (Number(percent_score) > 0) {
            new_percent = Math.round((new_percent + percent_score) / 2);
        }

        setScore(new_percent, total_score + current_score)
        wievScore();
    }

    function setScore(percent, total) {
        localStorage.setItem("percent_score", percent);
        localStorage.setItem("total_score", total);
    }

    function showbox() {
        document.getElementById("modalHolder").style.display = "flex";
    }

    function hidebox() {
        document.getElementById("modalHolder").style.display = "none";
    }

    function updateTime() {
        if (isActive) {
            let currentTime = Date.now();
            activeTime += Math.round((currentTime - lastTime) / 1000);
            lastTime = currentTime;
            localStorage.setItem(storageKey, activeTime);
        }
    }

    function resetInactivityTimer() {
        lastInteractionTime = Date.now();
        if (!isActive) {
            isActive = true;
            lastTime = Date.now();
        }
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            isActive = false;
            updateTime();
        } else {
            isActive = true;
            lastTime = Date.now();
        }
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }


    setInterval(() => {
        updateTime();
        document.getElementById("work_time").innerHTML = formatTime(activeTime);
    }, 15000);


    setInterval(() => {
        if (Date.now() - lastInteractionTime > inactivityLimit) {
            isActive = false;
            updateTime();
        }
    }, 5000);

    init();

}