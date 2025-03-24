class Chord{
	let name;
	let notes = []
	
	constructor(name,...notes){
		this.name = name;
		if(notes.length == 1){
			if(typeof notes[0] == 'object'){
				this.notes = notes[0];
				return;
			}
		}
		this.notes = notes;
	}
	
	play(inst = 2){
		for(i of this.notes){
			Synth.play(inst,i,4,1)
		}
	}
}