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

    // Skip lines that are just closing braces
    if (trimmedLine === "}") return;

    // Check for for loop syntax
    if (trimmedLine.startsWith("for") || trimmedLine.startsWith("for(")) {
      // Basic validation for for loop
      if (
        !trimmedLine.includes("(") ||
        (!trimmedLine.includes("{") && !trimmedLine.endsWith(")"))
      ) {
        errors.push({
          line: index + 1,
          message: `Invalid for loop syntax. Use: for(let i = 0; i < N; i++) {`,
        });
      }
      return;
    }

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
          (f) => f + "()",
        ).join(", ")} or for loops`,
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

  // Highlight 'for' keyword
  escaped = escaped.replace(
    /\b(for)\b/g,
    `<span class="token-keyword">$1</span>`,
  );

  // Highlight function names
  FUNCTIONS.forEach((fn) => {
    const fnRegex = new RegExp(`\\b(${fn})(?=\\()`, "g");
    escaped = escaped.replace(
      fnRegex,
      `<span class="token-function">$1</span>`,
    );
  });

  // Highlight parentheses
  escaped = escaped.replace(/\(/g, `<span class="token-parens">(</span>`);
  escaped = escaped.replace(/\)/g, `<span class="token-parens">)</span>`);

  // Highlight curly braces
  escaped = escaped.replace(/\{/g, `<span class="token-braces">{</span>`);
  escaped = escaped.replace(/\}/g, `<span class="token-braces">}</span>`);

  // Highlight numbers
  escaped = escaped.replace(
    /\b(\d+)\b/g,
    `<span class="token-number">$1</span>`,
  );

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
      "Select Difficulty",
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
    const level = currentGame.currentLevel;
    // Disable back button on level 1
    backBtn.disabled = level === 1;
    // Disable next button only on 1v1 mode (the last level)
    nextBtn.disabled = level === 6;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("game-textbox");
  const difficultyButtons = document.querySelector(".difficulty-buttons");

  if (difficultyButtons) difficultyButtons.style.display = "none";

  // Global sound listener for all buttons
  document.body.addEventListener("click", (e) => {
    if (
      e.target.tagName === "BUTTON" ||
      (e.target.classList && e.target.classList.contains("difficulty-btn"))
    ) {
      if (window.soundManager) {
        window.soundManager.playClick();
      }
    }
  });

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

    if (e.key === "Enter") {
      e.preventDefault();
      const text = editor.innerText || "";

      // Check if cursor is between {}
      const charBefore = text.charAt(caretPos - 1);
      const charAfter = text.charAt(caretPos);

      if (charBefore === "{" && charAfter === "}") {
        // Insert two newlines with indentation in between
        range.deleteContents();
        const newlines = document.createTextNode("\n  \n");
        range.insertNode(newlines);

        // Move caret to the indented line (after first \n and two spaces)
        setCaretAtPos(editor, caretPos + 3);
      } else {
        // Regular newline
        range.deleteContents();
        const br = document.createTextNode("\n");
        range.insertNode(br);

        // Move caret after the newline
        range.setStartAfter(br);
        range.setEndAfter(br);
        sel.removeAllRanges();
        sel.addRange(range);
      }

      // Trigger input to update highlighting
      editor.dispatchEvent(new Event("input"));
      return;
    }

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

    if (e.key === "{") {
      e.preventDefault();
      // Replace any selection with paired braces and place caret between
      range.deleteContents();

      const openNode = document.createTextNode("{");
      const closeNode = document.createTextNode("}");

      // Insert close then open so caret can be placed between them
      range.insertNode(closeNode);
      range.insertNode(openNode);

      // Move caret between the two nodes
      const newPos = caretPos + 1; // after '{'
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

    if (e.key === "}") {
      // If the next character in plain text is already '}', skip over it
      const text = editor.innerText || "";
      if (text.charAt(caretPos) === "}") {
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
    if (!currentGame) return;

    let nextLevel;
    if (typeof currentGame.currentLevel === "number") {
      if (currentGame.currentLevel < 4) {
        nextLevel = currentGame.currentLevel + 1;
      } else if (currentGame.currentLevel === 4) {
        nextLevel = "bot";
      }
    } else if (currentGame.currentLevel === "bot") {
      nextLevel = 6;
    }

    if (nextLevel !== undefined) {
      currentGame.removeGoalers();
      currentGame.loadLevel(nextLevel);
      document.getElementById("level-dropdown").value = nextLevel;
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
      updateUIForLevel(nextLevel);
      updateLevelButtons();
    }
  });

  document.getElementById("back-level-btn").addEventListener("click", () => {
    showAllGameButtons();
    const currentGame = window.currentGame;
    if (!currentGame) return;

    let prevLevel;
    if (currentGame.currentLevel === 6) {
      prevLevel = "bot";
    } else if (currentGame.currentLevel === "bot") {
      prevLevel = 4;
    } else if (
      typeof currentGame.currentLevel === "number" &&
      currentGame.currentLevel > 1
    ) {
      prevLevel = currentGame.currentLevel - 1;
    }

    if (prevLevel !== undefined) {
      currentGame.removeGoalers();
      currentGame.loadLevel(prevLevel);
      document.getElementById("level-dropdown").value = prevLevel;
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
      updateUIForLevel(prevLevel);
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
      currentGame.removeGoalers();
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
      "timed-input-container",
    );
    const toscoreBtn = document.getElementById("toscore-btn");
    const toscoreInputContainer = document.getElementById(
      "toscore-input-container",
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

  // Goalers buttons for bot mode
  const goalersButtonsContainer = document.querySelector(".goalers-buttons");
  if (goalersButtonsContainer) {
    const goalersButtons =
      goalersButtonsContainer.querySelectorAll(".difficulty-btn");
    const goalersOffBtn = document.getElementById("goalers-off-btn");
    const goalersOnBtn = document.getElementById("goalers-on-btn");

    goalersButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        goalersButtons.forEach((b) => {
          b.classList.remove("selected");
          b.disabled = false;
        });
        btn.classList.add("selected");
        btn.disabled = true;

        // Add or remove goalers based on selection
        if (window.currentGame) {
          if (btn === goalersOnBtn) {
            window.currentGame.addGoalers();
          } else {
            window.currentGame.removeGoalers();
          }
        }
      });
    });
  }

  // Start button
  const startBtn = document.querySelector(".start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      const difficultyGrid = document.querySelector(".difficulty-grid");
      const difficultySelected =
        difficultyGrid &&
        Array.from(difficultyGrid.querySelectorAll(".difficulty-btn")).some(
          (btn) => btn.classList.contains("selected"),
        );
      const modeButtons = document.querySelector(".mode-buttons");
      const modeSelectedBtn =
        modeButtons &&
        Array.from(modeButtons.querySelectorAll(".difficulty-btn")).find(
          (btn) => btn.classList.contains("selected"),
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
          "Please select a difficulty, mode, and enter a value if required.",
        );
        return;
      }

      if (window.currentGame && window.currentGame.currentLevel === "bot") {
        window.currentGame.botModeStarted = true;
        // Store the selected difficulty
        const selectedDifficultyBtn = Array.from(
          difficultyGrid.querySelectorAll(".difficulty-btn"),
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

      // Play start sound
      if (window.soundManager) {
        window.soundManager.playStart();
      }
    });
  }

  // Mode button selection for 1v1
  const modeButtonsContainer1v1 = document.querySelector(".mode-buttons-1v1");
  if (modeButtonsContainer1v1) {
    const modeButtons1v1 =
      modeButtonsContainer1v1.querySelectorAll(".difficulty-btn");
    const timedBtn1v1 = document.getElementById("timed-btn-1v1");
    const timedInputContainer1v1 = document.getElementById(
      "timed-input-container-1v1",
    );
    const toscoreBtn1v1 = document.getElementById("toscore-btn-1v1");
    const toscoreInputContainer1v1 = document.getElementById(
      "toscore-input-container-1v1",
    );
    const freeplayBtn1v1 = document.getElementById("freeplay-btn-1v1");
    const freeplayMessage1v1 = document.getElementById("freeplay-message-1v1");

    modeButtons1v1.forEach((btn) => {
      btn.addEventListener("click", () => {
        modeButtons1v1.forEach((b) => {
          b.classList.remove("selected");
          b.disabled = false;
        });
        btn.classList.add("selected");
        btn.disabled = true;

        if (btn === timedBtn1v1) {
          if (timedInputContainer1v1)
            timedInputContainer1v1.style.display = "block";
          if (toscoreInputContainer1v1)
            toscoreInputContainer1v1.style.display = "none";
          if (freeplayMessage1v1) freeplayMessage1v1.style.display = "none";
        } else if (btn === toscoreBtn1v1) {
          if (timedInputContainer1v1)
            timedInputContainer1v1.style.display = "none";
          if (toscoreInputContainer1v1)
            toscoreInputContainer1v1.style.display = "block";
          if (freeplayMessage1v1) freeplayMessage1v1.style.display = "none";
        } else if (btn === freeplayBtn1v1) {
          if (timedInputContainer1v1)
            timedInputContainer1v1.style.display = "none";
          if (toscoreInputContainer1v1)
            toscoreInputContainer1v1.style.display = "none";
          if (freeplayMessage1v1) freeplayMessage1v1.style.display = "block";
        } else {
          if (timedInputContainer1v1)
            timedInputContainer1v1.style.display = "none";
          if (toscoreInputContainer1v1)
            toscoreInputContainer1v1.style.display = "none";
          if (freeplayMessage1v1) freeplayMessage1v1.style.display = "none";
        }
      });
    });
  }

  // Goalers buttons for 1v1
  const goalersButtonsContainer1v1 = document.querySelector(
    ".goalers-buttons-1v1",
  );
  if (goalersButtonsContainer1v1) {
    const goalersButtons1v1 =
      goalersButtonsContainer1v1.querySelectorAll(".difficulty-btn");
    const goalersOffBtn1v1 = document.getElementById("goalers-off-btn-1v1");
    const goalersOnBtn1v1 = document.getElementById("goalers-on-btn-1v1");

    goalersButtons1v1.forEach((btn) => {
      btn.addEventListener("click", () => {
        goalersButtons1v1.forEach((b) => {
          b.classList.remove("selected");
          b.disabled = false;
        });
        btn.classList.add("selected");
        btn.disabled = true;

        // Add or remove goalers based on selection
        if (window.currentGame) {
          if (btn === goalersOnBtn1v1) {
            window.currentGame.addGoalers();
          } else {
            window.currentGame.removeGoalers();
          }
        }
      });
    });
  }

  // Start button for 1v1
  const start1v1Btn = document.getElementById("start-btn-1v1");
  if (start1v1Btn) {
    start1v1Btn.addEventListener("click", () => {
      const modeButtons1v1 = document.querySelector(".mode-buttons-1v1");
      const modeSelectedBtn1v1 =
        modeButtons1v1 &&
        Array.from(modeButtons1v1.querySelectorAll(".difficulty-btn")).find(
          (btn) => btn.classList.contains("selected"),
        );

      let validInput = true;
      if (modeSelectedBtn1v1 && modeSelectedBtn1v1.id === "timed-btn-1v1") {
        const timedInput = document.getElementById("timed-minutes-1v1");
        const timedVal =
          timedInput && timedInput.value ? parseInt(timedInput.value) : 0;
        validInput = timedInput && timedVal >= 1 && timedVal <= 20;
        if (timedInput && (timedVal < 1 || timedVal > 20)) {
          showPopup("Please choose a time between 1 and 20 minutes.");
          return;
        }
      } else if (
        modeSelectedBtn1v1 &&
        modeSelectedBtn1v1.id === "toscore-btn-1v1"
      ) {
        const scoreInput = document.getElementById("toscore-score-1v1");
        const scoreVal =
          scoreInput && scoreInput.value ? parseInt(scoreInput.value) : 0;
        validInput = scoreInput && scoreVal >= 1 && scoreVal <= 100;
        if (scoreInput && (scoreVal < 1 || scoreVal > 100)) {
          showPopup("Please choose a score between 1 and 100.");
          return;
        }
      }

      if (!modeSelectedBtn1v1 || !validInput) {
        showPopup("Please select a game mode and enter a value if required.");
        return;
      }

      if (window.currentGame && window.currentGame.currentLevel === 6) {
        window.currentGame.mode1v1Started = true;
        // Initialize scores to 0
        window.currentGame.playerScore = 0;
        window.currentGame.defenderScore = 0;
      }

      hide1v1StartUI();

      // Store the mode button globally for play again functionality
      window._currentModeBtn1v1 = modeSelectedBtn1v1;

      setupGameMode1v1(modeSelectedBtn1v1);
    });
  }

  // Keyboard controls for 1v1 and bot mode
  window.addEventListener("keydown", (e) => {
    const currentGame = window.currentGame;
    if (
      currentGame &&
      currentGame.currentLevel === 6 &&
      currentGame.mode1v1Started
    ) {
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
    if (
      currentGame &&
      currentGame.currentLevel === 6 &&
      currentGame.mode1v1Started
    ) {
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

  // End game button for freeplay mode
  const endGameBtn = document.getElementById("end-game-btn");
  if (endGameBtn) {
    endGameBtn.addEventListener("click", () => {
      const currentGame = window.currentGame;
      if (!currentGame) return;

      // Get the time played
      const freeplayTimerValue = document.getElementById(
        "freeplay-timer-value",
      );
      const timePlayed = freeplayTimerValue
        ? freeplayTimerValue.textContent
        : "0:00";

      // Determine which mode we're in
      if (currentGame.currentLevel === "bot") {
        currentGame.showFreeplayEndPopup(timePlayed);
      } else if (currentGame.currentLevel === 6) {
        currentGame.showFreeplayEndPopup1v1(timePlayed);
      }
    });
  }

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
  const difficultyButtons = document.querySelector(".difficulty-buttons");
  const mode1v1Buttons = document.getElementById("mode-1v1-buttons");

  if (level === "bot") {
    if (difficultyButtons) difficultyButtons.style.display = "flex";
    if (mode1v1Buttons) mode1v1Buttons.style.display = "none";
    editor.style.display = "none";
    editor.contentEditable = "false";
    editor.classList.remove("enabled");
    editor.innerHTML = "";
    if (scoreboard) scoreboard.style.display = "none";
    if (runBtn) runBtn.style.display = "none";
    if (clearBtn) clearBtn.style.display = "none";
  } else if (level === 6) {
    if (difficultyButtons) difficultyButtons.style.display = "none";
    if (window.currentGame && window.currentGame.mode1v1Started) {
      if (mode1v1Buttons) mode1v1Buttons.style.display = "none";
      if (scoreboard) scoreboard.style.display = "block";
    } else {
      if (mode1v1Buttons) mode1v1Buttons.style.display = "flex";
      if (scoreboard) scoreboard.style.display = "none";
    }
    editor.style.display = "none";
    editor.contentEditable = "false";
    editor.classList.remove("enabled");
    editor.innerHTML = "";
    if (runBtn) runBtn.style.display = "none";
    if (clearBtn) clearBtn.style.display = "none";
  } else {
    if (difficultyButtons) difficultyButtons.style.display = "none";
    if (mode1v1Buttons) mode1v1Buttons.style.display = "none";
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

function hide1v1StartUI() {
  const mode1v1Buttons = document.getElementById("mode-1v1-buttons");
  if (mode1v1Buttons) mode1v1Buttons.style.display = "none";
}

function show1v1StartUI() {
  const mode1v1Buttons = document.getElementById("mode-1v1-buttons");
  const timedInputContainer1v1 = document.getElementById(
    "timed-input-container-1v1",
  );
  const toscoreInputContainer1v1 = document.getElementById(
    "toscore-input-container-1v1",
  );
  const freeplayMessage1v1 = document.getElementById("freeplay-message-1v1");

  if (mode1v1Buttons) mode1v1Buttons.style.display = "flex";
  if (timedInputContainer1v1) timedInputContainer1v1.style.display = "none";
  if (toscoreInputContainer1v1) toscoreInputContainer1v1.style.display = "none";
  if (freeplayMessage1v1) freeplayMessage1v1.style.display = "none";

  // Unselect all mode buttons
  const modeButtons1v1 = document.querySelector(".mode-buttons-1v1");
  if (modeButtons1v1) {
    const modeBtns = modeButtons1v1.querySelectorAll(".difficulty-btn");
    modeBtns.forEach((btn) => {
      btn.classList.remove("selected");
      btn.disabled = false;
    });
  }

  // Clear input fields
  const timedInput = document.getElementById("timed-minutes-1v1");
  const scoreInput = document.getElementById("toscore-score-1v1");
  if (timedInput) timedInput.value = "";
  if (scoreInput) scoreInput.value = "";

  // Hide scoreboard
  const scoreboard = document.getElementById("scoreboard");
  if (scoreboard) scoreboard.style.display = "none";
}

function setupGameMode1v1(modeSelectedBtn) {
  // Store globally for restart functionality
  window._currentModeBtn1v1 = modeSelectedBtn;

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
    "freeplay-timer-container",
  );
  const freeplayTimerValue = document.getElementById("freeplay-timer-value");
  const endGameBtn = document.getElementById("end-game-btn");

  if (modeSelectedBtn && modeSelectedBtn.id === "toscore-btn-1v1") {
    const scoreInput = document.getElementById("toscore-score-1v1");
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

  if (modeSelectedBtn && modeSelectedBtn.id === "freeplay-btn-1v1") {
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
  } else {
    if (freeplayTimerContainer) {
      freeplayTimerContainer.style.display = "none";
      if (window._freeplayTimerInterval)
        clearInterval(window._freeplayTimerInterval);
    }
  }

  // Show End Game button for all modes
  if (endGameBtn) endGameBtn.style.display = "block";

  if (modeSelectedBtn && modeSelectedBtn.id === "timed-btn-1v1") {
    if (timerContainer && timerValue) {
      const timedInput = document.getElementById("timed-minutes-1v1");
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

function hideStartUI() {
  const difficultyGrid = document.querySelector(".difficulty-grid");
  const modeButtons = document.querySelector(".mode-buttons");
  const timedInputContainer = document.getElementById("timed-input-container");
  const toscoreInputContainer = document.getElementById(
    "toscore-input-container",
  );
  const freeplayMessage = document.getElementById("freeplay-message");
  const startBtn = document.querySelector(".start-btn");
  const goalersButtons = document.querySelector(".goalers-buttons");

  if (difficultyGrid) difficultyGrid.style.display = "none";
  if (modeButtons) modeButtons.style.display = "none";
  if (timedInputContainer) timedInputContainer.style.display = "none";
  if (toscoreInputContainer) toscoreInputContainer.style.display = "none";
  if (freeplayMessage) freeplayMessage.style.display = "none";
  if (startBtn) startBtn.style.display = "none";
  if (goalersButtons) goalersButtons.style.display = "none";

  if (
    difficultyGrid &&
    difficultyGrid.previousElementSibling &&
    difficultyGrid.previousElementSibling.textContent.includes(
      "Select Difficulty",
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
  // Hide Goalers label
  if (
    goalersButtons &&
    goalersButtons.previousElementSibling &&
    goalersButtons.previousElementSibling.textContent.includes("Goalers")
  ) {
    goalersButtons.previousElementSibling.style.display = "none";
  }
}

function showStartUI() {
  const difficultyGrid = document.querySelector(".difficulty-grid");
  const modeButtons = document.querySelector(".mode-buttons");
  const timedInputContainer = document.getElementById("timed-input-container");
  const toscoreInputContainer = document.getElementById(
    "toscore-input-container",
  );
  const freeplayMessage = document.getElementById("freeplay-message");
  const startBtn = document.querySelector(".start-btn");
  const goalersButtons = document.querySelector(".goalers-buttons");

  if (difficultyGrid) difficultyGrid.style.display = "grid";
  if (modeButtons) modeButtons.style.display = "flex";
  if (timedInputContainer) timedInputContainer.style.display = "none";
  if (toscoreInputContainer) toscoreInputContainer.style.display = "none";
  if (freeplayMessage) freeplayMessage.style.display = "none";
  if (startBtn) startBtn.style.display = "block";
  if (goalersButtons) goalersButtons.style.display = "flex";

  if (
    difficultyGrid &&
    difficultyGrid.previousElementSibling &&
    difficultyGrid.previousElementSibling.textContent.includes(
      "Select Difficulty",
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
  // Show Goalers label
  if (
    goalersButtons &&
    goalersButtons.previousElementSibling &&
    goalersButtons.previousElementSibling.textContent.includes("Goalers")
  ) {
    goalersButtons.previousElementSibling.style.display = "block";
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
    "freeplay-timer-container",
  );
  const freeplayTimerValue = document.getElementById("freeplay-timer-value");
  const endGameBtn = document.getElementById("end-game-btn");

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
  } else {
    if (freeplayTimerContainer) {
      freeplayTimerContainer.style.display = "none";
      if (window._freeplayTimerInterval)
        clearInterval(window._freeplayTimerInterval);
    }
  }

  // Show End Game button for all modes
  if (endGameBtn) endGameBtn.style.display = "block";

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

// Make functions accessible globally
window.setupGameMode = setupGameMode;
window.showStartUI = showStartUI;
window.setupGameMode1v1 = setupGameMode1v1;
window.show1v1StartUI = show1v1StartUI;
