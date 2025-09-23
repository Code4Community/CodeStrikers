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
    this.x = 400;
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

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate);
  }

  animate();
}
