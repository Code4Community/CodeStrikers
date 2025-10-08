class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 100;
    this.x = 100;
    this.y = 100;
    this.speed = 50; // Grid-based movement
    this.startX = 100; // Save starting position
    this.startY = 100;
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
    console.log("Player reset to starting position");
  }

  moveRight() {
    const newX = this.x + this.speed;
    // Check boundary (canvas width - player width)
    if (newX + this.width <= this.game.width) {
      this.x = newX;
      console.log(`Player moved right to x: ${this.x}`);
    } else {
      console.log(`Can't move right - boundary reached!`);
    }
  }

  moveLeft() {
    const newX = this.x - this.speed;
    // Check boundary (left edge)
    if (newX >= 0) {
      this.x = newX;
      console.log(`Player moved left to x: ${this.x}`);
    } else {
      console.log(`Can't move left - boundary reached!`);
    }
  }

  moveUp() {
    const newY = this.y - this.speed;
    // Check boundary (top edge)
    if (newY >= 0) {
      this.y = newY;
      console.log(`Player moved up to y: ${this.y}`);
    } else {
      console.log(`Can't move up - boundary reached!`);
    }
  }

  moveDown() {
    const newY = this.y + this.speed;
    // Check boundary (canvas height - player height)
    if (newY + this.height <= this.game.height) {
      this.y = newY;
      console.log(`Player moved down to y: ${this.y}`);
    } else {
      console.log(`Can't move down - boundary reached!`);
    }
  }

  shootBall() {
    this.x += this.speed * 4;
    console.log("Ball shot!");
  }

  draw(context) {
    context.fillStyle = "black";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    // No auto-movement anymore - controlled by user code
  }
}

class Field {
  constructor(game, side) {
    this.game = game;
    this.width = 300;
    this.height = 200;
    this.side = side;

    if (side === "left") {
      this.x = 1;
      this.y = 200;
    } else {
      this.x = game.width - this.width - 1;
      this.y = 200;
    }
  }

  draw(context) {
    context.fillStyle = "blue";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.currentLevel = 1;
    this.player = new Player(this);
    this.fieldLeft = new Field(this, "left");
    this.fieldRight = new Field(this, "right");
    this.isExecuting = false;
  }

  render(context) {
    this.fieldLeft.draw(context);
    this.fieldRight.draw(context);
    this.player.draw(context);
    this.player.update();
  }

  loadLevel(level) {
    this.currentLevel = level;
    this.player.x = 100;
    this.player.y = 100;
    console.log(`Level ${level} loaded`);
  }

  async executeUserCode(code) {
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
      await new Promise((resolve) => setTimeout(resolve, 400)); // 400ms delay between moves

      if (command.includes("moveRight()")) {
        this.player.moveRight();
      } else if (command.includes("moveLeft()")) {
        this.player.moveLeft();
      } else if (command.includes("moveUp()")) {
        this.player.moveUp();
      } else if (command.includes("moveDown()")) {
        this.player.moveDown();
      } else if (command.includes("shootBall()")) {
        this.player.shootBall();
      } else {
        console.warn(`Unknown command: ${command}`);
      }
    }

    this.isExecuting = false;
    console.log("Code execution complete!");
  }
}

function startGame() {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 888;
  canvas.height = 613;

  const game = new Game(canvas);
  window.setCurrentGame(game);

  document.getElementById("start-btn").style.display = "none";
  document.getElementById("action-buttons").style.display = "flex";

  const editor = document.getElementById("game-textbox");
  editor.style.display = "block";
  editor.contentEditable = "true";
  editor.classList.add("enabled");
  editor.innerHTML = "";

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  document.getElementById("run-btn").addEventListener("click", () => {
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

    console.log("Running code:", code);

    // Disable run button during execution
    const runBtn = document.getElementById("run-btn");
    const clearBtn = document.getElementById("clear-btn");
    runBtn.disabled = true;
    clearBtn.disabled = true;
    runBtn.textContent = "Running...";
    runBtn.style.opacity = "0.6";

    currentGame.executeUserCode(code).then(() => {
      runBtn.disabled = false;
      clearBtn.disabled = false;
      runBtn.textContent = "Run";
      runBtn.style.opacity = "1";
    });
  });

  let currentGame = null;

  document.getElementById("next-level-btn").addEventListener("click", () => {
    if (currentGame && currentGame.currentLevel < 5) {
      currentGame.loadLevel(currentGame.currentLevel + 1);
      document.getElementById("level-dropdown").value =
        currentGame.currentLevel;
      updateLevelButtons();
    }
  });

  document.getElementById("back-level-btn").addEventListener("click", () => {
    if (currentGame && currentGame.currentLevel > 1) {
      currentGame.loadLevel(currentGame.currentLevel - 1);
      document.getElementById("level-dropdown").value =
        currentGame.currentLevel;
      updateLevelButtons();
    }
  });

  document.getElementById("level-dropdown").addEventListener("change", (e) => {
    if (currentGame) {
      currentGame.loadLevel(parseInt(e.target.value));
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
});
