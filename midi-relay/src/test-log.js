const midi = require('midi');
require('dotenv').config() // load environment variables

const input = new midi.input();

console.log(`Found ${input.getPortCount()} MIDI input ports`);

const midiPort = parseInt(process.env.MIDI_PORT || '0', 10);
console.log(`Connecting to MIDI port no ${midiPort}: ${input.getPortName(midiPort)}`)

input.on('message', (deltaTime, message) => {
    console.log(`${message} (∆t: ${deltaTime})`);
});

input.openPort(midiPort);

input.ignoreTypes(false, false, false);

process.on('SIGINT', () => {
    console.log('Closing midi port...')
    input.closePort();
    process.exit();
});
