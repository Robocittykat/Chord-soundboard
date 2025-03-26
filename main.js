let inst = 2 // 0: piano; 1: organ; 2: guitar; 3: edm (Keith Horwitz)
let hs = 2**(1/12) //half step
let ws = 2**(1/6) //whole step
let letters = {'C':261.63,'C#':277.18,'D':293.66,'D#':311.13,'E':329.63,'F':349.23,'F#':369.99,'G':392.00,'G#':415.30,'A':440.00,'A#':466.16,'B':493.88} //Keith Horwitz
let freq = {} //backwards mapping chart, for when I have the frequency but not the note name
	for(i of Object.keys(letters)){
		freq[letters[i]] = i
	}

let choosing = false;
	for(let i = 0; i <= 9; i++){
		$("setpre"+i).addEventListener("click",()=>{setPreset(i)})
	}

function $(elem){ //a shorter name than document.getElementById(elem)
	return document.getElementById(elem)
}




function playChord(startFreq,type,octave = octaveSlide.value){
	console.log(startFreq)
	console.log(octave)
	
	if(choosing != false || choosing === 0){ //javascript considers 0 and false to be equal, but I need them to be different.
		if(typeof(startFreq) != 'string'){
			startFreq = freq[startFreq]
		}
		let startF = startFreq
		$("pre" + choosing).onclick = ()=>{playChord(startF,type,octave)};
		let toName = startFreq
		
		toName += type
		toName += octave
		$("pre" + choosing).innerHTML = toName
		choose()
		
	}
	
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
	if(choosing === false){
		$("setpre" + num).innerHTML = "(cancel)"
		choosing = num;
	}else{
		$("setpre" + num).innerHTML = "Click here to assign a chord"
		choosing = false;
	}
	
}function choose(){
	$("setpre" + choosing).innerHTML = "Click here to assign a chord"
	$("pre" + choosing).hidden = false;
	$("setpre" + choosing).style.width = "20%";
	$("setpre" + choosing).style.left = "80%";
	choosing = false;
}

function update(){
	octave.innerHTML = octaveSlide.value
}setInterval(update,0)
