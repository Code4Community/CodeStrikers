// ============================================
// LEVELS.JS - Level Configuration and Management
// ============================================

window.LevelManager = {
  loadLevel: function (game, level) {
    game.currentLevel = level;
    game.defenders = [];

    // Place player at fixed coordinates
    game.player.x = 150;
    game.player.y = 220;
    game.player.startX = game.player.x;
    game.player.startY = game.player.y;

    // Level-specific configurations
    if (level === 2) {
      // Level 2: Two defenders around the ball
      game.soccerBall.x = 430;
      game.soccerBall.y = (game.height - game.soccerBall.height) / 2;
      game.soccerBall.isStuck = false;
      const defenderWidth = 60;
      game.defenders.push(
        new Defender(game, game.soccerBall.x - defenderWidth - 30, 250)
      );
      game.defenders.push(
        new Defender(game, game.soccerBall.x + game.soccerBall.width + 30, 250)
      );
    } else if (level === 3) {
      // Level 3: Three defenders spread horizontally
      game.soccerBall.x = (game.width - game.soccerBall.width) / 2;
      game.soccerBall.y = (game.height - game.soccerBall.height) / 2;
      game.soccerBall.isStuck = false;
      game.defenders.push(new Defender(game, 350, 250));
      game.defenders.push(new Defender(game, 150, 350));
      game.defenders.push(new Defender(game, 150, 150));
      game.defenders.push(new Defender(game, 200, 250));
      game.defenders.push(new Defender(game, 150, 450));
      game.defenders.push(new Defender(game, 250, 50));
      game.defenders.push(new Defender(game, 425, 150));
      game.defenders.push(new Defender(game, 425, 400));
      game.defenders.push(new Defender(game, 600, 250));
    } else if (level === 6) {
      // Level 6: 1v1 mode
      game.player.x = 160;
      game.player.y = 250;
      game.player.startX = game.player.x;
      game.player.startY = game.player.y;
      game.defenders.push(new Defender(game, 610, 250));
      game.soccerBall.x = 430;
      game.soccerBall.y = (game.height - game.soccerBall.height) / 2;
      game.soccerBall.isStuck = false;
    } else if (level === "bot") {
      // Bot mode: defender on right side
      game.player.x = 150;
      game.player.y = 220;
      game.player.startX = game.player.x;
      game.player.startY = game.player.y;
      game.defenders.push(new Defender(game, 610, 250));
      game.soccerBall.x = 430;
      game.soccerBall.y = (game.height - game.soccerBall.height) / 2;
      game.soccerBall.isStuck = false;
    } else {
      // Default: center ball for other levels
      game.soccerBall.x = (game.width - game.soccerBall.width) / 2;
      game.soccerBall.y = (game.height - game.soccerBall.height) / 2;
      game.soccerBall.isStuck = false;
    }

    console.log(`Level ${level} loaded`);
  },
};
