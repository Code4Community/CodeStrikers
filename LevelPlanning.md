Player functions:

moveRight() - Moves 1 space right
moveLeft() - Moves 1 space left
moveUp() - Moves 1 space up
moveDown() - Moves 1 space down
shootBall() - Shoot ball 4 spaces right
inFront() - if Defender is in a block to the right of the user, then return true, otherwise return false
lookLeft() - Used in penalty level and if goalie is in the left side of the goal, then return true, otherwise return false
lookMiddle() - Used in penalty level and if goalie is in the middle of the goal, then return true, otherwise return false
lookRight() - Used in penalty level and if goalie is in the right side of the goal, then return true, otherwise return false
shootLeft() - Used in penalty level and shoots the ball to the left side of goal
shootMiddle() - Used in penalty level and shoots the ball to the middle of the goal
shootRight() - Used in penalty level and shoots the ball to the right side of goal
wait() - waits 1 second
1st Level: The user has to move right certain number of times to get closer to the goal and shoot the ball to score with no defenders.

2nd Level: 2 defenders in front of goal. User would start in the middle left of screen. They would then move around both defenders and then back in front of goal to shoot and score. Here the user would not use any loops.

3rd Level: More difficult level. User starts on the left side of screen and needs to move to the right until they are in front of a defender where they need to move around and score a goal. Introducing while loops and new function called inFront().

4th Level: Penalty kick. There will be a goalie that takes up 1 of the 3 blocks in the goal and the user will need to shoot the ball in an open block where the goalie is not. Introduction of if/else-if statements and new functions called lookLeft(), lookMiddle(), lookRight(), shootLeft(), shootMiddle(), shootRight().

5th level: Introduce Moving Defenders. Defenders will only move up and down. User will have to implement a while loop using the wait() function to stop before running into a defender. After moving through all of the defenders the user will shoot the ball to score.