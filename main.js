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

  constructor(game) {
    this.game = game;
    this.width = 50;
    this.height = 100;
    this.x = 100;
    this.y = 100;
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
      console.log("Ball shot!");
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
    this.player.x = 100;
    this.player.y = 270;
    this.player.startX = this.player.x;
    this.player.startY = this.player.y;
    this.isExecuting = false;
    this.pressedKeys = new Set();
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
    if (this.currentLevel === 7 && this.defenders[0]) {
      defenderFeetBox = this.defenders[0].getFeetBox();
    }

    if (this.currentLevel === 6) {
      if (
        !this.soccerBall.isStuck &&
        Game.rectsOverlap(playerFeetBox, ballBox)
      ) {
        this.soccerBall.isStuck = true;
      }
      if (this.soccerBall.isStuck) {
        this.soccerBall.stickToPlayer(this.player);
      }
    } else if (this.currentLevel === 7) {
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
      this.soccerBall.isStuck = Game.rectsOverlap(playerFeetBox, ballBox);
      if (this.soccerBall.isStuck) {
        this.soccerBall.stickToPlayer(this.player);
      }
      this.soccerBall._possessedBy = undefined;
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
    this.player.draw(context);
    this.soccerBall.draw(context);
    this.player.update();
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
        this.playerScore++;
        document.getElementById("score-player").textContent = this.playerScore;
        checkScoreCloseToWin();
      } else if (Game.rectsOverlap(ballBox, leftGoalBox)) {
        this.defenderScore++;
        document.getElementById("score-defender").textContent =
          this.defenderScore;
        checkScoreCloseToWin();
      }
      this.loadLevel(6);
      const scoreboard = document.getElementById("scoreboard");
      if (scoreboard) scoreboard.style.display = "block";
      const editor = document.getElementById("game-textbox");
      if (editor) {
        editor.style.display = "block";
        editor.contentEditable = "true";
        editor.classList.add("enabled");
      }
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
    if (this.currentLevel === 6) {
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
      // Space key shoot logic for WASD player
      if (this.pressedKeys.has(" ")) {
        // Only allow shoot if ball is stuck to player
        if (this.soccerBall.isStuck) {
          this.soccerBall.isStuck = false;
          const ball = this.soccerBall;
          const spaces = this.player.speed * 4;
          const frames = 32;
          let dxBall = spaces / frames;
          let speed = dxBall * 1.2; // Medium speed
          let twist = 0;
          // Animate ball roll with twist
          let frameCount = 0;
          function animateRoll() {
            if (frameCount < frames) {
              ball.x += speed;
              ball._rollingAngle =
                (ball._rollingAngle || 0) +
                Math.PI / 10 +
                Math.sin(twist) * 0.08;
              ball.x = Math.min(ball.x, ball.game.width - ball.width);
              twist += 0.3;
              speed *= 0.97; // Decelerate
              frameCount++;
              requestAnimationFrame(animateRoll);
            } else {
              ball._rollingAngle = 0;
            }
          }
          animateRoll();
        }
        // Remove space key so it doesn't repeat
        this.pressedKeys.delete(" ");
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

  // Fix backwards typing: only apply syntax highlighting on blur
  if (editor) {
    // Remove input event handler that sets innerHTML
    // Instead, apply syntax highlighting only on blur
    editor.addEventListener("blur", function () {
      const code = editor.textContent;
      let html = code.replace(
        /(moveRight|moveLeft|moveUp|moveDown|shootBall)/g,
        '<span class="highlight">$1</span>'
      );
      editor.innerHTML = html;
    });
    // On focus, restore plain text for editing
    editor.addEventListener("focus", function () {
      // Remove all HTML tags, keep only text
      const text = editor.textContent;
      editor.textContent = text;
    });
    // Handle Enter key to create new lines
    editor.addEventListener("keydown", function (e) {
      if (!editor.isContentEditable) return;

      if (e.key === "Enter") {
        e.preventDefault();

        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);

        // Insert a line break
        const textNode = document.createTextNode("\n");
        range.deleteContents();
        range.insertNode(textNode);

        // Move cursor after the newline
        range.setStartAfter(textNode);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
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
