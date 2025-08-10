async function loadMenu() {
    const menuDiv = document.getElementById('menu');
    const response = await fetch('data/sets-index.json');
    const sets = await response.json();

    menuDiv.innerHTML = '';
    sets.forEach(set => {
        const btn = document.createElement('button');
        btn.textContent = `${set.type.toUpperCase()} - Set ${set.id}`;
        btn.onclick = () => loadSet(set.file);
        menuDiv.appendChild(btn);
    });
}

async function loadSet(file) {
    const menuDiv = document.getElementById('menu');
    const exerciseDiv = document.getElementById('exercise');
    const resultDiv = document.getElementById('result');

    menuDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    exerciseDiv.classList.remove('hidden');

    const response = await fetch(`data/${file}`);
    const data = await response.json();

    renderExercise(data);
}

function renderExercise(data) {
    const exerciseDiv = document.getElementById('exercise');
    exerciseDiv.innerHTML = '';

    let score = 0;
    let answers = [];

    data.questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        const qText = document.createElement('p');
        qText.textContent = `${index + 1}. ${q.text}`;
        questionDiv.appendChild(qText);

        if (q.type === 'multiple-choice') {
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'options';
            q.options.forEach(option => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `q${index}`;
                input.value = option;
                label.appendChild(input);
                label.append(` ${option}`);
                optionsDiv.appendChild(label);
            });
            questionDiv.appendChild(optionsDiv);
        } else if (q.type === 'gap-fill' || q.type === 'word-formation' || q.type === 'rephrasing') {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `q${index}`;
            input.style.width = '100%';
            questionDiv.appendChild(input);
        }

        exerciseDiv.appendChild(questionDiv);
    });

    const submitBtn = document.createElement('button');
    submitBtn.className = 'nav';
    submitBtn.textContent = 'Submit';
    submitBtn.onclick = () => {
        const inputs = exerciseDiv.querySelectorAll('input');
        inputs.forEach((input, i) => {
            if (input.type === 'radio') {
                if (input.checked && input.value === data.questions[Math.floor(i / data.questions[0].options.length)].answer) {
                    score++;
                }
            } else if (input.type === 'text') {
                if (input.value.trim().toLowerCase() === data.questions[i].answer.toLowerCase()) {
                    score++;
                }
            }
        });
        showResult(score, data.questions.length);
    };

    exerciseDiv.appendChild(submitBtn);
}

function showResult(score, total) {
    const exerciseDiv = document.getElementById('exercise');
    const resultDiv = document.getElementById('result');

    exerciseDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');

    resultDiv.innerHTML = `
        <h2>Your Score: ${score} / ${total}</h2>
        <button class="nav" onclick="returnToMenu()">Return to Menu</button>
    `;
}

function returnToMenu() {
    document.getElementById('exercise').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
}

loadMenu();
