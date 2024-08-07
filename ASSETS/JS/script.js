
    const playerNameInput = document.getElementById("playerNameInput");
    const mainMenu = document.getElementById("mainMenu");
    const customButton = document.getElementById("customButton");
    const dpad = document.getElementById("dpad");
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    
    //background
    const backgroundImage = new Image();
    backgroundImage.src = 'ASSETS/IMG/background.jpeg'; 

console.log(backgroundImage);
 
    let gameStarted = false;
    let firstStart = true;
    let backgroundPosition = 0;
    const backgroundSpeed = 2;
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


    
    function gameLoop() {
        console.log(gameStarted);
        if(gameStarted){
            drawBackground();
            moveBackground();
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
        console.log('playing')
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the background image with the updated position
        ctx.drawImage(backgroundImage, backgroundPosition, 0);

        // Draw a second copy to create a seamless loop
        ctx.drawImage(backgroundImage, backgroundPosition + backgroundImage.width, 0);

        // Draw a third copy to ensure continuity
        ctx.drawImage(backgroundImage, backgroundPosition + 2 * backgroundImage.width, 0);
    }

    function input(event){
        //take input from keyboard
        //console.log("Input");
        console.log(event);
        console.log("Event type: " + event.type);
        //console.long("Keycode: " + event.key);
    
    }

    if(firstStart){
        window.requestAnimationFrame(gameLoop);
    }

