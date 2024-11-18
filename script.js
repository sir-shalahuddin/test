let currentIndex = 0;
let currentScore = 100;
let attemptsLeft = 5;
let revealedParts = [];
const gridParts = 6;
let gameData = [];

// Load JSON data (local file)
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        gameData = data;
        startGame();
    })
    .catch(err => {
        console.error("Error loading JSON:", err);
    });

// Game initialization
function startGame() {
    // Karena hanya ada satu data, kita langsung ambil data pertama
    currentIndex = 0;
    currentScore = 100;
    attemptsLeft = 5;
    revealedParts = [];

    // Set up the grid
    const grid = document.querySelector('.image-grid');
    grid.innerHTML = ''; // Clear grid
    for (let i = 0; i < gridParts; i++) {
        const part = document.createElement('div');
        part.className = 'image-part';
        part.style.backgroundImage = `url(${gameData[currentIndex].source})`;
        grid.appendChild(part);
    }

    // Reveal a random part at the beginning of the game
    revealPart();

    // Reset UI
    document.getElementById('score').textContent = currentScore;
    document.getElementById('message').textContent = '';
    document.getElementById('credit').textContent = `Credit: ${gameData[currentIndex].credit}`;
}

// Reveal a random part of the image
function revealPart() {
    const grid = document.querySelectorAll('.image-part');
    let partToReveal;
    do {
        partToReveal = Math.floor(Math.random() * gridParts);
    } while (revealedParts.includes(partToReveal));

    revealedParts.push(partToReveal);
    grid[partToReveal].style.opacity = '1';  // Reveal the selected part
}

// Handle guess submission
function handleGuess() {
    const guessInput = document.getElementById('guess-input');
    const guess = guessInput.value.trim().toLowerCase();
    const answer = gameData[currentIndex].answer.toLowerCase();

    if (guess === answer) {
        document.getElementById('message').textContent = 'Correct! You win!';
        endGame(true);  // End the game if the guess is correct
        return;
    }

    attemptsLeft--;
    currentScore -= 20;

    if (attemptsLeft > 0) {
        revealPart();  // Reveal another part if the guess is incorrect
        document.getElementById('score').textContent = currentScore;
        document.getElementById('message').textContent = `Wrong! You have ${attemptsLeft} attempts left.`;
    } else {
        document.getElementById('message').textContent = `Game over! The correct answer was "${answer}".`;
        endGame(false);  // End the game if the player runs out of attempts
    }

    guessInput.value = ''; // Clear input
}

// End the game and show the full image
function endGame(correct) {
    const grid = document.querySelectorAll('.image-part');

    // Reveal all parts of the image at the end of the game
    grid.forEach(part => {
        part.style.opacity = '1';  // Make all parts visible
    });

    if (correct) {
        document.getElementById('message').textContent = 'You guessed it right!';
    } else {
        document.getElementById('message').textContent = 'Game Over! Here is the full image.';
    }
}

// Event listeners
document.getElementById('submit-guess').addEventListener('click', handleGuess);
