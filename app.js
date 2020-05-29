document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;

    //tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2], 
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 +1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 +1],
        [width, width + 1, width + 2, width + 3]
    ];

    const theTetrominoes = [ lTetromino, zTetromino, tTetromino, oTetromino, iTetromino ];

    let currentPosition = 4;
    let currentRotation = 0;

    //randomly select a tetris shape in its first rotation
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        });
    };

    //undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        });
    };

    //make the tetromino move down every second
    timerId = setInterval(moveDown, 300);

    //assign functions to key presses via its codes
    function control(event) {
        if (event.keyCode === 87 || event.keyCode === 38) {
            moveInstantDown();
        };
    };

    function keyhandler(event) {
        if(event.keyCode === 37 || event.keyCode === 65) {
            moveLeft();
        } else if (event.keyCode === 32) {
            rotate();
        } else if (event.keyCode === 39 || event.keyCode === 68) {
            moveRight();
        } else if (event.keyCode === 40 || event.keyCode === 83) {
            moveDown();
        }; 
    };
   
    document.addEventListener('keyup', control)
    document.addEventListener('keydown', keyhandler)

    //move down function faster
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    };

    //instantly move piece all the way down
    function moveInstantDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    };

    //freeze function
    function freeze() {
        displayShape();
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
        };
    };

    //move tetromino left unless it's at the edge or blocked
    function moveLeft() {
        undraw();

        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if(!isAtLeftEdge) currentPosition -= 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        };

        draw();
    };

    //move tetromino right unless it's at the edge or blocked
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if(!isAtRightEdge) currentPosition += 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        };

        draw();
    };

    //rotate tetromino
    function rotate() {
        undraw();

        currentRotation ++;

        if(currentRotation === current.length) {
            //if current rotation gets to 4, make it go back to 0
            currentRotation = 0
        };

        current = theTetrominoes[random][currentRotation];

        draw();
    };

    //show up next shape in mini grid 
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    //the shapes without rotations array
    const upNextTetromino = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
    ];

    //shows shapes in mini grid display
    function displayShape() {
        //this will remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
        });
        upNextTetromino[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
        });
    };

    //add functionality to the start button
    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape();
        }
    });
});