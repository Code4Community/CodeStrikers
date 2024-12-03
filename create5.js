arr5 = getLevel(5);
var guards = []

function create5() {
    guards = [] 
    generateCheckerboard(this, 8); // Generate background
    setup(this);

    document.getElementById("respawn").addEventListener("click", (event) => {
      gameOver = false;
      this.scene.restart();
    });


    document.getElementById("nextLevel").disabled = true;

    document.getElementById('level-select').value = '6';

    // The player and its settings
    // GENERATE WALLS ---------------------------------------------------------------------
    // Create the horizontal walls and the vertical walls
    wall = this.physics.add.staticGroup();

    //Sets framework for multiple guards, adds them to an array to be used in collisions
        guardIndex = 0;

    //Sets framework for the laser, adds them to an array to be used in collisions
    var lasers = []
    lasersIndex = 0;

    for(i=0; i<arr5.length; i++){
      for(j=0;j<arr5[i].length;j++){
        if(arr5[i][j]==9){
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
          //wall.create(j*40+20,i*40+20, "wall");
         }
         else if (arr5[i][j] == 1){
           wall.create(j*40+20, i*40+20, "void");
         }
        //adding GUARD to that position
        else if(arr5[i][j]==3){
          //adds the guards to the array of guards
          guards[guardIndex] = this.physics.add.sprite(j*40+20,i*40+8, "guard").setScale(guardScale);
          guardIndex++;
          }
        else if(arr5[i][j]==7){
          //adds the guards to the array of guards
          guards[guardIndex] = this.physics.add.sprite(j*40+20,i*40+8, "GuardLightH").setScale(guardScale);
          guardIndex++;
          }
        else if(arr5[i][j]==8){
          //adds the guards to the array of guards
          guards[guardIndex] = this.physics.add.sprite(j*40+20,i*40+8, "GuardLightV").setScale(guardScale);
          guardIndex++;
          }
        //adding GEM to that position
        else if(arr5[i][j]==4){
          jewel = this.physics.add.sprite(j*40+20,i*40+20, "jewel").setScale(0.125);
          }
          //adding HORIZONTAL LASER to that position
        else if(arr5[i][j]==5){
          lasers[lasersIndex] = this.physics.add.sprite(j*40+20,i*40+20, "laserH");
          lasersIndex++;
          }
          //adding VERTICAL LASER to that position
        else if(arr5[i][j]==6){
          lasers[lasersIndex] = this.physics.add.sprite(j*40+20,i*40+20, "laserV");
          lasersIndex++;
          }
        }
       }
       for(i=0; i<arr5.length; i++){
        for(j=0;j<arr5[i].length;j++){
         //adding ROBBER to that position
         if(arr5[i][j]==2){
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
    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
  
    this.physics.add.collider(guards, wall);
  
    // this.physics.add.overlap(player, jewel, collectJewel, null, this);

    // this.physics.add.collider(player, lasers, hitGuard, null, this);
    }