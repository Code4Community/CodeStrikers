# ⚽ Code Strikers

## 🎮 Overview

**Code Strikers** is an interactive browser-based soccer programming game that teaches coding through gameplay. Players write JavaScript code to control a soccer player, navigate around defenders, and score goals. The game combines the excitement of soccer with fundamental programming concepts, making it perfect for beginners learning to code.

Built with vanilla HTML, CSS, and JavaScript, Code Strikers features:

- 🎯 **Progressive Learning Levels** - Start simple and advance to complex challenges
- 🤖 **AI Bot Mode** - Four difficulty levels with intelligent opponents
- 👥 **Local Multiplayer** - 1v1 mode for competitive play with friends
- 💻 **Professional Code Editor** - Syntax highlighting, line numbers, and auto-indentation
- ⚡ **Real-time Execution** - Watch your code come to life on the field
- 🎨 **Polished UI** - Animated sprites, smooth gameplay, and sound effects

---

## 🚀 Quick Start

1. **Clone or download** this repository
2. **Open `index.html`** in any modern web browser (Chrome, Firefox, Safari, Edge)
3. **Select a level** from the dropdown menu
4. **Click "Start"** to begin playing
5. **Write code** in the editor and click **"Run"** to execute it

No installation, dependencies, or setup required - just open and play!

---

## 📚 How to Play

### Programming Levels (1-4)

1. **Select a Level:** Choose from the level dropdown (Level 1-4 for programming challenges)
2. **Write Code:** Type JavaScript commands in the code editor to control your player
3. **Run Your Code:** Click the green **"Run"** button to execute your program
4. **Watch It Execute:** Your player animates each command in sequence
5. **Score Goals:** Navigate around defenders and shoot the ball into the goal
6. **Learn & Iterate:** Use syntax errors and feedback to improve your code

### Interactive Modes (Bot & 1v1)

For **Bot Mode** and **1v1 Mode**, you control players in real-time using keyboard controls instead of writing code. Choose your game mode (Timed, To Score, or Freeplay) and difficulty settings before starting.

---

## 🎮 Available Commands

### Movement Functions

- `moveRight()` – Move player 1 space to the right
- `moveLeft()` – Move player 1 space to the left
- `moveUp()` – Move player 1 space up
- `moveDown()` – Move player 1 space down

### Action Functions

- `shootBall()` – Shoot the ball 4 spaces to the right toward the goal

### Loop Functions

- `repeat(N):` – Repeat the indented code block N times (Python-style syntax)

**Note:** Use proper indentation (2 spaces) for code inside `repeat()` blocks. The editor supports auto-indentation when you press Enter after the colon.

---

## 🎯 Game Levels

### Level 1: Basic Movement

**Learning Goal:** Sequential commands and function calls

**Challenge:** Move right and shoot to score. No defenders to worry about.

**Example Solution:**

```javascript
moveRight();
moveRight();
moveRight();
moveRight();
moveRight();
shootBall();
```

---

### Level 2: Navigation

**Learning Goal:** Planning paths and avoiding obstacles

**Challenge:** Two static defenders block your path. Navigate around them without colliding.

**Example Solution:**

```javascript
moveRight();
moveRight();
moveUp();
moveRight();
moveRight();
moveDown();
shootBall();
```

---

### Level 3: Loops & Patterns

**Learning Goal:** Using `repeat()` for efficiency

**Challenge:** Multiple defenders scattered across the field. Use loops to write cleaner code.

**Example Solution:**

```javascript
repeat(3):
  moveRight()
  moveUp()
repeat(2):
  moveRight()
shootBall()
```

**Key Concept:** Instead of writing `moveRight()` five times, use `repeat(5):` to make your code more elegant and maintainable.

---

### Level 4: Dynamic Obstacles

**Learning Goal:** Timing and observation

**Challenge:** Defenders move up and down in patterns. Time your movements carefully to avoid collisions.

**Strategy:** Watch the defender patterns, then write code that moves through safe zones at the right moments.

---

## 🤖 Bot Mode

Test your skills against an AI-controlled opponent! The bot uses pathfinding and decision-making algorithms to chase the ball, defend the goal, and shoot.

### Difficulty Levels

**🟢 Easy**

- Slow movement speed
- Basic shooting mechanics
- Simple ball-chasing AI
- Perfect for beginners

**🟡 Medium**

- Faster movement
- Improved shooting accuracy
- Predictive interception - tries to cut off your path
- Good challenge for intermediate players

**🔴 Hard**

- Quick, responsive movement
- Advanced dodging mechanics - can avoid your shots
- Smart positioning between you and the goal
- Aggressive tackling behavior

**⚫ Impossible**

- Lightning-fast reactions
- Master-level tactics and feints
- Unpredictable movement patterns
- Extremely difficult to beat

### Game Modes

**⏱️ Timed Mode**

- Race against the clock (set custom duration from 1-20 minutes)
- Score as many goals as possible before time runs out
- Highest score wins

**🎯 To Score Mode**

- First to reach the target score wins
- Set custom winning score (1-100 points)
- Best for competitive matches

**∞ Freeplay Mode**

- No time limit or score target
- Practice and experiment freely
- End the game manually when ready

### Goaler Toggle

Turn goalkeepers ON or OFF for both modes. Goalers add an extra challenge by blocking shots at the goal.

---

## 👥 1v1 Mode

Challenge a friend in local multiplayer! Two players compete head-to-head on the same keyboard.

### Controls

**Player 1 (Blue - Left Side)**

- **W** - Move up
- **A** - Move left
- **S** - Move down
- **D** - Move right
- **SPACE** - Shoot (hold to charge power, release to shoot)

**Player 2 (Red - Right Side)**

- **↑** - Move up
- **←** - Move left
- **↓** - Move down
- **→** - Move right
- **M** - Shoot (hold to charge power, release to shoot)

### Shooting Mechanics

Press and **hold** the shoot button to charge up power (watch the power bar fill up), then **release** to shoot. The longer you hold, the more powerful and faster the shot!

### 1v1 Game Modes

Same as Bot Mode - choose **Timed**, **To Score**, or **Freeplay** with optional goalers.

---

## ✨ Code Editor Features

### Syntax Highlighting

- **Keywords** (`repeat`, `for`) in blue
- **Function names** in orange
- **Numbers** in teal
- **Parentheses** and **braces** color-coded
- **Colons** highlighted in red

### Smart Editor Behaviors

- ✅ **Auto-closing parentheses** - Type `(` and `)` appears automatically
- ✅ **Auto-indentation** - Press Enter after `repeat(N):` to auto-indent with 2 spaces
- ✅ **Line numbers** - Professional IDE-style line numbering that scrolls with your code
- ✅ **Tab support** - Press Tab to insert 2 spaces for indentation
- ✅ **Real-time syntax errors** - See errors highlighted as you type
- ✅ **Code validation** - Checks for invalid commands before running

### Keyboard Shortcuts

- **Enter** after `repeat(N):` → Auto-indent next line
- **Tab** → Insert 2 spaces
- **Ctrl+A** / **Cmd+A** → Select all code
- **Ctrl+V** / **Cmd+V** → Paste code

---

## 🎓 What You'll Learn

### Programming Concepts

- **Sequential Execution** - Code runs line by line from top to bottom
- **Function Calls** - Using pre-defined functions to perform actions
- **Loops** - Repeating code blocks efficiently with `repeat(N):`
- **Indentation** - Proper code formatting and scope
- **Debugging** - Reading error messages and fixing syntax issues
- **Problem Solving** - Breaking down challenges into smaller steps

### Computational Thinking

- **Algorithm Design** - Planning step-by-step solutions
- **Pattern Recognition** - Identifying repetitive actions
- **Abstraction** - Using loops instead of repetition
- **Decomposition** - Breaking complex problems into simple commands
- **Testing & Iteration** - Running code, observing results, and improving

---

## 🛠️ Technical Features

### Architecture

- **Vanilla JavaScript** - No frameworks or libraries required
- **HTML5 Canvas** - Smooth 60 FPS animations
- **CSS3** - Modern styling with animations and transitions
- **ContentEditable** - Custom-built code editor

### Game Engine

- **Collision Detection** - Precise player-defender and ball-goal collision
- **Physics Simulation** - Ball rolling, shooting mechanics, and momentum
- **Pathfinding AI** - Bot uses smart decision-making for movement
- **Animation System** - Smooth sprite animations and transitions

### Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 📁 Project Structure

```
CodeStrikers/
├── index.html          # Main game page
├── styles.css          # All styling and animations
├── ui.js               # UI controls, editor, event handlers
├── main.js             # Game engine, physics, AI
├── levels.js           # Level configurations
├── movement.js         # Player movement logic
├── field.js            # Soccer field rendering
├── sound.js            # Sound effects manager
├── assets/             # Images and sprites
│   ├── attacker.png
│   ├── defender.png
│   ├── soccer.png
│   ├── soccer_goal.png
│   └── soccer_field.png
└── README.md
```

---
