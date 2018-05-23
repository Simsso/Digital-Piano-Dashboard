const midi = require('midi');

class MIDIAdapter {
    constructor(callback) {
        this.callback = callback;
        this.input = null;
        this.midiPort = parseInt(process.env.MIDI_PORT || '0', 10);
        this.connect();
        this.lastPortCount = 0;
    }

    connect() {
        this.input = new midi.input();
        this.input.on('message', this.callback);
        this.input.ignoreTypes(false, false, false);
        try {
            this.input.openPort(this.midiPort);
        } 
        catch (e) {
            console.log('failed to connect, retrying...')
            this.close();
            setTimeout(this.connect.bind(this), 1000);
            return;
        }
        console.log(`connected to MIDI port ${this.midiPort}`);
        this.lastPortCount = this.portCount();
        setTimeout(this.checkConnection.bind(this), 1000);
    }

    checkConnection() {
        if (this.portCount() !== this.lastPortCount) {
            this.lastPortCount = this.portCount;
            this.connect();
        }
        else {
            setTimeout(this.checkConnection.bind(this), 1000);
        }
    }

    portCount() {
        if (this.input === null) {
            return -1;
        }
        return this.input.getPortCount();
    }

    close() {
        try {
            this.input.closePort();
        }
        catch (e) {
            console.log('MIDI port could not be closed')
            console.log(e);
        }
        return this;
    }
}

module.exports = MIDIAdapter;