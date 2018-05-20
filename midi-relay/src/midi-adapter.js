const midi = require('midi');

class MIDIAdapter {
    constructor() {
        this.input = new midi.input();
        this.midiPort = parseInt(process.env.MIDI_PORT || '0', 10);
        this.input.ignoreTypes(false, false, false);
    }

    start() {
        try {
            this.input.openPort(this.midiPort);
        } 
        catch (e) {
            setTimeout(this.start.bind(this), 1000);
            return this;
        }
        console.log(`connected to MIDI port ${this.midiPort}`);
        return this;
    }

    registerCallback(messageCallback) {
        this.input.on('message', messageCallback);
        return this;
    }

    close() {
        this.input.closePort();
        return this;
    }
}

module.exports = MIDIAdapter;