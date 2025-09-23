class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 100;
    this.x = 100;
    this.y = 100;
    this.speed = 5;
  }

  draw(context) {
    context.fillStyle = "black";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.speed;
  }
}

class Field {
  constructor(game) {
    this.game = game;
    this.width = 300;
    this.height = 200;
    this.x = 1;
    this.y = 200;
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
    this.player = new Player(this);
    this.field = new Field(this);
  }

  render(context) {
    this.field.draw(context);
    this.player.draw(context);
    this.player.update();
  }
}

function startGame() {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1000;
  canvas.height = 600;

  const game = new Game(canvas);

  document.getElementById("start-btn").style.display = "none";
  document.getElementById("action-buttons").style.display = "block";

  const editor = document.getElementById("game-textbox");
  editor.contentEditable = "true";
  editor.classList.add("enabled");

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate);
  }

  animate();
}

const FUNCTIONS = ["moveRight", "moveLeft", "moveUp", "moveDown", "shootBall"];

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
  });

  document.getElementById("clear-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your code?")) {
      const editor = document.getElementById("game-textbox");
      editor.innerHTML = "";
      editor.focus();
    }
  });
});
