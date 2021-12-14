var board_border = 'black';
var board_background = 'white';
var snake_col = 'lightblue';
var snake_border = 'darkblue';
// coordinates on the board of the snake parts to be filled by function later on
let snake = [
    {x:200,y:200},
    {x:190,y:200},
    {x:180,y:200},
    {x:170,y:200},
    {x:160,y:200},
]
// Define canvas element from html
const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext('2d');

//These are canvas commands in which fillRect, covers the whole canvas in fillStyle
// and strokeRect draws the outline of the border in strokeStyle 
function clearCanvas() {
    snakeboard_ctx.fillStyle = board_background;
    snakeboard_ctx.strokeStyle = board_border;
    snakeboard_ctx.fillRect(0,0, snakeboard.width,snakeboard.height);
    snakeboard_ctx.strokeRect(0,0,snakeboard.width,snakeboard.height);
}

// selecting color and filling up snakes by part
function drawSnakePart(snakePart) {
    snakeboard_ctx.fillStyle = 'lightblue';
    snakeboard_ctx.strokeStyle = 'darkblue';
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10,10);
    snakeboard_ctx.strokeRect(snakePart.x,snakePart.y,10,10);
}
// this applies drawsnakepart to each element in snake array 
function drawSnake() {
    snake.forEach(drawSnakePart);
}
// to reset the canvas to square one
/* tried to use setInterval to constantly loop main() but 
 was unable to alter snakes path */
 function main() {
    if (game_over()) {
        if (confirm("You Lost! Try again?")) {
            window.location.reload();
        } else {
            return
        }    
    }
    setTimeout(function onTick() {
    clearCanvas();
    draw_food();
    moveSnake();
    drawSnake();
    main();
    },100)
} 

// let initial movement be right 
let dx = 10;
let dy = 0;
let score = 0;
let changing_dir = false
let head = {x: snake[0].x , y: snake[0].y};
let food_x;
let food_y;

// start game 
main();
gen_food();
// adding event listener to html doc to obtain event
document.addEventListener('keydown', chg_dir);
// to incorporate movement arrow keys to change motion of snake
function chg_dir(event){

    var keyPressed = event.keyCode;
    var goingUp = dy === -10;
    var goingDown = dy === 10;
    var goingLeft = dx === -10;
    var goingRight = dx ===10;
// left arrow keycode is 37
    if (keyPressed=== 37 && !goingRight) {
        dx = -10;
        dy = 0;
// up arrow keycode is 38
    } if (keyPressed===38 && !goingDown) {
        dx = 0;
        dy=-10;
// right arrow keycode is 39
    } if (keyPressed===39 && !goingLeft) {
        dx = 10;
        dy = 0;
// down arrow keycode is 40
    } if (keyPressed === 40 && !goingUp) {
        dx = 0;
        dy = 10;
    }
} 
// condition to stop is when snake hits wall or itself
// we return true for game_over if any condition is met
function game_over() {
    for (let i=4; i< snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y ==snake[0].y) return true
    } 
    let exitLeft = snake[0].x <0;
    let exitRight = snake[0].x > snakeboard.width-10;
    let exitUp = snake[0].y <0;
    let exitDown = snake[0].y>snakeboard.height-10;
    return exitLeft||exitRight||exitUp||exitDown
}
// to generate random locations of food not occupied by snake
function random_num(min,max) {
    return Math.round((Math.random()*(max-min) + min)/10)*10;
}
function gen_food() {
    food_x = random_num(0,snakeboard.width);
    food_y = random_num(0,snakeboard.height);
    snake.forEach(function is_on_snake(part) {
        let on_snake = part.x == food_x && part.y==food_y;
        if (on_snake) gen_food();
    });
}
function draw_food() {
    snakeboard_ctx.fillStyle = 'red';
    snakeboard_ctx.strokeStyle = 'darkred';
    snakeboard_ctx.fillRect(food_x, food_y, 10,10);
    snakeboard_ctx.strokeRect(food_x, food_y, 10,10);
}
// move by 1 pixel either left/right/up/down
function moveSnake(){
    var head = {x: snake[0].x +dx, y: snake[0].y+dy};
    let has_eaten_food = snake[0].x == food_x && snake[0].y ==food_y;
    snake.unshift(head);
    if (has_eaten_food) {
        // increase score
        score+=10;
        // display new score on screen
        document.getElementById('score').innerHTML = score;
        gen_food();
    } else{
        snake.pop();
    }
}