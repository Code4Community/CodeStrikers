// ============================================
// MAIN.JS - Core Game Classes and Logic
// ============================================

class SoccerBall {
  stickToPlayer(player) {
    const feet = player.getFeetBox();
    this.x = feet.x + (feet.width - this.width) / 2;
    this.y = feet.y + feet.height - this.height / 2;
    this.x = Math.max(0, Math.min(this.x, this.game.width - this.width));
    this.y = Math.max(0, Math.min(this.y, this.game.height - this.height));
  }

  constructor(game) {
    this.game = game;
    this.width = 25;
    this.height = 25;
    this.x = (game.width - this.width) / 2;
    this.y = (game.height - this.height) / 2;
    this.image = document.getElementById("soccer-ball");
    this.isStuck = false;
  }

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

  inFront(defender) {
    const verticalThreshold = 100;
    return (
      defender.x > this.x + this.width &&
      Math.abs(defender.y - this.y) < verticalThreshold
    );
  }

  getBox() {
    const boxSize = this.width * 0.7;
    return {
      x: this.x + (this.width - boxSize) / 2,
      y: this.y + (this.height - boxSize) / 2,
      width: boxSize,
      height: boxSize,
    };
  }

  constructor(game, x, y) {
    this.game = game;
    this.width = 50;
    this.height = 100;
    this.x = x !== undefined ? x : 100;
    this.y = y !== undefined ? y : 100;
    this.startX = this.x;
    this.startY = this.y;
    this.speed = 55;
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
    if (this.game.soccerBall.isStuck) {
      this.game.soccerBall.isStuck = false;
      this.game.soccerBall._isShooting = true; // Prevent re-sticking during shot
      const ball = this.game.soccerBall;
      const spaces = this.speed * 4;
      const frames = 16;
      const dx = spaces / frames;
      for (let i = 0; i < frames; i++) {
        ball.x += dx;
        ball._rollingAngle = (ball._rollingAngle || 0) + Math.PI / 8;
        ball.x = Math.min(ball.x, this.game.width - ball.width);
        await new Promise((r) => setTimeout(r, 20));
      }
      ball._rollingAngle = 0;
      ball._isShooting = false; // Allow collision detection again
      console.log("Ball shot!");
    } else {
      console.log("Cannot shoot - ball is not stuck to player!");
    }
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    // No auto-movement - controlled by user code
  }
}

class Defender {
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
    const newX = Math.max(
      0,
      Math.min(this.x + dx, this.game.width - this.width)
    );
    const newY = Math.max(
      0,
      Math.min(this.y + dy, this.game.height - this.height)
    );

    // Only move if not colliding with goaler
    if (!this.game.wouldCollideWithGoaler(this, newX, newY)) {
      this.x = newX;
      this.y = newY;
    }
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
    this.image = document.getElementById("soccer-goal");
    this.side = side;
    this.width = 120;
    this.height = 200;
    const edgeOffset = -15;
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
        context.save();
        context.translate(this.x + this.width, this.y);
        context.scale(-1, 1);
        context.drawImage(this.image, 0, 0, this.width, this.height);
        context.restore();
      } else {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
      context.restore();
    }
  }
}

class Game {
  static rectsOverlap(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  wouldCollideWithGoaler(entity, newX, newY) {
    // Create a temporary box with the new position
    // Shrink the collision box by 20 pixels on each side
    const shrinkAmount = 20;
    const tempBox = {
      x: newX + shrinkAmount,
      y: newY + shrinkAmount,
      width: entity.width - shrinkAmount * 2,
      height: entity.height - shrinkAmount * 2,
    };

    // Check collision with left goalers
    if (this.goalersLeft && this.goalersLeft.length > 0) {
      for (let goaler of this.goalersLeft) {
        const goalerBox = {
          x: goaler.x + shrinkAmount,
          y: goaler.y + shrinkAmount,
          width: goaler.width - shrinkAmount * 2,
          height: goaler.height - shrinkAmount * 2,
        };
        if (Game.rectsOverlap(tempBox, goalerBox)) {
          return true;
        }
      }
    }

    // Check collision with right goalers
    if (this.goalersRight && this.goalersRight.length > 0) {
      for (let goaler of this.goalersRight) {
        const goalerBox = {
          x: goaler.x + shrinkAmount,
          y: goaler.y + shrinkAmount,
          width: goaler.width - shrinkAmount * 2,
          height: goaler.height - shrinkAmount * 2,
        };
        if (Game.rectsOverlap(tempBox, goalerBox)) {
          return true;
        }
      }
    }

    return false;
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
    this.goalersLeft = []; // Blue team goalers (left goal)
    this.goalersRight = []; // Red team goalers (right goal)
    this.goalersEnabled = false;
    this.player.x = 100;
    this.player.y = 270;
    this.player.startX = this.player.x;
    this.player.startY = this.player.y;
    this.isExecuting = false;
    this.pressedKeys = new Set();
    this.isBallRolling = false; // Prevent repeated spacebar triggers
  }

  getPlayerDirection(playerType) {
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

  render(context) {
    this.fieldLeft.draw(context);
    this.fieldRight.draw(context);

    // Collision detection
    const ballBox = this.soccerBall.getBox();
    let playerFeetBox = this.player.getFeetBox();
    let defenderFeetBox = null;
    if (
      (this.currentLevel === 6 ||
        this.currentLevel === 7 ||
        this.currentLevel === "bot") &&
      this.defenders[0]
    ) {
      defenderFeetBox = this.defenders[0].getFeetBox();
    }

    // Prevent ball from re-sticking during roll animation
    if (this.isBallRolling) {
      // Allow interception during roll - opposing player can steal the ball
      if (this.currentLevel === 6) {
        // 1v1 mode: check if opposing player touches the ball during roll
        if (
          this.soccerBall._lastShooter === "player" &&
          defenderFeetBox &&
          Game.rectsOverlap(defenderFeetBox, ballBox)
        ) {
          // Defender intercepts player's shot
          this.isBallRolling = false;
          this._stopBallAnimation = true;
          this.soccerBall._possessedBy = "defender";
          this.soccerBall.isStuck = true;
          this.soccerBall.stickToPlayer(this.defenders[0]);
        } else if (
          this.soccerBall._lastShooter === "defender" &&
          Game.rectsOverlap(playerFeetBox, ballBox)
        ) {
          // Player intercepts defender's shot
          this.isBallRolling = false;
          this._defender1v1Shooting = false;
          this._stopBallAnimation = true;
          this.soccerBall._possessedBy = "player";
          this.soccerBall.isStuck = true;
          this.soccerBall.stickToPlayer(this.player);
        }
      } else if (this.currentLevel === "bot") {
        // Bot mode: check if player can intercept bot's shot or bot can intercept player's shot
        if (
          this.soccerBall._lastShooter === "player" &&
          defenderFeetBox &&
          Game.rectsOverlap(defenderFeetBox, ballBox)
        ) {
          // Bot intercepts player's shot
          this.isBallRolling = false;
          this._stopBallAnimation = true;
          this.soccerBall._possessedBy = "defender";
          this.soccerBall.isStuck = true;
          this.soccerBall.stickToPlayer(this.defenders[0]);
        } else if (
          this.soccerBall._lastShooter === "defender" &&
          Game.rectsOverlap(playerFeetBox, ballBox)
        ) {
          // Player intercepts bot's shot
          this._botShooting = false;
          this._stopBallAnimation = true;
          this.soccerBall._possessedBy = "player";
          this.soccerBall.isStuck = true;
          this.soccerBall.stickToPlayer(this.player);
        }
      }
    } else if (this._botShooting) {
      // Do nothing: bot is shooting, ignore all stick logic
    } else if (this._defender1v1Shooting) {
      // Do nothing: defender is shooting in 1v1, ignore all stick logic
    } else if (this.currentLevel === 6) {
      // 1v1 mode: both players can possess the ball
      if (!this.soccerBall._possessedBy) {
        if (Game.rectsOverlap(playerFeetBox, ballBox)) {
          this.soccerBall._possessedBy = "player";
        } else if (
          defenderFeetBox &&
          Game.rectsOverlap(defenderFeetBox, ballBox)
        ) {
          this.soccerBall._possessedBy = "defender";
        }
      } else {
        // Allow stealing the ball
        if (
          this.soccerBall._possessedBy === "player" &&
          defenderFeetBox &&
          Game.rectsOverlap(defenderFeetBox, ballBox)
        ) {
          this.soccerBall._possessedBy = "defender";
        } else if (
          this.soccerBall._possessedBy === "defender" &&
          Game.rectsOverlap(playerFeetBox, ballBox)
        ) {
          this.soccerBall._possessedBy = "player";
        }
      }
      if (this.soccerBall._possessedBy === "player") {
        this.soccerBall.isStuck = true;
        this.soccerBall.stickToPlayer(this.player);
      } else if (
        this.soccerBall._possessedBy === "defender" &&
        this.defenders[0]
      ) {
        this.soccerBall.isStuck = true;
        this.soccerBall.stickToPlayer(this.defenders[0]);
      } else {
        this.soccerBall.isStuck = false;
      }
    } else if (this.currentLevel === 7 || this.currentLevel === "bot") {
      if (!this.soccerBall._possessedBy) {
        if (Game.rectsOverlap(playerFeetBox, ballBox)) {
          this.soccerBall._possessedBy = "player";
        } else if (
          defenderFeetBox &&
          Game.rectsOverlap(defenderFeetBox, ballBox)
        ) {
          this.soccerBall._possessedBy = "defender";
        }
      } else {
        if (
          this.soccerBall._possessedBy === "player" &&
          defenderFeetBox &&
          Game.rectsOverlap(defenderFeetBox, ballBox)
        ) {
          this.soccerBall._possessedBy = "defender";
        } else if (
          this.soccerBall._possessedBy === "defender" &&
          Game.rectsOverlap(playerFeetBox, ballBox)
        ) {
          this.soccerBall._possessedBy = "player";
        }
      }
      if (this.soccerBall._possessedBy === "player") {
        this.soccerBall.isStuck = true;
        this.soccerBall.stickToPlayer(this.player);
      } else if (
        this.soccerBall._possessedBy === "defender" &&
        this.defenders[0]
      ) {
        this.soccerBall.isStuck = true;
        this.soccerBall.stickToPlayer(this.defenders[0]);
      } else {
        this.soccerBall.isStuck = false;
      }
    } else {
      if (!this.soccerBall._isShooting) {
        this.soccerBall.isStuck = Game.rectsOverlap(playerFeetBox, ballBox);
        if (this.soccerBall.isStuck) {
          this.soccerBall.stickToPlayer(this.player);
        }
      }
      this.soccerBall._possessedBy = undefined;
    }

    // Goaler collision detection - ball sticks to any part of goaler's body
    // Skip collision if a goaler is actively passing (with cooldown)
    if (
      this.goalersEnabled &&
      !this.soccerBall.isStuck &&
      !this._goalerLeftPassing &&
      !this._goalerRightPassing
    ) {
      const ballBox = this.soccerBall.getBox();

      // Check left goalers (blue team)
      if (this.goalersLeft && this.goalersLeft.length > 0) {
        for (const goaler of this.goalersLeft) {
          const goalerBox = {
            x: goaler.x,
            y: goaler.y,
            width: goaler.width,
            height: goaler.height,
          };

          if (Game.rectsOverlap(ballBox, goalerBox)) {
            this.isBallRolling = false;
            this._stopBallAnimation = true;
            this.soccerBall.isStuck = true;
            this.soccerBall._possessedBy = "goaler-left";
            this.soccerBall.stickToPlayer(goaler);
            break;
          }
        }
      }

      // Check right goalers (red team)
      if (
        this.goalersRight &&
        this.goalersRight.length > 0 &&
        !this.soccerBall.isStuck
      ) {
        for (const goaler of this.goalersRight) {
          const goalerBox = {
            x: goaler.x,
            y: goaler.y,
            width: goaler.width,
            height: goaler.height,
          };

          if (Game.rectsOverlap(ballBox, goalerBox)) {
            this.isBallRolling = false;
            this._stopBallAnimation = true;
            this.soccerBall.isStuck = true;
            this.soccerBall._possessedBy = "goaler-right";
            this.soccerBall.stickToPlayer(goaler);
            break;
          }
        }
      }
    }

    // Goal collision detection
    const goalInset = 49;
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

    if (typeof this._goalPopupShown === "undefined") {
      this._goalPopupShown = false;
      this._goalPopupActive = false;
      this._ballInitialPos = { x: this.soccerBall.x, y: this.soccerBall.y };
      this._ballHasMoved = false;
    }

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

    if (!ballInGoal) {
      this._goalPopupShown = false;
      this._goalPopupActive = false;
    }

    // Draw defenders
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
    // Draw goalers if enabled
    if (this.goalersLeft && this.goalersLeft.length > 0) {
      this.goalersLeft.forEach((goaler) => goaler.draw(context));
    }
    if (this.goalersRight && this.goalersRight.length > 0) {
      this.goalersRight.forEach((goaler) => goaler.draw(context));
    }
    this.player.draw(context);
    this.soccerBall.draw(context);
    this.updateGoalerAI();
    this.player.update();
  }

  showGameOverPopup(winner) {
    if (document.getElementById("game-over-popup")) return;

    // Set game over flag to stop bot movement
    this.isGameOver = true;

    // Stop all timers
    if (window._timerInterval) {
      clearInterval(window._timerInterval);
    }
    if (window._freeplayTimerInterval) {
      clearInterval(window._freeplayTimerInterval);
    }

    const popup = document.createElement("div");
    popup.id = "game-over-popup";
    popup.className = "goal-popup";
    popup.innerHTML = `
      <div class="goal-popup-content">
        <h2 class="goal-unique-effect">${
          winner === "tie"
            ? "It's a Tie!"
            : winner === "player"
            ? "You Win!"
            : "Bot Wins!"
        }</h2>
        <p>Final Score: ${this.playerScore || 0} - ${
      this.defenderScore || 0
    }</p>
        <button id="play-again-btn" class="green-btn">Play Again</button>
        <button id="close-game-over-btn" class="red-btn">Close</button>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById("play-again-btn").onclick = () => {
      popup.remove();

      // Reset game state
      this.isGameOver = false;
      this.playerScore = 0;
      this.defenderScore = 0;
      this._defensivePassCount = 0;

      // Update scoreboard
      document.getElementById("score-player").textContent = "0";
      document.getElementById("score-defender").textContent = "0";

      // Restart the game mode (timers, etc.)
      const modeSelectedBtn = window._currentModeBtn;
      if (modeSelectedBtn && window.setupGameMode) {
        window.setupGameMode(modeSelectedBtn);
      }

      // Reset the level/ball position
      this.loadLevel("bot");
    };

    document.getElementById("close-game-over-btn").onclick = () => {
      popup.remove();

      // Reset game state
      this.isGameOver = false;
      this.botModeStarted = false;
      this.playerScore = 0;
      this.defenderScore = 0;
      this._defensivePassCount = 0;

      // Reset scoreboard
      document.getElementById("score-player").textContent = "0";
      document.getElementById("score-defender").textContent = "0";

      // Clear stored settings
      window._currentModeBtn = null;
      window._targetScore = undefined;

      // Stop all timers
      if (window._timerInterval) {
        clearInterval(window._timerInterval);
        window._timerInterval = null;
      }
      if (window._freeplayTimerInterval) {
        clearInterval(window._freeplayTimerInterval);
        window._freeplayTimerInterval = null;
      }

      // Hide all timer/score displays
      const targetScoreContainer = document.getElementById(
        "targetscore-container"
      );
      const timerContainer = document.getElementById("timer-container");
      const freeplayTimerContainer = document.getElementById(
        "freeplay-timer-container"
      );
      if (targetScoreContainer) targetScoreContainer.style.display = "none";
      if (timerContainer) timerContainer.style.display = "none";
      if (freeplayTimerContainer) freeplayTimerContainer.style.display = "none";

      // Show start UI again
      if (window.showStartUI) {
        window.showStartUI();
      }

      // Reset the level/ball position
      this.loadLevel("bot");
    };
  }

  showFreeplayEndPopup(timePlayed) {
    if (document.getElementById("game-over-popup")) return;

    // Set game over flag to stop bot movement
    this.isGameOver = true;

    // Stop all timers
    if (window._freeplayTimerInterval) {
      clearInterval(window._freeplayTimerInterval);
    }

    const popup = document.createElement("div");
    popup.id = "game-over-popup";
    popup.className = "goal-popup";
    popup.innerHTML = `
      <div class="goal-popup-content">
        <h2 class="goal-unique-effect">Game Ended!</h2>
        <p>Time Played: ${timePlayed}</p>
        <p>Final Score: ${this.playerScore || 0} - ${
      this.defenderScore || 0
    }</p>
        <button id="play-again-btn" class="green-btn">Play Again</button>
        <button id="close-game-over-btn" class="red-btn">Close</button>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById("play-again-btn").onclick = () => {
      popup.remove();

      // Reset game state
      this.isGameOver = false;
      this.playerScore = 0;
      this.defenderScore = 0;
      this._defensivePassCount = 0;

      // Update scoreboard
      document.getElementById("score-player").textContent = "0";
      document.getElementById("score-defender").textContent = "0";

      // Restart the game mode (timers, etc.)
      const modeSelectedBtn = window._currentModeBtn;
      if (modeSelectedBtn && window.setupGameMode) {
        window.setupGameMode(modeSelectedBtn);
      }

      // Reset the level/ball position
      this.loadLevel("bot");
    };

    document.getElementById("close-game-over-btn").onclick = () => {
      popup.remove();

      // Reset game state
      this.isGameOver = false;
      this.botModeStarted = false;
      this.playerScore = 0;
      this.defenderScore = 0;
      this._defensivePassCount = 0;

      // Reset scoreboard
      document.getElementById("score-player").textContent = "0";
      document.getElementById("score-defender").textContent = "0";

      // Clear stored settings
      window._currentModeBtn = null;
      window._targetScore = undefined;

      // Stop all timers
      if (window._freeplayTimerInterval) {
        clearInterval(window._freeplayTimerInterval);
        window._freeplayTimerInterval = null;
      }

      // Hide all timer/score displays
      const targetScoreContainer = document.getElementById(
        "targetscore-container"
      );
      const timerContainer = document.getElementById("timer-container");
      const freeplayTimerContainer = document.getElementById(
        "freeplay-timer-container"
      );
      const endGameBtn = document.getElementById("end-game-btn");
      if (targetScoreContainer) targetScoreContainer.style.display = "none";
      if (timerContainer) timerContainer.style.display = "none";
      if (freeplayTimerContainer) freeplayTimerContainer.style.display = "none";
      if (endGameBtn) endGameBtn.style.display = "none";

      // Show start UI again
      if (window.showStartUI) {
        window.showStartUI();
      }

      // Reset the level/ball position
      this.loadLevel("bot");
    };
  }

  showGameOverPopup1v1(winner) {
    if (document.getElementById("game-over-popup")) return;

    // Set game over flag
    this.isGameOver = true;

    // Stop all timers
    if (window._timerInterval) {
      clearInterval(window._timerInterval);
    }
    if (window._freeplayTimerInterval) {
      clearInterval(window._freeplayTimerInterval);
    }

    const popup = document.createElement("div");
    popup.id = "game-over-popup";
    popup.className = "goal-popup";
    popup.innerHTML = `
      <div class="goal-popup-content">
        <h2 class="goal-unique-effect">${
          winner === "tie"
            ? "It's a Tie!"
            : winner === "player"
            ? "Player Wins!"
            : "Defender Wins!"
        }</h2>
        <p>Final Score: ${this.playerScore || 0} - ${
      this.defenderScore || 0
    }</p>
        <button id="play-again-btn" class="green-btn">Play Again</button>
        <button id="close-game-over-btn" class="red-btn">Close</button>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById("play-again-btn").onclick = () => {
      popup.remove();

      // Reset game state
      this.isGameOver = false;
      this.playerScore = 0;
      this.defenderScore = 0;

      // Update scoreboard
      document.getElementById("score-player").textContent = "0";
      document.getElementById("score-defender").textContent = "0";

      // Restart the game mode (timers, etc.)
      const modeSelectedBtn = window._currentModeBtn1v1;
      if (modeSelectedBtn && window.setupGameMode1v1) {
        window.setupGameMode1v1(modeSelectedBtn);
      }

      // Reset the level/ball position
      this.loadLevel(6);
    };

    document.getElementById("close-game-over-btn").onclick = () => {
      popup.remove();

      // Reset game state
      this.isGameOver = false;
      this.mode1v1Started = false;
      this.playerScore = 0;
      this.defenderScore = 0;

      // Reset scoreboard
      document.getElementById("score-player").textContent = "0";
      document.getElementById("score-defender").textContent = "0";

      // Clear stored settings
      window._currentModeBtn1v1 = null;
      window._targetScore = undefined;

      // Stop all timers
      if (window._timerInterval) {
        clearInterval(window._timerInterval);
        window._timerInterval = null;
      }
      if (window._freeplayTimerInterval) {
        clearInterval(window._freeplayTimerInterval);
        window._freeplayTimerInterval = null;
      }

      // Hide all timer/score displays
      const targetScoreContainer = document.getElementById(
        "targetscore-container"
      );
      const timerContainer = document.getElementById("timer-container");
      const freeplayTimerContainer = document.getElementById(
        "freeplay-timer-container"
      );
      if (targetScoreContainer) targetScoreContainer.style.display = "none";
      if (timerContainer) timerContainer.style.display = "none";
      if (freeplayTimerContainer) freeplayTimerContainer.style.display = "none";

      // Show start UI again
      if (window.show1v1StartUI) {
        window.show1v1StartUI();
      }

      // Reset the level/ball position
      this.loadLevel(6);
    };
  }

  showFreeplayEndPopup1v1(timePlayed) {
    if (document.getElementById("game-over-popup")) return;

    // Set game over flag
    this.isGameOver = true;

    // Stop all timers
    if (window._freeplayTimerInterval) {
      clearInterval(window._freeplayTimerInterval);
    }

    const popup = document.createElement("div");
    popup.id = "game-over-popup";
    popup.className = "goal-popup";
    popup.innerHTML = `
      <div class="goal-popup-content">
        <h2 class="goal-unique-effect">Game Ended!</h2>
        <p>Time Played: ${timePlayed}</p>
        <p>Final Score: ${this.playerScore || 0} - ${
      this.defenderScore || 0
    }</p>
        <button id="play-again-btn" class="green-btn">Play Again</button>
        <button id="close-game-over-btn" class="red-btn">Close</button>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById("play-again-btn").onclick = () => {
      popup.remove();

      // Reset game state
      this.isGameOver = false;
      this.playerScore = 0;
      this.defenderScore = 0;

      // Update scoreboard
      document.getElementById("score-player").textContent = "0";
      document.getElementById("score-defender").textContent = "0";

      // Restart the game mode (timers, etc.)
      const modeSelectedBtn = window._currentModeBtn1v1;
      if (modeSelectedBtn && window.setupGameMode1v1) {
        window.setupGameMode1v1(modeSelectedBtn);
      }

      // Reset the level/ball position
      this.loadLevel(6);
    };

    document.getElementById("close-game-over-btn").onclick = () => {
      popup.remove();

      // Reset game state
      this.isGameOver = false;
      this.mode1v1Started = false;
      this.playerScore = 0;
      this.defenderScore = 0;

      // Reset scoreboard
      document.getElementById("score-player").textContent = "0";
      document.getElementById("score-defender").textContent = "0";

      // Clear stored settings
      window._currentModeBtn1v1 = null;
      window._targetScore = undefined;

      // Stop all timers
      if (window._freeplayTimerInterval) {
        clearInterval(window._freeplayTimerInterval);
        window._freeplayTimerInterval = null;
      }

      // Hide all timer/score displays
      const targetScoreContainer = document.getElementById(
        "targetscore-container"
      );
      const timerContainer = document.getElementById("timer-container");
      const freeplayTimerContainer = document.getElementById(
        "freeplay-timer-container"
      );
      const endGameBtn = document.getElementById("end-game-btn");
      if (targetScoreContainer) targetScoreContainer.style.display = "none";
      if (timerContainer) timerContainer.style.display = "none";
      if (freeplayTimerContainer) freeplayTimerContainer.style.display = "none";
      if (endGameBtn) endGameBtn.style.display = "none";

      // Show start UI again
      if (window.show1v1StartUI) {
        window.show1v1StartUI();
      }

      // Reset the level/ball position
      this.loadLevel(6);
    };
  }

  showGoalPopup() {
    if (document.getElementById("goal-popup")) return;
    if (this.currentLevel === 6) {
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
        this.playerScore = (this.playerScore || 0) + 1;
        document.getElementById("score-player").textContent = this.playerScore;

        // Check if player won by reaching target score (not in freeplay mode)
        if (
          window._targetScore &&
          this.playerScore >= window._targetScore &&
          !window._freeplayTimerInterval
        ) {
          this.showGameOverPopup1v1("player");
          return;
        }
      } else if (Game.rectsOverlap(ballBox, leftGoalBox)) {
        this.defenderScore = (this.defenderScore || 0) + 1;
        document.getElementById("score-defender").textContent =
          this.defenderScore;

        // Check if defender won by reaching target score (not in freeplay mode)
        if (
          window._targetScore &&
          this.defenderScore >= window._targetScore &&
          !window._freeplayTimerInterval
        ) {
          this.showGameOverPopup1v1("defender");
          return;
        }
      }
      this.loadLevel(6);
      const scoreboard = document.getElementById("scoreboard");
      if (scoreboard) scoreboard.style.display = "block";
      return;
    }
    // Do NOT show popup for bot mode
    if (this.currentLevel === "bot") {
      // Stop any ongoing ball rolling animation
      this._stopBallAnimation = true;
      this.isBallRolling = false;
      this.soccerBall._rollingAngle = 0;

      // Unstick the ball and reset possession
      this.soccerBall.isStuck = false;
      this.soccerBall._possessedBy = undefined;

      // Reset defensive pass counter for impossible mode
      this._defensivePassCount = 0;

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
        this.playerScore = (this.playerScore || 0) + 1;
        document.getElementById("score-player").textContent = this.playerScore;

        // Check if player won by reaching target score (not in freeplay mode)
        if (
          window._targetScore &&
          this.playerScore >= window._targetScore &&
          !window._freeplayTimerInterval
        ) {
          this.showGameOverPopup("player");
          return;
        }
      } else if (Game.rectsOverlap(ballBox, leftGoalBox)) {
        this.defenderScore = (this.defenderScore || 0) + 1;
        document.getElementById("score-defender").textContent =
          this.defenderScore;

        // Check if bot won by reaching target score (not in freeplay mode)
        if (
          window._targetScore &&
          this.defenderScore >= window._targetScore &&
          !window._freeplayTimerInterval
        ) {
          this.showGameOverPopup("bot");
          return;
        }
      }

      // Check if timer reached 0 in timed mode (not in freeplay)
      const timerValue = document.getElementById("timer-value");
      if (
        timerValue &&
        timerValue.textContent === "0:00" &&
        !window._freeplayTimerInterval
      ) {
        // Determine winner by score
        const playerScore = this.playerScore || 0;
        const defenderScore = this.defenderScore || 0;
        const winner =
          playerScore > defenderScore
            ? "player"
            : playerScore < defenderScore
            ? "bot"
            : "tie";
        this.showGameOverPopup(winner);
        return;
      }

      this.loadLevel("bot");
      const scoreboard = document.getElementById("scoreboard");
      if (scoreboard) scoreboard.style.display = "block";
      return;
    }

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
        const editor = document.getElementById("game-textbox");
        if (editor) {
          editor.innerHTML = "";
          editor.style.display = "block";
          editor.contentEditable = "true";
          editor.classList.add("enabled");
        }
        const dropdown = document.getElementById("level-dropdown");
        if (dropdown) dropdown.value = nextLevel;
      }
    };
    document.getElementById("close-popup-btn").onclick = () => {
      popup.remove();
    };
  }

  loadLevel(level) {
    // Import loadLevel from levels.js
    if (window.LevelManager) {
      window.LevelManager.loadLevel(this, level);
    }
  }

  addGoalers() {
    // Clear existing goalers
    this.goalersLeft = [];
    this.goalersRight = [];
    this.goalersEnabled = true;

    // Position goalers in front of their respective goals
    // Left goal goaler (blue team) - positioned closer to left goal
    const leftGoalerX = 50; // Closer to left goal
    const leftGoalerY = (this.height - 70) / 2 - 30; // Centered vertically and raised up
    this.goalersLeft.push(new Player(this, leftGoalerX, leftGoalerY));

    // Right goal goaler (red team) - positioned closer to right goal
    const rightGoalerX = this.width - 110; // Closer to right goal
    const rightGoalerY = (this.height - 70) / 2; // Centered vertically
    this.goalersRight.push(new Defender(this, rightGoalerX, rightGoalerY));
  }

  removeGoalers() {
    this.goalersLeft = [];
    this.goalersRight = [];
    this.goalersEnabled = false;
  }

  async executeUserCode(code, shouldStop) {
    if (this.isExecuting) {
      alert("Code is already running!");
      return;
    }

    this.player.reset();

    if (this.currentLevel === 3) {
      this.soccerBall.x = (this.width - this.soccerBall.width) / 2;
      this.soccerBall.y = (this.height - this.soccerBall.height) / 2;
    } else {
      this.soccerBall.x = (this.width - this.soccerBall.width) / 2;
      this.soccerBall.y = (this.height - this.soccerBall.height) / 2;
    }
    this.soccerBall.isStuck = false;

    this.isExecuting = true;

    const game = this;
    const player = this.player;
    const defenders = this.defenders;

    const userFunctions = {
      moveRight: async function () {
        await player.moveRight();
        // Add pause after movement
        await new Promise((resolve) => setTimeout(resolve, 300));
      },
      moveLeft: async function () {
        await player.moveLeft();
        // Add pause after movement
        await new Promise((resolve) => setTimeout(resolve, 300));
      },
      moveUp: async function () {
        await player.moveUp();
        // Add pause after movement
        await new Promise((resolve) => setTimeout(resolve, 300));
      },
      moveDown: async function () {
        await player.moveDown();
        // Add pause after movement
        await new Promise((resolve) => setTimeout(resolve, 300));
      },
      shootBall: async function () {
        await player.shootBall();
        // Add pause after shooting
        await new Promise((resolve) => setTimeout(resolve, 300));
      },
      inFront: function (defenderIndex) {
        if (defenderIndex >= 0 && defenderIndex < defenders.length) {
          return player.inFront(defenders[defenderIndex]);
        }
        return false;
      },
    };

    try {
      let safeCode = code
        .replace(/([^a-zA-Z0-9_])?moveRight\s*\(/g, "$1await moveRight(")
        .replace(/([^a-zA-Z0-9_])?moveLeft\s*\(/g, "$1await moveLeft(")
        .replace(/([^a-zA-Z0-9_])?moveUp\s*\(/g, "$1await moveUp(")
        .replace(/([^a-zA-Z0-9_])?moveDown\s*\(/g, "$1await moveDown(")
        .replace(/([^a-zA-Z0-9_])?shootBall\s*\(/g, "$1await shootBall(");

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
    if (this.currentLevel !== 6) return;
    if (e.type === "keydown") {
      this.pressedKeys.add(e.key);
    } else if (e.type === "keyup") {
      this.pressedKeys.delete(e.key);
    }
  }

  updateSmoothMovement() {
    if (this.currentLevel === 6 && this.mode1v1Started) {
      // Check if timer reached 0 in timed mode (only check if timer is actually being used and not in freeplay)
      const timerContainer = document.getElementById("timer-container");
      const timerValue = document.getElementById("timer-value");
      if (
        timerContainer &&
        timerContainer.style.display !== "none" &&
        timerValue &&
        timerValue.textContent === "0:00" &&
        !document.getElementById("game-over-popup") &&
        !window._freeplayTimerInterval
      ) {
        // Determine winner by score (or declare tie)
        const playerScore = this.playerScore || 0;
        const defenderScore = this.defenderScore || 0;
        const winner =
          playerScore > defenderScore
            ? "player"
            : playerScore < defenderScore
            ? "defender"
            : "tie";
        this.showGameOverPopup1v1(winner);
        return;
      }

      const speed = 4;
      let dx = 0,
        dy = 0;
      if (this.pressedKeys.has("a") || this.pressedKeys.has("A")) dx -= speed;
      if (this.pressedKeys.has("d") || this.pressedKeys.has("D")) dx += speed;
      if (this.pressedKeys.has("w") || this.pressedKeys.has("W")) dy -= speed;
      if (this.pressedKeys.has("s") || this.pressedKeys.has("S")) dy += speed;
      if (dx !== 0 || dy !== 0) {
        const newX = Math.max(
          0,
          Math.min(this.width - this.player.width, this.player.x + dx)
        );
        const newY = Math.max(
          0,
          Math.min(this.height - this.player.height, this.player.y + dy)
        );
        // Only move if not colliding with goaler
        if (!this.wouldCollideWithGoaler(this.player, newX, newY)) {
          this.player.x = newX;
          this.player.y = newY;
        }
      }
      dx = 0;
      dy = 0;
      if (this.pressedKeys.has("ArrowLeft")) dx -= speed;
      if (this.pressedKeys.has("ArrowRight")) dx += speed;
      if (this.pressedKeys.has("ArrowUp")) dy -= speed;
      if (this.pressedKeys.has("ArrowDown")) dy += speed;
      if ((dx !== 0 || dy !== 0) && this.defenders[0]) {
        const newX = Math.max(
          0,
          Math.min(
            this.width - this.defenders[0].width,
            this.defenders[0].x + dx
          )
        );
        const newY = Math.max(
          0,
          Math.min(
            this.height - this.defenders[0].height,
            this.defenders[0].y + dy
          )
        );
        // Only move if not colliding with goaler
        if (!this.wouldCollideWithGoaler(this.defenders[0], newX, newY)) {
          this.defenders[0].x = newX;
          this.defenders[0].y = newY;
        }
      }

      // Space key shoot logic for blue player (WASD)
      if (
        this.pressedKeys.has(" ") &&
        !this.isBallRolling &&
        !this._defender1v1Shooting
      ) {
        // Only allow shoot if ball is stuck to player AND player has possession
        if (
          this.soccerBall.isStuck &&
          this.soccerBall._possessedBy === "player"
        ) {
          this.isBallRolling = true;
          this.soccerBall._lastShooter = "player"; // Track who shot the ball
          // Set ball position to player's feet before rolling
          const feet = this.player.getFeetBox();
          this.soccerBall.x = feet.x + (feet.width - this.soccerBall.width) / 2;
          this.soccerBall.y = feet.y + feet.height - this.soccerBall.height / 2;
          this.soccerBall.isStuck = false;
          this.soccerBall._possessedBy = undefined;
          const ball = this.soccerBall;
          const spaces = this.player.speed * 4;
          const frames = 32;
          let dxBall = spaces / frames;
          let speed = dxBall * 0.9; // Reduced shooting distance
          let frameCount = 0;
          const game = this;
          function animateRoll() {
            // Stop animation if goal was scored or game was reset
            if (frameCount < frames && !game._stopBallAnimation) {
              ball.x += speed;
              ball._rollingAngle = (ball._rollingAngle || 0) + Math.PI / 10;
              ball.x = Math.min(ball.x, ball.game.width - ball.width);
              speed *= 0.97; // Decelerate
              frameCount++;
              requestAnimationFrame(animateRoll);
            } else {
              ball._rollingAngle = 0;
              // Allow future rolls
              if (ball.game) {
                ball.game.isBallRolling = false;
                ball.game._stopBallAnimation = false;
              }
            }
          }
          animateRoll();
        }
        // Remove space key so it doesn't repeat
        this.pressedKeys.delete(" ");
      }

      // M key shoot logic for red player (Arrow keys)
      if (
        (this.pressedKeys.has("m") || this.pressedKeys.has("M")) &&
        !this.isBallRolling &&
        !this._defender1v1Shooting
      ) {
        // Only allow shoot if ball is stuck to defender AND defender has possession
        if (
          this.soccerBall.isStuck &&
          this.soccerBall._possessedBy === "defender" &&
          this.defenders[0]
        ) {
          this.isBallRolling = true;
          this._defender1v1Shooting = true;
          this.soccerBall._lastShooter = "defender"; // Track who shot the ball
          // Set ball position to defender's feet before rolling
          const feet = this.defenders[0].getFeetBox();
          this.soccerBall.x = feet.x + (feet.width - this.soccerBall.width) / 2;
          this.soccerBall.y = feet.y + feet.height - this.soccerBall.height / 2;
          this.soccerBall.isStuck = false;
          this.soccerBall._possessedBy = undefined;
          const ball = this.soccerBall;
          const spaces = this.player.speed * 4;
          const frames = 32;
          let shootSpeed = (spaces / frames) * 0.9; // Reduced shooting distance
          let frameCount = 0;
          const game = this;
          function animateRoll() {
            // Stop animation if goal was scored or game was reset
            if (frameCount < frames && !game._stopBallAnimation) {
              ball.x -= shootSpeed; // Subtract to move left
              ball._rollingAngle = (ball._rollingAngle || 0) - Math.PI / 10;
              ball.x = Math.max(ball.x, 0);
              shootSpeed *= 0.97; // Decelerate
              frameCount++;
              requestAnimationFrame(animateRoll);
            } else {
              ball._rollingAngle = 0;
              // Allow future rolls
              if (ball.game) {
                ball.game.isBallRolling = false;
                ball.game._defender1v1Shooting = false;
                ball.game._stopBallAnimation = false;
              }
            }
          }
          animateRoll();
        }
        // Remove M key so it doesn't repeat
        this.pressedKeys.delete("m");
        this.pressedKeys.delete("M");
      }

      return;
    }
    if (this.currentLevel === "bot" && this.botModeStarted) {
      // Check if timer reached 0 in timed mode (only check if timer is actually being used and not in freeplay)
      const timerContainer = document.getElementById("timer-container");
      const timerValue = document.getElementById("timer-value");
      if (
        timerContainer &&
        timerContainer.style.display !== "none" &&
        timerValue &&
        timerValue.textContent === "0:00" &&
        !document.getElementById("game-over-popup") &&
        !window._freeplayTimerInterval
      ) {
        // Determine winner by score (or declare tie)
        const playerScore = this.playerScore || 0;
        const defenderScore = this.defenderScore || 0;
        const winner =
          playerScore > defenderScore
            ? "player"
            : playerScore < defenderScore
            ? "bot"
            : "tie";
        this.showGameOverPopup(winner);
        return;
      }

      const speed = 4;
      let dx = 0,
        dy = 0;
      if (this.pressedKeys.has("a") || this.pressedKeys.has("A")) dx -= speed;
      if (this.pressedKeys.has("d") || this.pressedKeys.has("D")) dx += speed;
      if (this.pressedKeys.has("w") || this.pressedKeys.has("W")) dy -= speed;
      if (this.pressedKeys.has("s") || this.pressedKeys.has("S")) dy += speed;
      if (dx !== 0 || dy !== 0) {
        const newX = Math.max(
          0,
          Math.min(this.width - this.player.width, this.player.x + dx)
        );
        const newY = Math.max(
          0,
          Math.min(this.height - this.player.height, this.player.y + dy)
        );
        // Only move if not colliding with goaler
        if (!this.wouldCollideWithGoaler(this.player, newX, newY)) {
          this.player.x = newX;
          this.player.y = newY;
        }
      }
      // Space key shoot logic for WASD player
      if (this.pressedKeys.has(" ") && !this.isBallRolling) {
        // Only allow shoot if ball is stuck to player AND player has possession
        if (
          this.soccerBall.isStuck &&
          this.soccerBall._possessedBy === "player"
        ) {
          this.isBallRolling = true;
          this.soccerBall._lastShooter = "player"; // Track who shot the ball
          // Set ball position to player's feet before rolling
          const feet = this.player.getFeetBox();
          this.soccerBall.x = feet.x + (feet.width - this.soccerBall.width) / 2;
          this.soccerBall.y = feet.y + feet.height - this.soccerBall.height / 2;
          this.soccerBall.isStuck = false;
          this.soccerBall._possessedBy = undefined;
          const ball = this.soccerBall;
          const spaces = this.player.speed * 4;
          const frames = 32;
          let dxBall = spaces / frames;
          let speed = dxBall * 1.2; // Medium speed
          let frameCount = 0;
          const game = this;
          function animateRoll() {
            // Stop animation if goal was scored or game was reset
            if (frameCount < frames && !game._stopBallAnimation) {
              ball.x += speed;
              ball._rollingAngle = (ball._rollingAngle || 0) + Math.PI / 10;
              ball.x = Math.min(ball.x, ball.game.width - ball.width);
              speed *= 0.97; // Decelerate
              frameCount++;
              requestAnimationFrame(animateRoll);
            } else {
              ball._rollingAngle = 0;
              // Allow future rolls
              if (ball.game) {
                ball.game.isBallRolling = false;
                ball.game._stopBallAnimation = false;
              }
            }
          }
          animateRoll();
        }
        // Remove space key so it doesn't repeat
        this.pressedKeys.delete(" ");
      }

      // Update bot AI
      this.updateBotAI();
    }
  }

  updateGoalerAI() {
    // Only update goalers if they are enabled and game is active
    if (!this.goalersEnabled || this.isGameOver) return;

    const goalerSpeed = 5;
    const activationDistance = 250; // Distance at which goaler starts tracking
    const alignmentDeadzone = 5; // Stop moving when within this many pixels of target Y

    // Update left goal goaler (blue team) - defends against red team
    if (this.goalersLeft && this.goalersLeft.length > 0) {
      const leftGoaler = this.goalersLeft[0];
      let threat = null;

      // In 1v1 mode, defend against the red player (defender)
      if (this.currentLevel === 6 && this.defenders[0]) {
        threat = this.defenders[0];
      }
      // In bot mode, defend against the bot (also stored as defender)
      else if (this.currentLevel === "bot" && this.defenders[0]) {
        threat = this.defenders[0];
      }

      // If there's a threat within activation distance, track it
      if (threat) {
        const distance = Math.sqrt(
          Math.pow(threat.x - leftGoaler.x, 2) +
            Math.pow(threat.y - leftGoaler.y, 2)
        );

        if (distance < activationDistance) {
          const yDiff = Math.abs(threat.y - leftGoaler.y);
          // Only move if not already aligned (deadzone prevents jittering)
          if (yDiff > alignmentDeadzone) {
            // Move towards threat's Y position to block
            if (threat.y < leftGoaler.y) {
              leftGoaler.y = Math.max(0, leftGoaler.y - goalerSpeed);
            } else if (threat.y > leftGoaler.y) {
              leftGoaler.y = Math.min(
                this.height - leftGoaler.height,
                leftGoaler.y + goalerSpeed
              );
            }
          }
        }
      }
    }

    // Update right goal goaler (red team) - defends against blue team
    if (this.goalersRight && this.goalersRight.length > 0) {
      const rightGoaler = this.goalersRight[0];
      let threat = null;

      // Defend against the main player (blue)
      threat = this.player;

      // If there's a threat within activation distance, track it
      if (threat) {
        const distance = Math.sqrt(
          Math.pow(threat.x - rightGoaler.x, 2) +
            Math.pow(threat.y - rightGoaler.y, 2)
        );

        if (distance < activationDistance) {
          const yDiff = Math.abs(threat.y - rightGoaler.y);
          // Only move if not already aligned (deadzone prevents jittering)
          if (yDiff > alignmentDeadzone) {
            // Move towards threat's Y position to block
            if (threat.y < rightGoaler.y) {
              rightGoaler.y = Math.max(0, rightGoaler.y - goalerSpeed);
            } else if (threat.y > rightGoaler.y) {
              rightGoaler.y = Math.min(
                this.height - rightGoaler.height,
                rightGoaler.y + goalerSpeed
              );
            }
          }
        }
      }
    }

    // Goaler passing logic - pass ball back to teammate when safe
    const teammateCloseDistance = 350; // Teammate must be within this distance
    const threatSafeDistance = 150; // Threat must be farther than this distance

    // Left goaler (blue team) passing to player
    if (
      this.goalersLeft &&
      this.goalersLeft.length > 0 &&
      this.soccerBall._possessedBy === "goaler-left" &&
      !this._goalerLeftPassing
    ) {
      const leftGoaler = this.goalersLeft[0];
      const teammate = this.player;
      let threat = null;

      // Identify the threat (opponent)
      if (this.currentLevel === 6 && this.defenders[0]) {
        threat = this.defenders[0];
      } else if (this.currentLevel === "bot" && this.defenders[0]) {
        threat = this.defenders[0];
      }

      if (teammate && threat) {
        // Get teammate's feet position for accurate targeting
        const teammateFeet = teammate.getFeetBox();
        const teammateFeetCenterX = teammateFeet.x + teammateFeet.width / 2;
        const teammateFeetCenterY = teammateFeet.y + teammateFeet.height / 2;

        // Calculate distances
        const teammateDistance = Math.sqrt(
          Math.pow(teammateFeetCenterX - leftGoaler.x, 2) +
            Math.pow(teammateFeetCenterY - leftGoaler.y, 2)
        );
        const threatDistance = Math.sqrt(
          Math.pow(threat.x - leftGoaler.x, 2) +
            Math.pow(threat.y - leftGoaler.y, 2)
        );

        // Debug logging
        console.log("Left Goaler has ball:", {
          teammateDistance: Math.floor(teammateDistance),
          threatDistance: Math.floor(threatDistance),
          shouldPass:
            teammateDistance < teammateCloseDistance &&
            threatDistance > threatSafeDistance,
          passing: this._goalerLeftPassing,
        });

        // Pass if teammate is close and threat is far
        if (
          teammateDistance < teammateCloseDistance &&
          threatDistance > threatSafeDistance
        ) {
          console.log(
            "STARTING PASS! stopBallAnimation:",
            this._stopBallAnimation
          );
          // Shoot the ball towards teammate
          this._goalerLeftPassing = true;
          this._stopBallAnimation = false;
          this.isBallRolling = true;
          this.soccerBall.isStuck = false;
          this.soccerBall._possessedBy = undefined;

          // Calculate direction to teammate's feet
          const dx = teammateFeetCenterX - this.soccerBall.x;
          const dy = teammateFeetCenterY - this.soccerBall.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          console.log("Pass direction:", { dx, dy, distance });

          // Slow rolling animation towards teammate's feet (easier to receive)
          const ball = this.soccerBall;
          const speed = 2.5;
          const totalFrames = Math.floor(distance / speed);
          let frame = 0;

          const rollBall = () => {
            console.log("Rolling frame:", frame, "/", totalFrames);
            if (frame < totalFrames && !this._stopBallAnimation) {
              ball.x += (dx / distance) * speed;
              ball.y += (dy / distance) * speed;
              ball._rollingAngle = (ball._rollingAngle || 0) + Math.PI / 8;
              frame++;
              requestAnimationFrame(rollBall);
            } else {
              console.log("Pass animation complete");
              ball._rollingAngle = 0;
              this.isBallRolling = false;
              // Keep passing flag true for 30 frames (0.5 seconds) as cooldown
              setTimeout(() => {
                this._goalerLeftPassing = false;
              }, 500);
              this._stopBallAnimation = false;
            }
          };
          rollBall();
        }
      }
    }

    // Right goaler (red team) passing to defender
    if (
      this.goalersRight &&
      this.goalersRight.length > 0 &&
      this.soccerBall._possessedBy === "goaler-right" &&
      !this._goalerRightPassing
    ) {
      const rightGoaler = this.goalersRight[0];
      let teammate = null;
      const threat = this.player;

      // Identify the teammate
      if (this.currentLevel === 6 && this.defenders[0]) {
        teammate = this.defenders[0];
      } else if (this.currentLevel === "bot" && this.defenders[0]) {
        teammate = this.defenders[0];
      }

      if (teammate && threat) {
        // Get teammate's feet position for accurate targeting
        const teammateFeet = teammate.getFeetBox();
        const teammateFeetCenterX = teammateFeet.x + teammateFeet.width / 2;
        const teammateFeetCenterY = teammateFeet.y + teammateFeet.height / 2;

        // Calculate distances
        const teammateDistance = Math.sqrt(
          Math.pow(teammateFeetCenterX - rightGoaler.x, 2) +
            Math.pow(teammateFeetCenterY - rightGoaler.y, 2)
        );
        const threatDistance = Math.sqrt(
          Math.pow(threat.x - rightGoaler.x, 2) +
            Math.pow(threat.y - rightGoaler.y, 2)
        );

        // Pass if teammate is close and threat is far
        const threatSafeDistance = 150;
        if (
          teammateDistance < teammateCloseDistance &&
          threatDistance > threatSafeDistance
        ) {
          // Shoot the ball towards teammate
          this._goalerRightPassing = true;
          this._stopBallAnimation = false;
          this.isBallRolling = true;
          this.soccerBall.isStuck = false;
          this.soccerBall._possessedBy = undefined;

          // Calculate direction to teammate's feet
          const dx = teammateFeetCenterX - this.soccerBall.x;
          const dy = teammateFeetCenterY - this.soccerBall.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Slow rolling animation towards teammate's feet (easier to receive)
          const ball = this.soccerBall;
          const speed = 2.5;
          const totalFrames = Math.floor(distance / speed);
          let frame = 0;

          const rollBall = () => {
            if (frame < totalFrames && !this._stopBallAnimation) {
              ball.x += (dx / distance) * speed;
              ball.y += (dy / distance) * speed;
              ball._rollingAngle = (ball._rollingAngle || 0) + Math.PI / 8;
              frame++;
              requestAnimationFrame(rollBall);
            } else {
              ball._rollingAngle = 0;
              this.isBallRolling = false;
              // Keep passing flag true for 0.5 seconds as cooldown
              setTimeout(() => {
                this._goalerRightPassing = false;
              }, 500);
              this._stopBallAnimation = false;
            }
          };
          rollBall();
        }
      }
    }
  }

  updateBotAI() {
    // Only run bot AI if bot mode has been started and game is not over
    if (!this.defenders[0] || !this.botModeStarted || this.isGameOver) return;

    const bot = this.defenders[0];
    const ball = this.soccerBall;
    const difficulty = this.botDifficulty || "easy";

    // Difficulty settings
    let botSpeed, shootDistance;
    if (difficulty === "impossible") {
      botSpeed = 3.5;
      shootDistance = 200;
    } else if (difficulty === "hard") {
      botSpeed = 3.5;
      shootDistance = 180;
    } else if (difficulty === "medium") {
      botSpeed = 3.5;
      shootDistance = 150;
    } else {
      // easy
      botSpeed = 2.5;
      shootDistance = 120;
    }

    // Get bot's feet position for accurate collision
    const botFeet = bot.getFeetBox();
    const botFeetCenterX = botFeet.x + botFeet.width / 2;
    const botFeetCenterY = botFeet.y + botFeet.height / 2;

    const ballCenterX = ball.x + ball.width / 2;
    const ballCenterY = ball.y + ball.height / 2;

    // Calculate direction from bot's feet to ball
    const dx = ballCenterX - botFeetCenterX;
    const dy = ballCenterY - botFeetCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If ball is possessed by bot, move towards goal
    if (this.soccerBall._possessedBy === "defender") {
      const playerCenterX = this.player.x + this.player.width / 2;
      const playerCenterY = this.player.y + this.player.height / 2;
      const playerDx = playerCenterX - botFeetCenterX;
      const playerDy = playerCenterY - botFeetCenterY;
      const playerDistance = Math.sqrt(
        playerDx * playerDx + playerDy * playerDy
      );

      // Impossible difficulty: Defensive pass if player gets too close
      if (
        difficulty === "impossible" &&
        playerDistance < 100 &&
        !this._botShooting
      ) {
        // Initialize defensive pass counter
        if (typeof this._defensivePassCount === "undefined") {
          this._defensivePassCount = 0;
        }

        // Limit to 2 defensive passes per round
        if (this._defensivePassCount < 2) {
          this._defensivePassCount++;

          // Bot clears the ball away from player to regain control
          this.isBallRolling = true;
          this._botShooting = true;
          this.soccerBall._lastShooter = "defender"; // Track who shot the ball
          this.soccerBall.isStuck = false;
          this.soccerBall._possessedBy = undefined;

          const shootBall = this.soccerBall;
          const spaces = 180; // Short distance pass
          const frames = 24;
          let shootSpeed = spaces / frames;
          let frameCount = 0;

          const game = this;
          const shootAnimation = () => {
            if (frameCount < frames && !game._stopBallAnimation) {
              shootBall.x -= shootSpeed;
              shootBall._rollingAngle =
                (shootBall._rollingAngle || 0) + Math.PI / 10;
              shootBall.x = Math.max(0, shootBall.x);
              shootSpeed *= 0.97;
              frameCount++;
              requestAnimationFrame(shootAnimation);
            } else {
              shootBall._rollingAngle = 0;
              if (shootBall.game) {
                shootBall.game.isBallRolling = false;
                shootBall.game._botShooting = false;
                shootBall.game._stopBallAnimation = false;
              }
            }
          };
          shootAnimation();
          return; // Exit early after defensive pass
        }
      }

      // Move towards left goal (opposite side)
      const goalCenterX = this.fieldLeft.x + this.fieldLeft.width / 2;
      const goalCenterY = this.fieldLeft.y + this.fieldLeft.height / 2;

      let goalDx = goalCenterX - botFeetCenterX;
      let goalDy = goalCenterY - botFeetCenterY;
      const goalDistance = Math.sqrt(goalDx * goalDx + goalDy * goalDy);

      // Impossible difficulty: Advanced feints and jukes
      if (difficulty === "impossible") {
        // Initialize feint timer if not exists
        if (!this._feintTimer) this._feintTimer = 0;
        this._feintTimer++;

        if (playerDistance < 180) {
          // Ultra unpredictable movement with random elements
          const time = this._feintTimer;
          const random = Math.sin(time * 0.3) * Math.cos(time * 0.7);

          // Multi-layered unpredictable pattern
          const fastCycle = time % 8; // Very fast changes
          const medCycle = Math.floor(time / 10) % 5;
          const randomFactor = Math.random();

          // Extremely erratic dodging
          if (fastCycle < 2) {
            // Rapid zigzag up
            goalDy -= 250;
            goalDx += 30 * random; // Add horizontal juke
          } else if (fastCycle < 4) {
            // Rapid zigzag down
            goalDy += 250;
            goalDx -= 30 * random; // Reverse horizontal juke
          } else if (fastCycle < 6) {
            // Fake movement based on random
            if (randomFactor > 0.5) {
              goalDy -= 220;
              goalDx += 40;
            } else {
              goalDy += 220;
              goalDx -= 40;
            }
          } else {
            // Unpredictable diagonal movements
            if (medCycle === 0) {
              goalDy -= 230;
              goalDx -= 50;
            } else if (medCycle === 1) {
              goalDy += 230;
              goalDx += 50;
            } else if (medCycle === 2) {
              // Sudden reverse
              goalDy += 200;
              goalDx -= 60;
            } else if (medCycle === 3) {
              // Wave pattern
              goalDy += Math.sin(time * 0.5) * 250;
              goalDx += Math.cos(time * 0.3) * 40;
            } else {
              // Chaos mode
              goalDy += (randomFactor - 0.5) * 350;
              goalDx += (Math.random() - 0.5) * 80;
            }
          }

          // Add even more chaos when very close
          if (playerDistance < 100) {
            goalDy += Math.sin(time * 1.2) * 150;
            goalDx += Math.cos(time * 1.5) * 60;
          }
        }
      }

      // Hard difficulty: dodge player when moving to goal
      if (difficulty === "hard") {
        // If player is close (within 120 pixels), dodge them
        if (playerDistance < 120) {
          // Dodge perpendicular to the direction toward player
          // If player is above bot, dodge down; if below, dodge up
          if (playerDy < 0) {
            // Player is above, dodge down
            goalDy += 150;
          } else {
            // Player is below, dodge up
            goalDy -= 150;
          }
        }
      }

      // Normalize and move (boost speed during dodge in hard mode)
      const moveDistance = Math.sqrt(goalDx * goalDx + goalDy * goalDy);
      if (moveDistance > 10) {
        // Speed boost during dodge for hard mode
        const dodgeSpeed =
          difficulty === "hard" && playerDistance < 120
            ? botSpeed * 1.3
            : botSpeed;
        const moveX = (goalDx / moveDistance) * dodgeSpeed;
        const moveY = (goalDy / moveDistance) * dodgeSpeed;
        bot.move(moveX, moveY);
      }

      // Shoot when close to goal
      if (goalDistance < shootDistance) {
        // Shoot logic similar to player
        if (!this._botShooting) {
          this.isBallRolling = true;
          this._botShooting = true;
          this.soccerBall._lastShooter = "defender"; // Track who shot the ball
          this.soccerBall.isStuck = false;
          this.soccerBall._possessedBy = undefined;

          const shootBall = this.soccerBall;
          const spaces = 250; // Distance to shoot
          const frames = 32;
          let shootSpeed = spaces / frames;
          let frameCount = 0;

          const game = this;
          const shootAnimation = () => {
            // Stop animation if goal was scored or game was reset
            if (frameCount < frames && !game._stopBallAnimation) {
              shootBall.x -= shootSpeed; // Shoot left towards goal
              shootBall._rollingAngle =
                (shootBall._rollingAngle || 0) + Math.PI / 10;
              shootBall.x = Math.max(0, shootBall.x);
              shootSpeed *= 0.97;
              frameCount++;
              requestAnimationFrame(shootAnimation);
            } else {
              shootBall._rollingAngle = 0;
              if (shootBall.game) {
                shootBall.game.isBallRolling = false;
                shootBall.game._botShooting = false;
                shootBall.game._stopBallAnimation = false;
              }
            }
          };
          shootAnimation();
        }
      }
    } else {
      // Chase the ball (with interception for medium+)
      let targetX = ballCenterX;
      let targetY = ballCenterY;

      // Medium/Hard difficulty: predict ball movement for interception
      if (
        (difficulty === "medium" || difficulty === "hard") &&
        this.soccerBall._possessedBy === "player"
      ) {
        // If player has ball, move toward the ball (player's feet) to tackle
        // But also consider blocking the goal path
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;
        const goalCenterX = this.fieldLeft.x + this.fieldLeft.width / 2;
        const goalCenterY = this.fieldLeft.y + this.fieldLeft.height / 2;

        // Move aggressively toward the ball to tackle
        targetX = ballCenterX;
        targetY = ballCenterY;

        // But if bot is far from ball, try to intercept path to goal
        const botToPlayerDist = Math.sqrt(
          (playerCenterX - botFeetCenterX) ** 2 +
            (playerCenterY - botFeetCenterY) ** 2
        );

        const interceptThreshold = difficulty === "hard" ? 180 : 150;
        if (botToPlayerDist > interceptThreshold) {
          // Intercept point between player and goal
          const interceptRatio = difficulty === "hard" ? 0.4 : 0.3;
          targetX =
            playerCenterX + (goalCenterX - playerCenterX) * interceptRatio;
          targetY =
            playerCenterY + (goalCenterY - playerCenterY) * interceptRatio;
        }
      }

      const targetDx = targetX - botFeetCenterX;
      const targetDy = targetY - botFeetCenterY;
      const targetDistance = Math.sqrt(
        targetDx * targetDx + targetDy * targetDy
      );

      if (targetDistance > 5) {
        const moveX = (targetDx / targetDistance) * botSpeed;
        const moveY = (targetDy / targetDistance) * botSpeed;
        bot.move(moveX, moveY);
      }
    }
  }
}

function startGame() {
  window.focus();
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 888;
  canvas.height = 613;

  const levelDropdown = document.getElementById("level-dropdown");
  const selectedValue = levelDropdown.value;
  const selectedLevel = parseInt(selectedValue);

  const game = new Game(canvas);
  game.botModeStarted = false;
  window.setCurrentGame(game);
  game.loadLevel(selectedLevel);

  document.getElementById("action-buttons").style.display = "flex";

  const editor = document.getElementById("game-textbox");
  const scoreboard = document.getElementById("scoreboard");
  const runBtn = document.getElementById("run-btn");
  const clearBtn = document.getElementById("clear-btn");
  const start1v1Btn = document.getElementById("start-1v1-btn");

  if (selectedLevel === 6) {
    if (scoreboard) scoreboard.style.display = "none";
    if (start1v1Btn) {
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
    if (start1v1Btn) start1v1Btn.style.display = "none";
    editor.style.display = "none";
    editor.contentEditable = "false";
    editor.classList.remove("enabled");
    editor.innerHTML = "";
    if (scoreboard) scoreboard.style.display = "none";
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

  // Real-time syntax highlighting with color preservation
  if (editor) {
    // Helper function to escape HTML
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

    // Helper function to highlight code
    function highlightCode(code) {
      let escaped = escapeHtml(code);
      const functions = [
        "moveRight",
        "moveLeft",
        "moveUp",
        "moveDown",
        "shootBall",
      ];
      functions.forEach((fn) => {
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

    // Helper function to restore caret position
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

    // Real-time syntax highlighting on input
    editor.addEventListener("input", function (e) {
      if (!editor.isContentEditable) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editor);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      const caretPos = preCaretRange.toString().length;

      const plainText = editor.innerText;
      editor.innerHTML = highlightCode(plainText);

      // Restore caret position
      try {
        setCaret(editor, caretPos);
      } catch (err) {
        // Fallback: move caret to end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(editor);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });

    // Handle Enter key to create new lines
    editor.addEventListener("keydown", function (e) {
      if (!editor.isContentEditable) return;

      if (e.key === "Enter") {
        e.preventDefault();

        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);

        // Get plain text to calculate position
        const plainText = editor.innerText || editor.textContent;

        // Calculate caret position by walking through text nodes
        let caretPos = 0;
        const walker = document.createTreeWalker(
          editor,
          NodeFilter.SHOW_TEXT,
          null
        );

        let node;
        let found = false;
        while ((node = walker.nextNode())) {
          if (node === range.startContainer) {
            caretPos += range.startOffset;
            found = true;
            break;
          } else {
            caretPos += node.textContent.length;
          }
        }

        // If we didn't find the node, use fallback calculation
        if (!found) {
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(editor);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          caretPos = preCaretRange.toString().length;
        }

        // Insert newline in plain text
        const beforeCursor = plainText.substring(0, caretPos);
        const afterCursor = plainText.substring(caretPos);
        const newText = beforeCursor + "\n" + afterCursor;

        // Update with highlighted code
        editor.innerHTML = highlightCode(newText);

        // Restore caret position after newline
        requestAnimationFrame(() => {
          try {
            // Find the text node containing the newline at caretPos
            const walker2 = document.createTreeWalker(
              editor,
              NodeFilter.SHOW_TEXT,
              null
            );

            let currentPos = 0;
            let node2;
            while ((node2 = walker2.nextNode())) {
              const text = node2.textContent;
              const nodeLength = text.length;

              // Check if the newline is in this node
              if (
                currentPos <= caretPos &&
                caretPos < currentPos + nodeLength
              ) {
                const localPos = caretPos - currentPos;
                // Check if there's a newline at or before this position
                const textBefore = text.substring(0, localPos);
                const newlineIndex = textBefore.lastIndexOf("\n");

                if (newlineIndex !== -1) {
                  // Position cursor after the newline
                  const range = document.createRange();
                  const sel = window.getSelection();
                  range.setStart(node2, newlineIndex + 1);
                  range.collapse(true);
                  sel.removeAllRanges();
                  sel.addRange(range);
                  return;
                }
              }

              currentPos += nodeLength;
            }

            // Fallback: use setCaret function
            setCaret(editor, caretPos + 1);
          } catch (err) {
            // Final fallback: move caret to end
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(editor);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        });
      }
    });
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
