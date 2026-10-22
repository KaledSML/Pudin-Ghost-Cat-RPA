(()=>{const $=id=>document.getElementById(id),scene=$('scene'),ids=['offer','glitch','attack','ending'];let timers=[],ctx;
function show(id){ids.forEach(x=>{$(x).classList.toggle('hidden',x!==id);$(x).setAttribute('aria-hidden',String(x!==id))})}
function later(fn,ms){timers.push(setTimeout(fn,ms))}function clear(){timers.forEach(clearTimeout);timers=[]}
function scream(){const s=$('jumpscareSound');try{s.pause();s.currentTime=0;const p=s.play();if(p&&p.catch)p.catch(()=>{});}catch(e){}}
$('sachet').addEventListener('click',()=>{clear();$('status').textContent='SEÑAL: CORRUPTA';show('glitch');scene.classList.add('glitch');later(()=>{scene.classList.remove('glitch');show('attack');scene.classList.add('flash','shake');scream();later(()=>scene.classList.remove('flash'),250);later(()=>scene.classList.remove('shake'),750);later(()=>{show('ending');$('status').textContent='INCIDENTE: CERRADO';const e=$('eatSound');try{e.pause();e.currentTime=0;const p=e.play();if(p&&p.catch)p.catch(()=>{});}catch(err){}},1050)},650)});
$('again').addEventListener('click',()=>{clear();scene.classList.remove('glitch','flash','shake');$('status').textContent='SEÑAL ESTABLE';try{$('eatSound').pause();$('eatSound').currentTime=0;}catch(e){}show('offer')});
})();
