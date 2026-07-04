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

/*==================================================
            AI COOLING SYSTEM
==================================================*/

const fridgeTemp = document.getElementById("fridgeTemp");
const freezerTemp = document.getElementById("freezerTemp");
const outsideTemp = document.getElementById("outsideTemp");

const coolProgress = document.getElementById("coolProgress");
const aiProcess = document.getElementById("aiProcess");

const slider = document.getElementById("coolSlider");
const sliderValue = document.getElementById("sliderValue");

const foodLevel = document.getElementById("foodLevel");
const energy = document.getElementById("energy");
const doorCount = document.getElementById("doorCount");

const fan = document.querySelector(".fan");
const modes = document.querySelectorAll(".mode");

let currentMode = "AUTO";

/*====================================
        COOLING MODES
====================================*/

modes.forEach(button=>{

    button.addEventListener("click",function(){

        modes.forEach(btn=>btn.classList.remove("active"));

        this.classList.add("active");

        currentMode=this.innerText;

        switch(currentMode){

            case "AUTO":

                fan.style.animationDuration="4s";

                coolProgress.style.width="80%";

                energy.innerHTML="35%";

            break;

            case "ECO":

                fan.style.animationDuration="8s";

                coolProgress.style.width="60%";

                energy.innerHTML="55%";

            break;

            case "TURBO":

                fan.style.animationDuration="1.5s";

                coolProgress.style.width="100%";

                energy.innerHTML="15%";

            break;

        }

    });

});

/*====================================
        SLIDER
====================================*/

slider.addEventListener("input",function(){

    sliderValue.innerHTML=this.value+"%";

    coolProgress.style.width=this.value+"%";

});

/*====================================
        TEMPERATURE UPDATE
====================================*/

function updateTemperature(){

    let outside=Math.floor(Math.random()*12)+26;

    outsideTemp.innerHTML=outside+"°C";

    let fridge=4;

    let freezer=-18;

    if(currentMode=="ECO"){

        fridge=5;

        freezer=-16;

    }

    if(currentMode=="AUTO"){

        fridge=4;

        freezer=-18;

    }

    if(currentMode=="TURBO"){

        fridge=2;

        freezer=-22;

    }

    fridgeTemp.innerHTML=fridge+"°C";

    freezerTemp.innerHTML=freezer+"°C";

}

setInterval(updateTemperature,4000);

/*====================================
        FOOD STORAGE
====================================*/

let food=80;

setInterval(()=>{

    food+=Math.floor(Math.random()*5)-2;

    if(food<45) food=45;

    if(food>100) food=100;

    foodLevel.style.width=food+"%";

},3000);

/*====================================
        DOOR SENSOR
====================================*/
let door=12;

setInterval(()=>{

    door++;

    if(door>30){

        door=12;

    }

    doorCount.innerHTML=door+" Times";

},5000);

/*====================================
        AI PROCESS BAR
====================================*/

let process=0;

setInterval(()=>{

    process+=5;

    if(process>100){

        process=0;

    }

    aiProcess.style.width=process+"%";

},150);

/*====================================
        ENERGY SAVING
====================================*/

setInterval(()=>{

    let value;

    if(currentMode=="AUTO"){

        value=35;

    }

    else if(currentMode=="ECO"){

        value=55;

    }

    else{

        value=15;

    }

    energy.innerHTML=value+"%";

},1000);

/*====================================
        COOLING LEVEL
====================================*/

let level=80;

setInterval(()=>{

    level+=Math.floor(Math.random()*7)-3;

    if(level<55) level=55;

    if(level>100) level=100;

    coolProgress.style.width=level+"%";

},3500);

/*====================================
        WEATHER CHANGE
====================================*/

const weatherBox=document.querySelector(".weather-box");

const weatherList=[

"☀ Sunny",

"☁ Cloudy",

"🌧 Rain",

"⛈ Storm",

"🌤 Partly Cloudy"

];

setInterval(()=>{

    let random=Math.floor(Math.random()*weatherList.length);

    weatherBox.firstChild.textContent=weatherList[random];

},6000);

/*====================================
        SNOW EFFECT
====================================*/

function createSnow(){

    const snow=document.createElement("div");

    snow.innerHTML="❄";

    snow.style.position="absolute";

    snow.style.left=Math.random()*100+"%";

    snow.style.top="-20px";

    snow.style.fontSize=(10+Math.random()*20)+"px";

    snow.style.opacity="0.7";

    snow.style.animation="snowFall 6s linear";

    document.querySelector(".cooling-display").appendChild(snow);

    setTimeout(()=>{

        snow.remove();

    },6000);

}

setInterval(createSnow,500);


window.addEventListener("load",()=>{
    console.log("QQ Smart AI Cooling Ready");
});

/*==================================================
            ECO ENERGY MODE
==================================================*/

const todayPower = document.getElementById("todayPower");
const todayCost = document.getElementById("todayCost");
const savingPercent = document.getElementById("savingPercent");
const livePower = document.getElementById("livePower");
const energyProgress = document.getElementById("energyProgress");

const energyModes = document.querySelectorAll(".energy-mode");
const bars = document.querySelectorAll(".energy-chart .bar");

let currentEnergyMode = "ECO";

/*====================================
        CHANGE MODE
====================================*/

energyModes.forEach(button => {

    button.addEventListener("click", function(){

        energyModes.forEach(btn=>btn.classList.remove("active"));

        this.classList.add("active");

        currentEnergyMode = this.innerText;

        if(currentEnergyMode==="ECO"){

            livePower.innerHTML="320 W";

            savingPercent.innerHTML="45%";

            todayPower.innerHTML="0.92 kWh";

            todayCost.innerHTML="$0.16";

            energyProgress.style.width="90%";

        }

        else if(currentEnergyMode==="NORMAL"){

            livePower.innerHTML="430 W";

            savingPercent.innerHTML="30%";

            todayPower.innerHTML="1.18 kWh";

            todayCost.innerHTML="$0.22";

            energyProgress.style.width="65%";

        }

        else{

            livePower.innerHTML="610 W";

            savingPercent.innerHTML="12%";

            todayPower.innerHTML="1.65 kWh";

            todayCost.innerHTML="$0.34";

            energyProgress.style.width="40%";

        }

    });

});


/*====================================
        LIVE POWER
====================================*/

setInterval(()=>{

    let power;

    if(currentEnergyMode==="ECO"){

        power = 300 + Math.floor(Math.random()*40);

    }

    else if(currentEnergyMode==="NORMAL"){

        power = 420 + Math.floor(Math.random()*60);

    }

    else{

        power = 580 + Math.floor(Math.random()*80);

    }

    livePower.innerHTML = power + " W";

},2000);


/*====================================
        ENERGY SAVING
====================================*/

setInterval(()=>{

    let save;

    if(currentEnergyMode==="ECO"){

        save = 40 + Math.floor(Math.random()*8);

    }

    else if(currentEnergyMode==="NORMAL"){

        save = 28 + Math.floor(Math.random()*5);

    }

    else{

        save = 10 + Math.floor(Math.random()*5);

    }

    savingPercent.innerHTML = save + "%";

},3000);


/*====================================
        DAILY POWER
====================================*/

setInterval(()=>{

    let value;

    if(currentEnergyMode==="ECO"){

        value=(0.9+Math.random()*0.2).toFixed(2);

    }

    else if(currentEnergyMode==="NORMAL"){

        value=(1.1+Math.random()*0.3).toFixed(2);

    }

    else{
value=(1.5+Math.random()*0.4).toFixed(2);

    }

    todayPower.innerHTML=value+" kWh";

},4000);


/*====================================
        ELECTRIC COST
====================================*/

setInterval(()=>{

    let cost;

    if(currentEnergyMode==="ECO"){

        cost=(0.15+Math.random()*0.03).toFixed(2);

    }

    else if(currentEnergyMode==="NORMAL"){

        cost=(0.21+Math.random()*0.04).toFixed(2);

    }

    else{

        cost=(0.31+Math.random()*0.05).toFixed(2);

    }

    todayCost.innerHTML="$"+cost;

},4500);


/*====================================
        BAR CHART
====================================*/

setInterval(()=>{

    bars.forEach(bar=>{

        let height=40+Math.floor(Math.random()*60);

        bar.style.height=height+"%";

    });

},2500);


/*====================================
        AI PROGRESS
====================================*/

let progress = 80;

setInterval(()=>{

    progress += Math.floor(Math.random()*8)-3;

    if(progress<35){

        progress=35;

    }

    if(progress>100){

        progress=100;

    }

    energyProgress.style.width=progress+"%";

},2000);


/*====================================
        AUTO ECO MODE
====================================*/

function autoEcoMode(){

    const hour = new Date().getHours();

    if(hour>=22 || hour<=6){

        currentEnergyMode="ECO";

    }

}

setInterval(autoEcoMode,60000);


/*====================================
        AI NOTIFICATION
====================================*/

const suggestions=[

"AI optimized cooling successfully.",

"Electricity consumption decreased.",

"Night Eco Mode activated.",

"Temperature optimized automatically.",

"Saving electricity with AI.",

"Compressor speed adjusted.",

"Power usage analyzed.",

"Weekly report updated."

];

function randomSuggestion(){

    const cards=document.querySelectorAll(".control-card");

    const lastCard=cards[cards.length-1];

    const ul=lastCard.querySelector("ul");

    const index=Math.floor(Math.random()*suggestions.length);

    ul.innerHTML="";

    suggestions.forEach((text,i)=>{

        const li=document.createElement("li");

        if(i===index){

            li.innerHTML="⚡ "+text;

        }else{

            li.innerHTML="✔ "+text;

        }

        ul.appendChild(li);

    });

}

setInterval(randomSuggestion,6000);


/*====================================
        START
====================================*/

window.addEventListener("load",()=>{

    console.log("QQ Smart Eco Energy Ready");

});


/*==================================================
                INSIDE VIEW
==================================================*/

const cameraImage = document.querySelector(".camera-screen img");
const phoneCamera = document.getElementById("phoneCamera");

const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");
const nightMode = document.getElementById("nightMode");
const snapshot = document.getElementById("snapshot");

const vegetableCount = document.getElementById("vegetableCount");
const drinkCount = document.getElementById("drinkCount");
const meatCount = document.getElementById("meatCount");
const eggCount = document.getElementById("eggCount");

let scale = 1;
let night = false;

/*==============================
        ZOOM IN
==============================*/

zoomIn.addEventListener("click", () => {

    scale += 0.1;

    if(scale > 2){

        scale = 2;

    }

    cameraImage.style.transform = `scale(${scale})`;
    phoneCamera.style.transform = `scale(${scale})`;

});


/*==============================
        ZOOM OUT
==============================*/

zoomOut.addEventListener("click", () => {

    scale -= 0.1;

    if(scale < 1){

        scale = 1;

    }

    cameraImage.style.transform = `scale(${scale})`;
    phoneCamera.style.transform = `scale(${scale})`;

});


/*==============================
        NIGHT MODE
==============================*/

nightMode.addEventListener("click", () => {

    night = !night;

    if(night){

        cameraImage.style.filter =
        "brightness(55%) contrast(130%) hue-rotate(80deg)";

        phoneCamera.style.filter =
        "brightness(55%) contrast(130%) hue-rotate(80deg)";

        nightMode.innerHTML = "☀ Day Vision";

    }else{

        cameraImage.style.filter = "none";
        phoneCamera.style.filter = "none";

        nightMode.innerHTML = "🌙 Night Vision";

    }

});


/*==============================
        SNAPSHOT
==============================*/

snapshot.addEventListener("click", () => {

    snapshot.innerHTML = "✔ Saved";

    snapshot.style.background = "#28a745";

    setTimeout(() => {

        snapshot.innerHTML = "📸 Snapshot";

        snapshot.style.background = "";

    },2000);

});


/*==============================
        LIVE BLINK
==============================*/

setInterval(() => {

    const dots = document.querySelectorAll(".live-dot,.record-dot");

    dots.forEach(dot=>{

        dot.style.opacity =
        dot.style.opacity=="0.2" ? "1" : "0.2";

    });

},700);


/*==============================
        RANDOM FOOD
==============================*/

setInterval(()=>{

    vegetableCount.innerHTML =
    Math.floor(Math.random()*10)+8;

    drinkCount.innerHTML =
    Math.floor(Math.random()*8)+15;

    meatCount.innerHTML =
    Math.floor(Math.random()*5)+5;

    eggCount.innerHTML =
    Math.floor(Math.random()*8)+18;

},5000);


/*==============================
        PHONE LIVE
==============================*/

const phoneLive =
document.querySelector(".phone-live");

setInterval(()=>{

    phoneLive.style.opacity =
    phoneLive.style.opacity=="0.4"
    ? "1"
    : "0.4";

},600);


/*==============================
        CAMERA SHAKE
==============================*/

setInterval(()=>{

    cameraImage.style.transform =
    `translateX(${Math.random()*2-1}px)
     translateY(${Math.random()*2-1}px)
     scale(${scale})`;

    phoneCamera.style.transform =
    `translateX(${Math.random()*2-1}px)
     translateY(${Math.random()*2-1}px)
     scale(${scale})`;

},120);


/*==============================
        AI MESSAGE
==============================*/

const aiMessages=[

"AI detected fresh vegetables.",

"Camera synchronized successfully.",

"Temperature is stable.",

"Cloud backup completed.",

"Door has not been opened recently.",

"Food recognition completed.",

"All cameras online.",

"Remote monitoring active."

];

const aiList =
document.querySelector(".inside-info ul");

setInterval(()=>{

    aiList.innerHTML="";

    aiMessages.forEach(msg=>{

        const li=document.createElement("li");

        li.innerHTML="✔ "+msg;

        aiList.appendChild(li);

    });

},7000);


/*==============================
        CAMERA QUALITY
==============================*/

const statItems =
document.querySelectorAll(".stat-item strong");

setInterval(()=>{

    statItems[0].innerHTML="Full HD";

    statItems[1].innerHTML=
    58+Math.floor(Math.random()*3)+" FPS";

    statItems[2].innerHTML="Cloud Backup";

    statItems[3].innerHTML="Active";

},4000);


/*==============================
        BUTTON HOVER SOUND
==============================*/

document.querySelectorAll(".camera-control button")
.forEach(button=>{

    button.addEventListener("mouseenter",()=>{

        button.style.transform="scale(1.05)";

    });

    button.addEventListener("mouseleave",()=>{

        button.style.transform="scale(1)";

    });

});


/*==============================
        START
==============================*/

window.addEventListener("load",()=>{

    console.log("Inside View Ready");

});