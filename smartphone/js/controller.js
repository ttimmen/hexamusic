$(document).ready(function() {
    // This function will be run when the color of the
    // input element needs to be changed
    var updatePreview = function() {
        var color = $(this).chromoselector('getColor');
        $(this).css({
            'background-color': color.getHexString(),
            'color': color.getTextColor().getHexString(),
            'text-shadow': '0 1px 0 ' + color.getTextColor().getTextColor().getHexString()
        });
        $(this).html('');

    };
    var updateBackground = function(bgcolor){
        $('#color').css({
            'background-color': bgcolor,
        });

    }



    console.log($('#color').width());
    // Initialise the color picker
    $('#color').chromoselector({
        target: '#picker',
        autoshow: true,
        width: $('#color').width(),
        preview: false,
        create: updatePreview,
        update: updatePreview
    }).chromoselector('show', 1);

  var socket = io.connect('10.100.1.101:3000');
  socket.on('ctrl', function (data) {
    console.log(data);
    console.log(data.bgcolor)
    updateBackground(data.bgcolor);

    //console.log(json.bgcolor);
    //console.log(json);
   socket.emit('my other event', { my: 'data' });
  });

    var app = new MixApi();
context = new webkitAudioContext();
notes = []; // array that keeps track of which notes are playing; otherwise you can't stop them
app.init(function(){ // initialize API and wait for callback
// subscribe to the event: "a note starts playing", you get following midi info: note(=pitch), velocity(~volume), channel
// noteOn with velocity 0 is already mapped to noteOff!
app.onNoteOn(function(note, velocity, channel){

console.log(note);


var oscillator = context.createOscillator();
var gainNode = context.createGainNode();
// map different channels to different types of oscillators
if(0 <= channel && channel <= 3)
// Sine wave is type = 0 -> default
// Square wave is type = 1
// Sawtooth wave is type = 2
// Triangle wave is type = 3
oscillator.type = channel;
oscillator.frequency.value = 440 * Math.pow(2,(note-69)/12); //note (MIDI notation) to frequency mapping
oscillator.connect(gainNode);
gainNode.connect(context.destination);
gainNode.gain.value = 0.1 + 0.9 * velocity / 127.0;
if(notes[note]) notes[note].noteOff(0);
notes[note] = oscillator;
notes[note].noteOn(0); // this is the function from the Web Audio API to start the oscillator



});

//subscribe to the event: "a note stops playing"
app.onNoteOff(function(note, velocity, channel){
if(notes[note]){
notes[note].noteOff(0); // this is the function from the Web Audio API to stop the oscillator
notes[note] = null;
}

});

//subscribe to all MIDI data; this includes control messages as well.

app.onData(function(data){
console.log(data);
// app.parseData converts the MIDI data to readable notation; shows what kind of data it is, e.g. NoteOn, C# 2 etc
console.log(app.parseData(data));
});
});

// var testObject = { 'one': 34, 'two': 23, 'three': 3 };
// // Put the object into storage
// localStorage.setItem('testObjects', JSON.stringify(testObject));
// // Retrieve the object from storage
// var retrievedObject = localStorage.getItem('testObjects');

// console.log('retrievedObject: ', JSON.parse(retrievedObject));


});
