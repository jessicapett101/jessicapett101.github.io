let quizData = [];
let destinationsData = [];
let currentQuestionIndex = 0;
let userAnswers = {};

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');

// Fetch the data
fetch('questions.json')
    .then(res => res.json())
    .then(data => {
        quizData = data.questions;
        destinationsData = data.destinations;
    });

// Start Quiz
document.getElementById('start-btn').addEventListener('click', () => {
    welcomeScreen.classList.remove('active');
    quizScreen.classList.add('active');
    loadQuestion();
});

function loadQuestion() {
    // Reset animation
    questionText.classList.remove('animate-pop');
    void questionText.offsetWidth; // trigger reflow
    questionText.classList.add('animate-pop');

    const currentQ = quizData[currentQuestionIndex];
    questionText.innerText = currentQ.text;
    optionsContainer.innerHTML = '';

    // Update Progress Bar
    progressBar.style.width = `${((currentQuestionIndex) / quizData.length) * 100}%`;

    currentQ.options.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.className = 'option-btn animate-slide-up';
        btn.style.animationDelay = '0.1s'; // Staggered entrance
        btn.addEventListener('click', () => handleAnswer(currentQ.id, option));
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(questionId, answer) {
    userAnswers[questionId] = answer;
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        progressBar.style.width = '100%';
        setTimeout(calculateResult, 400); // Slight delay for visual polish
    }
}

function calculateResult() {
    quizScreen.classList.remove('active');
    resultsScreen.classList.add('active');
    
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    // Scoring Algorithm: Find the best match
    let bestMatch = destinationsData[0];
    let highestScore = -1;

    destinationsData.forEach(dest => {
        let score = 0;
        // Check if the array of months includes the user's answer
        if (dest.month.includes(userAnswers.month)) score++;
        if (dest.vibe === userAnswers.vibe) score++;
        if (dest.transport.includes(userAnswers.transport)) score++;
        if (dest.budget === userAnswers.budget) score++;

        if (score > highestScore) {
            highestScore = score;
            bestMatch = dest;
        }
    });

    // Populate Results UI
    document.getElementById('dest-image').src = bestMatch.image;
    document.getElementById('dest-name').innerText = bestMatch.name;
    document.getElementById('dest-budget').innerText = `💰 ${bestMatch.budget}`;
    document.getElementById('dest-vibe').innerText = `✨ ${bestMatch.vibe}`;
    document.getElementById('dest-desc').innerText = bestMatch.description;
}

// Restart Quiz
document.getElementById('restart-btn').addEventListener('click', () => {
    currentQuestionIndex = 0;
    userAnswers = {};
    resultsScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
});
