//localStorage, to save presets and custom chords
function save(){ //saves everything that needs to be saved
	localStorage.setItem("presets",stringJSON(presets))
	localStorage.setItem("allPresets",stringJSON(allPresets))
}

function load(){ //loads everything that needs to be loaded.
	if(localStorage.length == 0){return}
	presets = destringJSON(localStorage.presets)
	for(i in presets){
		if(typeof presets[i] == 'object' && presets[i] != null){
			presets[i] = new Chord(presets[i])
			choose(presets[i],i)
		}
	}
	
	allPresets = destringJSON(localStorage.allPresets)
	
	preSelect.innerHTML = ''
	for(i in allPresets){
		let newOpt = document.createElement("option")
		newOpt.text = i
		preSelect.add(newOpt)
		preName.value = ''
	}
	
}

//helper functions (things that are more related to javasctipt itself than music)
function $(elem){ //a shorter name than document.getElementById(elem)
	return document.getElementById(elem)
}

function stringJSON(oldJSON){ //JSON.stringify, the built-in function to turn a JSON into a string, is broken in that it deletes some entries in JSONs.
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
function destringJSON(oldJSON){ //Reverses stringJSON
	oldJSON = JSON.parse(oldJSON)
	for(i in oldJSON){
		if(typeof oldJSON[i] == 'string'){
			if(oldJSON[i][0] == '{'){//hopefully that means its a json :) (probably not because JSONs hate me >:(  )
				oldJSON[i] = destringJSON(oldJSON[i])
			}
		}
	}return oldJSON
}




let inst = 2 // 0: piano 1: organ 2: guitar 3: edm (Keith Horwitz)
let hs = 2**(1/12) //half step
let ws = 2**(1/6) //whole step
let letters = {'C':261.63,'C#':277.18,'D':293.66,'D#':311.13,'E':329.63,'F':349.23,'F#':369.99,'G':392.00,'G#':415.30,'A':440.00,'A#':466.16,'B':493.88} //Keith Horwitz
let freq = {} //backwards mapping chart, for when I have the frequency but not the note name
	for(i of Object.keys(letters)){
		freq[letters[i]] = i
	}

let choosing = false
	for(let i = 0; i <= 9; i++){ //adds the functionality to setPre_
		$("setpre"+i).addEventListener("click",()=>{setPreset(i)})
	}


let presets = { //The current sidebar
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

let allPresets = { //Every saved preset
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





function playChord(startFreq,type,octave = octaveSlide.value){ //The function called by the soundboard buttons
	
	
	
	if(typeof startFreq == 'string'){ //if a string was inputted for startFreq, it turns it into an actual frequency.
		startFreq = letters[startFreq]
	}
	let noteFreq = startFreq //saves the innitial value for later before modifying it
	startFreq *= 2**(octave-4) //adjusts the frequency if the octave should shift it up
	
	notes = [startFreq,]
	
	switch(type){ //adds more notes based on the chord type
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
	
	if(inOct.checked){ //adjusts the frequencies if the user wants to keep notes in the octave
		for(i in notes){
			if(notes[i] > 493.88 * 2**(octave-4)){
				notes[i] /= 2
			}
		}
	}
	
	
	if(choosing != false || choosing === 0){ //javascript considers 0 and false to be equal, but I need them to be different.
		
		
		
		
		if(typeof(startFreq) != 'string'){
			startFreq = freq[noteFreq] //set startFreq to the note name
		}
		
		
		let toName = startFreq //create the name of the chord
		
		toName += type
		//toName += octave
		$("pre" + choosing).innerHTML = toName
		presets[choosing] = (new Chord(toName,notes))
		choose(presets[choosing])
		save()
		
	}
	
	for(i of notes){ //play each chord
		Synth.play(inst,i,4,1)
	}
	
}

/*function customPlay(chord){ //add a custom chord. This was originally 
	chord.play()
	if(choosing !== false){
		$("pre" + choosing).innerHTML = chord.name
		presets[choosing] = (chord)
		choose(presets[choosing])
		save()
	}
}*/

function setPreset(num){ //when you click on the button to set a sidebar button
	if(choosing === false){
		$("setpre" + num).innerHTML = "(cancel)"
		choosing = num
	}else{
		$("setpre" + num).innerHTML = "Click here to assign a chord"
		choosing = false
	}
	
}function choose(chord, which = choosing){ //when you pick a chord for the sidebar
	if(which === false){return}
	
	$("pre" + which).innerHTML = chord.name
	$("setpre" + which).innerHTML = "Click here to assign a chord"
	$("pre" + which).hidden = false
	$("setpre" + which).style.width = "20%"
	$("setpre" + which).style.left = "80%"
	choosing = false
}

function savePre(){ //save a preset
	if(preName.value == ''){
		alert("Name the preset first!")
		return
	}
	if(preName.value == 'empty'){
		alert("You can't name a preset 'empty'.") //because that would override the default preset
		return
	}
	allPresets[preName.value] = destringJSON(stringJSON(presets)) //effectively duplicates a json, from what I can tell there is no convenient built-in method to do so
	preSelect.innerHTML = '' //resets the options in the dropdown, and adds them all again in case you override a previous save.
	for(i in allPresets){
		let newOpt = document.createElement("option")
		newOpt.text = i
		preSelect.add(newOpt)
		preName.value = ''
	}
	save()
}

function loadPre(){ //to load a preset
	let toLoad = allPresets[preSelect.value]
	for(i in toLoad){
		if(toLoad[i] == null){
			$("pre" + i).innerHTML = toLoad[i]
			$("pre" + i).hidden = true
			$("setpre" + i).style.width = "100%"
			$("setpre" + i).style.left = "0%"
		}else{
			choose(toLoad[i],i)
		}
	}presets = destringJSON(stringJSON(toLoad))
	reChord(presets)
	save()
}

function saveChord(){ //saves a chord to the sidebar
	
	if(choosing === false){
		alert("Pick a sidebar slot to assign the chord to first!")
		return
	}
	
	
	toElems = document.getElementsByClassName("chosen")
	elems = []
	for(let j of toElems){
		elems.unshift(j)
	}
	notes = []
	for(i of elems){
		let id = i.id
		switch(true){ //figures out what note
			case id.includes('C#'):
				note = 'C#'
				break
			case id.includes('C'):
				note = 'C'
				break
			case id.includes('D#'):
				note = 'D#'
				break
			case id.includes('D'):
				note = 'D'
				break
			case id.includes('E'):
				note = 'E'
				break
			case id.includes('F#'):
				note = 'F#'
				break
			case id.includes('F'):
				note = 'F'
				break
			case id.includes('G#'):
				note = 'G#'
				break
			case id.includes('G'):
				note = 'G'
				break
			case id.includes('A#'):
				note = 'A#'
				break
			case id.includes('A'):
				note = 'A'
				break
			case id.includes('B'):
				note = 'B'
				break
		}
		switch(true){ //figures out what octave
			case id.includes('0'):
				oct = 0
				break
			case id.includes('1'):
				oct = 1
				break
		}
		notes.unshift(letters[note] * 2**(oct+octaveSlide2.value-4))
		i.classList.remove('chosen')
	}
	toSave = new Chord(customName.value,notes)
	console.log(toSave)
	toSave.play()
	
	$("pre" + choosing).innerHTML = toSave.name
	presets[choosing] = toSave
	choose(presets[choosing])
	save()
	
	customName.value = ''
}

function reChord(preset){ //when JSON.stringifying an object (such as a chord), it is turned into a classless object, thus loosing all its methods. Therefore, this function will take a preset array and turn all of them back into chord class objects
	for(i in preset){
		if(preset[i] == null){
			continue
		}else{
			preset[i] = new Chord(preset[i])
		}
	}
}

function update(){ //updates page info asap
	octave.innerHTML = octaveSlide.value
	octave2.innerHTML = octaveSlide2.value
	//inst = instSelect.value
}setInterval(update,0)


function tab(tab){ //switch tab
	tabs = [soundboardTab,presetTab,customTab]
	for(i of tabs){
		i.hidden = true
	}
	$(tab + "Tab").hidden = false
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


let holdingKeys = []

holdingKeys.contains = function(item){ //this function is mostly unneccesary, but I got this code from a previous project
	if(holdingKeys.indexOf(item) >= 0){
		return true
	}else{
		return false
	}
}


document.onkeydown = function(key){ //when you press a number key
	if(key.which >= 49 && key.which < (59) || key.which == 48){
		which = key.which - 48
		
		if(holdingKeys.contains(which)){
			return
		}
		holdingKeys.unshift(which)
		if(which == 0){
			presets[9].play()
		}else{
			presets[which - 1].play()
		}
	}
}
document.onkeyup = function(key){ //W3 schools
	if(holdingKeys.contains(key.which - 48)){
		holdingKeys.splice(holdingKeys.indexOf(key.which-48,1))
	}
}

function chordKey(note,oct){ //when you press a piano key
	Synth.play(inst,letters[note],octaveSlide2.value*1+oct,1)
	if($(note+oct).classList.contains("chosen")){
		$(note+oct).classList.remove("chosen")
	}else{
		$(note+oct).classList.add("chosen")
	}
}
function testChord(){ //when you test the custom chord
	elems = document.getElementsByClassName("chosen")
	for(i of elems){
		let id = i.id
		switch(true){
			case id.includes('C#'):
				note = 'C#'
				break
			case id.includes('C'):
				note = 'C'
				break
			case id.includes('D#'):
				note = 'D#'
				break
			case id.includes('D'):
				note = 'D'
				break
			case id.includes('E'):
				note = 'E'
				break
			case id.includes('F#'):
				note = 'F#'
				break
			case id.includes('F'):
				note = 'F'
				break
			case id.includes('G#'):
				note = 'G#'
				break
			case id.includes('G'):
				note = 'G'
				break
			case id.includes('A#'):
				note = 'A#'
				break
			case id.includes('A'):
				note = 'A'
				break
			case id.includes('B'):
				note = 'B'
				break
		}
		switch(true){
			case id.includes('0'):
				oct = 0
				break
			case id.includes('1'):
				oct = 1
				break
		}
		Synth.play(inst,letters[note],octaveSlide2.value*1+oct,1)
		console.log(id)
	}
}






















load()