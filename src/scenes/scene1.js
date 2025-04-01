import character from '../assets/character.png';
import background from '../assets/background.jpg';
import C4C from 'c4c-lib';
import { gameLoopSpeed } from '..';

export default class Scene1 extends Phaser.Scene {
    constructor() {
        // This gives the name of the scene in phaser, so you can start it with game.scene.start('Scene1');
        super('Scene1');
    }
    preload() {
        // This is where you load images and sounds
        this.load.image('character', character);
        this.load.image('background', background);

    }

    create() {
        // This is where you set up your scene
        // Add the background image to the center of the screen and make it the size of the screen
        this.add.image(400, 300, 'background').setDisplaySize(800, 600);

        // Add the character image to the center of the screen
        // Save a reference to the character
        this.character = this.physics.add.sprite(400, 300, 'character');
        // Make it much smaller (the image is large)
        this.character.setDisplaySize(40, 50)

        // Stops the player from falling off the screen
        this.character.setCollideWorldBounds(true);


        // Add some text to the code editor
        C4C.Editor.setText(`// Here's some sample code \nmoveRight()\nmoveLeft(150)\njump()`);

        // Define the functions to move the character
        // There are definitely better ways to do this, I probably shouldn't be using setTimeout for example
        C4C.Interpreter.define('moveRight', (speed) => {
            if (speed === undefined) {
                speed = 100;
            }
            this.character.setVelocityX(speed);
            // Stop after 1 game loop
            setTimeout(() => {
                // This could fail if we switch scenes
                try {
                    this.character.setVelocityX(0);
                } catch (e){};
            }, gameLoopSpeed);

        })

        C4C.Interpreter.define('moveLeft', (speed) => {
            if (speed === undefined) {
                speed = 100;
            }
            this.character.setVelocityX(-speed);
            // Stop after 1 game loop
            setTimeout(() => {
                try {
                    this.character.setVelocityX(0);
                } catch (e){};
            }, gameLoopSpeed);
        })

        C4C.Interpreter.define('jump', () => {
            this.character.setVelocityY(-200);
        })        

        // This scene enables the runCode button
        document.getElementById('run-code').removeAttribute('disabled');
    }

    update() {
        // This is where the game logic goes.  This is called every frame

    }
       
}