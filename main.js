
// Create the C4C editor, inside the given element.
var createtext = C4C.Editor.create(document.getElementById("mytest"));
// document.getElementById("mytest").value = createtext;


const CENTER_HORIZONTAL = 400;
const CENTER_VERTICAL = 300;
let TILE_WIDTH = 40;
let TILE_HEIGHT = 40;

let SPEED = 150;

var config = {
  parent: "game",
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: createDemo,
    update: update,
  },
};

var player;
var jewels;
var guards;
var cursors;
var gameOver = false;
var tileSize = TILE_WIDTH;
var moveIncrement = 40; //THIS CONTROLS THE SPEED THAT THE GUY WALKS
var moveTimer = 150;
var current_level = 0;
var screenWidth = CENTER_HORIZONTAL * 2;
var screenHeight = CENTER_VERTICAL * 2;
var playerScale;
var pauseKeyboard = false;
var playerCenterX;
var playerCenterY;
var playerOffset = 8;
var targetX = 0;
var targetY = 0;
var playerScale = 0.2;
var guardScale = 0.7;
var jewelScale = 0.125;
var totalMoved = 0;
var currentDirection;
var currentBoard = demo;
var reachedTarget = true;
var runner
var guardHit = false;
var finishedLevels = [0,0,0,0,0,0];

var player_start_current_level = [0,0]
var checkBox = document.getElementById("arrowKeysCheck");
// var logo; 

var playerRow = 10; //the row the player is in in the game board array
var playerCol = 4; //the column the player is in in the game board array

var game = new Phaser.Game(config);

function preload() {
  this.load.image("blueT", "assets/tileBlue.png");
  this.load.image("whiteT", "assets/tileWhite.png");
  this.load.image("wall", "assets/WallBox.png");
  this.load.image("wall_light", "assets/WallBoxLight.png");
  this.load.image("wallS", "assets/WallBoxSlash.png");
  this.load.image("wallSR", "assets/WallBoxSlashReverse.png");
  this.load.image("wallDS", "assets/WallBoxDoubleSlash.png");
  this.load.image("painting1", "assets/WallBoxPainting.png");
  this.load.image("painting2", "assets/WallBoxPainting2.png");
  this.load.image("painting3", "assets/WallBoxPainting3.png");
  this.load.image("painting4", "assets/WallBoxPainting4.png");
  this.load.image("void", "assets/void.png");
  this.load.image("jewel", "assets/jewel.png");
  // this.load.image("jewelg", "assets/jewelg.png");
  this.load.image("GameOver", "assets/Gameover.png");
  this.load.image("NextLevel", "assets/NextLevel.png");
  this.load.image("AvoidGuards", "assets/Avoidtheguards.png");
  this.load.image("laserV", "assets/laser_vertical.png");
  this.load.image("GuardLightH", "assets/guard_with_torchH.png");
  this.load.image("GuardLightV", "assets/guard_with_torchV.png");
  this.load.image("laserH", "assets/laser_horizontal.png");
  this.load.image("laserV", "assets/laser_vertical.png");
  this.load.spritesheet("dude", "assets/Robber.png", {
    frameWidth: 190,
    frameHeight: 340,
  });
  this.load.image("guard", "assets/Guard.png");
}

var toggleVal = false;
var toggle = document.querySelector('input[type="checkbox"]');
toggle.addEventListener('click', () => {
  toggleVal = !toggleVal;
  for (i = 0; i < 5; i++) {
    if (toggleVal == false) {
      if (finishedLevels[i] == 1) {
        document.getElementById("level-select").options[i+1].disabled = false;
      } else {
        document.getElementById("level-select").options[i+1].disabled = true;
      }
    } else {
      document.getElementById("level-select").options[i+1].disabled = false;
    }

  }
});


document.getElementById("level-select").addEventListener("change", (event) => {
  switchLevel(event.target.value);
});

document.getElementById("nextLevel").disabled = true;


for (i = 0; i < 5; i++) {
  document.getElementById("level-select").options[i+1].disabled = true;
}

document.getElementById("enableCommands").addEventListener("click", (event) => {
  // document.getElementById("enableCommands").disabled = true;
  player.x = player_start_current_level[0];
  player.y = player_start_current_level[1];

  playerCol = Math.floor(player.x / 40);
  playerRow = Math.floor(player.y / 40);
  programText = C4C.Editor.getText();
  // HERE'S THE IMPORTANT PART!!
  // C4C.Interpreter.run(programText);

  gameOver = false;
  runner.setProgram(programText);
  
  if (!runner.check()) {
    runner.reset();
    return;
  } 
  runner.reset();
}); 


function switchLevel(level) {
  getBoardArray(level-1)
  switch (level) {
    case "1":
      game.destroy(true);
      config.scene.create = createDemo;
      game = new Phaser.Game(config);
      gameOver = false;
      current_level = 0;
      break;

    case "2":
      game.destroy(true);
      config.scene.create = create1;
      game = new Phaser.Game(config);
      gameOver = false;
      current_level = 1;
      break;

    case "3":
      game.destroy(true);
      config.scene.create = create2;
      game = new Phaser.Game(config);
      gameOver = false;
      current_level = 2;
      break;

    case "4":
      game.destroy(true);
      config.scene.create = create3;
      game = new Phaser.Game(config);
      gameOver = false;
      current_level = 3;
      break;

    case "5":
      game.destroy(true);
      config.scene.create = create4;
      game = new Phaser.Game(config);
      gameOver = false;
      current_level = 4;
      break;
      
    case "6":
      game.destroy(true);
      config.scene.create = create5;
      game = new Phaser.Game(config);
      gameOver = false;
      current_level = 5;
      break;
  }

}

function update() {
  game.input.keyboard.removeCapture('SPACE');
  if (gameOver) {
    this.physics.pause();

    document.getElementById("enableCommands").disable;

    if (guardHit == true) {
       gameOverMsg = this.physics.add.staticGroup();
       gameOverMsg.create(380, CENTER_VERTICAL + 200, "GameOver").setScale(1.75);
       gameOverMsg.setDepth(2);
       player.setDepth(1);
       for (i = 0; i < guards.length; i++){
         guards[i].setDepth(1);
       }
    }
    else if (document.getElementById('level-select').value != "6") {
      NextLevelMsg = this.physics.add.staticGroup();
      NextLevelMsg.create(515, CENTER_VERTICAL-120, "NextLevel").setScale(.55);
    }
  
    player.setVelocity(0, 0);
    reachedTarget = true; 
    player.x = targetX;
    player.y = targetY;
    player.anims.play("front");

    return;
  }
  if (!reachedTarget){
    if (player.x >= targetX - 3 && player.x <= targetX + 3 && player.y >= targetY - 3 && player.y <= targetY + 3){  
      player.setVelocity(0, 0);
      reachedTarget = true;
      player.x = Math.round(targetX);
      player.y = Math.round(targetY);
    }

  }
  
  console.log(toggleVal);

  //Player movement
  if (checkBox.checked) {
    if (this.input.keyboard.checkDown(cursors.left, moveTimer)) {
      move("left", this)
    }
    else if (this.input.keyboard.checkDown(cursors.right, moveTimer)) {
      move("right", this)
    }
    else if (this.input.keyboard.checkDown(cursors.up, moveTimer)) {
      move("up", this)
    }
    else if (this.input.keyboard.checkDown(cursors.down, moveTimer)) {
      move("down", this)
    }
  } 
}

//MAIN MOVE FUNCTION
function move(dir, scene) {
  player.x = Math.floor(player.x);
  player.y = Math.floor(player.y);
  if (!checkBounds(dir) && reachedTarget){
    animatedMovement(dir, player);
    reachedTarget = false;
    if (dir == "up") {
      targetX = Math.round(player.x);
      playerRow -= 1;
      targetY = playerRow * moveIncrement+8;
    }
    else if (dir == "down"){
      targetX = Math.round(player.x);
      playerRow += 1;
      targetY = playerRow * moveIncrement+4;
    }
    else if (dir == "left"){
      targetY = Math.round(player.y);
      playerCol -= 1;
      targetX = Math.round(playerCol * moveIncrement+20);


    }
    else if (dir == "right"){
      targetY = Math.round(player.y);
      playerCol += 1;
      targetX = Math.round(playerCol * moveIncrement+20);
    }

    adjust_guards_depth(scene);
    console.log("CURRENT: " + player.x + " " + player.y);
    console.log("TARGET: " + targetX + " " + targetY);
    scene.physics.moveTo(player, targetX, targetY, SPEED);
  }


}

function adjust_guards_depth(scene) {
  for (i = 0; i < guards.length; i++){
    guardRow = Math.floor(guards[i].y / 40);
    if (playerRow == guardRow + 1) {
      guards[i].setDepth(1);
    }
    else {
      guards[i].setDepth(3);
    }
  }
}

//Checks if the player's next move will hit a wall bounding box
//returns false if the path is clear
function checkBounds(dir) {
  wrongMove = false;
  //get potential next move based on the direction
  if (dir == "up"){
    if (currentBoard[playerRow - 1][playerCol] == 9){
      wrongMove = true;
    } else {
      checkGuard(playerRow - 1, playerCol);
      checkJewel(playerRow - 1, playerCol);
    }
    
  }
  else if (dir == "down"){
    if (currentBoard[playerRow + 1][playerCol] == 9){
      wrongMove = true;
    } else {
      checkGuard(playerRow + 1, playerCol);
      checkJewel(playerRow + 1, playerCol);
    }
  }
  else if (dir == "left"){
    if (currentBoard[playerRow][playerCol - 1] == 9){
      wrongMove = true;
    } else {
      checkGuard(playerRow, playerCol - 1);
      checkJewel(playerRow, playerCol - 1);
    }
  }
  else if (dir == "right"){
    if (currentBoard[playerRow][playerCol + 1] == 9){
      wrongMove = true;
    } else {
      checkGuard(playerRow, playerCol + 1);
      checkJewel(playerRow, playerCol + 1);
    }
  }
  return wrongMove;
}


function collectJewel() {
  jewel.disableBody(true, true);
  //TODO RUN GAMEOVER CODE
  player.setTint(0x00ff00);
  guardHit = false;

  gameOver = true;
  finishedLevels[current_level] = 1;
  if (current_level < 5) {
    document.getElementById("level-select").options[current_level].disabled = false;
    document.getElementById("level-select").options[current_level+1].disabled = false;
    document.getElementById("nextLevel").disabled = false;
  }

}

function hitGuard() {
  for (i = 0; i < guards.length; i++){
    guards[i].setDepth(3);
  }
  player.setTint(0xff0000);

  guardHit = true;
  gameOver = true;



}

function checkGuard(playerRow, playerCol) {
  if (currentBoard[playerRow][playerCol] == 3 || currentBoard[playerRow][playerCol] == 6 || currentBoard[playerRow][playerCol] == 7 || currentBoard[playerRow][playerCol] == 5){ 
    this.hitGuard();
  }
}

function checkJewel(playerRow, playerCol) {
  if (currentBoard[playerRow][playerCol] == 4){
    this.collectJewel();
  } else if (playerRow > 0) {
    if (currentBoard[playerRow][playerCol] == 4){
      this.collectJewel();
    }
  }
}


//Plays player animations
function animatedMovement(dir, player) { 
  if (dir == "up") {
    player.anims.play("back");
  }
  else if (dir == "down"){
    player.anims.play("up")
  }
  else if (dir == "left"){
    player.anims.play("left")
  }
  else if (dir == "right"){
    player.anims.play("right")
  }
}

function generateCheckerboard(game, numRows) {
  /*
   * Pass "this" as first argument and the number of rows from and including center as the second argument.
   */
  let whiteTile = false;
  // Number of tiles from and including the middle row of tiles
  const bottom = CENTER_VERTICAL + numRows * TILE_HEIGHT;
  const tileScale = 0.99;
  const tileAdjustment = 0;

  // Loop through the columns
  for (
    let hl = CENTER_VERTICAL, hu = CENTER_VERTICAL;
    hl < bottom;
    hl += TILE_HEIGHT + tileAdjustment, hu -= TILE_HEIGHT + tileAdjustment
  ) {
    // Loop through the row
    for (
      let w = TILE_WIDTH / 2;
      w < config.width;
      w += TILE_WIDTH + tileAdjustment
    ) {
      // Is the first row being generated?
      if (hl === CENTER_VERTICAL) {
        // White or blue tile?
        if (whiteTile) {
          game.add.image(w, hl, "whiteT").setScale(tileScale);
        } else {
          game.add.image(w, hl, "blueT").setScale(tileScale);
        }
        // Switch colors
        whiteTile = !whiteTile;
      } else {
        // White or blue tile?
        if (whiteTile) {
          game.add.image(w, hu, "whiteT").setScale(tileScale);
          game.add.image(w, hl, "whiteT").setScale(tileScale);
        } else {
          game.add.image(w, hu, "blueT").setScale(tileScale);
          game.add.image(w, hl, "blueT").setScale(tileScale);
        }
        // Switch colors
        whiteTile = !whiteTile;
      }
    }
    // Alternate orders for row
    whiteTile = !whiteTile;
  }
}

function setup(g){ 
  //  Our player animations, turning, walking left and walking right.
  g.anims.create({
    key: "left",
    frames: g.anims.generateFrameNumbers("dude", { start: 1, end: 4 }),
    frameRate: 15,
    repeat: 1,
  });

  g.anims.create({
    key: "right",
    frames: g.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 15,
    repeat: 1,
  });

  g.anims.create({
    key: "front",

    frames: [{ key: "dude", frame: 0 }],
    frameRate: 20,
  });

  g.anims.create({
    key: "up",
    frames: g.anims.generateFrameNumbers("dude", { start: 13, end: 16 }),
    frameRate: 15,
    repeat: 1
  });

  g.anims.create({
    key: "back",
    frames: g.anims.generateFrameNumbers("dude", { start: 9, end: 12 }),
    frameRate: 15,
    repeat: 1
  });

  // Define new function and store it in the symbol "alert". This
  // function can now be called from our little language.

  C4C.Interpreter.define("alert", () => {
    alert("hello");
  });

  C4C.Interpreter.define("moveLeft", () => {
  move("left", g);
  console.log("LEFT")
  });

  C4C.Interpreter.define("moveRight", () => {
    move("right", g);
    console.log("RIGHT")
  });

  C4C.Interpreter.define("moveUp", () => {
    move("up", g);
    console.log("up")
  });

  C4C.Interpreter.define("moveDown", () => {
    move("down", g);
    console.log("down")
  });

  console.log(C4C);

  let programText;
  
  runner = C4C.Runner.createRunner(); 
  
  const timer = g.time.addEvent({
    delay: 350,
    callback: () => {if (!gameOver) {runner.step();}},
    loop: true
  });
}


function getBoardArray(level) {
  if (level == 0) {
    currentBoard = demo
  } 
  else if (level == 1) {
    currentBoard = arr1
  } 
  else if (level == 2) {
    currentBoard = arr2
  }
  else if (level == 3) {
    currentBoard = arr3
  }
  else if (level == 4) {
    currentBoard = arr4
  }
  else if (level == 5) {
    currentBoard = arr5
  }
  console.log(currentBoard)  

}

function waitForPlayerMove(callback) {
  // Check if player has reached the target
  if (reachedTarget) {
    setTimeout(() => {
    }, 100);
    callback(); // If so, execute the callback
  } else {
    // If not, wait for a short duration and check again
    setTimeout(() => {
      waitForPlayerMove(callback);
    }, 100); // Adjust the duration as needed
  }
}