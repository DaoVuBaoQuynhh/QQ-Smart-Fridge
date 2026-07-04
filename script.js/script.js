function updateClock(){
const now=new Date();
const time=now.toLocaleTimeString();
const date=now.toDateString();

document.getElementById("clock").innerHTML=time;
document.getElementById("date").innerHTML=date;
}
setInterval(updateClock,1000);
updateClock();

const voiceBtn=document.getElementById("voiceBtn");
const voiceText=document.getElementById("voiceText");
voiceBtn.onclick=function(){
voiceText.innerHTML="Listening...";
setTimeout(()=>{
voiceText.innerHTML="Open refrigerator settings";
},2000);
}

/*======================================================
            WATER & ICE DISPENSER
======================================================*/

let currentMode = "Cold Water";
let currentAmount = 150;
let dispensing = false;

function changeMode(mode){
    currentMode = mode;
    document.getElementById("currentMode").innerHTML = mode;
    document.getElementById("machineStatus").innerHTML =
    mode + " Selected";
    let buttons = document.querySelectorAll(".mode-btn");
    buttons.forEach(btn=>{
        btn.classList.remove("active");
    });
    event.target.classList.add("active");
}

function selectAmount(amount){
    currentAmount = amount;
    document.getElementById("machineStatus").innerHTML =
    amount + " ml Selected";
}

document
.getElementById("dispenseBtn")
.addEventListener("click",startDispense);

function startDispense(){
    if(dispensing){
        return;
    }

    // Child Lock
    if(document.getElementById("childLock").checked){
        alert("Child Lock Enabled");
        return;
    }

    dispensing=true;
    document.getElementById("machineStatus").innerHTML="Dispensing...";
    waterAnimation();
}

function waterAnimation(){
    let stream=document.getElementById("waterFlow");
    let water=document.getElementById("waterLevel");
    let progress=document.getElementById("progressFill");
    stream.classList.add("flow");
    progress.style.width="0%";
    let level=30;

    if(currentAmount==250){
        level=60;
    }

    if(currentAmount==500){
        level=95;
    }

    let percent=0;
    let timer=setInterval(function(){
        percent+=2;
        progress.style.width=percent+"%";
        if(percent>=100){
            clearInterval(timer);
        }
    },30);

    setTimeout(function(){
        water.style.height=level+"%";
    },600);

    if(currentMode=="Ice Cube"){
        createIce();
    }

    if(currentMode=="Crushed Ice"){
        createCrushedIce();
    }

    setTimeout(function(){
        finishDispense();
    },3200);
}

function finishDispense(){
    dispensing=false;
    document.getElementById("machineStatus").innerHTML="Completed";
    document
    .getElementById("waterFlow")
    .classList
    .remove("flow");
}

function createIce(){
    let area=document.getElementById("iceArea");
    area.innerHTML="";
    for(let i=0;i<8;i++){
        let cube=document.createElement("div");
        cube.className="ice";
        cube.style.left=Math.random()*90+"px";
        cube.style.animationDelay=(i*0.1)+"s";
        area.appendChild(cube);
    }
}

function createCrushedIce(){
    let area=document.getElementById("iceArea");
    area.innerHTML="";
    for(let i=0;i<20;i++){
        let ice=document.createElement("div");
        ice.className="ice";
        ice.style.width="8px";
        ice.style.height="8px";
        ice.style.left=Math.random()*120+"px";
        ice.style.animationDelay=(i*0.05)+"s";
        area.appendChild(ice);
    }
}

document
.getElementById("nightLed")
.addEventListener("change",function(){
    let body=document.querySelector(".dispenser");
    if(this.checked){
        body.classList.add("led-active");
    }

    else{
        body.classList.remove("led-active");
    }
});

document
.getElementById("overflow")
.addEventListener("change",function(){

    if(this.checked){
        console.log("Overflow Sensor ON");
    }

    else{
        console.log("Overflow Sensor OFF");
    }
});

setInterval(function(){
    let temp=(4+Math.random()).toFixed(1);
    document
    .querySelector(".oled-info h4")
    .innerHTML=temp+"°C";
},4000);

let filter=98;
setInterval(function(){
    filter--;
    if(filter<70){
        filter=98;
    }

    document
    .querySelectorAll(".oled-info h4")[1]
    .innerHTML=filter+"%";
},10000);

let messages=[
"Ready",
"AI Cooling",
"Energy Saving",
"Water Purified",
"Smart Filter",
"QQ Smart"
];

let index=0;
setInterval(function(){
    if(dispensing){
        return;
    }

    document
    .getElementById("machineStatus")
    .innerHTML=messages[index];
    index++;
    if(index>=messages.length){
        index=0;
    }
},3500);

function resetWater(){
    document.getElementById("waterLevel").style.height="0";
    document.getElementById("progressFill").style.width="0";
}
setTimeout(resetWater,500);

document.addEventListener("keydown",function(e){
    if(e.key=="1"){
        changeMode("Cold Water");
    }

    if(e.key=="2"){
        changeMode("Ice Cube");
    }

    if(e.key=="3"){
        changeMode("Crushed Ice");
    }
});

window.onload=function(){
document.getElementById("machineStatus").innerHTML="System Ready";
};

document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        changeMode(this.dataset.mode);
    });
});