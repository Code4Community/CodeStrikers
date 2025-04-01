// This is the starting point of your application
import C4C from 'c4c-lib';
import Phaser from 'phaser';
import Scene1 from './scenes/scene1';
import Scene2 from './scenes/scene2';

// Load style.css into our page
import './assets/style.css'


const gameWidth = 800;
const gameHeight = 600;

// Theme for the C4C editor.  Look into the codemirror documentation for more options
const theme = {
    "&": {
        color: "#00007F",
        backgroundColor: "#fafafa",
        height: gameHeight + "px",
        width: "calc(100vw - "+gameWidth+"px)",        
    }
}

// Create the C4C editor
// The functions that you want the code editor to autocomplete
// If you want to add more on the fly depending on the scene, you will have to create a new editor
const autocompleteFunctions = ['moveRight', 'moveLeft', 'jump'];
C4C.Editor.create(document.getElementById('code-editor'), theme, false, autocompleteFunctions);

// Create the game
const config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    // Where the game is located (id of the DOM element)
    parent: 'game-container',
    // All the scenes in the game
    scene: [Scene1, Scene2]
}


// Create the game
const game = new Phaser.Game(config);
// The key to start the scene is defined in the constructor.
// Note Scene1 has a constructer that calls super('Scene1'), so the key is 'Scene1'
game.scene.start('Scene1');


// This is only for stepEval code, you can delete this line otherwise
// StepEval does not currently allow functions to be defined in the code editor
const codeRunner = C4C.Runner.createRunner();
// Runs 1 step of code every second
const gameLoopSpeed = 1000;
var gameLoop;

// Switch the scene whenever the "switchScene" button is pressed
document.getElementById('switch-scene').addEventListener('click', () => {
    // Stop running any code that's currently running
    codeRunner.reset();
    clearInterval(gameLoop);
    // If the current scene is Scene1, switch to Scene2
    if (game.scene.isActive('Scene1')) {
        game.scene.stop('Scene1');
        game.scene.start('Scene2');
    } else {
        game.scene.stop('Scene2');
        game.scene.start('Scene1');
    }
});


// Run the code whenever the "run" button is pressed
document.getElementById('run-code').addEventListener('click', () => {
    // Get the code from the editor, and remove any comments
    // This is not a perfect way to remove comments, since if there is a double slash in a string it will break the code
    // This shouldn't matter though.
    const code = C4C.Editor.getText().replaceAll(/\/\/.*/g, '');
    console.log(code)
    // This is how you would run the code normally, if you wanted it all to run at once
    // C4C.Interpreter.run(code);

    // We want to use stepEval to run the code one line at a time
    codeRunner.programText = code;
    codeRunner.reset();
    clearInterval(gameLoop);
    // Make sure the code works before running it
    try {
        codeRunner.check();
    } catch (e) {
        // You may want to give better feedback here
        alert("There's a problem in your code: "+e);
        return;
    }

    // Restart the gameloop right now
    // Note phaser has a way to do a game loop that's probably better than this, I would look into using that instead maybe
    codeRunner.step();
    gameLoop = setInterval(() => codeRunner.step(), gameLoopSpeed)
});




// This is a flag to determine whether or not the game should listen to keyboard events always.
// If false, the game will only listen to keyboard events when you click on the game window
const keyboardAlwaysActive = false;


game.input.keyboard.enabled = keyboardAlwaysActive;
game.input.keyboard.preventDefault = true;
game.input.keyboard.addCapture(['UP', 'DOWN', 'LEFT', 'RIGHT', 'SHIFT', 'SPACE']);

// Capture keyboard events when the game is in focus
document.getElementById('game-container').addEventListener('click', () => {
    game.input.keyboard.enabled = true;
    document.getElementById('game-container').classList.add('active');
    // Blur the code editor or any buttons that are currently active    
    document.activeElement.blur();
})

// Release keyboard events when the game is out of focus
document.addEventListener('click', (e) => {
    if (e.target.id === 'game-container' || e.target.parentNode.id === 'game-container') return;
    game.input.keyboard.enabled = keyboardAlwaysActive;
    document.getElementById('game-container').classList.remove('active');
})


// Export the game loop speed so that it can be used in the scene files
export {gameLoopSpeed};