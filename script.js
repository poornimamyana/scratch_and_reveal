const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const card = document.getElementById("card");
const finished = document.getElementById("finishedMessage");
const sound = document.getElementById("celebrateSound");
const resetBtn = document.getElementById("resetBtn");

let isDrawing = false;
let revealed = false;

function resizeCanvas(){
 canvas.width = card.offsetWidth;
 canvas.height = card.offsetHeight;
 drawScratchLayer();
}

function drawScratchLayer(){

 const grad = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
 grad.addColorStop(0,"#f9d976");
 grad.addColorStop(.5,"#d4af37");
 grad.addColorStop(1,"#b8860b");

 ctx.globalCompositeOperation="source-over";
 ctx.fillStyle=grad;
 ctx.fillRect(0,0,canvas.width,canvas.height);

 for(let i=0;i<400;i++){
 ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.3})`;
 ctx.beginPath();
 ctx.arc(Math.random()*canvas.width,
 Math.random()*canvas.height,
 Math.random()*2,0,Math.PI*2);
 ctx.fill();
 }

 ctx.fillStyle="rgba(255,255,255,.95)";
 ctx.font="bold 28px Trebuchet MS";
 ctx.textAlign="center";
 ctx.fillText(" SCRATCH TO REVEAL ", canvas.width/2, canvas.height/2 - 20);

 ctx.font="20px Trebuchet MS";
 ctx.fillText("Kallem Family Surprise", canvas.width/2, canvas.height/2 + 25);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function scratch(x,y){
 ctx.globalCompositeOperation="destination-out";
 ctx.beginPath();
 ctx.arc(x,y,28,0,Math.PI*2);
 ctx.fill();
}

function getPosition(e){
 const rect = canvas.getBoundingClientRect();

 if(e.touches){
 return {
 x:e.touches[0].clientX - rect.left,
 y:e.touches[0].clientY - rect.top
 }
 }

 return {
 x:e.clientX - rect.left,
 y:e.clientY - rect.top
 }
}

function start(e){
 isDrawing=true;
 const p=getPosition(e);
 scratch(p.x,p.y);
}

function move(e){
 if(!isDrawing) return;
 e.preventDefault();
 const p=getPosition(e);
 scratch(p.x,p.y);
 checkReveal();
}

function end(){
 isDrawing=false;
}

canvas.addEventListener("mousedown",start);
canvas.addEventListener("mousemove",move);
canvas.addEventListener("mouseup",end);
canvas.addEventListener("mouseleave",end);

canvas.addEventListener("touchstart",start,{passive:false});
canvas.addEventListener("touchmove",move,{passive:false});
canvas.addEventListener("touchend",end);

function checkReveal(){

 if(revealed) return;

 const pixels = ctx.getImageData(0,0,canvas.width,canvas.height).data;

 let transparent=0;

 for(let i=3;i<pixels.length;i+=4){
 if(pixels[i]===0) transparent++;
 }

 const percent = transparent/(canvas.width*canvas.height);

 if(percent>0.60){
 revealed=true;
 finished.classList.remove("hidden");

 if(sound) sound.play().catch(()=>{});

 confetti({
 particleCount:180,
 spread:120,
 origin:{y:.6}
 });
 }
}

resetBtn.addEventListener("click",()=>{
 revealed=false;
 finished.classList.add("hidden");
 drawScratchLayer();
});
