document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');


    let isGameOver = false;
    let speed = 5;
    let platformCount = 6;
    let platforms = [];
    let score = 0;
    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    const gravity = 9.8;
    let upTimerId;
    let downTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    let highestScore = 0;

    class Platform {
        constructor(newPlatBottom) {
            this.left = Math.random() * 315;
            this.bottom = newPlatBottom;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 600 / platformCount;
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom);
            platforms.push(newPlatform);
            console.log(platforms);
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    console.log(platforms);
                    score++;
                    var newPlatform = new Platform(600);
                    platforms.push(newPlatform);
                }
            });
        }
    }

    function createDoodler() {
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }

    function fall() {
        isJumping = false;
        clearInterval(upTimerId);
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace <= 0) {
                gameOver();
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= (platform.bottom + 15)) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log('tick');
                    startPoint = doodlerBottomSpace;
                    jump();
                    console.log('start', startPoint);
                    isJumping = true;
                }
            });
        }, 20);
    }

    function jump() {
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function () {
            console.log(startPoint);
            console.log('1', doodlerBottomSpace);
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            console.log('2', doodlerBottomSpace);
            console.log('s', startPoint);
            if (doodlerBottomSpace > (startPoint + 200)) {
                fall();
                isJumping = false;
            }
        }, 30);
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= 0) {
                console.log('going left');
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else moveRight();
        }, 20);
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimerId = setInterval(function () {
            //changed to 313 to fit doodle image
            if (doodlerLeftSpace <= 313) {
                console.log('going right');
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else moveLeft();
        }, 20);
    }

    function moveStraight() {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    //assign functions to keyCodes
    function control(e) {
        doodler.style.bottom = doodlerBottomSpace + 'px';
        if (e.key === 'ArrowLeft') {
            moveLeft();
        } else if (e.key === 'ArrowRight') {
            moveRight();
        } else if (e.key === 'ArrowUp') {
            moveStraight();
        }
    }

    function gameOver() {
        isGameOver = true;

        // Update the highest score if the current score is greater
        if (score > highestScore) {
            highestScore = score;
        }

        // Remove only game elements, not UI buttons/titles
        document.querySelectorAll('.platform, .doodler').forEach(el => el.remove());

        // Remove any existing score container
        const oldScoreDiv = grid.querySelector('.score-container');
        if (oldScoreDiv) oldScoreDiv.remove();

        // Create and append the score container
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'score-container';
        scoreDiv.innerHTML = `
            Current Score: <span class="current-score">${score}</span><br>
            Highest Score: <span class="highest-score">${highestScore}</span>
        `;
        grid.appendChild(scoreDiv);

        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);

        // Show the retry button
        restartButton.style.display = 'block';
        restartButton.onclick = goToStartScreen;
    }

    function goToStartScreen() {
        // Reset game variables
        isGameOver = false;
        score = 0;
        doodlerLeftSpace = 50;
        doodlerBottomSpace = startPoint;
        platforms = [];

        // Remove the score container if it exists
        const scoreDiv = grid.querySelector('.score-container');
        if (scoreDiv) scoreDiv.remove();

        restartButton.style.display = 'none';
        startButton.style.display = 'block';

        // Show the title and instructions again
        const startTitle = document.getElementById('start-title');
        const instructions = document.getElementById('instructions');
        if (startTitle) startTitle.style.display = 'block';
        if (instructions) instructions.style.display = 'block';
    }

    function start() {
        if (!isGameOver) {
            // Hide the start button
            startButton.style.display = 'none';
            startButton.style.display = 'none';
            const startTitle = document.getElementById('start-title');
            const instructions = document.getElementById('instructions');
            if (startTitle) {
                startTitle.style.display = 'none';
                instructions.style.display = 'none';
            }
            // To do: fix the title so that it shows up when a round is over and replayed
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms, 30);
            jump(startPoint);
            document.addEventListener('keyup', control);
        }
    }

    // Attach the start function to the button's click event
    startButton.addEventListener('click', start);

});
