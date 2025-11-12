class SoccerBall {
  stickToPlayer(player) {
    // Stick ball to player's feet (centered horizontally)
    const feet = player.getFeetBox();
    // Place ball just below the player's feet, centered horizontally
    this.x = feet.x + (feet.width - this.width) / 2;
    this.y = feet.y + feet.height - this.height / 2;
    // Prevent ball from going off canvas
    this.x = Math.max(0, Math.min(this.x, this.game.width - this.width));
    this.y = Math.max(0, Math.min(this.y, this.game.height - this.height));
  }
  constructor(game) {
    this.game = game;
    this.width = 25;
    this.height = 25;
    // Place ball dead center of the field
    this.x = (game.width - this.width) / 2;
    this.y = (game.height - this.height) / 2;
    this.image = document.getElementById("soccer-ball");
    this.isStuck = false;
  }
  // Returns a rectangle representing the ball's bounding box
  getBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  draw(context) {
    if (this.image) {
      context.save();
      // Rolling effect: rotate if _rollingAngle is set
      if (this._rollingAngle) {
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        context.rotate(this._rollingAngle);
        context.drawImage(
          this.image,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height
        );
      } else {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
      context.restore();
    }
  }
}
class Player {
  // Returns a rectangle representing the player's feet
  getFeetBox() {
    // Shrink feet box for more precise collision
    const feetHeight = 10;
    const feetWidth = this.width * 0.5;
    return {
      x: this.x + (this.width - feetWidth) / 2,
      y: this.y + this.height - feetHeight,
      width: feetWidth,
      height: feetHeight,
    };
  }

  inFront(defender) {
    // Check if a defender is directly in front of the player (to the right)
    // Returns true if the defender's x position is ahead (to the right)
    // and within a reasonable vertical range (approximately same y level)
    const verticalThreshold = 100; // Allow some vertical distance
    return (
      defender.x > this.x + this.width &&
      Math.abs(defender.y - this.y) < verticalThreshold
    );
  }
  // Returns a rectangle representing the ball's bounding box
  getBox() {
    // Shrink ball box for more precise collision
    const boxSize = this.width * 0.7;
    return {
      x: this.x + (this.width - boxSize) / 2,
      y: this.y + (this.height - boxSize) / 2,
      width: boxSize,
      height: boxSize,
    };
  }
  constructor(game) {
    this.game = game;
    this.width = 50; // Make black box bigger
    this.height = 100;
    // Use default values, will be set by Game after fields are created
    this.x = 100;
    this.y = 100;
    this.startX = this.x;
    this.startY = this.y;
    this.speed = 55; // Grid-based movement
    this.startX = 100; // Save starting position
    this.startY = 100;
    this.image = document.getElementById("attacker");
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
    if (this.game.soccerBall) {
      this.game.soccerBall.isStuck = false;
    }
    console.log("Player reset to starting position");
  }

  async moveRight() {
    const targetX = this.x + this.speed;
    if (targetX + this.width <= this.game.width) {
      const steps = 8;
      const dx = targetX - this.x;
      for (let i = 0; i < steps; i++) {
        this.x += dx / steps;
        if (this.game.soccerBall.isStuck) {
          this.game.soccerBall.stickToPlayer(this);
        }
        await new Promise((r) => setTimeout(r, 12));
      }
      this.x = targetX;
      if (this.game.soccerBall.isStuck) {
        this.game.soccerBall.stickToPlayer(this);
      }
      console.log(`Player moved right to x: ${this.x}`);
    } else {
      console.log(`Can't move right - boundary reached!`);
    }
  }

  async moveLeft() {
    const targetX = this.x - this.speed;
    if (targetX >= 0) {
      const steps = 16;
      const dx = targetX - this.x;
      for (let i = 0; i < steps; i++) {
        this.x += dx / steps;
        // Completely prevent ball from sticking/moving backwards if in 1v1 and in front of ball
        let canStick = true;
        if (this.game.currentLevel === 6) {
          const playerRight = this.x + this.width;
          const ballLeft = this.game.soccerBall.x;
          if (playerRight <= ballLeft + 2) {
            canStick = false;
          }
        }
        if (this.game.soccerBall.isStuck && canStick) {
          this.game.soccerBall.stickToPlayer(this);
        }
        await new Promise((r) => setTimeout(r, 12));
      }
      this.x = targetX;
      // Final check for stick after move
      let canStick = true;
      if (this.game.currentLevel === 6) {
        const playerRight = this.x + this.width;
        const ballLeft = this.game.soccerBall.x;
        if (playerRight <= ballLeft + 2) {
          canStick = false;
        }
      }
      if (this.game.soccerBall.isStuck && canStick) {
        this.game.soccerBall.stickToPlayer(this);
      }
      console.log(`Player moved left to x: ${this.x}`);
    } else {
      console.log(`Can't move left - boundary reached!`);
    }
  }

  async moveUp() {
    const targetY = this.y - this.speed;
    if (targetY >= 0) {
      const steps = 8;
      const dy = targetY - this.y;
      for (let i = 0; i < steps; i++) {
        this.y += dy / steps;
        if (this.game.soccerBall.isStuck) {
          this.game.soccerBall.stickToPlayer(this);
        }
        await new Promise((r) => setTimeout(r, 12));
      }
      this.y = targetY;
      if (this.game.soccerBall.isStuck) {
        this.game.soccerBall.stickToPlayer(this);
      }
      console.log(`Player moved up to y: ${this.y}`);
    } else {
      console.log(`Can't move up - boundary reached!`);
    }
  }

  async moveDown() {
    const targetY = this.y + this.speed;
    if (targetY + this.height <= this.game.height) {
      const steps = 16;
      const dy = targetY - this.y;
      for (let i = 0; i < steps; i++) {
        this.y += dy / steps;
        if (this.game.soccerBall.isStuck) {
          this.game.soccerBall.stickToPlayer(this);
        }
        await new Promise((r) => setTimeout(r, 12));
      }
      this.y = targetY;
      if (this.game.soccerBall.isStuck) {
        this.game.soccerBall.stickToPlayer(this);
      }
      console.log(`Player moved down to y: ${this.y}`);
    } else {
      console.log(`Can't move down - boundary reached!`);
    }
  }

  async shootBall() {
    // Only shoot if ball is stuck
    if (this.game.soccerBall.isStuck) {
      this.game.soccerBall.isStuck = false;
      const ball = this.game.soccerBall;
      const spaces = this.speed * 4; // Move ball 4 spaces right
      const frames = 16;
      const dx = spaces / frames;
      let angle = 0;
      for (let i = 0; i < frames; i++) {
        ball.x += dx;
        // Rolling effect: rotate ball
        ball._rollingAngle = (ball._rollingAngle || 0) + Math.PI / 8;
        angle = ball._rollingAngle;
        // Clamp ball to canvas
        ball.x = Math.min(ball.x, this.game.width - ball.width);
        await new Promise((r) => setTimeout(r, 20));
      }
      ball._rollingAngle = 0;
      console.log("Ball shot!");
    }
  }

  draw(context) {
    // Draw image scaled to player size (no black border)
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    // No auto-movement anymore - controlled by user code
  }
}

class Defender {
  // Returns a rectangle representing the defender's feet
  getFeetBox() {
    const feetHeight = 10;
    const feetWidth = this.width * 0.5;
    return {
      x: this.x + (this.width - feetWidth) / 2,
      y: this.y + this.height - feetHeight,
      width: feetWidth,
      height: feetHeight,
    };
  }
  constructor(game, x, y) {
    this.game = game;
    this.width = 60;
    this.height = 70;
    this.x = x;
    this.y = y;
    this.image = document.getElementById("defender");
  }

  move(dx, dy) {
    // Move defender by dx, dy, clamped to field
    this.x = Math.max(0, Math.min(this.x + dx, this.game.width - this.width));
    this.y = Math.max(0, Math.min(this.y + dy, this.game.height - this.height));
  }

  draw(context) {
    if (this.image) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}

class Field {
  constructor(game, side) {
    this.game = game;
    // Use soccer_goal.png for the goal image
    this.image = document.getElementById("soccer-goal");
    this.side = side;
    // Goal box size (smaller, matches the small box in the field image)
    this.width = 120; // Adjust as needed for the small box
    this.height = 200; // Adjust as needed for the small box
    // Position goal at the correct edge and vertical center
    const edgeOffset = -15; // Small offset from edge
    if (side === "left") {
      this.x = edgeOffset;
      this.y = (this.game.height - this.height) / 2;
    } else {
      this.x = this.game.width - this.width - edgeOffset;
      this.y = (this.game.height - this.height) / 2;
    }
  }

  draw(context) {
    if (this.image) {
      context.save();
      if (this.side === "left") {
        // Draw left goal (no rotation, just flip horizontally if needed)
        context.save();
        context.translate(this.x + this.width, this.y);
        context.scale(-1, 1); // Flip horizontally
        context.drawImage(this.image, 0, 0, this.width, this.height);
        context.restore();
      } else {
        // Draw right goal (normal)
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
      context.restore();
    }
  }
}

class Game {
  // Helper to get movement direction for a player based on pressed keys
  getPlayerDirection(playerType) {
    // playerType: 'main' or 'defender'
    let dx = 0,
      dy = 0;
    if (playerType === "main") {
      if (this.pressedKeys.has("a") || this.pressedKeys.has("A")) dx -= 1;
      if (this.pressedKeys.has("d") || this.pressedKeys.has("D")) dx += 1;
      if (this.pressedKeys.has("w") || this.pressedKeys.has("W")) dy -= 1;
      if (this.pressedKeys.has("s") || this.pressedKeys.has("S")) dy += 1;
    } else if (playerType === "defender") {
      if (this.pressedKeys.has("ArrowLeft")) dx -= 1;
      if (this.pressedKeys.has("ArrowRight")) dx += 1;
      if (this.pressedKeys.has("ArrowUp")) dy -= 1;
      if (this.pressedKeys.has("ArrowDown")) dy += 1;
    }
    return { dx, dy };
  }
  // Helper: check if two rectangles overlap
  static rectsOverlap(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.currentLevel = 1;
    this.fieldLeft = new Field(this, "left");
    this.fieldRight = new Field(this, "right");
    this.player = new Player(this);
    this.soccerBall = new SoccerBall(this);
    this.defenders = [];
    // Set player position to fixed coordinates
    this.player.x = 100;
    this.player.y = 270;
    this.player.startX = this.player.x;
    this.player.startY = this.player.y;
    this.isExecuting = false;
    // Smooth movement state for 1v1
    this.pressedKeys = new Set();
  }

  render(context) {
    this.fieldLeft.draw(context);
    this.fieldRight.draw(context);

    // Collision detection: check if player's feet touch ball
    const feetBox = this.player.getFeetBox();
    const ballBox = this.soccerBall.getBox();
    // For level 6 (bot/1v1), make the ball stick and move with player when touched
    if (this.currentLevel === 6) {
      if (!this.soccerBall.isStuck && Game.rectsOverlap(feetBox, ballBox)) {
        this.soccerBall.isStuck = true;
      }
      if (this.soccerBall.isStuck) {
        this.soccerBall.stickToPlayer(this.player);
      }
    } else {
      this.soccerBall.isStuck = Game.rectsOverlap(feetBox, ballBox);
      if (this.soccerBall.isStuck) {
        this.soccerBall.stickToPlayer(this.player);
      }
    }

    // Goal collision detection
    // Make the goal collision area even smaller so the ball must fully enter the goal
    const goalInset = 49; // Ball must go even deeper inside the goal to count
    const leftGoalBox = {
      x: this.fieldLeft.x + goalInset,
      y: this.fieldLeft.y + goalInset,
      width: this.fieldLeft.width - goalInset * 2,
      height: this.fieldLeft.height - goalInset * 2,
    };
    const rightGoalBox = {
      x: this.fieldRight.x + goalInset,
      y: this.fieldRight.y + goalInset,
      width: this.fieldRight.width - goalInset * 2,
      height: this.fieldRight.height - goalInset * 2,
    };
    // Only show popup if not already shown and only once per goal event
    // Track initial ball position per level
    if (typeof this._goalPopupShown === "undefined") {
      this._goalPopupShown = false;
      this._goalPopupActive = false;
      this._ballInitialPos = { x: this.soccerBall.x, y: this.soccerBall.y };
      this._ballHasMoved = false;
    }
    // Detect if ball has moved from initial position
    if (
      !this._ballHasMoved &&
      (this.soccerBall.x !== this._ballInitialPos.x ||
        this.soccerBall.y !== this._ballInitialPos.y)
    ) {
      this._ballHasMoved = true;
    }
    const ballInGoal =
      Game.rectsOverlap(ballBox, leftGoalBox) ||
      Game.rectsOverlap(ballBox, rightGoalBox);
    if (
      !this._goalPopupShown &&
      ballInGoal &&
      !this._goalPopupActive &&
      this._ballHasMoved
    ) {
      this._goalPopupShown = true;
      this._goalPopupActive = true;
      this.showGoalPopup();
    }
    // Reset popup flag if ball is not in goal
    if (!ballInGoal) {
      this._goalPopupShown = false;
      this._goalPopupActive = false;
    }

    // Draw defenders for level 2, 3, 1v1 (level 6), and Bot mode
    if (
      (this.currentLevel === 2 ||
        this.currentLevel === 3 ||
        this.currentLevel === 6 ||
        this.currentLevel === "bot") &&
      this.defenders &&
      this.defenders.length > 0
    ) {
      this.defenders.forEach((defender) => defender.draw(context));
    }
    this.player.draw(context);
    this.soccerBall.draw(context);
    this.player.update();
  }

  showGoalPopup() {
    if (document.getElementById("goal-popup")) return; // Only one popup at a time
    if (this.currentLevel === 6) {
      // Ball in right goal: Player scores, left goal: Defender scores
      const ballBox = this.soccerBall.getBox();
      const leftGoalBox = {
        x: this.fieldLeft.x,
        y: this.fieldLeft.y,
        width: this.fieldLeft.width,
        height: this.fieldLeft.height,
      };
      const rightGoalBox = {
        x: this.fieldRight.x,
        y: this.fieldRight.y,
        width: this.fieldRight.width,
        height: this.fieldRight.height,
      };
      if (Game.rectsOverlap(ballBox, rightGoalBox)) {
        this.playerScore++;
        document.getElementById("score-player").textContent = this.playerScore;
        checkScoreCloseToWin();
      } else if (Game.rectsOverlap(ballBox, leftGoalBox)) {
        this.defenderScore++;
        document.getElementById("score-defender").textContent =
          this.defenderScore;
        checkScoreCloseToWin();
      }
      // After scoring, reset the level to keep both players and ball visible
      this.loadLevel(6);
      // Keep scoreboard visible
      const scoreboard = document.getElementById("scoreboard");
      if (scoreboard) scoreboard.style.display = "block";
      // Keep IDE visible for all levels
      const editor = document.getElementById("game-textbox");
      if (editor) {
        editor.style.display = "block";
        editor.contentEditable = "true";
        editor.classList.add("enabled");
      }
      return; // Do NOT show popup for 1v1
    }
    // Call original popup logic
    const popup = document.createElement("div");
    popup.id = "goal-popup";
    popup.className = "goal-popup";
    const nextLevel = Math.min(this.currentLevel + 1, 5);
    popup.innerHTML = `
      <div class="goal-popup-content">
        <h2 class="goal-unique-effect">Great job!</h2>
        <p>Level: <span id="goal-level-label">Level ${this.currentLevel}</span> complete</p>
        <button id="next-level-popup-btn" class="green-btn">Next Level</button>
        <button id="close-popup-btn" class="red-btn">Close</button>
      </div>
    `;
    document.body.appendChild(popup);
    document.getElementById("next-level-popup-btn").onclick = () => {
      popup.remove();
      if (this.currentLevel < 5) {
        this.loadLevel(nextLevel);
        // Clear code box but keep IDE visible
        const editor = document.getElementById("game-textbox");
        if (editor) {
          editor.innerHTML = "";
          editor.style.display = "block";
          editor.contentEditable = "true";
          editor.classList.add("enabled");
        }
        // Update level label in dropdown
        const dropdown = document.getElementById("level-dropdown");
        if (dropdown) dropdown.value = nextLevel;
      }
    };
    document.getElementById("close-popup-btn").onclick = () => {
      popup.remove();
    };
  }

  loadLevel(level) {
    this.currentLevel = level;
    // Clear existing defenders
    this.defenders = [];

    // Place player at fixed coordinates
    this.player.x = 150;
    this.player.y = 220;
    this.player.startX = this.player.x;
    this.player.startY = this.player.y;

    // Add defenders for level 2, 1v1 (level 6), and Bot mode
    if (level === 2) {
      // Two defenders: one left, one right of the soccer ball
      this.soccerBall.x = 430;
      this.soccerBall.y = (this.height - this.soccerBall.height) / 2;
      this.soccerBall.isStuck = false;
      const defenderWidth = 60;
      this.defenders.push(
        new Defender(this, this.soccerBall.x - defenderWidth - 30, 250)
      );
      this.defenders.push(
        new Defender(this, this.soccerBall.x + this.soccerBall.width + 30, 250)
      );
    } else if (level === 3) {
      // Level 3: Three defenders spread horizontally - player must navigate around them
      // Position ball in center of field
      this.soccerBall.x = (this.width - this.soccerBall.width) / 2;
      this.soccerBall.y = (this.height - this.soccerBall.height) / 2;
      this.soccerBall.isStuck = false;
      // Three defenders arranged horizontally: left, middle, right blocking the path
      this.defenders.push(new Defender(this, 350, 250)); // Left defender (top)
      this.defenders.push(new Defender(this, 150, 350)); // Left defender (top)
      this.defenders.push(new Defender(this, 150, 150)); // Left defender (top)
      this.defenders.push(new Defender(this, 200, 250)); // Middle defender (center)
      this.defenders.push(new Defender(this, 350, 500)); // Right defender (bottom)
    } else if (level === 6) {
      // 1v1: main player (blue) is controlled by WASD, one defender (arrow keys)
      this.player.x = 160;
      this.player.y = 250;
      this.player.startX = this.player.x;
      this.player.startY = this.player.y;
      // Only one defender (right, controlled by arrow keys)
      this.defenders.push(new Defender(this, 610, 250));
      this.soccerBall.x = 430;
      this.soccerBall.y = (this.height - this.soccerBall.height) / 2;
      this.soccerBall.isStuck = false;
    } else if (level === "bot") {
      // Bot mode: add a defender on the right side
      this.player.x = 150;
      this.player.y = 220;
      this.player.startX = this.player.x;
      this.player.startY = this.player.y;
      this.defenders.push(new Defender(this, 610, 250));
      this.soccerBall.x = 430;
      this.soccerBall.y = (this.height - this.soccerBall.height) / 2;
      this.soccerBall.isStuck = false;
    } else {
      // Default: center ball for other levels
      this.soccerBall.x = (this.width - this.soccerBall.width) / 2;
      this.soccerBall.y = (this.height - this.soccerBall.height) / 2;
      this.soccerBall.isStuck = false;
    }

    console.log(`Level ${level} loaded`);
  }

  async executeUserCode(code, shouldStop) {
    if (this.isExecuting) {
      alert("Code is already running!");
      return;
    }

    // Reset player and ball before running code
    this.player.reset();

    // Reset soccer ball position based on level
    if (this.currentLevel === 3) {
      // Level 3: ball is centered
      this.soccerBall.x = (this.width - this.soccerBall.width) / 2;
      this.soccerBall.y = (this.height - this.soccerBall.height) / 2;
    } else {
      // Default: center ball for other levels
      this.soccerBall.x = (this.width - this.soccerBall.width) / 2;
      this.soccerBall.y = (this.height - this.soccerBall.height) / 2;
    }
    this.soccerBall.isStuck = false;

    this.isExecuting = true;

    // Create a controlled execution environment
    const game = this;
    const player = this.player;
    const defenders = this.defenders;
    let loopCount = 0;
    const maxLoopIterations = 1000; // Prevent infinite loops

    // Define available functions in the user's scope
    const userFunctions = {
      moveRight: async function () {
        await player.moveRight();
      },
      moveLeft: async function () {
        await player.moveLeft();
      },
      moveUp: async function () {
        await player.moveUp();
      },
      moveDown: async function () {
        await player.moveDown();
      },
      shootBall: async function () {
        await player.shootBall();
      },
      inFront: function (defenderIndex) {
        if (defenderIndex >= 0 && defenderIndex < defenders.length) {
          return player.inFront(defenders[defenderIndex]);
        }
        return false;
      },
    };

    try {
      // Automatically insert 'await' before movement/action commands
      let safeCode = code
        .replace(/([^a-zA-Z0-9_])?moveRight\s*\(/g, "$1await moveRight(")
        .replace(/([^a-zA-Z0-9_])?moveLeft\s*\(/g, "$1await moveLeft(")
        .replace(/([^a-zA-Z0-9_])?moveUp\s*\(/g, "$1await moveUp(")
        .replace(/([^a-zA-Z0-9_])?moveDown\s*\(/g, "$1await moveDown(")
        .replace(/([^a-zA-Z0-9_])?shootBall\s*\(/g, "$1await shootBall(");

      // Create a function from the code with access to user functions
      const userCode = new Function(
        "moveRight",
        "moveLeft",
        "moveUp",
        "moveDown",
        "shootBall",
        "inFront",
        "defenders",
        `
        return (async function() {
          let originalLoopCount = 0;
          const maxIterations = 1000;
          ${safeCode}
        })();
        `
      );

      // Execute the user code
      await userCode(
        userFunctions.moveRight,
        userFunctions.moveLeft,
        userFunctions.moveUp,
        userFunctions.moveDown,
        userFunctions.shootBall,
        userFunctions.inFront,
        defenders
      );
    } catch (error) {
      console.error("Error executing user code:", error);
      alert("Error in code: " + error.message);
    }

    this.isExecuting = false;
    console.log("Code execution complete!");
  }

  handleDefenderControls(e) {
    // Only allow in 1v1 (level 6)
    if (this.currentLevel !== 6) return;
    if (e.type === "keydown") {
      this.pressedKeys.add(e.key);
    } else if (e.type === "keyup") {
      this.pressedKeys.delete(e.key);
    }
  }

  updateSmoothMovement() {
    // 1v1 mode movement
    if (this.currentLevel === 6) {
      // ...existing 1v1 movement logic...
      const speed = 4;
      let dx = 0,
        dy = 0;
      if (this.pressedKeys.has("a") || this.pressedKeys.has("A")) dx -= speed;
      if (this.pressedKeys.has("d") || this.pressedKeys.has("D")) dx += speed;
      if (this.pressedKeys.has("w") || this.pressedKeys.has("W")) dy -= speed;
      if (this.pressedKeys.has("s") || this.pressedKeys.has("S")) dy += speed;
      if (dx !== 0 || dy !== 0) {
        this.player.x = Math.max(
          0,
          Math.min(this.width - this.player.width, this.player.x + dx)
        );
        this.player.y = Math.max(
          0,
          Math.min(this.height - this.player.height, this.player.y + dy)
        );
      }
      // Defender (arrow keys)
      dx = 0;
      dy = 0;
      if (this.pressedKeys.has("ArrowLeft")) dx -= speed;
      if (this.pressedKeys.has("ArrowRight")) dx += speed;
      if (this.pressedKeys.has("ArrowUp")) dy -= speed;
      if (this.pressedKeys.has("ArrowDown")) dy += speed;
      if ((dx !== 0 || dy !== 0) && this.defenders[0]) {
        this.defenders[0].move(dx, dy);
      }
      return;
    }
    // Bot mode movement (WASD for blue player, only after Start)
    if (this.currentLevel === "bot" && this.botModeStarted) {
      const speed = 4;
      let dx = 0,
        dy = 0;
      if (this.pressedKeys.has("a") || this.pressedKeys.has("A")) dx -= speed;
      if (this.pressedKeys.has("d") || this.pressedKeys.has("D")) dx += speed;
      if (this.pressedKeys.has("w") || this.pressedKeys.has("W")) dy -= speed;
      if (this.pressedKeys.has("s") || this.pressedKeys.has("S")) dy += speed;
      if (dx !== 0 || dy !== 0) {
        this.player.x = Math.max(
          0,
          Math.min(this.width - this.player.width, this.player.x + dx)
        );
        this.player.y = Math.max(
          0,
          Math.min(this.height - this.player.height, this.player.y + dy)
        );
      }
      // No defender movement in bot mode
    }
  }
}

// Test comment 2
function startGame() {
  // Ensure window is focused for keyboard events
  window.focus();
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 888;
  canvas.height = 613;

  const levelDropdown = document.getElementById("level-dropdown");
  const selectedValue = levelDropdown.value;
  const selectedLevel = parseInt(selectedValue);
  // After creating the game instance and setting it, initialize botModeStarted
  const game = new Game(canvas);
  game.botModeStarted = false; // Track if bot mode has started
  window.setCurrentGame(game);
  game.loadLevel(selectedLevel);

  document.getElementById("action-buttons").style.display = "flex";

  const editor = document.getElementById("game-textbox");
  const scoreboard = document.getElementById("scoreboard");
  // Show/hide IDE textbox based on level
  const runBtn = document.getElementById("run-btn");
  const clearBtn = document.getElementById("clear-btn");
  const start1v1Btn = document.getElementById("start-1v1-btn");
  if (selectedLevel === 6) {
    // 1v1 mode
    if (scoreboard) scoreboard.style.display = "none";
    if (start1v1Btn) {
      // Only show the button if it hasn't been clicked yet
      if (!window._scoreboardStarted1v1) {
        start1v1Btn.style.display = "block";
      } else {
        start1v1Btn.style.display = "none";
      }
      start1v1Btn.onclick = () => {
        window._scoreboardStarted1v1 = true;
        start1v1Btn.style.display = "none";
        if (scoreboard) scoreboard.style.display = "block";
        if (window.currentGame) {
          window.currentGame.playerScore = 0;
          window.currentGame.defenderScore = 0;
          document.getElementById("score-player").textContent = "0";
          document.getElementById("score-defender").textContent = "0";
          window.currentGame.loadLevel(6);
        }
      };
    }
    editor.style.display = "none";
    editor.contentEditable = "false";
    editor.classList.remove("enabled");
    editor.innerHTML = "";
    if (runBtn) runBtn.style.display = "none";
    if (clearBtn) clearBtn.style.display = "none";
    if (window.currentGame) {
      window.currentGame.playerScore = 0;
      window.currentGame.defenderScore = 0;
      document.getElementById("score-player").textContent = "0";
      document.getElementById("score-defender").textContent = "0";
    }
  } else if (selectedValue === "bot") {
    // Bot mode
    if (start1v1Btn) start1v1Btn.style.display = "none";
    editor.style.display = "none";
    editor.contentEditable = "false";
    editor.classList.remove("enabled");
    editor.innerHTML = "";
    if (scoreboard) scoreboard.style.display = "none";
    if (runBtn) runBtn.style.display = "none";
    if (clearBtn) clearBtn.style.display = "none";
  } else {
    // All other levels
    if (start1v1Btn) start1v1Btn.style.display = "none";
    editor.style.display = "block";
    editor.contentEditable = "true";
    editor.classList.add("enabled");
    editor.innerHTML = "";
    if (scoreboard) scoreboard.style.display = "none";
    if (runBtn) runBtn.style.display = "inline-block";
    if (clearBtn) clearBtn.style.display = "inline-block";
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (typeof game.updateSmoothMovement === "function")
      game.updateSmoothMovement();
    game.render(ctx);
    requestAnimationFrame(animate);
  }
  animate();
}

// Patch showGoalPopup to update scores and reset 1v1 after goal, but no popup for 1v1
const originalShowGoalPopup = Game.prototype.showGoalPopup;
Game.prototype.showGoalPopup = function () {
  if (this.currentLevel === 6) {
    // Ball in right goal: Player scores, left goal: Defender scores
    // Ensure scores are initialized
    if (typeof this.playerScore !== "number") this.playerScore = 0;
    if (typeof this.defenderScore !== "number") this.defenderScore = 0;
    const ballBox = this.soccerBall.getBox();
    const leftGoalBox = {
      x: this.fieldLeft.x,
      y: this.fieldLeft.y,
      width: this.fieldLeft.width,
      height: this.fieldLeft.height,
    };
    const rightGoalBox = {
      x: this.fieldRight.x,
      y: this.fieldRight.y,
      width: this.fieldRight.width,
      height: this.fieldRight.height,
    };
    if (Game.rectsOverlap(ballBox, rightGoalBox)) {
      this.playerScore =
        (typeof this.playerScore === "number" ? this.playerScore : 0) + 1;
      document.getElementById("score-player").textContent = this.playerScore;
    } else if (Game.rectsOverlap(ballBox, leftGoalBox)) {
      this.defenderScore =
        (typeof this.defenderScore === "number" ? this.defenderScore : 0) + 1;
      document.getElementById("score-defender").textContent =
        this.defenderScore;
    }
    // After scoring, reset the level to keep both players and ball visible
    this.loadLevel(6);
    // Restore scores after reload
    document.getElementById("score-player").textContent = this.playerScore;
    document.getElementById("score-defender").textContent = this.defenderScore;
    // Keep scoreboard visible
    const scoreboard = document.getElementById("scoreboard");
    if (scoreboard) scoreboard.style.display = "block";
    // Hide IDE textbox for 1v1
    const editor = document.getElementById("game-textbox");
    if (editor) {
      editor.style.display = "none";
      editor.contentEditable = "false";
      editor.classList.remove("enabled");
      editor.innerHTML = "";
    }
    return; // Do NOT show popup for 1v1
  }
  // Call original popup logic
  const popup = document.createElement("div");
  popup.id = "goal-popup";
  popup.className = "goal-popup";
  const nextLevel = Math.min(this.currentLevel + 1, 5);
  popup.innerHTML = `
    <div class="goal-popup-content">
      <h2 class="goal-unique-effect">Great job!</h2>
      <p>Level: <span id="goal-level-label">Level ${this.currentLevel}</span> complete</p>
      <button id="next-level-popup-btn" class="green-btn">Next Level</button>
      <button id="close-popup-btn" class="red-btn">Close</button>
    </div>
  `;
  document.body.appendChild(popup);
  document.getElementById("next-level-popup-btn").onclick = () => {
    popup.remove();
    if (this.currentLevel < 5) {
      this.loadLevel(nextLevel);
      // Clear code box but keep IDE visible
      const editor = document.getElementById("game-textbox");
      if (editor) {
        editor.innerHTML = "";
        editor.style.display = "block";
        editor.contentEditable = "true";
        editor.classList.add("enabled");
      }
      // Update level label in dropdown
      const dropdown = document.getElementById("level-dropdown");
      if (dropdown) dropdown.value = nextLevel;
    }
  };
  document.getElementById("close-popup-btn").onclick = () => {
    popup.remove();
  };
};

function checkSyntaxErrors(code) {
  const lines = code.split("\n");
  const errors = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (trimmedLine.length === 0) return;

    // Check if line contains a valid function
    let isValid = false;
    for (const func of FUNCTIONS) {
      if (trimmedLine === `${func}()`) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      errors.push({
        line: index + 1,
        message: `Invalid command: "${trimmedLine}". Valid commands: ${FUNCTIONS.map(
          (f) => f + "()"
        ).join(", ")}`,
      });
    }
  });

  return errors;
}

function updateLineNumbers() {
  const editor = document.getElementById("game-textbox");
  const lineNumbers = document.getElementById("line-numbers");

  const lines = editor.innerText.split("\n");
  const lineCount = lines.length;

  let numbers = "";
  for (let i = 1; i <= lineCount; i++) {
    numbers += i + "\n";
  }

  lineNumbers.textContent = numbers;
}

function displaySyntaxErrors(errors) {
  const errorDiv = document.getElementById("syntax-error");

  if (errors.length === 0) {
    errorDiv.style.display = "none";
    return;
  }

  errorDiv.style.display = "block";
  errorDiv.innerHTML = errors
    .map((err) => `<strong>Line ${err.line}:</strong> ${err.message}`)
    .join("<br>");
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

function highlightCode(code) {
  let escaped = escapeHtml(code);

  FUNCTIONS.forEach((fn) => {
    const fnRegex = new RegExp(`\\b(${fn})(?=\\()`, "g");
    escaped = escaped.replace(
      fnRegex,
      `<span class="token-function">$1</span>`
    );
  });

  escaped = escaped.replace(/\(/g, `<span class="token-parens">(</span>`);
  escaped = escaped.replace(/\)/g, `<span class="token-parens">)</span>`);

  return escaped;
}

document.addEventListener("DOMContentLoaded", () => {
  function showAllGameButtons() {
    const difficultyGrid = document.querySelector(".difficulty-grid");
    const modeButtons = document.querySelector(".mode-buttons");
    const startBtn = document.querySelector(".start-btn");
    if (difficultyGrid) difficultyGrid.style.display = "grid";
    if (modeButtons) modeButtons.style.display = "flex";
    if (startBtn) startBtn.style.display = "block";
    // Restore instructional text visibility
    if (
      difficultyGrid &&
      difficultyGrid.previousElementSibling &&
      difficultyGrid.previousElementSibling.textContent.includes(
        "Select Difficulty"
      )
    ) {
      difficultyGrid.previousElementSibling.style.display = "block";
    }
    if (
      modeButtons &&
      modeButtons.previousElementSibling &&
      modeButtons.previousElementSibling.textContent.includes(
        "Select Game Mode"
      )
    ) {
      modeButtons.previousElementSibling.style.display = "block";
    }
  }
  // Hide all buttons when Start is clicked, but only if all required selections/inputs are made
  const startBtn = document.querySelector(".start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      // Check if a difficulty is selected
      const difficultyGrid = document.querySelector(".difficulty-grid");
      const difficultySelected =
        difficultyGrid &&
        Array.from(difficultyGrid.querySelectorAll(".difficulty-btn")).some(
          (btn) => btn.classList.contains("selected")
        );
      // Check if a mode is selected
      const modeButtons = document.querySelector(".mode-buttons");
      const modeSelectedBtn =
        modeButtons &&
        Array.from(modeButtons.querySelectorAll(".difficulty-btn")).find(
          (btn) => btn.classList.contains("selected")
        );
      // Check Timed/To Score input if needed
      let validInput = true;
      if (modeSelectedBtn && modeSelectedBtn.id === "timed-btn") {
        const timedInput = document.getElementById("timed-minutes");
        const timedVal =
          timedInput && timedInput.value ? parseInt(timedInput.value) : 0;
        validInput = timedInput && timedVal >= 1 && timedVal <= 20;
        if (timedInput && (timedVal < 1 || timedVal > 20)) {
          let popup = document.getElementById("select-popup");
          if (!popup) {
            popup = document.createElement("div");
            popup.id = "select-popup";
            popup.style.position = "fixed";
            popup.style.top = "0";
            popup.style.left = "0";
            popup.style.width = "100vw";
            popup.style.height = "100vh";
            popup.style.background = "rgba(0,0,0,0.35)";
            popup.style.display = "flex";
            popup.style.alignItems = "center";
            popup.style.justifyContent = "center";
            popup.style.zIndex = "9999";
            popup.innerHTML = `<div style="background: #fffde7; border-radius: 14px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); padding: 32px 40px; text-align: center; font-size: 1.2em; color: #d32f2f; font-weight: 600; max-width: 340px;"><div style='margin-bottom:18px;'>Please choose a time between 1 and 20 minutes.</div><button id='close-select-popup' style='margin-top:10px; padding:8px 24px; font-size:1em; border-radius:8px; border:none; background:#d32f2f; color:#fff; font-weight:600; cursor:pointer;'>Close</button></div>`;
            document.body.appendChild(popup);
            document.getElementById("close-select-popup").onclick = () =>
              popup.remove();
          }
          return;
        }
      } else if (modeSelectedBtn && modeSelectedBtn.id === "toscore-btn") {
        const scoreInput = document.getElementById("toscore-score");
        const scoreVal =
          scoreInput && scoreInput.value ? parseInt(scoreInput.value) : 0;
        validInput = scoreInput && scoreVal >= 1 && scoreVal <= 100;
        if (scoreInput && (scoreVal < 1 || scoreVal > 100)) {
          let popup = document.getElementById("select-popup");
          if (!popup) {
            popup = document.createElement("div");
            popup.id = "select-popup";
            popup.style.position = "fixed";
            popup.style.top = "0";
            popup.style.left = "0";
            popup.style.width = "100vw";
            popup.style.height = "100vh";
            popup.style.background = "rgba(0,0,0,0.35)";
            popup.style.display = "flex";
            popup.style.alignItems = "center";
            popup.style.justifyContent = "center";
            popup.style.zIndex = "9999";
            popup.innerHTML = `<div style=\"background: #fffde7; border-radius: 14px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); padding: 32px 40px; text-align: center; font-size: 1.2em; color: #d32f2f; font-weight: 600; max-width: 340px;\"><div style='margin-bottom:18px;'>Please choose a score between 1 and 100.</div><button id='close-select-popup' style='margin-top:10px; padding:8px 24px; font-size:1em; border-radius:8px; border:none; background:#d32f2f; color:#fff; font-weight:600; cursor:pointer;'>Close</button></div>`;
            document.body.appendChild(popup);
            document.getElementById("close-select-popup").onclick = () =>
              popup.remove();
          }
          return;
        }
      }
      if (!difficultySelected || !modeSelectedBtn || !validInput) {
        // Show popup
        let popup = document.getElementById("select-popup");
        if (!popup) {
          popup = document.createElement("div");
          popup.id = "select-popup";
          popup.style.position = "fixed";
          popup.style.top = "0";
          popup.style.left = "0";
          popup.style.width = "100vw";
          popup.style.height = "100vh";
          popup.style.background = "rgba(0,0,0,0.35)";
          popup.style.display = "flex";
          popup.style.alignItems = "center";
          popup.style.justifyContent = "center";
          popup.style.zIndex = "9999";
          popup.innerHTML = `<div style="background: #fffde7; border-radius: 14px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); padding: 32px 40px; text-align: center; font-size: 1.2em; color: #d32f2f; font-weight: 600; max-width: 340px;"><div style='margin-bottom:18px;'>Please select a difficulty, mode, and enter a value if required.</div><button id='close-select-popup' style='margin-top:10px; padding:8px 24px; font-size:1em; border-radius:8px; border:none; background:#d32f2f; color:#fff; font-weight:600; cursor:pointer;'>Close</button></div>`;
          document.body.appendChild(popup);
          document.getElementById("close-select-popup").onclick = () =>
            popup.remove();
        }
        return;
      }
      // After ALL validations pass and before hiding UI, enable botModeStarted for bot mode
      if (window.currentGame && window.currentGame.currentLevel === "bot") {
        window.currentGame.botModeStarted = true;
      }
      // Hide difficulty grid, mode buttons, input containers, and Start button
      const timedInputContainer = document.getElementById(
        "timed-input-container"
      );
      const toscoreInputContainer = document.getElementById(
        "toscore-input-container"
      );
      const freeplayMessage = document.getElementById("freeplay-message");
      if (difficultyGrid) difficultyGrid.style.display = "none";
      if (modeButtons) modeButtons.style.display = "none";
      if (timedInputContainer) timedInputContainer.style.display = "none";
      if (toscoreInputContainer) toscoreInputContainer.style.display = "none";
      if (freeplayMessage) freeplayMessage.style.display = "none";
      startBtn.style.display = "none";
      // Hide instructional text above difficulty and mode buttons
      if (
        difficultyGrid &&
        difficultyGrid.previousElementSibling &&
        difficultyGrid.previousElementSibling.textContent.includes(
          "Select Difficulty"
        )
      ) {
        difficultyGrid.previousElementSibling.style.display = "none";
      }
      if (
        modeButtons &&
        modeButtons.previousElementSibling &&
        modeButtons.previousElementSibling.textContent.includes(
          "Select Game Mode"
        )
      ) {
        modeButtons.previousElementSibling.style.display = "none";
      }
      // Show scoreboard and reset scores to 0
      const scoreboard = document.getElementById("scoreboard");
      const scorePlayer = document.getElementById("score-player");
      const scoreDefender = document.getElementById("score-defender");
      if (scoreboard) {
        scoreboard.style.display = "block";
      }
      if (scorePlayer) scorePlayer.textContent = "0";
      if (scoreDefender) scoreDefender.textContent = "0";
      window._lastScoreMessage = null;
      // Show timer if Timed mode is selected
      // Show target score if To Score mode is selected
      const targetScoreContainer = document.getElementById(
        "targetscore-container"
      );
      const targetScoreValue = document.getElementById("targetscore-value");
      let targetScore = 0;
      if (
        modeSelectedBtn &&
        modeSelectedBtn.id === "toscore-btn" &&
        targetScoreContainer &&
        targetScoreValue
      ) {
        const scoreInput = document.getElementById("toscore-score");
        targetScore =
          scoreInput && scoreInput.value ? parseInt(scoreInput.value) : 0;
        targetScoreContainer.style.display = "block";
        targetScoreValue.textContent = targetScore;
        window._targetScore = targetScore;
      } else if (targetScoreContainer) {
        targetScoreContainer.style.display = "none";
        window._targetScore = undefined;
      }
      // Show timer for Freeplay mode (counts up)
      const freeplayTimerContainer = document.getElementById(
        "freeplay-timer-container"
      );
      const freeplayTimerValue = document.getElementById(
        "freeplay-timer-value"
      );
      if (
        modeSelectedBtn &&
        modeSelectedBtn.id === "freeplay-btn" &&
        freeplayTimerContainer &&
        freeplayTimerValue
      ) {
        let secondsElapsed = 0;
        function formatTime(sec) {
          const m = Math.floor(sec / 60);
          const s = sec % 60;
          return `${m}:${s.toString().padStart(2, "0")}`;
        }
        freeplayTimerContainer.style.display = "block";
        freeplayTimerValue.textContent = formatTime(secondsElapsed);
        if (window._freeplayTimerInterval)
          clearInterval(window._freeplayTimerInterval);
        window._freeplayTimerInterval = setInterval(() => {
          secondsElapsed++;
          freeplayTimerValue.textContent = formatTime(secondsElapsed);
        }, 1000);
      } else if (freeplayTimerContainer) {
        freeplayTimerContainer.style.display = "none";
        if (window._freeplayTimerInterval)
          clearInterval(window._freeplayTimerInterval);
      }
      // Show message if player or defender is one point away from target score
      function checkScoreCloseToWin() {
        const targetScore = window._targetScore;
        if (!targetScore) return;
        const scorePlayer = document.getElementById("score-player");
        const scoreDefender = document.getElementById("score-defender");
        if (!scorePlayer || !scoreDefender) return;
        const playerScore = parseInt(scorePlayer.textContent);
        const defenderScore = parseInt(scoreDefender.textContent);
        let message = "";
        if (targetScore - playerScore === 1) {
          message = "Player needs one more point to win!";
        } else if (targetScore - defenderScore === 1) {
          message = "Defender needs one more point to win!";
        }
        if (message && window._lastScoreMessage !== message) {
          let popup = document.getElementById("score-close-popup");
          if (!popup) {
            popup = document.createElement("div");
            popup.id = "score-close-popup";
            popup.style.position = "fixed";
            popup.style.top = "0";
            popup.style.left = "0";
            popup.style.width = "100vw";
            popup.style.height = "100vh";
            popup.style.background = "rgba(0,0,0,0.35)";
            popup.style.display = "flex";
            popup.style.alignItems = "center";
            popup.style.justifyContent = "center";
            popup.style.zIndex = "9999";
            popup.innerHTML = `<div style=\"background: #fffde7; border-radius: 14px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); padding: 32px 40px; text-align: center; font-size: 1.2em; color: #d32f2f; font-weight: 600; max-width: 340px;\"><div style='margin-bottom:18px;'>${message}</div><button id='close-score-close-popup' style='margin-top:10px; padding:8px 24px; font-size:1em; border-radius:8px; border:none; background:#d32f2f; color:#fff; font-weight:600; cursor:pointer;'>Close</button></div>`;
            document.body.appendChild(popup);
            document.getElementById("close-score-close-popup").onclick = () =>
              popup.remove();
          }
          window._lastScoreMessage = message;
        } else if (!message) {
          const popup = document.getElementById("score-close-popup");
          if (popup) popup.remove();
          window._lastScoreMessage = null;
        }
      }
      const timerContainer = document.getElementById("timer-container");
      const timerValue = document.getElementById("timer-value");
      if (
        modeSelectedBtn &&
        modeSelectedBtn.id === "timed-btn" &&
        timerContainer &&
        timerValue
      ) {
        const timedInput = document.getElementById("timed-minutes");
        let secondsLeft = parseInt(timedInput.value, 10) * 60;
        function formatTime(sec) {
          const m = Math.floor(sec / 60);
          const s = sec % 60;
          return `${m}:${s.toString().padStart(2, "0")}`;
        }
        timerContainer.style.display = "block";
        timerValue.textContent = formatTime(secondsLeft);
        if (window._timerInterval) clearInterval(window._timerInterval);
        window._timerInterval = setInterval(() => {
          secondsLeft--;
          if (secondsLeft < 0) {
            clearInterval(window._timerInterval);
            timerValue.textContent = "0:00";
            // Optionally: trigger end of game here
            return;
          }
          timerValue.textContent = formatTime(secondsLeft);
        }, 1000);
      } else if (timerContainer) {
        timerContainer.style.display = "none";
      }
    });
  }
  // Mode button selection logic
  const modeButtonsContainer = document.querySelector(".mode-buttons");
  if (modeButtonsContainer) {
    const modeButtons =
      modeButtonsContainer.querySelectorAll(".difficulty-btn");
    const timedBtn = document.getElementById("timed-btn");
    const timedInputContainer = document.getElementById(
      "timed-input-container"
    );
    const toscoreBtn = document.getElementById("toscore-btn");
    const toscoreInputContainer = document.getElementById(
      "toscore-input-container"
    );
    const freeplayBtn = document.getElementById("freeplay-btn");
    const freeplayMessage = document.getElementById("freeplay-message");
    modeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        modeButtons.forEach((b) => {
          b.classList.remove("selected");
          b.disabled = false;
        });
        btn.classList.add("selected");
        btn.disabled = true;
        // Show/hide time, score input, and freeplay message
        if (btn === timedBtn) {
          if (timedInputContainer) timedInputContainer.style.display = "block";
          if (toscoreInputContainer)
            toscoreInputContainer.style.display = "none";
          if (freeplayMessage) freeplayMessage.style.display = "none";
        } else if (btn === toscoreBtn) {
          if (timedInputContainer) timedInputContainer.style.display = "none";
          if (toscoreInputContainer)
            toscoreInputContainer.style.display = "block";
          if (freeplayMessage) freeplayMessage.style.display = "none";
        } else if (btn === freeplayBtn) {
          if (timedInputContainer) timedInputContainer.style.display = "none";
          if (toscoreInputContainer)
            toscoreInputContainer.style.display = "none";
          if (freeplayMessage) freeplayMessage.style.display = "block";
        } else {
          if (timedInputContainer) timedInputContainer.style.display = "none";
          if (toscoreInputContainer)
            toscoreInputContainer.style.display = "none";
          if (freeplayMessage) freeplayMessage.style.display = "none";
        }
      });
    });
    // Only use minutes input for timer duration
    window.getTimedModeDuration = function () {
      const min =
        parseInt(document.getElementById("timed-minutes").value, 10) || 1;
      return min * 60;
    };
  }
  // Difficulty button selection logic
  const difficultyGrid = document.querySelector(".difficulty-grid");
  if (difficultyGrid) {
    const buttons = difficultyGrid.querySelectorAll(".difficulty-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("selected");
          b.disabled = false;
        });
        btn.classList.add("selected");
        btn.disabled = true;
      });
    });
  }
  const editor = document.getElementById("game-textbox");
  const difficultyButtons = document.querySelector(".difficulty-buttons");
  // Hide difficulty buttons on initial load
  if (difficultyButtons) difficultyButtons.style.display = "none";

  editor.addEventListener("input", (e) => {
    if (!editor.isContentEditable) return;

    // Only update caret if the editor is focused
    if (document.activeElement !== editor) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editor);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const caretPos = preCaretRange.toString().length;

    const plainText = editor.innerText;

    editor.innerHTML = highlightCode(plainText);

    function setCaret(el, pos) {
      for (let node of el.childNodes) {
        if (node.nodeType === 3) {
          if (node.length >= pos) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(node, pos);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            return -1;
          } else {
            pos -= node.length;
          }
        } else {
          pos = setCaret(node, pos);
        }
        if (pos === -1) return -1;
      }
      return pos;
    }
  });

  // Handle paste events to strip HTML and paste only plain text
  editor.addEventListener("paste", function (e) {
    if (!editor.isContentEditable) return;

    e.preventDefault();

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    // Get plain text from clipboard
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("text/plain");

    if (pastedText) {
      // Delete selected content
      range.deleteContents();

      // Insert plain text only
      const textNode = document.createTextNode(pastedText);
      range.insertNode(textNode);

      // Move cursor to end of inserted text
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      // Trigger input event to reapply syntax highlighting
      editor.dispatchEvent(new Event("input"));
    }
  });

  document.getElementById("clear-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your code?")) {
      const editor = document.getElementById("game-textbox");
      editor.innerHTML = "";
      editor.focus();
    }
  });

  const runBtn = document.getElementById("run-btn");
  const stopBtn = document.getElementById("stop-btn");
  const clearBtn = document.getElementById("clear-btn");
  let stopRequested = false;

  runBtn.addEventListener("click", () => {
    const code = editor.innerText.trim();
    const currentGame = window.currentGame;

    if (!currentGame) {
      alert("Please start the game first!");
      return;
    }
    if (!code) {
      alert("Please write some code first!");
      return;
    }

    stopRequested = false;
    runBtn.style.display = "none";
    stopBtn.style.display = "inline-block";
    clearBtn.disabled = true;

    currentGame
      .executeUserCode(code, () => stopRequested)
      .then(() => {
        runBtn.style.display = "inline-block";
        stopBtn.style.display = "none";
        clearBtn.disabled = false;
      });
  });

  stopBtn.addEventListener("click", () => {
    stopRequested = true;
    stopBtn.disabled = true;
    const currentGame = window.currentGame;
    if (currentGame) {
      currentGame.player.reset();
    }
    setTimeout(() => {
      runBtn.style.display = "inline-block";
      stopBtn.style.display = "none";
      stopBtn.disabled = false;
      clearBtn.disabled = false;
    }, 300);
  });

  let currentGame = null;

  document.getElementById("next-level-btn").addEventListener("click", () => {
    showAllGameButtons();
    if (currentGame && currentGame.currentLevel < 5) {
      currentGame.loadLevel(currentGame.currentLevel + 1);
      document.getElementById("level-dropdown").value =
        currentGame.currentLevel;
      // Reset player
      currentGame.player.reset();
      if (currentGame.soccerBall) {
        // Reset popup flags and initial ball position
        currentGame._goalPopupShown = false;
        currentGame._goalPopupActive = false;
        currentGame._ballInitialPos = {
          x: currentGame.soccerBall.x,
          y: currentGame.soccerBall.y,
        };
        currentGame._ballHasMoved = false;
      }
      // Hide/show textbox and scoreboard for 1v1
      const editor = document.getElementById("game-textbox");
      const scoreboard = document.getElementById("scoreboard");
      const runBtn = document.getElementById("run-btn");
      const clearBtn = document.getElementById("clear-btn");
      const levelDropdown = document.getElementById("level-dropdown");
      const selectedValue = levelDropdown.value;
      const start1v1Btn = document.getElementById("start-1v1-btn");
      if (currentGame.currentLevel === 6) {
        if (window._scoreboardStarted1v1) {
          if (scoreboard) scoreboard.style.display = "block";
          if (start1v1Btn) start1v1Btn.style.display = "none";
        } else {
          if (scoreboard) scoreboard.style.display = "none";
          if (start1v1Btn) start1v1Btn.style.display = "block";
        }
        editor.style.display = "none";
        editor.contentEditable = "false";
        editor.classList.remove("enabled");
        editor.innerHTML = "";
        if (runBtn) runBtn.style.display = "none";
        if (clearBtn) clearBtn.style.display = "none";
      } else {
        if (start1v1Btn) start1v1Btn.style.display = "none";
        editor.style.display = "block";
        editor.contentEditable = "true";
        editor.classList.add("enabled");
        editor.innerHTML = "";
        if (scoreboard) scoreboard.style.display = "none";
        if (runBtn) runBtn.style.display = "inline-block";
        if (clearBtn) clearBtn.style.display = "inline-block";
        if (difficultyButtons) difficultyButtons.style.display = "none";
      }
      updateLevelButtons();
    }
  });

  document.getElementById("back-level-btn").addEventListener("click", () => {
    showAllGameButtons();
    if (currentGame && currentGame.currentLevel > 1) {
      currentGame.loadLevel(currentGame.currentLevel - 1);
      document.getElementById("level-dropdown").value =
        currentGame.currentLevel;
      // Reset player
      currentGame.player.reset();
      if (currentGame.soccerBall) {
        // Reset popup flags and initial ball position
        currentGame._goalPopupShown = false;
        currentGame._goalPopupActive = false;
        currentGame._ballInitialPos = {
          x: currentGame.soccerBall.x,
          y: currentGame.soccerBall.y,
        };
        currentGame._ballHasMoved = false;
      }
      // Hide/show textbox and scoreboard for 1v1
      const editor = document.getElementById("game-textbox");
      const scoreboard = document.getElementById("scoreboard");
      const runBtn = document.getElementById("run-btn");
      const clearBtn = document.getElementById("clear-btn");
      const levelDropdown = document.getElementById("level-dropdown");
      const selectedValue = levelDropdown.value;
      const start1v1Btn = document.getElementById("start-1v1-btn");
      if (currentGame.currentLevel === 6) {
        if (window._scoreboardStarted1v1) {
          if (scoreboard) scoreboard.style.display = "block";
          if (start1v1Btn) start1v1Btn.style.display = "none";
        } else {
          if (scoreboard) scoreboard.style.display = "none";
          if (start1v1Btn) start1v1Btn.style.display = "block";
        }
        editor.style.display = "none";
        editor.contentEditable = "false";
        editor.classList.remove("enabled");
        editor.innerHTML = "";
        if (runBtn) runBtn.style.display = "none";
        if (clearBtn) clearBtn.style.display = "none";
      } else {
        if (start1v1Btn) start1v1Btn.style.display = "none";
        editor.style.display = "block";
        editor.contentEditable = "true";
        editor.classList.add("enabled");
        editor.innerHTML = "";
        if (scoreboard) scoreboard.style.display = "none";
        if (runBtn) runBtn.style.display = "inline-block";
        if (clearBtn) clearBtn.style.display = "inline-block";
      }
      updateLevelButtons();
    }
  });

  // Also patch the level dropdown change event
  document.getElementById("level-dropdown").addEventListener("change", (e) => {
    showAllGameButtons();
    const selectedValue = e.target.value;
    let selectedLevel = parseInt(selectedValue);
    if (selectedValue === "bot") {
      selectedLevel = "bot";
    }
    if (currentGame) {
      const difficultyButtons = document.querySelector(".difficulty-buttons");
      if (selectedValue === "bot") {
        // Bot mode
        currentGame.loadLevel("bot");
        // Hide IDE and scoreboard
        const editor = document.getElementById("game-textbox");
        const runBtn = document.getElementById("run-btn");
        const clearBtn = document.getElementById("clear-btn");
        const scoreboard = document.getElementById("scoreboard");
        const start1v1Btn = document.getElementById("start-1v1-btn");
        if (start1v1Btn) start1v1Btn.style.display = "none";
        editor.style.display = "none";
        editor.contentEditable = "false";
        editor.classList.remove("enabled");
        editor.innerHTML = "";
        if (scoreboard) scoreboard.style.display = "none";
        if (runBtn) runBtn.style.display = "none";
        if (clearBtn) clearBtn.style.display = "none";
        if (difficultyButtons) difficultyButtons.style.display = "flex";
      } else if (selectedValue === "6") {
        // 1v1 mode
        if (difficultyButtons) difficultyButtons.style.display = "none";
        currentGame.loadLevel(6);
        currentGame.player.reset();
        if (currentGame.soccerBall) {
          currentGame._goalPopupShown = false;
          currentGame._goalPopupActive = false;
          currentGame._ballInitialPos = {
            x: currentGame.soccerBall.x,
            y: currentGame.soccerBall.y,
          };
          currentGame._ballHasMoved = false;
        }
        const editor = document.getElementById("game-textbox");
        const runBtn = document.getElementById("run-btn");
        const clearBtn = document.getElementById("clear-btn");
        const scoreboard = document.getElementById("scoreboard");
        const start1v1Btn = document.getElementById("start-1v1-btn");
        if (window._scoreboardStarted1v1) {
          if (scoreboard) scoreboard.style.display = "block";
          if (start1v1Btn) start1v1Btn.style.display = "none";
        } else {
          if (scoreboard) scoreboard.style.display = "none";
          if (start1v1Btn) start1v1Btn.style.display = "block";
        }
        editor.style.display = "none";
        editor.contentEditable = "false";
        editor.classList.remove("enabled");
        editor.innerHTML = "";
        if (runBtn) runBtn.style.display = "none";
        if (clearBtn) clearBtn.style.display = "none";
      } else {
        // All other levels
        if (difficultyButtons) difficultyButtons.style.display = "none";
        currentGame.loadLevel(selectedLevel);
        currentGame.player.reset();
        if (currentGame.soccerBall) {
          currentGame._goalPopupShown = false;
          currentGame._goalPopupActive = false;
          currentGame._ballInitialPos = {
            x: currentGame.soccerBall.x,
            y: currentGame.soccerBall.y,
          };
          currentGame._ballHasMoved = false;
        }
        const editor = document.getElementById("game-textbox");
        const runBtn = document.getElementById("run-btn");
        const clearBtn = document.getElementById("clear-btn");
        const scoreboard = document.getElementById("scoreboard");
        const start1v1Btn = document.getElementById("start-1v1-btn");
        if (start1v1Btn) start1v1Btn.style.display = "none";
        editor.style.display = "block";
        editor.contentEditable = "true";
        editor.classList.add("enabled");
        editor.innerHTML = "";
        if (scoreboard) scoreboard.style.display = "none";
        if (runBtn) runBtn.style.display = "inline-block";
        if (clearBtn) clearBtn.style.display = "inline-block";
      }
    }
  });

  // Removed duplicate level-dropdown change event listener that always shows the textbox

  function updateLevelButtons() {
    const backBtn = document.getElementById("back-level-btn");
    const nextBtn = document.getElementById("next-level-btn");

    if (currentGame) {
      backBtn.disabled = currentGame.currentLevel === 1;
      const dropdown = document.getElementById("level-dropdown");
      const selectedValue = dropdown.value;
      // Next Level button should only be disabled for 1v1 and Bot modes
      if (selectedValue === "6" || selectedValue === "bot") {
        nextBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }
    }
  }

  window.setCurrentGame = (game) => {
    currentGame = game;
    window.currentGame = game; // Make it globally accessible
    updateLevelButtons();
  };

  // Consolidated keydown/keyup event listeners for 1v1 and bot mode
  window.addEventListener("keydown", (e) => {
    const currentGame = window.currentGame;
    // 1v1 mode: always allow movement
    if (currentGame && currentGame.currentLevel === 6) {
      currentGame.handleDefenderControls(e);
      e.preventDefault();
    }
    // Bot mode: only allow movement after Start is clicked
    if (
      currentGame &&
      currentGame.currentLevel === "bot" &&
      currentGame.botModeStarted
    ) {
      currentGame.pressedKeys.add(e.key);
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    const currentGame = window.currentGame;
    // 1v1 mode: always allow movement
    if (currentGame && currentGame.currentLevel === 6) {
      currentGame.handleDefenderControls(e);
      e.preventDefault();
    }
    // Bot mode: only allow movement after Start is clicked
    if (
      currentGame &&
      currentGame.currentLevel === "bot" &&
      currentGame.botModeStarted
    ) {
      currentGame.pressedKeys.delete(e.key);
      e.preventDefault();
    }
  });

  // Auto-start the game when page loads
  startGame();
});
