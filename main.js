let inst = 0

function playChord(n1,n2,n3){
    Synth.play(inst,n1,4,4)
    Synth.play(inst,n2,4,4)
    Synth.play(inst,n3,4,4)
}