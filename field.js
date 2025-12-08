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

// Helper: check if two rectangles overlap
Game.rectsOverlap = function (a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
x);
};

Game.prototype.render = function (context) {
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
A     height: this.fieldRight.height - goalInset * 2,
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
ci if (
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

  // Draw defenders for level 2, 1v1 (level 6), and Bot mode
  if (
    (this.currentLevel === 2 ||
      this.currentLevel === 4 ||
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
};