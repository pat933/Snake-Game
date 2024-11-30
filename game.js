// Get the canvas and its context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const gridSize = 20; // size of each grid square
const canvasSize = 400;
const initialLength = 3; // Initial length of the rat (snake)

// Snake initial position and direction
let rat = [{x: 100, y: 100}, {x: 80, y: 100}, {x: 60, y: 100}];
let direction = 'right';

// Cheese position
let cheese = {x: 200, y: 200};

// Game variables
let gameOver = false;
let gameInterval;
let cheeseEaten = 0; // Cheese counter

// Create a Start button
const startButton = document.createElement('button');
startButton.innerText = 'Start Game';
startButton.style.marginTop = '20px';
document.body.appendChild(startButton);

// Create a Restart button
const restartButton = document.createElement('button');
restartButton.innerText = 'Restart Game';
restartButton.style.display = 'none'; // Hidden by default
restartButton.style.marginTop = '20px';
document.body.appendChild(restartButton);

// Create a div to display the cheese counter
const cheeseCounter = document.createElement('div');
cheeseCounter.innerText = `Cheese Eaten: ${cheeseEaten}`;
cheeseCounter.style.fontSize = '20px';
cheeseCounter.style.marginTop = '20px';
document.body.appendChild(cheeseCounter);

// Listen for keyboard input to control the rat
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

// Draw the game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw the rat
    rat.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'gray' : 'black'; // Head is gray, body is black
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw the cheese
    ctx.fillStyle = 'yellow';
    ctx.fillRect(cheese.x, cheese.y, gridSize, gridSize);
}

// Update the game state
function update() {
    if (gameOver) return; // Stop the game if it's over

    // Move the rat based on the direction
    let head = Object.assign({}, rat[0]); // Copy the head of the rat
    if (direction === 'up') head.y -= gridSize;
    if (direction === 'down') head.y += gridSize;
    if (direction === 'left') head.x -= gridSize;
    if (direction === 'right') head.x += gridSize;

    // Check for collision with walls
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver = true;
        showRestartButton();
        return;
    }

    // Check for collision with itself
    if (rat.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        showRestartButton();
        return;
    }

    // Check if rat eats cheese
    if (head.x === cheese.x && head.y === cheese.y) {
        rat.unshift(head); // Add the new head to the front
        cheeseEaten++; // Increment the cheese counter
        cheeseCounter.innerText = `Cheese Eaten: ${cheeseEaten}`; // Update the counter display
        placeCheese(); // Place a new cheese
    } else {
        rat.unshift(head); // Add the new head
        rat.pop(); // Remove the last segment (tail)
    }

    // Draw everything
    draw();
}

// Randomly place the cheese on the canvas
function placeCheese() {
    cheese.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    cheese.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

// Show the restart button when the game ends
function showRestartButton() {
    restartButton.style.display = 'inline-block'; // Show the button
}

// Reset the game when the restart button is clicked
restartButton.addEventListener('click', () => {
    gameOver = false;
    direction = 'right';
    rat = [{x: 100, y: 100}, {x: 80, y: 100}, {x: 60, y: 100}];
    cheese = {x: 200, y: 200};
    cheeseEaten = 0; // Reset the cheese counter
    cheeseCounter.innerText = `Cheese Eaten: ${cheeseEaten}`; // Reset the display
    restartButton.style.display = 'none'; // Hide the button again
    clearInterval(gameInterval); // Clear the old game loop interval
    startGame(); // Start the game again
});

// Start the game loop
function startGame() {
    gameInterval = setInterval(update, 100); // Run the game loop at a consistent interval (100ms)
    startButton.style.display = 'none'; // Hide the start button
}

// Start button functionality
startButton.addEventListener('click', () => {
    startGame(); // Start the game when the button is clicked
});
