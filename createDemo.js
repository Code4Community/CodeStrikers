
arr0 = getLevel(0);
var guards = []

function createDemo() {
  guards = []
  document.getElementById("nextLevel").addEventListener("click", (event) => {
    switchLevel("2");
  });

  document.getElementById("respawn").addEventListener("click", (event) => {
    gameOver = false;
    this.scene.restart();
  });

  document.getElementById("nextLevel").disabled = true;

  document.getElementById('level-select').value = '1';


  avoidGuard = this.physics.add.staticGroup();
  avoidGuard.create(400, CENTER_VERTICAL + 200, "AvoidGuards").setScale(0.75);


  array_levDemo = getLevel(0);
  generateCheckerboard(this, 8); // Generate background
  setup(this);

  // GENERATE WALLS ---------------------------------------------------------------------
  // Create the horizontal walls and the vertical walls
  wall = this.physics.add.staticGroup();

  //Sets framework for multiple guards, adds them to an array to be used in collisions
  guardIndex = 0;

  for (i = 0; i < arr0.length; i++){
    for(j=0; j < arr0[i].length; j++){
      if (arr0[i][j] ==9){
        wallkind = Math.floor(Math.random() * (10 - 1 + 1) + 1);
        if (wallkind == 1 || wallkind == 4 || wallkind == 7){
          wall.create(j*40+20, i*40+20, "wallS");
        }
        else if (wallkind == 2 || wallkind == 5 || wallkind == 8){
          wall.create(j*40+20, i*40+20, "wallSR");
        }
        else if (wallkind == 3 || wallkind == 6 || wallkind == 9){
          wall.create(j*40+20, i*40+20, "wallDS");
        }
        else if (wallkind == 10){
          wallkind = Math.floor(Math.random() * (5 - 1 + 1) + 1);
          if (wallkind == 1){
            wall.create(j*40+20, i*40+20, "painting1");
          }
          else if (wallkind == 2){
            wall.create(j*40+20, i*40+20, "painting2");
          }
          else if (wallkind == 3){
            wall.create(j*40+20, i*40+20, "painting3");
          }
          else if (wallkind == 4){
            wall.create(j*40+20, i*40+20, "painting4");
          }
          else if (wallkind == 5){
            wall.create(j*40+20, i*40+20, "wall_light");
          }
        }

       // wall.create(j*40+20, i*40+20, "wall");

      }
      else if (arr0[i][j] == 1){
        wall.create(j*40+20, i*40+20, "void");
      }
      //adding guard to that position
      else if(arr0[i][j]==3){
        //adds the guards to the array of guards
        guards[guardIndex] = this.physics.add.sprite(j*40+20,i*40+20, "guard").setScale(guardScale);
        guardIndex++;
      }
      //adding gem to that position
      else if(arr0[i][j]==4){
        jewel = this.physics.add.sprite(j*40+20,i*40+20, "jewel").setScale(0.125);
      }
    }
  }
  for(i=0; i<arr0.length; i++){
    for(j=0;j<arr0[i].length;j++){
     //adding ROBBER to that position
     if(arr0[i][j]==2){
       player = this.physics.add.sprite(j*40+20,i*40+8, "dude").setScale(playerScale);
       playerRow = i;
       playerCol = j;
       player_start_current_level = [j*40+20,i*40+8];
      }
    }
  }
  player.setDepth(2);
  for (i = 0; i < guards.length; i++){
    guards[i].setDepth(3);
  }
  jewel.setDepth(1);

  avoidGuard = this.physics.add.staticGroup();
  avoidGuard.create(400, CENTER_VERTICAL + 175, "AvoidGuards").setScale(1);

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(guards, wall);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  // this.physics.add.overlap(player, jewel, collectJewel, null, this);
  
  // this.hitGuard = hitGuard.bind(this);

  // logo = this.add.image(400, 150, 'jewelg');

}