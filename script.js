const state={frame:0,total:10,fps:12,frames:[],playing:false,selectedPart:"all"};
const maya=document.querySelector("#maya"),framesEl=document.querySelector("#frames"),status=document.querySelector("#status"),frameLabel=document.querySelector("#frameLabel");
function snapshot(){return {x:parseFloat(maya.style.left)||42,y:parseFloat(maya.style.top)||20,scale:parseFloat(maya.dataset.scale||1),rotation:parseFloat(maya.dataset.rotation||0),image:maya.dataset.image||""}}
function apply(s){maya.style.left=s.x+"%";maya.style.top=s.y+"%";maya.style.transform="scale("+s.scale+") rotate("+s.rotation+"deg)";if(s.image){maya.style.backgroundImage="url('"+s.image+"')";maya.style.backgroundSize="contain";maya.style.backgroundRepeat="no-repeat";maya.querySelectorAll(".head,.hair,.body,.arm,.leg").forEach(x=>x.style.visibility="hidden")}}
function ensureFrame(){while(state.frames.length<state.total)state.frames.push(state.frames.at(-1)||snapshot())}
function renderFrames(){framesEl.innerHTML="";for(let i=0;i<state.total;i++){const b=document.createElement("button");b.className="frame"+(i===state.frame?" selected":"");b.textContent=i+1;b.addEventListener("click",()=>go(i));framesEl.appendChild(b)}status.textContent="Frame "+(state.frame+1)+" / "+state.total;frameLabel.textContent="Frame "+(state.frame+1)}
function saveCurrent(){ensureFrame();state.frames[state.frame]=snapshot()}
function go(i){saveCurrent();state.frame=Math.max(0,Math.min(state.total-1,i));apply(state.frames[state.frame]||snapshot());renderFrames()}
function next(){saveCurrent();if(state.frame<state.total-1)state.frame++;else state.total++;state.frames[state.frame]=snapshot();apply(state.frames[state.frame]);renderFrames()}
document.querySelector("#nextBtn").addEventListener("click",next);
document.querySelector("#prevBtn").addEventListener("click",()=>go(state.frame-1));
document.querySelector("#addBtn").addEventListener("click",()=>{saveCurrent();state.total++;state.frame=state.total-1;state.frames[state.frame]={...state.frames[state.frames.length-1]};apply(state.frames[state.frame]);renderFrames()});
document.querySelector("#resetBtn").addEventListener("click",()=>{maya.style.left="42%";maya.style.top="20%";maya.dataset.scale=1;maya.dataset.rotation=0;state.frames=[];state.total=10;state.frame=0;ensureFrame();apply(state.frames[0]);renderFrames()});
document.querySelector("#clearBtn").addEventListener("click",()=>{state.frames=[];state.total=10;state.frame=0;ensureFrame();apply(state.frames[0]);renderFrames()});
let drag=null;
maya.addEventListener("pointerdown",e=>{e.preventDefault();maya.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,left:parseFloat(maya.style.left)||42,top:parseFloat(maya.style.top)||20}});
maya.addEventListener("pointermove",e=>{if(!drag)return;const r=document.querySelector("#stage").getBoundingClientRect();maya.style.left=(drag.left+(e.clientX-drag.x)/r.width*100)+"%";maya.style.top=(drag.top+(e.clientY-drag.y)/r.height*100)+"%"});
maya.addEventListener("pointerup",()=>{drag=null;saveCurrent();renderFrames()});
document.querySelector("#imageInput").addEventListener("change",e=>{const f=e.target.files?.[0];if(!f)return;const url=URL.createObjectURL(f);maya.dataset.image=url;maya.style.backgroundImage="url('"+url+"')";maya.style.backgroundSize="contain";maya.style.backgroundPosition="center";maya.style.backgroundRepeat="no-repeat";maya.querySelectorAll(".head,.hair,.body,.arm,.leg").forEach(x=>x.style.visibility="hidden");saveCurrent();renderFrames()});
document.querySelectorAll("#parts button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#parts button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.selectedPart=b.dataset.part}));
document.querySelector("#playBtn").addEventListener("click",()=>{state.playing=!state.playing;document.querySelector("#playBtn").textContent=state.playing?"⏸ Pause":"▶ Play";if(state.playing)tick()});
function tick(){if(!state.playing)return;go((state.frame+1)%state.total);setTimeout(tick,1000/state.fps)}
ensureFrame();apply(state.frames[0]);renderFrames();