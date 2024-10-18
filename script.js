const wordInput = document.getElementById('word-input');
const submitButton = document.getElementById('submit-word');
const wordChain = document.getElementById('word-chain');
const scoreValue = document.getElementById('score-value');
const timeValue = document.getElementById('time-value');
const startGameButton = document.getElementById('start-game');

let score = 0;
let timeLeft = 60;
let timer;
let gameActive = false;
let currentChain = [];
let usedWords = new Set(); // Add this line to keep track of used words

function startGame() {
    score = 0;
    timeLeft = 60;
    currentChain = [];
    usedWords.clear(); // Clear the set of used words when starting a new game
    gameActive = true;
    wordChain.textContent = '';
    scoreValue.textContent = score;
    timeValue.textContent = timeLeft;
    wordInput.value = '';
    wordInput.disabled = false;  // Enable the input when the game starts
    submitButton.disabled = false;  // Enable the submit button when the game starts
    wordInput.focus();

    timer = setInterval(() => {
        timeLeft--;
        timeValue.textContent = timeLeft;
        if (timeLeft === 0) {
            endGame();
        }
    }, 1000);

    startGameButton.disabled = true;
}

function endGame() {
    clearInterval(timer);
    gameActive = false;
    wordInput.value = '';
    wordInput.disabled = true;
    submitButton.disabled = true;
    startGameButton.disabled = false;
    alert(`Game Over! Your final score is ${score}`);
}

async function isValidWord(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        return response.ok;
    } catch (error) {
        console.error('Error checking word validity:', error);
        return false;
    }
}

async function submitWord() {
    if (!gameActive) return;

    const word = wordInput.value.trim().toLowerCase();
    
    if (word.length <= 1) {
        alert('Please enter a word with at least 2 letters');
        return;
    }

    if (usedWords.has(word)) {
        alert('This word has already been used. Please try a different word.');
        return;
    }

    const isValid = await isValidWord(word);
    if (!isValid) {
        alert('Please enter a valid English word');
        return;
    }

    if (currentChain.length > 0) {
        const lastWord = currentChain[currentChain.length - 1];
        if (word[0] !== lastWord[lastWord.length - 1]) {
            alert('The word must start with the last letter of the previous word');
            return;
        }
    }

    currentChain.push(word);
    usedWords.add(word); // Add the word to the set of used words
    wordChain.textContent = currentChain.join(' → ');
    score += word.length;
    scoreValue.textContent = score;
    wordInput.value = '';
    wordInput.focus();
}

submitButton.addEventListener('click', submitWord);
wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitWord();
    }
});
startGameButton.addEventListener('click', startGame);

// Initialize the game
wordInput.disabled = true;
submitButton.disabled = true;

// Add this function at the end of the file
function createBubbles() {
    const bubbles = document.getElementById('bubbles');
    const colors = ['#ee7752', '#e73c7e', '#23a6d5', '#23d5ab'];

    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = `${Math.random() * 100}vw`;
        bubble.style.animationDuration = `${Math.random() * 3 + 2}s`;
        bubble.style.animationDelay = `${Math.random() * 2}s`;
        bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        bubbles.appendChild(bubble);
    }
}

// Call createBubbles when the page loads
window.addEventListener('load', createBubbles);
