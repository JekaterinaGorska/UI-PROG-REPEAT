
    const playerNameInput = document.getElementById("playerNameInput");
    const mainMenu = document.getElementById("mainMenu");
    const customButton = document.getElementById("customButton");
    const dpad = document.getElementById("dpad");
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    class Projectile{

        constructor(x,y,spriteSheet){
            this.x = x;
            this.y = y;
            this.spriteSheet = spriteSheet;
            this.speed = 5;
            this.scaleFactor = 2.0;

        this.frameIndex = 0;
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.totalFrames = 4;
        this.animationSpeed = 5;
        this.frameCounter = 0;
        this.markForDeletion = false;
    }
    update(){
        this.x += this.speed;
        if(this.x > canvas.width){
            this.markForDeletion = true;
        }

        this.frameCounter++;
        if(this.frameCounter >= this.animationSpeed)
        {
            this.frameCounter = 0;
            this.frameCounter = (this.frameIndex + 1) % this.totalFrames;
        }
    }
    draw(ctx){
        const sourceX = this.frameIndex * this.frameWidth;
        ctx.drawImage(
            this.spriteSheet,
            sourceX, 0,
            this.frameWidth, this.frameHeight,
            this.x, this.y,
            this.frameWidth * this.scaleFactor, this.frameHeight * this.scaleFactor
        );
    }
}

    class Enemy {

        constructor(x,y,spriteSheet){
            this.x = x;
            this.y = y;
            this.spriteSheet = spriteSheet;
            this.speed = 0.5;

            this.frameIndex = 0;
            this.totalFrames = 5;
            this.frameWidth = 400 / this.totalFrames;
            this.frameHeight = 76;
            this.animationSpeed = 20;
            this.frameCounter = 0;
            this.verticalDirection = 'down';
            this.verticalBoundTop = y;
            this.verticalBoundBottom = Math.min(canvas.height - this.frameHeight, y + 200); 
        }
    update() {
        this.frameCounter++;
        if (this.frameCounter >= this.animationSpeed) {
            this.frameCounter = 0;
            this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
        }

        if (this.verticalDirection === 'up') {
            this.y -= this.speed;
            if (this.y <= this.verticalBoundTop) {
                this.y = this.verticalBoundTop;
                this.verticalDirection = 'down'; // Change direction when hitting top bound
            }
        } else if (this.verticalDirection === 'down') {
            this.y += this.speed;
            if (this.y >= this.verticalBoundBottom) {
                this.y = this.verticalBoundBottom;
                this.verticalDirection = 'up'; // Change direction when hitting bottom bound
            }

        this.y = Math.max(this.verticalBoundTop, Math.min(this.y, this.verticalBoundBottom));
    }
}
    


    draw(ctx) {
        const sourceX = this.frameIndex * this.frameWidth;
        const scaleFactor = 2.0;

        ctx.drawImage(
            this.spriteSheet,
            sourceX, 0,
            this.frameWidth, this.frameHeight,
            this.x, this.y,
            this.frameWidth * scaleFactor, this.frameHeight * scaleFactor
        );
    }
}


    class Player{
    
        constructor(x,y,spriteSheet){
            this.x = x;
            this.y = y;
            this.spriteSheet = spriteSheet;
            this.speed = 1.5;
            this.vx = 0;
            this.vy = 0;

            this.projectiles = [];

            this.frameIndex = 0; 
            this.totalFrames = 4; 
            this.frameWidth = 600 / this.totalFrames; 
            this.frameHeight = 100; 
            this.animationSpeed = 10; 
            this.frameCounter = 0; 
            this.animationDirection = 1;
            this.facingDirection = 'right';


            this.handleKeyDown = this.handleKeyDown.bind(this);
            this.handleKeyUp = this.handleKeyUp.bind(this);
            this.shoot = this.shoot.bind(this);
            this.update = this.update.bind(this);
    
            window.addEventListener('keydown', this.handleKeyDown);
            window.addEventListener('keyup', this.handleKeyUp);
            //window.addEventListener('click', this.shoot);
        }

        shoot(){
            const projectileX = this.x + this.frameWidth / 2; 
            const projectileY = this.y; 
            const projectileOffset = this.frameWidth / 2; 


            if (this.facingDirection === 'right') {
                this.projectiles.push(new Projectile(projectileX + projectileOffset, projectileY, projectileSpritesheet));
            } else if (this.facingDirection === 'left') {
                this.projectiles.push(new Projectile(projectileX - projectileOffset, projectileY, projectileSpritesheet));
            } else if (this.facingDirection === 'up') {
                this.projectiles.push(new Projectile(projectileX, projectileY - projectileOffset, projectileSpritesheet));
            } else if (this.facingDirection === 'down') {
                this.projectiles.push(new Projectile(projectileX, projectileY + projectileOffset, projectileSpritesheet));
            }
            }
      
        handleKeyDown(event){
            switch(event.key){
                case 'w':
                    this.vy = -this.speed;
                    break;
                case 's':
                    this.vy = this.speed;
                    break;
                case 'a':
                    this.vx = -this.speed;
                    //this.animationDirection = -1;
                    break;
                case 'd':
                    this.vx = this.speed;
                    //this.animationDirection = 1;
                    break;
                case ' ':
                    this.shoot();
                    break;
                default:
                    break;
            }
        }

        handleKeyUp(event){
            switch(event.key){
                case 'w':
                    this.vy = 0;
                    break;
                case 's':
                    this.vy = 0;
                    break;
                case 'a':
                    this.vx = 0;
                    break;
                case 'd':
                    this.vx = 0;
                    break;
                default:
                    break;
            }
        }
        update(){
            this.x += this.vx;
            this.y += this.vy;
            //this.pushBack();

             // Collision detection to prevent player from moving past the borders
            if (this.x < 0) {
                this.x = 0;
            } else if (this.x + this.frameWidth * 2 > canvas.width) { // multiplied by 2 due to the scaling factor
                this.x = canvas.width - this.frameWidth * 2;
            }

            if (this.y < 0) {
                this.y = 0;
            } else if (this.y + this.frameHeight * 2 > canvas.height) { // multiplied by 2 due to the scaling factor
                this.y = canvas.height - this.frameHeight * 2;
            }

            if (this.vx !== 0 || this.vy !== 0) {
                this.frameCounter++;
                if (this.frameCounter >= this.animationSpeed) {
                    this.frameCounter = 0;
                    this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
                }
            } else {
                this.frameIndex = 0;
            }
    
            if(this.x < 0){
                this.x = 0;
            }else if (this.x + this.spriteSheet.width > canvas.width){
                this.x = canvas.width - this.spriteSheet.width;
            }
            if(this.y < 0){
                this.y = 0;
            }else if (this.y + this.spriteSheet.height > canvas.height){
                this.y = canvas.height - this.spriteSheet.height;
            }
            
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markForDeletion);
        }
    
        draw(ctx){
            const sourceX = this.frameIndex * this.frameWidth;
            const scaleFactor = 2.0;

            ctx.drawImage(
                this.spriteSheet, 
                sourceX, 0, 
                this.frameWidth, this.frameHeight, 
                this.x, this.y, 
                this.frameWidth * scaleFactor, this.frameHeight * scaleFactor
            );
            this.projectiles.forEach(projectile => projectile.draw(ctx));
        }
    }
    
    
    const backgroundImage = new Image();
    backgroundImage.src = 'ASSETS/IMG/background.jpeg';
    
    const playerImage = new Image();
    playerImage.src = 'ASSETS/IMG/griffonSpriteSheet.png';

    const projectileSpritesheet = new Image();
    projectileSpritesheet.src = 'ASSETS/IMG/projectile.png';

    const enemyImage = new Image();
    enemyImage.src = 'ASSETS/IMG/knight-enemy.png';



    const player = new Player(0, 0, playerImage);
    const enemy = new Enemy(canvas.width - 750, canvas.height / 9 - 76 / 2, enemyImage);

    let gameStarted = false;
    let firstStart = true;
    let backgroundPosition = 0;
    const backgroundSpeed = 1;
    // let gamerInput = new GamerInput("");

    function setupMainMenu() {
        dpad.style.display = 'none';
        document.getElementById('myCanvas').style.display = 'none';
        mainMenu.style.display = 'flex';
    }
    
    function startGame() {
        console.log("Start Game game");
        const playerName = playerNameInput.value.trim();
        var savedName = localStorage.getItem('playerName');
        gameStarted = true;
    
        if (!savedName) {
            // Player has not visited before
           console.log("No saved name found, showing main menu");
            canvas.style.display = 'block';
            dpad.style.display = 'block';
            mainMenu.style.display = 'none';
        } else {
            // Player has visited before
            // Ask if they want to restore settings
            console.log("Saved name foud: " + savedName);
            const restoreSettings = confirm(`Welcome back, ${savedName}!\nDo you want to restore your previous settings and continue the game?`);
    
            if (restoreSettings) {
                // Restore settings and show canvas
                gameStarted = true;
                dpad.style.display = 'block';
                canvas.style.display = 'block';
                mainMenu.style.display = 'none';
                if (firstStart) {
                    window.requestAnimationFrame(gameLoop);
                }
                firstStart = false;
    
                alert('Welcome back! Your previous settings have been restored.');
            } else {
                // Start a new game and clear saved data
                localStorage.removeItem('playerName');
                localStorage.removeItem('score');
                canvas.style.display = 'block';
                dpad.style.display = 'block';
                mainMenu.style.display = 'none';
                if (firstStart) {
                    window.requestAnimationFrame(gameLoop);
                }
                firstStart = false;
    
                alert('Welcome! Starting a new game.');
            }
        }
    }
    
    const storedPlayerName = localStorage.getItem("playerName");
    if (storedPlayerName) {
        playerNameInput.value = storedPlayerName;
    }

    customButton.addEventListener('click', startGame);
    setupMainMenu();


    window.addEventListener('keydown', player.input);
    function gameLoop() {
        //console.log(gameStarted);
        if(gameStarted){
            drawBackground();
            moveBackground();
            player.update()
            enemy.update();
            
        }
        window.requestAnimationFrame(gameLoop);
    }

    window.requestAnimationFrame(gameLoop);

    backgroundImage.onload = function () {
        // Set the canvas size to match the image size
        canvas.width = backgroundImage.width;
        canvas.height = backgroundImage.height;
        console.log('load')
        // Start the game loop
        requestAnimationFrame(gameLoop);
    };

    function moveBackground() {
        backgroundPosition -= backgroundSpeed;

        // Reset background position when it goes off-screen
        if (backgroundPosition < -backgroundImage.width) {
            backgroundPosition = 0;
        }
    }

    function drawBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the background image with the updated position
        ctx.drawImage(backgroundImage, backgroundPosition, 0);

        // Draw a second copy to create a seamless loop
        ctx.drawImage(backgroundImage, backgroundPosition + backgroundImage.width, 0);

        // Draw a third copy to ensure continuity
        ctx.drawImage(backgroundImage, backgroundPosition + 2 * backgroundImage.width, 0);

        player.draw(ctx);
        enemy.draw(ctx);
    }

    function input(event){
        //take input from keyboard
        //console.log("Input");
        // console.log(event);
        // console.log("Event type: " + event.type);
        //console.long("Keycode: " + event.key);
    
    }

    if(firstStart){
        window.requestAnimationFrame(gameLoop);
    }

