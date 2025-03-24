let inst = 2
let hs = 2**(1/12)
let ws = 2**(1/6)
let letters = {'C':261.63,'C#':277.18,'D':293.66,'D#':311.13,'E':329.63,'F':349.23,'F#':369.99,'G':392.00,'G#':415.30,'A':440.00,'A#':466.16,'B':493.88}

let choosing = false;

function $(elem){
	return document.getElementById(elem)
}

for(let i = 0; i <= 9; i++){
	$("setpre"+i).addEventListener("click",()=>{setPreset(i)})
}


function playChord(startFreq,type,octave){
	if(choosing != false){
		$("pre" + num).addEventListener("click",()=>{playChord(startFreq,type,octave)})
	}
	
    octave = octaveSlide.value
	if(typeof startFreq == 'string'){
		startFreq = letters[startFreq]
	}
	
	startFreq *= 2**(octave-4)
	
	notes = [startFreq,]
	
	switch(type){
		case "maj":
			notes.push(startFreq*hs**4)
			notes.push(startFreq*hs**7)
			break
		case "min":
			notes.push(startFreq*hs**3)
			notes.push(startFreq*hs**7)
			break
		case "7":
			notes.push(startFreq*hs**4)
			notes.push(startFreq*hs**7)
			notes.push(startFreq*hs**10)
			break
		case "M7":
			notes.push(startFreq*hs**4)
			notes.push(startFreq*hs**7)
			notes.push(startFreq*hs**11)
			break
		case "m7":
			notes.push(startFreq*hs**3)
			notes.push(startFreq*hs**7)
			notes.push(startFreq*hs**10)
			break
		case "dim":
			notes.push(startFreq*hs**3)
			notes.push(startFreq*hs**6)
			break
		case "sus":
			notes.push(startFreq*hs**5)
			notes.push(startFreq*hs**7)
			break
		
	}
	
	for(i of notes){
		Synth.play(inst,i,4,1)
	}
	
}

function setPreset(num){
	choosing = num;
	$("pre" + num).hidden = false;
	$("setpre" + num).style.width = "20%";
	$("setpre" + num).style.left = "80%";
}

function update(){
	octave.innerHTML = octaveSlide.value
}setInterval(update,0)
