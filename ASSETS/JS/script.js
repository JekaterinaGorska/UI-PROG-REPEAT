
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
    }
    update(){
        this.x += this.speed;
        if(this.x > canvas.width){
            delete this;
        }
    }
    draw(ctx){
        ctx.drawImage(this.spriteSheet, this.x, this.y);
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

            this.handleKeyDown = this.handleKeyDown.bind(this);
            this.handleKeyUp = this.handleKeyUp.bind(this);
            this.shoot = this.shoot.bind(this);
            this.update = this.update.bind(this);
    
            window.addEventListener('keydown', this.handleKeyDown);
            window.addEventListener('keyup', this.handleKeyUp);
            window.addEventListener('click', this.shoot);
        }
        shoot(event){
            console.log(event)
            this.projectiles.push(new Projectile(this.x, this.y, this.spriteSheet));
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
                    break;
                case 'd':
                    this.vx = this.speed;
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
            this.pushBack();

            this.projectiles.forEach(projectile => {
                projectile.update();
            });
        }

        pushBack(){
            this.x -= 0.5;
        }
    
        draw(ctx){
            ctx.drawImage(this.spriteSheet, this.x, this.y);
            this.projectiles.forEach(projectile => {
                projectile.draw(ctx);
            });
        }
    }
    
    //background
    const backgroundImage = new Image();
    backgroundImage.src = 'ASSETS/IMG/background.jpeg';
    
    const playerImage = new Image();
    playerImage.src = 'ASSETS/IMG/griffon1.png';



    const player = new Player(0, 0, playerImage);
 
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
            //update();
            //draw();
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

