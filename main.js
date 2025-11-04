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
    this.player.x = 200;
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
    this.soccerBall.isStuck = Game.rectsOverlap(feetBox, ballBox);

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

    // Draw defenders for level 2 and 1v1 (level 6)
    if (
      (this.currentLevel === 2 || this.currentLevel === 6) &&
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
      } else if (Game.rectsOverlap(ballBox, leftGoalBox)) {
        this.defenderScore++;
        document.getElementById("score-defender").textContent =
          this.defenderScore;
      }
      // After scoring, reset the level to keep both players and ball visible
      this.loadLevel(6);
      // Keep scoreboard visible
      const scoreboard = document.getElementById("scoreboard");
      if (scoreboard) scoreboard.style.display = "block";
      // Hide textbox
      const editor = document.getElementById("game-textbox");
      if (editor) editor.style.display = "none";
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
        // Clear code box
        const editor = document.getElementById("game-textbox");
        if (editor) editor.innerHTML = "";
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
    this.player.x = 300;
    this.player.y = 220;
    this.player.startX = this.player.x;
    this.player.startY = this.player.y;

    // Add defenders for level 2 and 1v1 (level 6)
    if (level === 2) {
      // Two defenders: one left, one right of the soccer ball
      this.soccerBall.x = 430;
      this.soccerBall.y = (this.height - this.soccerBall.height) / 2;
      this.soccerBall.isStuck = false;
      // Place one defender to the left of the ball, one to the right (with clear spacing)
      const defenderWidth = 60;
      this.defenders.push(
        new Defender(this, this.soccerBall.x - defenderWidth - 30, 250)
      );
      this.defenders.push(
        new Defender(this, this.soccerBall.x + this.soccerBall.width + 30, 250)
      );
    } else if (level === 6) {
      // 1v1: main player (blue) is controlled by WASD, one defender (arrow keys)
      this.player.x = 310;
      this.player.y = 250;
      this.player.startX = this.player.x;
      this.player.startY = this.player.y;
      // Only one defender (right, controlled by arrow keys)
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

  // Reset soccer ball position (center of field)
  this.soccerBall.x = (this.width - this.soccerBall.width) / 2;
  this.soccerBall.y = (this.height - this.soccerBall.height) / 2;
  this.soccerBall.isStuck = false;

  this.isExecuting = true;

  // Split and clean user code lines
  const commands = code
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  console.log("Executing commands:", commands);

  // Execute each command sequentially
  for (const command of commands) {
    if (shouldStop && shouldStop()) break;
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (shouldStop && shouldStop()) break;

    if (command.includes("moveRight()")) {
      await this.player.moveRight();
    } else if (command.includes("moveLeft()")) {
      await this.player.moveLeft();
    } else if (command.includes("moveUp()")) {
      await this.player.moveUp();
    } else if (command.includes("moveDown()")) {
      await this.player.moveDown();
    } else if (command.includes("shootBall()")) {
      await this.player.shootBall();
    } else {
      console.warn(`Unknown command: ${command}`);
    }
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
    // Ball bump/kick on contact for both players in 1v1
    if (this.currentLevel === 6 && this.soccerBall) {
      if (!this._kickCooldown)
        this._kickCooldown = { main: false, defender: false };
      const mainFeet = this.player.getFeetBox();
      const ballBox = this.soccerBall.getBox();
      // Main player (WASD)
      const mainDir = this.getPlayerDirection("main");
      if (
        Game.rectsOverlap(mainFeet, ballBox) &&
        (mainDir.dx !== 0 || mainDir.dy !== 0)
      ) {
        // Check if player is behind the ball (can push it forward)
        const playerRight = this.player.x + this.player.width;
        const ballLeft = this.soccerBall.x;
        const isPlayerBehindBall = playerRight > ballLeft + 5; // Player is behind if overlapping/past ball

        if (!this._kickCooldown.main) {
          const kickSpeed = 14;
          let canKick = false;
          let kickDx = 0;
          let kickDy = 0;

          // Allow forward (right) movement only if behind the ball
          if (mainDir.dx > 0 && isPlayerBehindBall) {
            canKick = true;
            kickDx = mainDir.dx * kickSpeed;
          }
          // Allow backward (left) movement only if behind the ball
          else if (mainDir.dx < 0 && isPlayerBehindBall) {
            canKick = true;
            kickDx = mainDir.dx * kickSpeed;
          }
          // Always allow up/down movement regardless of position
          if (mainDir.dy !== 0) {
            canKick = true;
            kickDy = mainDir.dy * kickSpeed;
          }

          if (canKick) {
            this.soccerBall.x += kickDx;
            this.soccerBall.y += kickDy;
            this.soccerBall.x = Math.max(
              0,
              Math.min(this.width - this.soccerBall.width, this.soccerBall.x)
            );
            this.soccerBall.y = Math.max(
              0,
              Math.min(this.height - this.soccerBall.height, this.soccerBall.y)
            );
            this._kickCooldown.main = true;
            setTimeout(() => {
              this._kickCooldown.main = false;
            }, 180);
          }
        }
      } else {
        this._kickCooldown.main = false;
      }
      // Defender (arrow keys)
      if (this.defenders[0]) {
        const defFeet = this.defenders[0].getFeetBox();
        const defDir = this.getPlayerDirection("defender");
        if (
          Game.rectsOverlap(defFeet, ballBox) &&
          (defDir.dx !== 0 || defDir.dy !== 0)
        ) {
          // Check if defender is behind the ball (left side, so can push it left)
          const defenderLeft = this.defenders[0].x;
          const ballRight = this.soccerBall.x + this.soccerBall.width;
          const isDefenderBehindBall = defenderLeft < ballRight - 5; // Defender is behind if to the left

          if (!this._kickCooldown.defender) {
            const kickSpeed = 14;
            let canKick = false;
            let kickDx = 0;
            let kickDy = 0;

            // Allow backward (left) movement only if behind the ball
            if (defDir.dx < 0 && isDefenderBehindBall) {
              canKick = true;
              kickDx = defDir.dx * kickSpeed;
            }
            // Allow forward (right) movement only if behind the ball
            else if (defDir.dx > 0 && isDefenderBehindBall) {
              canKick = true;
              kickDx = defDir.dx * kickSpeed;
            }
            // Always allow up/down movement regardless of position
            if (defDir.dy !== 0) {
              canKick = true;
              kickDy = defDir.dy * kickSpeed;
            }

            if (canKick) {
              this.soccerBall.x += kickDx;
              this.soccerBall.y += kickDy;
              this.soccerBall.x = Math.max(
                0,
                Math.min(this.width - this.soccerBall.width, this.soccerBall.x)
              );
              this.soccerBall.y = Math.max(
                0,
                Math.min(
                  this.height - this.soccerBall.height,
                  this.soccerBall.y
                )
              );
              this._kickCooldown.defender = true;
              setTimeout(() => {
                this._kickCooldown.defender = false;
              }, 180);
            }
          }
        } else {
          this._kickCooldown.defender = false;
        }
      }
    }
    if (this.currentLevel !== 6) return;
    const speed = 4;
    // Main player (WASD)
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

  const selectedLevel = parseInt(
    document.getElementById("level-dropdown").value
  );
  const game = new Game(canvas);
  window.setCurrentGame(game);

  game.loadLevel(selectedLevel);

  document.getElementById("start-btn").style.display = "none";
  document.getElementById("action-buttons").style.display = "flex";

  const editor = document.getElementById("game-textbox");
  const scoreboard = document.getElementById("scoreboard");
  // Show scoreboard for 1v1, textbox for other levels
  // Hide textbox for 1v1 (6) and AI Agent (5), show for levels 1-5
  if (selectedLevel === 6 || selectedLevel === 5) {
    editor.style.display = "none";
    editor.contentEditable = "false";
    editor.classList.remove("enabled");
    if (scoreboard) scoreboard.style.display = "block";
    // Always initialize scores for 1v1 mode
    if (selectedLevel === 6 && window.currentGame) {
      window.currentGame.playerScore = 0;
      window.currentGame.defenderScore = 0;
    }
    if (selectedLevel === 6) {
      document.getElementById("score-player").textContent = "0";
      document.getElementById("score-defender").textContent = "0";
    }
  } else {
    editor.style.display = "block";
    editor.contentEditable = "true";
    editor.classList.add("enabled");
    editor.innerHTML = "";
    if (scoreboard) scoreboard.style.display = "none";
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
    // Hide textbox
    const editor = document.getElementById("game-textbox");
    if (editor) editor.style.display = "none";
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
      // Clear code box
      const editor = document.getElementById("game-textbox");
      if (editor) editor.innerHTML = "";
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
  const editor = document.getElementById("game-textbox");

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
          if (pos === -1) {
            return -1;
          }
        }
      }
      return pos;
    }

    setCaret(editor, caretPos);
  });

  editor.addEventListener("keydown", function (e) {
    if (!editor.isContentEditable) return;

    if (e.key === "(") {
      e.preventDefault();

      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);

      const node = document.createTextNode("()");
      range.deleteContents();
      range.insertNode(node);

      range.setStart(node, 1);
      range.setEnd(node, 1);

      selection.removeAllRanges();
      selection.addRange(range);

      editor.dispatchEvent(new Event("input"));
    }

    // Allow Enter key to create new lines (fix double-Enter bug)
    if (e.key === "Enter") {
      e.preventDefault();
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      // Use insertLineBreak for proper new line in contenteditable
      document.execCommand("insertLineBreak");
      // Trigger syntax highlighting
      editor.dispatchEvent(new Event("input"));
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
      updateLevelButtons();
    }
  });

  document.getElementById("back-level-btn").addEventListener("click", () => {
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
      updateLevelButtons();
    }
  });

  document.getElementById("level-dropdown").addEventListener("change", (e) => {
    const val = parseInt(e.target.value);
    const editor = document.getElementById("game-textbox");
    // Always hide textbox before Start is clicked
    editor.style.display = "none";
    editor.contentEditable = "false";
    editor.classList.remove("enabled");
    if (currentGame) {
      currentGame.loadLevel(val);
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
      // Hide and reset scoreboard if switching to code levels (1-5)
      const scoreboard = document.getElementById("scoreboard");
      if (val >= 1 && val <= 5 && scoreboard) {
        scoreboard.style.display = "none";
        document.getElementById("score-player").textContent = "0";
        document.getElementById("score-defender").textContent = "0";
      }
      updateLevelButtons();
    }
  });

  function updateLevelButtons() {
    const backBtn = document.getElementById("back-level-btn");
    const nextBtn = document.getElementById("next-level-btn");

    if (currentGame) {
      backBtn.disabled = currentGame.currentLevel === 1;
      nextBtn.disabled = currentGame.currentLevel === 5;
    }
  }

  window.setCurrentGame = (game) => {
    currentGame = game;
    window.currentGame = game; // Make it globally accessible
    updateLevelButtons();
  };

  // WASD/Arrow controls for defenders in 1v1 (level 6), only after game is started
  window.addEventListener("keydown", (e) => {
    const currentGame = window.currentGame;
    if (currentGame && currentGame.currentLevel === 6) {
      currentGame.handleDefenderControls(e);
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    const currentGame = window.currentGame;
    if (currentGame && currentGame.currentLevel === 6) {
      currentGame.handleDefenderControls(e);
      e.preventDefault();
    }
  });

  // Smooth movement for 1v1 (level 6)
  window.addEventListener("keydown", (e) => {
    const currentGame = window.currentGame;
    if (currentGame && currentGame.currentLevel === 6) {
      currentGame.handleDefenderControls(e);
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    const currentGame = window.currentGame;
    if (currentGame && currentGame.currentLevel === 6) {
      currentGame.handleDefenderControls(e);
      e.preventDefault();
    }
  });
});
