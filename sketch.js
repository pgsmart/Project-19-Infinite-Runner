var towerImg, tower;
var doorImg, door, doorsGroup;
var climberImg, climber, climbersGroup;
var ghost, ghostImg, ghostJumpingImg;
var invisibleBlockGroup, invisibleBlock;
var gameState = "play"
var doorPos = 0;
var number1;
var score = 0;
var check = false;
var lava, lavaVisible, lavaImg;
var bottomEdge;
var TouchClimber = false;
var gameState = "PLAY";
var gameOver, gameOverImg;
var obstacle, obstacleImg1, obstacleImg2, obstacleGroup;
var gameStartDrop = false;
var numberOfDoor = 0;
var timer = 5;
var destroyObstacleButton;
var scoreSetback = 0;
var destroyError = false;

function preload(){
  towerImg = loadImage("tower.png");
  doorImg = loadImage("door.png");
  climberImg = loadImage("climber.png");
  ghostImg = loadImage("ghost-standing.png");
  spookySound = loadSound("spooky.wav");
  ghostJumpingImg = loadImage("ghost-jumping.png");
  lavaImg = loadImage("lavagame.jpg");
  gameOverImg = loadImage("gameOver.png");
  obstacleImg1 = loadImage("obstacle1.png");
  obstacleImg2 = loadImage("obstacle2.png");
}

function setup() {
  createCanvas(1000, 1000);
  tower = createSprite(500,300);
  tower.addImage("tower",towerImg);
  tower.velocityY = 1;
  tower.scale = 1.8;

  ghost = createSprite(500,875);
  ghost.addImage(ghostImg)
  ghost.scale = 0.8;
  ghost.setCollider("rectangle",-20,25,150,250);

  doorsGroup = new Group();
  climbersGroup = new Group();

  bottomEdge = createSprite(500,1000,1000,10);

  doorPos = Math.round(random(1,4)) * 200;

  createEdgeSprites();

  lava = createSprite(500,950,875,75);
  lava.addImage(lavaImg);
  lava.scale = 1.05;
  lavaVisible = false;

  gameOver = createSprite(500,500);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.5;
  gameOver.visible = false;

  destroyObstacleButton = createSprite(200,50,250,75);
  destroyObstacleButton.shapeColor = "red"

  obstacleGroup = new Group();
}

function draw() {

  if(gameState === "PLAY"){
    background(200);

  createDoors();
  createObstacle();

  spookySound.play();
  spookySound.setVolume(0.05);

  if(gameStartDrop === false){

    ghost.y = 200;


  setTimeout(() => {
    if(timer === 5){
      timer -= 1;
    }
    setTimeout(() => {
      if(timer === 4){
        timer -= 1;
      }
      setTimeout(() => {
        if(timer === 3){
          timer -= 1;
        }
        setTimeout(() => {
          if(timer === 2){
            timer -= 1;
          }
          setTimeout(() => {
            if(timer === 1){
              timer -= 1;
            }
            setTimeout(() => {
              if(timer === 0){
                timer = "";
              }
            }, 500)
          }, 1000)
        }, 1000)
      }, 1000)
    }, 1000)
  }, 1000)

  setTimeout(() => {
    gameStartDrop = true;
  }, 5000)
}

  lava.visible = lavaVisible;

  lava.setCollider("rectangle",0,20,830,75);

  if(ghost.y < 875){
    ghost.velocityY += 0.2;
  }else{ghost.velocityY = 0}

  
  if(tower.y > 400){
      tower.y = 300
    }

  if(ghost.velocityY > 0){
    ghost.addImage(ghostImg);
  }

  if(keyDown("left") && ghost.x > 150){
    ghost.x -= 5;
  }
  if(keyDown("right") && ghost.x < 850){
    ghost.x += 5;
  }

  if(keyDown("space")){
    ghost.velocityY = -7;
    ghost.addImage(ghostJumpingImg);
  }

  if(ghost.isTouching(climbersGroup)){
    lavaVisible = true;
  }


  score = Math.round(frameCount/30) - scoreSetback;

  ghost.collide(climbersGroup);}

  if(ghost.isTouching(lava)&&lava.visible === true){
    gameState = "END";
  }
  if(ghost.isTouching(obstacleGroup)){
    gameState = "END";
  }

  if(gameState === "END"){
    doorsGroup.setVelocityYEach(0);
    climbersGroup.setVelocityYEach(0);
    obstacleGroup.setVelocityYEach(0);
    ghost.velocityY = 0;
    tower.velocityY = 0;
    setTimeout(() => {
      swal(
        {
          title: `Game Over!!!`,
          text: "Thanks for playing!!",
          imageUrl:
            "https://raw.githubusercontent.com/pgsmart/Infinite-Runner-19/main/obstacle1.png",
          imageSize: "200x200",
          confirmButtonText: "Play Again"
        },
        function(isConfirm) {
          if (isConfirm) {
            location.reload();
          }
        }
      );
    }, 1000)
  }

  if(mousePressedOver(destroyObstacleButton)){
    obstacle.destroy();
    scoreSetback += 15;
  }

  console.log(gameState);

  drawSprites();

  fill(0,0,0);
  rect(430,15,175,50);
  textSize(30);
  fill(255,255,255)
  text("Score: " + score,450,50);  

  textSize(200);
  text(timer, width/2, height/2);

  textSize(30);
  text("Destroy Obstacles", 75,50);
  textSize(20);
  text("(Or Press D, Score -15)", 95, 75);

  if(destroyError === true){
  textSize(40);
  text("Not Enough Score Points!", 300,150);
  }
}

function createDoors(){
  if(frameCount%80 === 0){
     door = createSprite(doorPos,0);
    door.addImage(doorImg);
    door.velocityY = 3;
    doorsGroup.add(door);
    door.scale = 1.5;
    door.depth = ghost.depth - 1;
    numberOfDoor++;
    climber = createSprite(door.x,door.y+80);
    climber.addImage(climberImg);
    climber.velocityY = 3;  
    climbersGroup.add(climber);
    climber.scale = 1.2;
    climber.depth = ghost.depth - 1;

    number1 = Math.round(random(1,2));
    if(number1 === 1){
      doorPos += 200;
    }else{
      doorPos -= 200;
    }
    if(doorPos < 200){
      doorPos += 400
    }else if(doorPos > 800){
      doorPos -= 400;
    }
  }
}

function createObstacle(){
  if(frameCount%200 === 0 && numberOfDoor > 5){
    obstacle = createSprite(200 * Math.round(random(1,4)),0);
    obstacle.addImage(obstacleImg1)
    obstacle.velocityY = 6;
    obstacleGroup.add(obstacle);
    obstacle.scale = 0.2;
  }
}

function keyPressed(){
  if(keyCode === 68 && score >= 15){
    obstacle.destroy();
    scoreSetback += 15;
  }else if(keyCode === 68 && score < 15){
    destroyError = true;   
    
    setTimeout(() => {
      destroyError = false;
    }, 2000)
  }

}