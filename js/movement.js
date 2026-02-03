// ============================================
// MOVEMENT.JS - Player Movement Functions
// ============================================

// These movement functions are attached to the Player class
// They handle all player movement with smooth animations

async function moveRight() {
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
    if (window.soundManager) window.soundManager.playMove();
    if (this.game.soccerBall.isStuck) {
      this.game.soccerBall.stickToPlayer(this);
    }
    console.log(`Player moved right to x: ${this.x}`);
    // If we're on level 4, cause defenders to step asynchronously
    if (
      this.game &&
      typeof this.game.stepDefendersOnPlayerMove === "function"
    ) {
      this.game.stepDefendersOnPlayerMove();
    }
  } else {
    console.log(`Can't move right - boundary reached!`);
  }
}

async function moveLeft() {
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
    if (window.soundManager) window.soundManager.playMove();
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
    // If we're on level 4, cause defenders to step asynchronously
    if (
      this.game &&
      typeof this.game.stepDefendersOnPlayerMove === "function"
    ) {
      this.game.stepDefendersOnPlayerMove();
    }
  } else {
    console.log(`Can't move left - boundary reached!`);
  }
}

async function moveUp() {
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
    if (window.soundManager) window.soundManager.playMove();
    if (this.game.soccerBall.isStuck) {
      this.game.soccerBall.stickToPlayer(this);
    }
    console.log(`Player moved up to y: ${this.y}`);
    // If we're on level 4, cause defenders to step asynchronously
    if (
      this.game &&
      typeof this.game.stepDefendersOnPlayerMove === "function"
    ) {
      this.game.stepDefendersOnPlayerMove();
    }
  } else {
    console.log(`Can't move up - boundary reached!`);
  }
}

async function moveDown() {
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
    if (window.soundManager) window.soundManager.playMove();
    if (this.game.soccerBall.isStuck) {
      this.game.soccerBall.stickToPlayer(this);
    }
    console.log(`Player moved down to y: ${this.y}`);
    // If we're on level 4, cause defenders to step asynchronously
    if (
      this.game &&
      typeof this.game.stepDefendersOnPlayerMove === "function"
    ) {
      this.game.stepDefendersOnPlayerMove();
    }
  } else {
    console.log(`Can't move down - boundary reached!`);
  }
}

async function shootBall() {
  if (this.game.soccerBall.isStuck) {
    this.game.soccerBall.isStuck = false;
    this.game.soccerBall._isShooting = true; // Prevent re-sticking during shot
    if (window.soundManager) window.soundManager.playShoot();
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
