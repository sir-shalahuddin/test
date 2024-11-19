let currentIndex = 0;
let currentScore = 100;
let attemptsLeft = 5;
let revealedParts = [];
const gridParts = 6;
let gameData = [];
let currentGame = null; // Store the current game data

// Load JSON data (local file)
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    gameData = data;
    initializeGame(); // Initialize the game after data is loaded
  })
  .catch(err => {
    console.error("Error loading JSON:", err);
  });

function initializeGame() {
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('game-date');
  dateInput.value = today;

  // Start the game based on the default date
  dateInput.addEventListener('change', startGame); // Update game when date changes
  startGame();
}

function startGame() {
  // Get selected date or use today's date
  const selectedDate = document.getElementById('game-date').value;

  // Filter game data by date
  const filteredData = gameData.filter(item => item.date === selectedDate);

  if (filteredData.length === 0) {
    document.getElementById('message').textContent = 'No game data available for the selected date.';
    document.querySelector('.image-grid').innerHTML = ''; // Clear grid
    document.getElementById('score').textContent = '';
    document.getElementById('credit').textContent = '';
    return;
  }

  // Set current game state
  currentGame = filteredData[0]; // Use the first game entry for the selected date
  currentIndex = 0; // Only one entry per date, so index is always 0
  currentScore = 100;
  attemptsLeft = 5;
  revealedParts = [];

  // Set up the grid
  const grid = document.querySelector('.image-grid');
  grid.innerHTML = ''; // Clear grid

  // Create image part divs
  for (let i = 0; i < gridParts; i++) {
    const part = document.createElement('div');
    part.className = 'image-part';
    part.style.backgroundImage = `url(${currentGame.source})`;
    grid.appendChild(part);
  }

  // Create a loading spinner and add it to the grid
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  grid.appendChild(spinner);

  // Add hidden class to hide the grid while loading
  grid.classList.add('hidden');

  // Get the image and adjust grid aspect ratio
  const img = new Image();
  img.src = currentGame.source;

  img.onload = () => {
    // Calculate aspect ratio
    const aspectRatio = img.naturalWidth / img.naturalHeight;

    // Adjust the grid's height based on the image's aspect ratio
    const gridWidth = grid.offsetWidth; // Current width of the grid container
    grid.style.height = `${gridWidth / aspectRatio}px`; // Adjust height based on aspect ratio

    // Remove the loading spinner
    spinner.remove();

    // Remove the 'hidden' class to display the grid
    grid.classList.remove('hidden');

    // Reveal a random part at the beginning of the game
    revealPart();

    // Reset UI
    document.getElementById('score').textContent = currentScore;
    document.getElementById('message').textContent = '';
  };

  img.onerror = () => {
    // Handle image load error
    spinner.remove();
    grid.classList.remove('hidden');
    document.getElementById('message').textContent = 'Error loading image.';
  };
}

// Reveal a random part of the image
function revealPart() {
  const grid = document.querySelectorAll('.image-part');
  let partToReveal;
  do {
    partToReveal = Math.floor(Math.random() * gridParts);
  } while (revealedParts.includes(partToReveal));

  revealedParts.push(partToReveal);
  grid[partToReveal].style.opacity = '1'; // Reveal the selected part
}

// Handle guess submission
function handleGuess() {
  const guessInput = document.getElementById('guess-input');
  const guess = guessInput.value.trim().toLowerCase();
  const answer = currentGame.answer.toLowerCase(); // Use currentGame for the correct answer

  if (guess === answer) {
    document.getElementById('message').textContent = 'Correct! You win!';
    endGame(true); // End the game if the guess is correct
    return;
  }

  attemptsLeft--;
  currentScore -= 20;

  if (attemptsLeft > 0) {
    revealPart(); // Reveal another part if the guess is incorrect
    document.getElementById('score').textContent = currentScore;
    document.getElementById('message').textContent = `Wrong! You have ${attemptsLeft} attempts left.`;
  } else {
    document.getElementById('guess-input').style.display = "none";
    document.getElementById('submit-guess').style.display = "none";
    document.getElementById('message').textContent = `Game over! The correct answer was "${answer}".`;
    endGame(false); // End the game if the player runs out of attempts
  }

  guessInput.value = ''; // Clear input
}

// End the game and show the full image
function endGame(correct) {
  const grid = document.querySelectorAll('.image-part');

  // Reveal all parts of the image at the end of the game
  grid.forEach(part => {
    part.style.opacity = '1'; // Make all parts visible
  });

  if (correct) {
    document.getElementById('message').textContent = 'You guessed it right!';
  }

  document.getElementById('credit').textContent = `Credit: ${currentGame.credit}`; // Use currentGame for credit
}

// Event listeners
document.getElementById('submit-guess').addEventListener('click', handleGuess);
