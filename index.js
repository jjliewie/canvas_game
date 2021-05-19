const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player{
  constructor(x, y, rad, color){
    this.x = x
    this.y = y
    this.rad = rad
    this.color = color
  }

  draw(){
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.rad, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
  }
}

class Projectile{
  constructor(x, y, rad, color, vel){
    this.x = x
    this.y = y
    this.rad = rad
    this.color = color
    this.vel = vel
  }
  draw(){
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.rad, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
  }

  update(){
    this.draw()
    this.x += this.vel.x
    this.y += this.vel.y
  }
}

class Meteor{
  constructor(x, y, rad, color, vel){
    this.x = x
    this.y = y
    this.rad = rad
    this.color = color
    this.vel = vel
  }
  draw(){
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.rad, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
  }

  update(){
    this.draw()
    this.x += this.vel.x
    this.y += this.vel.y
  }
}

const x = canvas.width/2
const y = canvas.height -100
var score = 0
const player = new Player(x, y, 20, 'blue')

const projectiles = []
const meteors = []
var angle = -Math.PI/2

function color_score(score){
  if (score <= 180){
    return score
  }
  else{
    return color_score(score-180)
  }
}

function spawnmeteors(){
  setInterval(()=>{
    const rad = (Math.random() * 24) + 6
    const x = ((canvas.width-rad) * Math.random())+rad
    // const y = canvas.height - rad
    const y = rad
    const color = `hsl(${color_score(score)*4}, 50%, 50%)`
    const angle = Math.atan2((player.y) - y,
      (player.x) - x)

    const vel = {
      x: Math.cos(angle) * (3 + Math.floor(score/10)),
      y: Math.sin(angle) * (3 + Math.floor(score/10))
    }
    meteors.push(new Meteor(x, y, rad, color, vel))
  }, 1000 - (Math.floor(score/10)*10))
}
let animationId
function animate(){
  animationId = requestAnimationFrame(animate)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = "25px Courier"
  ctx.fillStyle = "white"
  ctx.fillText("Score: " + score, 30, 50)
  ctx.fillText("Level: " + (Math.floor(score/10) + 1), canvas.width-180, 50)

  // draw angle line
  meteors.forEach((meteor, idx) => {
    meteor.update()

    const distance = Math.hypot(player.x - meteor.x,
      player.y - meteor.y)

      if(distance - meteor.rad - player.rad < -2){
        setTimeout(()=>{
          cancelAnimationFrame(animationId)
          console.log('endgame');
          alert('you died, your score is ' + score)
        }, 0)
      }

    projectiles.forEach((projectile, index) => {
      const distance = Math.hypot(projectile.x - meteor.x,
        projectile.y - meteor.y)
      if(distance - meteor.rad - projectile.rad < 1){
        score ++;
        setTimeout(()=>{
          meteors.splice(idx, 1)
          projectiles.splice(index, 1)
        }, 0)
      }
    });
  });
  draw_angle(angle)
  projectiles.forEach((projectile, idx) => {
    projectile.update()

    if(projectile.x + projectile.rad < 0 ||
    projectile.x - projectile.rad > canvas.width ||
    projectile.y + projectile.rad < 0 ||
    projectile.y - projectile.rad > canvas.height){
      setTimeout(()=>{
        projectiles.splice(idx, 1)
      }, 0)
    }
  });
  player.draw()

}

console.log(player);

function draw_angle(a){

  ctx.strokeStyle = 'grey';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.setLineDash([5, 15]);
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(250*Math.cos(a) + player.x, 250*Math.sin(a) + player.y);
  ctx.stroke();
}

window.addEventListener('keydown', (e)=> {

  if(e.code === 'ArrowLeft'){
    angle -= 0.15
  }
  if(e.code === 'ArrowRight'){
    angle += 0.15
  }

  console.log(angle)

  const vel = {
    x: Math.cos(angle) * 8,
    y: Math.sin(angle) * 8
  }

  if(e.code === 'Space'){

  projectiles.push(new Projectile(
    (player.x),
    (player.y),
    5,
    'blue',
    vel
  ))

}
}
)

animate()
spawnmeteors()
