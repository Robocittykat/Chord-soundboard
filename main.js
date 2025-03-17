let inst = 0
let hs = 2**(1/12)
let ws = 2**(1/6)
let letters = {'C':261.63,'C#':277.18,'D':293.66,'D#':311.13,'E':329.63,'F':349.23,'F#':369.99,'G':392.00,'G#':415.30,'A':440.00,'A#':466.16,'B':493.88}

function playChord(startFreq,type,octave){
    if(typeof startFreq == 'string'){
		startFreq = letters[startFreq]
	}
	
	startFreq *= 2**(octave-4)
	
	notes = [startFreq,]
	
	switch(type){
		case "maj":
			notes.push(startFreq*hs**4)
			notes.push(startFreq*hs**7)
	}
	
	for(i of notes){
		Synth.play(inst,i,4,1)
	}
	
}


