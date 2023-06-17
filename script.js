/*
1. Score value
- let score = 0
- if snake touch point, score++
*/

// SCORE VALUE
let score = parseInt(document.getElementById("score").textContent);

/*
2. High score value
- let score = [0]
- every game over, store the score value into high score array
- high score = max of those array
*/

// HIGH SCORE VALUE
function updateHighScore(newScore, highScore){
    highScore.push(newScore);    
    let highScoreValue = Math.max(...highScore);
    document.getElementById("high-score").innerHTML = highScoreValue;
}

let highScore = [];
let newScore = 0; // Change into the last value before game over
updateHighScore(newScore, highScore);

/*
3. Randomize point inside game canvas, except on snake body
- Get the div html
- Divide thos div into 2 dimension array of pixel (?)
- Set empty array of snake body
- While x and y is in snake body array: set random number for the x and y
- Make square with those x and y position
*/

// RANDOMIZE POINT
const gameCanvas = document.getElementById("game-canvas");
const numColumns = 20; // Adjust the number of columns as needed
const numRows = 20; // Adjust the number of rows as needed

// Generate the grid cells
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numColumns; col++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.x = col;
    cell.dataset.y = row;
    gameCanvas.appendChild(cell);
  }
}

// Initialize snake body array
let snakeBody = [];

// Initialize random red point
const min = 0;
const max = Math.max(numColumns, numRows) - 1;
let point = [];
let pointColor;

// While x and y is in snake body array: set random number for the x and y
function randomPoint() {
    let x = Math.floor(Math.random() * (max - min + 1)) + min;
    let y = Math.floor(Math.random() * (max - min + 1)) + min;
    return [x, y]
}

do {
    point = randomPoint();
    console.log(`Point: ${point}`);
    pointColor = gameCanvas.querySelector(`.cell[data-x="${point[0]}"][data-y="${point[1]}"]`);
    pointColor.style.backgroundColor = "red";
} while (snakeBody.includes(point));    


/*
4. Building growing snake and the point
4a. Initialize random point with size 1
- While x and y === initialized point: set random number for the x and y
- Make point with those x and y position
- append to snake body array
- snake body array pixel = white color
*/

let initSnake = []
do {
    initSnake = randomPoint();
} while (initSnake[0] === point[0] && initSnake[1] === point[1]);

snakeBody.push(initSnake);

function coloring_snake(bodyColor, headColor) {
    for (let coord of snakeBody) {
      console.log(`Snake: ${coord}`);
      let snakeColor = gameCanvas.querySelector(
        `.cell[data-x="${coord[0]}"][data-y="${coord[1]}"]`
      );
  
      if (snakeColor) {
        snakeColor.style.backgroundColor = bodyColor;
      }
    }
  
    let snakeHead = gameCanvas.querySelector(
      `.cell[data-x="${snakeBody[snakeBody.length - 1][0]}"][data-y="${snakeBody[snakeBody.length - 1][1]}"]`
    );
  
    if (snakeHead) {
      snakeHead.style.backgroundColor = headColor;
    }
  }

coloring_snake("white", "blue");

/*
4b. Go ahead every 0.5 second, with his body following the track of the head
- initial position, as stop
- do this every 0.5 second
.if there is keyboard input, change the position
- get keyboard input: each arrow = up, down, right, left
- get 0.5 second, increment every it occur :
- state 1, state 2, state 3, state 4 = up, down, right, left
.state 1 = add member (x, y+1) & pop first array member
.state 2 = add member (x, y-1) & pop first array member
.state 3 = add member (x+1, y) & pop first array member
.state 4 = add member (x-1, y) & pop first array member

4c. Everytime touch point, growing the snake by one
- if added member === point, cancel pop the first array member

*/

let lastKeyPressed = null;
let newBody = null;

function undo_coloring(coord){
    let snakeColor = gameCanvas.querySelector(`.cell[data-x="${coord[0]}"][data-y="${coord[1]}"]`);
    snakeColor.style.backgroundColor = "transparent";
}

function addSnakeBody(newBody, point) {
    snakeBody.push(newBody);
    // Check if the new body collides with the point
    if (newBody[0] === point[0] && newBody[1] === point[1]) {
      // If collided, generate a new point and don't remove the tail
      point = newPoint();
    } else {
      // If not collided, remove the tail
      undo_coloring(snakeBody[0]);
      snakeBody.shift();
    }
    coloring_snake("white", "blue");
  }
  

let isPointInSnakeBody;

function newPoint() {
    do {
        point = randomPoint();
        pointColor = gameCanvas.querySelector(`.cell[data-x="${point[0]}"][data-y="${point[1]}"]`);
        pointColor.style.backgroundColor = "red";

        isPointInSnakeBody = false
        for (let i = 0; i < snakeBody.length; i++) {
            if (snakeBody[i][0] === point[0] && snakeBody[i][1] === point[1]) {
              isPointInSnakeBody = true;
              break;
            }
        }

    } while (isPointInSnakeBody);
    score++;
    document.getElementById("score").innerHTML = score;
    return point;
}

document.addEventListener("keydown", function(event){
    if ((lastKeyPressed === "ArrowUp" && event.key =="ArrowDown") || (lastKeyPressed === "ArrowDown" && event.key =="ArrowUp") ||
    (lastKeyPressed === "ArrowRight" && event.key =="ArrowLeft") || (lastKeyPressed === "ArrowLeft" && event.key =="ArrowRight"));
    else if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "ArrowLeft") {
        lastKeyPressed = event.key;
    }
})

// game over div
const gameOverScreen = document.getElementById("game-over-screen");

function snakeEatingError(snakeBody) {
    const snakeHead = snakeBody[snakeBody.length - 1];
    for (let i = 0; i < snakeBody.length - 1; i++) {
      // Check if the head coordinates overlap with any body segment
      if (snakeBody[i][0] === snakeHead[0] && snakeBody[i][1] === snakeHead[1]) {
        return true; // Return true if snake eats itself
      }
    }
    return false; // Return false if snake doesn't eat itself
  }

function moving() {
    try {
        if (lastKeyPressed === null) {
            console.log("Do nothing");
            coloring_snake("white", "blue");
        }
        else if (lastKeyPressed === "ArrowUp") {
            newBody = [snakeBody[snakeBody.length-1][0], snakeBody[snakeBody.length-1][1] - 1];
            addSnakeBody(newBody, point);
        } else if (lastKeyPressed === "ArrowDown") {
            newBody = [snakeBody[snakeBody.length-1][0], snakeBody[snakeBody.length-1][1] + 1];
            addSnakeBody(newBody, point);
        } else if (lastKeyPressed === "ArrowRight") {
            newBody = [snakeBody[snakeBody.length-1][0] + 1, snakeBody[snakeBody.length-1][1]];
            addSnakeBody(newBody, point);
        } else if (lastKeyPressed === "ArrowLeft") {
            newBody = [snakeBody[snakeBody.length-1][0] - 1, snakeBody[snakeBody.length-1][1]];
            addSnakeBody(newBody, point);
        }
        console.log(snakeBody);
    }
    catch(error) {
        gameOverScreen.style.display = "block";
    }
    if (snakeEatingError(snakeBody)){
        gameOverScreen.style.display = "block";
    }
}
  
intervalId = setInterval(moving, 200);
intervalId

function newGame() {
    // Clear current interval
    clearInterval(intervalId);
    
    // Hide game over div
    gameOverScreen.style.display = "none";

    // Append score to highscore, then update the highscore value
    updateHighScore(score, highScore);

    // Set score to zero
    score = 0;
    document.getElementById("score").innerHTML = score;

    // Set all snakeBody into [], recolor the snake, and initiate new red food
    pointColor = gameCanvas.querySelector(`.cell[data-x="${point[0]}"][data-y="${point[1]}"]`);
    pointColor.style.backgroundColor = "transparent";

    point = randomPoint()
    pointColor = gameCanvas.querySelector(`.cell[data-x="${point[0]}"][data-y="${point[1]}"]`);
    pointColor.style.backgroundColor = "red";

    lastKeyPressed = null

    coloring_snake("transparent", "transparent");
    snakeBody = [];
    let initSnake = [];
    do {
        initSnake = randomPoint();
    } while (initSnake[0] === point[0] && initSnake[1] === point[1]);
    snakeBody.push(initSnake);

    // Recall the game
    intervalId = setInterval(moving, 200);
    intervalId
}

document.getElementById("try-again").addEventListener("click", newGame);