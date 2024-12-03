arr4 = getLevel(4);
var guards = []

function create4() {
    guards = [] 
    generateCheckerboard(this, 8); // Generate background
    setup(this)

    document.getElementById("nextLevel").addEventListener("click", (event) => {
      switchLevel("6");
    });

    document.getElementById("respawn").addEventListener("click", (event) => {
      gameOver = false;
      this.scene.restart();
    });

    document.getElementById("nextLevel").disabled = true;

    document.getElementById('level-select').value = '5';

    // GENERATE WALLS ---------------------------------------------------------------------
    // Create the horizontal walls and the vertical walls
    wall = this.physics.add.staticGroup();

    for(i=0; i<arr4.length; i++){
      for(j=0;j<arr4[i].length;j++){
        if(arr4[i][j]==9){
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
         else if (arr4[i][j] == 1){
           wall.create(j*40+20, i*40+20, "void");
         }
        //adding GUARD to that position
        else if(arr4[i][j]==3){
          guards = this.physics.add.sprite(j*40+20,i*40+8, "guard").setScale(guardScale);
          }
        //adding GEM to that position
        else if(arr4[i][j]==4){
          jewel = this.physics.add.sprite(j*40+20,i*40+20, "jewel").setScale(0.125);
          }
        }
       }
      
      for(i=0; i<arr4.length; i++){
        for(j=0;j<arr4[i].length;j++){
         //adding ROBBER to that position
         if(arr4[i][j]==2){
           player = this.physics.add.sprite(j*40+20,i*40+8, "dude").setScale(playerScale);
           player_start_current_level = [j*40+20,i*40+8];
           playerRow = i;
           playerCol = j;
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
  
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    // this.physics.add.overlap(player, jewel, collectJewel, null, this);
  }