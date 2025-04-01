//localStorage, to save presets and custom chords
function save(){
	localStorage.setItem("presets",stringJSON(presets))
}

function load(){
	presets = destringJSON(localStorage.presets)
	for(i in presets){
		if(typeof presets[i] == 'object' && presets[i] != null){
			presets[i] = new Chord(presets[i])
			choose(presets[i],i)
		}
	}
}

//helper functions (things that are more related to javasctipt itself than music)
function $(elem){ //a shorter name than document.getElementById(elem)
	return document.getElementById(elem)
}

function stringJSON(oldJSON){ //modified from Robocittykat (me), base incremental 2.0
	let newJSON = {}
	for(let key in oldJSON){
		if(typeof oldJSON[key] == "object" && oldJSON[key] != null){
			newJSON[key] = stringJSON(oldJSON[key])
		}else{
			newJSON[key] = oldJSON[key]
		}
	}
	newJSON = JSON.stringify(newJSON)
	return newJSON
}
function destringJSON(oldJSON){ //modified from Robocittykat (me), base incremental 2.0
	oldJSON = JSON.parse(oldJSON)
	for(i in oldJSON){
		if(typeof oldJSON[i] == 'string'){
			if(oldJSON[i][0] == '{'){//hopefully that means its a json :) (probably not because JSONs hate me >:(  )
				oldJSON[i] = destringJSON(oldJSON[i])
			}
		}
	}return oldJSON
}




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


let presets = {
	0:null,
	1:null,
	2:null,
	3:null,
	4:null,
	5:null,
	6:null,
	7:null,
	8:null,
	9:null,
}

let allPresets = {
	empty: {
		0:null,
		1:null,
		2:null,
		3:null,
		4:null,
		5:null,
		6:null,
		7:null,
		8:null,
		9:null,
	}
}





function playChord(startFreq,type,octave = octaveSlide.value){
	
	
	
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
	
	if(choosing != false || choosing === 0){ //javascript considers 0 and false to be equal, but I need them to be different.
		if(typeof(startFreq) != 'string'){
			startFreq = freq[startFreq]
		}
		let toName = startFreq
		
		toName += type
		toName += octave
		$("pre" + choosing).innerHTML = toName
		presets[choosing] = (new Chord(toName,notes))
		choose(presets[choosing])
		
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
	
}function choose(chord, which = choosing){
	if(which === false){return}
	
	$("pre" + which).innerHTML = chord.name
	//$("pre" + which).onclick = ()=>{presets[which].play}
	$("setpre" + which).innerHTML = "Click here to assign a chord"
	$("pre" + which).hidden = false;
	$("setpre" + which).style.width = "20%";
	$("setpre" + which).style.left = "80%";
	choosing = false;
	save();
}

function savePre(){
	if(preName.value == ''){
		alert("Name the preset first!")
		return
	}
	allPresets[preName.value] = destringJSON(stringJSON(presets)) //effectively duplicates a json, from what I can tell there is no convenient built-in method to do so
	let newOpt = document.createElement("option")
	newOpt.text = preName.value
	preSelect.add(newOpt)
	preName.value = ''
}

function update(){
	octave.innerHTML = octaveSlide.value
}setInterval(update,0)


function tab(tab){
	tabs = [soundboardTab,presetTab];
	for(i of tabs){
		i.hidden = true;
	}
	$(tab + "Tab").hidden = false;
}






let holdingKeys = []

holdingKeys.contains = function(item){
	if(holdingKeys.indexOf(item) >= 0){
		return true
	}else{
		return false
	}
}


document.onkeydown = function(key){
	if(key.which >= 49 && key.which < (59) || key.which == 48){
		which = key.which - 48
		if(holdingKeys.contains(which)){
			return
		}
		holdingKeys.unshift(which)
		presets[which].play()
	}
}
document.onkeyup = function(key){
	if(holdingKeys.contains(key.which - 48)){
		holdingKeys.splice(holdingKeys.indexOf(key.which-48,1))
	}
}


/*
ch|cd
0 |48
1 |49
2 |50
3 |51
4 |52
5 |53
6 |54
7 |55
8 |56
9 |57
*/





















load();