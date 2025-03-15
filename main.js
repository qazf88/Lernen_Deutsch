{
    let current_arr = eval(Liste_tests[0].name);
    let current_level = "All";

    function setCurrentButton(index, parentElementId) {
        let btns = document.getElementById(parentElementId).children;
        for (i = 0; i < btns.length; i++) {
            if (index === i) {
                btns[i].style.color = "black";
                btns[i].style.fontSize = "26px";
            } else {
                btns[i].style.color = "gray"
                btns[i].style.fontSize = "20px";
            }
        }
    }

    function changeTest(val) {
        if (Number(val) >= Liste_tests.length) {
            current_arr = eval(Liste_tests[0].name);
        } else {
            Liste_tests.forEach((item, index) => {
                if (Number(val) === Number(index)) {
                    if (current_arr === eval(item.name)) {
                        return;
                    } else {
                        current_arr = eval(item.name)
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
        current_level = Levels[val].name || undefined;
        if (Levels[val].name === undefined) {
            alert("Error: Level not found")
            current_level = Levels[0].name;
        }
        setCurrentButton(val, "buttonLevelContainer");
        generateTasks();
    }

    function generateTasks() {
        console.log(current_arr);
        let resElement = document.getElementById("result");
        resElement.innerHTML = "";
        let desk = document.getElementById("deskription");
        desk.innerHTML = current_arr.desc;
        let taskContainer = document.getElementById("taskContainer");
        taskContainer.innerHTML = "";
        let levelOneArray;
        if (current_level === "All") {
            levelOneArray = current_arr.data;
        } else {
            levelOneArray = current_arr.data.filter(item => item.level === current_level);
        }
        let selectedSentences = levelOneArray.toSorted(() => 0.5 - Math.random()).slice(0, 10);
        selectedSentences.forEach((item, index) => {
            let sentenceId = `sentens_${current_arr.data.findIndex(e => e.sentence === item.sentence)}`;

            let sentenceWithInputs = item.sentence.replace("___", `<input type='text' id='q${index}_0'>`);
            if (sentenceWithInputs.includes("___")) {
                sentenceWithInputs = sentenceWithInputs.replace("___", `<input type='text' id='q${index + 1}_1'>`);
            }
            let infinitive = "";
            if (item.level === "A1" || item.level === "A2" || item.level === "B1") {
                infinitive = "(" + item.infinitive + ")";
            }

            let taskHTML = `
            <p id='${sentenceId}'>
                ${index + 1}. ${sentenceWithInputs} 
                ${infinitive}
                <span data-tooltip="${item.ua_infinitiv}"> &#9755; &#9432;</span>  
                <span data-tooltip="${item.ua_sentence}"> &#9755; &#9432;</span> 
                <span data-tooltip="${item.level}"> &#9755; &#9432;</span> 
                <span class='hint' id='hint${index}'></span> 
                <a href="https://dict.com/deutsch-ukrainisch/${item.infinitive}" target="_blank">dict.com</a> 
                <a href="https://www.duden.de/rechtschreibung/${item.infinitive}" target="_blank">duden</a>
            </p>
        `;
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

            let richtig = current_arr.data[Number(sentenceElements[i].id.replace("sentens_", ""))].answer.split(" ");

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
            resElement.style.color = "yellow";
        }
        else {
            resElement.style.color = "red";
        }
    };


    function create_button(name, index, oncFunc) {
        var el = document.createElement("button");
        el.id = "btn_" + index;
        el.innerHTML = name
        el.setAttribute("onClick", oncFunc + "(" + Number(index) + ")")
        return el;
    }


    function init() {
        let buttonTestContainer = document.getElementById("buttonTestContainer");
        Liste_tests.forEach((item, index) => {
            buttonTestContainer.appendChild(create_button(eval(item.name).name, index, "changeTest"));
        });
        let buttonLevelContainer = document.getElementById("buttonLevelContainer");
        Levels.forEach((item, index) => {
            buttonLevelContainer.appendChild(create_button(item.name, index, "changeLevel"));
        });
        current_arr = eval(Liste_tests[0].name);
        current_level = "All";
        setCurrentButton(Levels.length - 1, "buttonLevelContainer");
        setCurrentButton(0, "buttonTestContainer");

    }

    init();
    generateTasks();

}