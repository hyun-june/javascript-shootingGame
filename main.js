// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas)

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false; // true이면 게임 끝
let score = 0;
// 우주선 좌표
let spaceshipX = canvas.width/2-32 // 캔버스의 가로 400을 2로 나누고 우주선의 크기 절반 32
let spaceshipY = canvas.height-64 // 캔버스의 높이 700 - 우주선의 크기 64 

// 총알 만들기
// 1. 스페이스바를 누르면 총알 발사
// 2. 총알이 발사 = 총알의 y값이 -- , 총알의 x값은? 스페이스바를 누른 순간의 우주선의 x좌표
// 3. 발사된 총알들은 배열에 저장을 한다.
// 4. 총알들은 x,y 좌표 값이 있어야 한다.
// 5. 배열을 가지고 render 그려준다.

let bulletList = [] //총알들을 저장하는 리스트
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
      this.x = spaceshipX + 20; // 우주선의 중간에서 총알 발사
      this.y = spaceshipY;
      this.alive = true;
      bulletList.push(this);
    }
    this.update = function () {
        this.y -= 3
    }
    this.checkHit = function(){
        for(let i=0;i< enemyList.length;i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x+60){
                score ++;
                this.alive = false;
                enemyList.splice(i,1)
            }
        }

    }
}

// 1. 적군은 위치가 랜덤하다
// 2. 적군은 밑으로 내려온다
// 3. 1초마다 하나씩 적군이 나온다
// 4. 적군의 우주선이 바닥에 닿으면 게임이 끝난다.
// 5. 적군과 총알이 만나면 우주선이 사라지고 점수 1점 획득한다. 총알.y <= 적군.y && 총알.x >= 적군.x && 총알.x <=적군.x + 40

const generateRandomValue = (min,max) =>{
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}

let enemyList = [];
function Enemy(){
    this.x=0;
    this.y=0;
    this.init = function(){
        this.x = generateRandomValue(0,canvas.width-64)
        this.y = 0
        enemyList.push(this);
    }
    this.update = function(){
        this.y += 2 // 적군의 속도 조절

        if(this.y >= canvas.height-64){
            gameOver = true;
        }
    }
}

const loadImage = () =>{
    backgroundImage = new Image();
    backgroundImage.src="images/background.jpg"

    spaceshipImage = new Image();
    spaceshipImage.src="images/spaceship.png"

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png"

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png"

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.png"
}


let keysDown = {};
const setupKeyboardListener = () =>{
    document.addEventListener("keydown",(event)=>{
        keysDown[event.key] = true

    })
    document.addEventListener("keyup",(event)=>{
        delete keysDown[event.key]

        if(event.key == " "){
            createBullet() // 총알 생성
        }
    })
}

const createBullet = () =>{
    let b = new Bullet(); // 총알 하나 생성
    b.init();
}

const createEnemy = () =>{
    const interval = setInterval(()=>{
        let e = new Enemy();
        e.init();
    },1000)
}

const update = () =>{
    if('ArrowRight' in keysDown){
        spaceshipX += 2 // 우주선의 속도 오른쪽
    }
    if('ArrowLeft' in keysDown){
        spaceshipX -= 2 // 우주선의 속도 왼쪽
    }

    if(spaceshipX <= 0){
        spaceshipX = 0
    }
    if(spaceshipX >= canvas.width-64){
        spaceshipX = canvas.width-64
    }
    // 우주선의 좌표값이 경기장 안에서만 있게 하려면

    // 총알의 y좌표 업데이트하는 함수
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
            bulletList[i].update()
            bulletList[i].checkHit();
        }
    }

    for(let i=0;i<enemyList.length;i++){
        enemyList[i].update()
    }

}

const render = () =>{
    ctx.drawImage(backgroundImage,0,0,canvas.width,canvas.height);
    ctx.drawImage(spaceshipImage,spaceshipX,spaceshipY)
    ctx.fillText(`Score:${score}`,10,30);
    ctx.fillStyle="white";
    ctx.font ="20px Arial"
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y)
        }
    }

    for(let i=0;i<enemyList.length;i++){
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y)
    }
}

const main = () =>{
    if(!gameOver){
        update()
        render()
        requestAnimationFrame(main)
    } else{
        ctx.drawImage(gameOverImage,10,100,380,380)
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

