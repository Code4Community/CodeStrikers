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
        if (this.game.soccerBall.isStuck) {
          this.game.soccerBall.stickToPlayer(this);
        }
        await new Promise((r) => setTimeout(r, 12));
      }
      this.x = targetX;
      if (this.game.soccerBall.isStuck) {
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
    // Make goals smaller so they're easier to aim at
    this.width = 120; // Goal width (reduced from 320)
    this.height = 300; // Goal height (reduced from 400)
    this.side = side;

    const edgeOffset = -80; // Move a bit back to line up with white line
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
        // Rotate 180 degrees for left field
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        context.rotate(Math.PI);
        context.drawImage(
          this.image,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height
        );
      } else {
        // Right field, no rotation
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
      context.restore();
    }
  }
}

class Game {
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

    // Reset player to starting position before running code
    this.player.reset();

    this.isExecuting = true;

    // Parse the code into commands
    const commands = code
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    console.log("Executing commands:", commands);

    // Execute each command with animation delay
    for (const command of commands) {
      if (shouldStop && shouldStop()) break;
      await new Promise((resolve) => setTimeout(resolve, 400)); // 400ms delay between moves
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
  // Show textbox only if not 1v1 (level 6)
  if (selectedLevel === 6) {
    editor.style.display = "none";
  } else {
    editor.style.display = "block";
    editor.contentEditable = "true";
    editor.classList.add("enabled");
    editor.innerHTML = "";
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

const FUNCTIONS = ["moveRight", "moveLeft", "moveUp", "moveDown", "shootBall"];

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

    // Allow Enter key to create new lines
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

      // Trigger syntax highlighting
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
    if (val === 6) {
      editor.style.display = "none";
    } else {
      editor.style.display = "block";
      editor.contentEditable = "true";
      editor.classList.add("enabled");
    }
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
