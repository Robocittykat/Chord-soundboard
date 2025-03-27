class Chord{
	
	
	constructor(name,...notes){
		console.log(notes)
		if(typeof name == 'object'){
			this.name = name.name
			this.notes = name.notes
		}else{
			this.name = name;
			if(notes.length == 1){
				if(typeof notes[0] == 'object'){
					this.notes = notes[0];
					return;
				}
			}
			this.notes = notes;
		}
	}
	
	play(inst = 2){
		for(i in this.notes){
			Synth.play(inst,this.notes[i],4,1)
		}
	}
}