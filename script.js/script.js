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