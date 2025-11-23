// ============================================
// UI.JS - User Interface Controls and Event Handlers
// ============================================

const FUNCTIONS = ["moveRight", "moveLeft", "moveUp", "moveDown", "shootBall"];

function checkSyntaxErrors(code) {
  const lines = code.split("\n");
  const errors = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0) return;

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
      popup.innerHTML = `<div style="background: #fffde7; border-radius: 14px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); padding: 32px 40px; text-align: center; font-size: 1.2em; color: #d32f2f; font-weight: 600; max-width: 340px;"><div style='margin-bottom:18px;'>${message}</div><button id='close-score-close-popup' style='margin-top:10px; padding:8px 24px; font-size:1em; border-radius:8px; border:none; background:#d32f2f; color:#fff; font-weight:600; cursor:pointer;'>Close</button></div>`;
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

function showAllGameButtons() {
  const difficultyGrid = document.querySelector(".difficulty-grid");
  const modeButtons = document.querySelector(".mode-buttons");
  const startBtn = document.querySelector(".start-btn");
  if (difficultyGrid) difficultyGrid.style.display = "grid";
  if (modeButtons) modeButtons.style.display = "flex";
  if (startBtn) startBtn.style.display = "block";
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
    modeButtons.previousElementSibling.textContent.includes("Select Game Mode")
  ) {
    modeButtons.previousElementSibling.style.display = "block";
  }
}

function updateLevelButtons() {
  const backBtn = document.getElementById("back-level-btn");
  const nextBtn = document.getElementById("next-level-btn");
  const currentGame = window.currentGame;

  if (currentGame) {
    backBtn.disabled = currentGame.currentLevel === 1;
    const dropdown = document.getElementById("level-dropdown");
    const selectedValue = dropdown.value;
    if (selectedValue === "6" || selectedValue === "bot") {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("game-textbox");
  const difficultyButtons = document.querySelector(".difficulty-buttons");

  if (difficultyButtons) difficultyButtons.style.display = "none";

  // Editor input handler
  editor.addEventListener("input", (e) => {
    if (!editor.isContentEditable) return;
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
    // Restore caret to original position after replacing innerHTML
    try {
      setCaret(editor, caretPos);
    } catch (err) {
      // If caret restore fails for any reason, move caret to end as fallback
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    // Update line numbers and syntax error display
    updateLineNumbers();
    displaySyntaxErrors(checkSyntaxErrors(plainText));
  });

  // Auto-pairing for parentheses: insert matching ')' after '(' and skip over
  // existing ')' when user types ')'. Runs on keydown so we can preventDefault
  // and control insertion before the browser updates the content.
  editor.addEventListener("keydown", (e) => {
    if (!editor.isContentEditable) return;

    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);

    // Helper: set caret inside editor at absolute character position
    function setCaretAtPos(el, pos) {
      for (let node of el.childNodes) {
        if (node.nodeType === 3) {
          if (node.length >= pos) {
            const r = document.createRange();
            const s = window.getSelection();
            r.setStart(node, pos);
            r.collapse(true);
            s.removeAllRanges();
            s.addRange(r);
            return -1;
          } else {
            pos -= node.length;
          }
        } else {
          pos = setCaretAtPos(node, pos);
        }
        if (pos === -1) return -1;
      }
      return pos;
    }

    // Compute caret absolute position in plain text
    const pre = range.cloneRange();
    pre.selectNodeContents(editor);
    pre.setEnd(range.endContainer, range.endOffset);
    const caretPos = pre.toString().length;

    if (e.key === "(") {
      e.preventDefault();
      // Replace any selection with paired parentheses and place caret between
      range.deleteContents();

      const openNode = document.createTextNode("(");
      const closeNode = document.createTextNode(")");

      // Insert close then open so caret can be placed between them
      range.insertNode(closeNode);
      range.insertNode(openNode);

      // Move caret between the two nodes
      const newPos = caretPos + 1; // after '('
      setCaretAtPos(editor, newPos);

      // Trigger input to run highlighting and UI updates
      editor.dispatchEvent(new Event("input"));
      return;
    }

    if (e.key === ")") {
      // If the next character in plain text is already ')', skip over it
      const text = editor.innerText || "";
      if (text.charAt(caretPos) === ")") {
        e.preventDefault();
        setCaretAtPos(editor, caretPos + 1);
      }
    }
  });

  // Paste handler
  editor.addEventListener("paste", function (e) {
    if (!editor.isContentEditable) return;

    e.preventDefault();

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("text/plain");

    if (pastedText) {
      range.deleteContents();
      const textNode = document.createTextNode(pastedText);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      editor.dispatchEvent(new Event("input"));
    }
  });

  // Clear button
  document.getElementById("clear-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your code?")) {
      const editor = document.getElementById("game-textbox");
      editor.innerHTML = "";
      editor.focus();
    }
  });

  // Run and Stop buttons
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

  // Level navigation
  document.getElementById("next-level-btn").addEventListener("click", () => {
    showAllGameButtons();
    const currentGame = window.currentGame;
    if (currentGame && currentGame.currentLevel < 5) {
      currentGame.loadLevel(currentGame.currentLevel + 1);
      document.getElementById("level-dropdown").value =
        currentGame.currentLevel;
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
      updateUIForLevel(currentGame.currentLevel);
      updateLevelButtons();
    }
  });

  document.getElementById("back-level-btn").addEventListener("click", () => {
    showAllGameButtons();
    const currentGame = window.currentGame;
    if (currentGame && currentGame.currentLevel > 1) {
      currentGame.loadLevel(currentGame.currentLevel - 1);
      document.getElementById("level-dropdown").value =
        currentGame.currentLevel;
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
      updateUIForLevel(currentGame.currentLevel);
      updateLevelButtons();
    }
  });

  // Level dropdown change
  document.getElementById("level-dropdown").addEventListener("change", (e) => {
    showAllGameButtons();
    const selectedValue = e.target.value;
    let selectedLevel = parseInt(selectedValue);
    if (selectedValue === "bot") {
      selectedLevel = "bot";
    }
    const currentGame = window.currentGame;
    if (currentGame) {
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
      updateUIForLevel(selectedLevel);
    }
  });

  // Difficulty button selection
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

  // Mode button selection
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

    window.getTimedModeDuration = function () {
      const min =
        parseInt(document.getElementById("timed-minutes").value, 10) || 1;
      return min * 60;
    };
  }

  // Start button
  const startBtn = document.querySelector(".start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      const difficultyGrid = document.querySelector(".difficulty-grid");
      const difficultySelected =
        difficultyGrid &&
        Array.from(difficultyGrid.querySelectorAll(".difficulty-btn")).some(
          (btn) => btn.classList.contains("selected")
        );
      const modeButtons = document.querySelector(".mode-buttons");
      const modeSelectedBtn =
        modeButtons &&
        Array.from(modeButtons.querySelectorAll(".difficulty-btn")).find(
          (btn) => btn.classList.contains("selected")
        );

      let validInput = true;
      if (modeSelectedBtn && modeSelectedBtn.id === "timed-btn") {
        const timedInput = document.getElementById("timed-minutes");
        const timedVal =
          timedInput && timedInput.value ? parseInt(timedInput.value) : 0;
        validInput = timedInput && timedVal >= 1 && timedVal <= 20;
        if (timedInput && (timedVal < 1 || timedVal > 20)) {
          showPopup("Please choose a time between 1 and 20 minutes.");
          return;
        }
      } else if (modeSelectedBtn && modeSelectedBtn.id === "toscore-btn") {
        const scoreInput = document.getElementById("toscore-score");
        const scoreVal =
          scoreInput && scoreInput.value ? parseInt(scoreInput.value) : 0;
        validInput = scoreInput && scoreVal >= 1 && scoreVal <= 100;
        if (scoreInput && (scoreVal < 1 || scoreVal > 100)) {
          showPopup("Please choose a score between 1 and 100.");
          return;
        }
      }

      if (!difficultySelected || !modeSelectedBtn || !validInput) {
        showPopup(
          "Please select a difficulty, mode, and enter a value if required."
        );
        return;
      }

      if (window.currentGame && window.currentGame.currentLevel === "bot") {
        window.currentGame.botModeStarted = true;
        // Store the selected difficulty
        const selectedDifficultyBtn = Array.from(
          difficultyGrid.querySelectorAll(".difficulty-btn")
        ).find((btn) => btn.classList.contains("selected"));
        if (selectedDifficultyBtn) {
          const difficultyText =
            selectedDifficultyBtn.textContent.toLowerCase();
          window.currentGame.botDifficulty = difficultyText;
        }
      }

      hideStartUI();

      // Store the mode button globally for play again functionality
      window._currentModeBtn = modeSelectedBtn;

      setupGameMode(modeSelectedBtn);
    });
  }

  // Keyboard controls for 1v1 and bot mode
  window.addEventListener("keydown", (e) => {
    const currentGame = window.currentGame;
    if (currentGame && currentGame.currentLevel === 6) {
      currentGame.handleDefenderControls(e);
      e.preventDefault();
    }
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
    if (currentGame && currentGame.currentLevel === 6) {
      currentGame.handleDefenderControls(e);
      e.preventDefault();
    }
    if (
      currentGame &&
      currentGame.currentLevel === "bot" &&
      currentGame.botModeStarted
    ) {
      currentGame.pressedKeys.delete(e.key);
      e.preventDefault();
    }
  });

  window.setCurrentGame = (game) => {
    window.currentGame = game;
    updateLevelButtons();
  };

  // Auto-start the game
  startGame();
});

// Helper functions
function updateUIForLevel(level) {
  const editor = document.getElementById("game-textbox");
  const scoreboard = document.getElementById("scoreboard");
  const runBtn = document.getElementById("run-btn");
  const clearBtn = document.getElementById("clear-btn");
  const start1v1Btn = document.getElementById("start-1v1-btn");
  const difficultyButtons = document.querySelector(".difficulty-buttons");

  if (level === "bot") {
    if (difficultyButtons) difficultyButtons.style.display = "flex";
    if (start1v1Btn) start1v1Btn.style.display = "none";
    editor.style.display = "none";
    editor.contentEditable = "false";
    editor.classList.remove("enabled");
    editor.innerHTML = "";
    if (scoreboard) scoreboard.style.display = "none";
    if (runBtn) runBtn.style.display = "none";
    if (clearBtn) clearBtn.style.display = "none";
  } else if (level === 6) {
    if (difficultyButtons) difficultyButtons.style.display = "none";
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
    if (difficultyButtons) difficultyButtons.style.display = "none";
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

function showPopup(message) {
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
    popup.innerHTML = `<div style="background: #fffde7; border-radius: 14px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); padding: 32px 40px; text-align: center; font-size: 1.2em; color: #d32f2f; font-weight: 600; max-width: 340px;"><div style='margin-bottom:18px;'>${message}</div><button id='close-select-popup' style='margin-top:10px; padding:8px 24px; font-size:1em; border-radius:8px; border:none; background:#d32f2f; color:#fff; font-weight:600; cursor:pointer;'>Close</button></div>`;
    document.body.appendChild(popup);
    document.getElementById("close-select-popup").onclick = () =>
      popup.remove();
  }
}

function hideStartUI() {
  const difficultyGrid = document.querySelector(".difficulty-grid");
  const modeButtons = document.querySelector(".mode-buttons");
  const timedInputContainer = document.getElementById("timed-input-container");
  const toscoreInputContainer = document.getElementById(
    "toscore-input-container"
  );
  const freeplayMessage = document.getElementById("freeplay-message");
  const startBtn = document.querySelector(".start-btn");

  if (difficultyGrid) difficultyGrid.style.display = "none";
  if (modeButtons) modeButtons.style.display = "none";
  if (timedInputContainer) timedInputContainer.style.display = "none";
  if (toscoreInputContainer) toscoreInputContainer.style.display = "none";
  if (freeplayMessage) freeplayMessage.style.display = "none";
  if (startBtn) startBtn.style.display = "none";

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
    modeButtons.previousElementSibling.textContent.includes("Select Game Mode")
  ) {
    modeButtons.previousElementSibling.style.display = "none";
  }
}

function showStartUI() {
  const difficultyGrid = document.querySelector(".difficulty-grid");
  const modeButtons = document.querySelector(".mode-buttons");
  const timedInputContainer = document.getElementById("timed-input-container");
  const toscoreInputContainer = document.getElementById(
    "toscore-input-container"
  );
  const freeplayMessage = document.getElementById("freeplay-message");
  const startBtn = document.querySelector(".start-btn");

  if (difficultyGrid) difficultyGrid.style.display = "grid";
  if (modeButtons) modeButtons.style.display = "flex";
  if (timedInputContainer) timedInputContainer.style.display = "none";
  if (toscoreInputContainer) toscoreInputContainer.style.display = "none";
  if (freeplayMessage) freeplayMessage.style.display = "none";
  if (startBtn) startBtn.style.display = "block";

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
    modeButtons.previousElementSibling.textContent.includes("Select Game Mode")
  ) {
    modeButtons.previousElementSibling.style.display = "block";
  }

  // Unselect all difficulty buttons
  if (difficultyGrid) {
    const difficultyBtns = difficultyGrid.querySelectorAll(".difficulty-btn");
    difficultyBtns.forEach((btn) => {
      btn.classList.remove("selected");
      btn.disabled = false;
    });
  }

  // Unselect all mode buttons
  if (modeButtons) {
    const modeBtns = modeButtons.querySelectorAll(".difficulty-btn");
    modeBtns.forEach((btn) => {
      btn.classList.remove("selected");
      btn.disabled = false;
    });
  }

  // Clear input fields
  const timedInput = document.getElementById("timed-minutes");
  const scoreInput = document.getElementById("toscore-score");
  if (timedInput) timedInput.value = "";
  if (scoreInput) scoreInput.value = "";

  // Hide scoreboard
  const scoreboard = document.getElementById("scoreboard");
  if (scoreboard) scoreboard.style.display = "none";
}

function setupGameMode(modeSelectedBtn) {
  // Store globally for restart functionality
  window._currentModeBtn = modeSelectedBtn;

  const scoreboard = document.getElementById("scoreboard");
  const scorePlayer = document.getElementById("score-player");
  const scoreDefender = document.getElementById("score-defender");

  if (scoreboard) scoreboard.style.display = "block";
  if (scorePlayer) scorePlayer.textContent = "0";
  if (scoreDefender) scoreDefender.textContent = "0";
  window._lastScoreMessage = null;

  const targetScoreContainer = document.getElementById("targetscore-container");
  const targetScoreValue = document.getElementById("targetscore-value");
  const timerContainer = document.getElementById("timer-container");
  const timerValue = document.getElementById("timer-value");
  const freeplayTimerContainer = document.getElementById(
    "freeplay-timer-container"
  );
  const freeplayTimerValue = document.getElementById("freeplay-timer-value");

  if (modeSelectedBtn && modeSelectedBtn.id === "toscore-btn") {
    const scoreInput = document.getElementById("toscore-score");
    const targetScore =
      scoreInput && scoreInput.value ? parseInt(scoreInput.value) : 0;
    if (targetScoreContainer && targetScoreValue) {
      targetScoreContainer.style.display = "block";
      targetScoreValue.textContent = targetScore;
      window._targetScore = targetScore;
    }
  } else if (targetScoreContainer) {
    targetScoreContainer.style.display = "none";
    window._targetScore = undefined;
  }

  if (modeSelectedBtn && modeSelectedBtn.id === "freeplay-btn") {
    if (freeplayTimerContainer && freeplayTimerValue) {
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
    }
  } else if (freeplayTimerContainer) {
    freeplayTimerContainer.style.display = "none";
    if (window._freeplayTimerInterval)
      clearInterval(window._freeplayTimerInterval);
  }

  if (modeSelectedBtn && modeSelectedBtn.id === "timed-btn") {
    if (timerContainer && timerValue) {
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
          return;
        }
        timerValue.textContent = formatTime(secondsLeft);
      }, 1000);
    }
  } else if (timerContainer) {
    timerContainer.style.display = "none";
  }
}

// Make setupGameMode and showStartUI accessible globally
window.setupGameMode = setupGameMode;
window.showStartUI = showStartUI;
