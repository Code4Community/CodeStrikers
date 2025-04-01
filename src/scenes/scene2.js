import character from '../assets/character.png';
import background from '../assets/background.jpg';
import C4C from 'c4c-lib';

export default class Scene2 extends Phaser.Scene {
    constructor() {
        // This gives the name of the scene in phaser, so you can start it with game.scene.start('Scene1');
        super('Scene2');
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
        // You will normally use a spritesheet to animate the character, but we will keep it simple for now
        // Look into phaser animations, you would do something with this.character.anims

        // Give this character increased gravity
        this.character.setGravityY(600);

        // Stops the player from falling off the screen
        this.character.setCollideWorldBounds(true);

        this.add.text(10, 10, 'Use arrow keys to move, and shift to sprint', { font: '16px Courier', fill: '#ffffff' });

        this.add.text(10, 40, 'You have to click on the game for this to work', { font: '16px Courier', fill: '#ffffff' });

        // Add some keyboard controls
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        // Don't allow coding in this scene
        C4C.Editor.setText(`// You can't code here, just use the arrow keys`)
        document.getElementById('run-code').setAttribute('disabled', 'true');
    }

    update() {
        
        // This is where the game logic goes.  This is called every frame

        // Moving side to side
        const speed = this.cursorKeys.shift.isDown ? 300 : 160;
        if (this.cursorKeys.left.isDown) {
            this.character.setVelocityX(-speed);
        } else if (this.cursorKeys.right.isDown) {
            this.character.setVelocityX(speed);
        } else {
            this.character.setVelocityX(0);
        }

        // Jumping
        if (this.cursorKeys.up.isDown && this.character.body.onFloor()) {
            this.character.setVelocityY(-330);
        }
    }
       
}