require('dotenv').config() // load environment variables

const app = require('express')();
const http = require('http').Server(app);
const SocketManager = require('./socket-manager');
const sockets = new SocketManager(http);
const MIDIAdapter = require('./midi-adapter');
const midi = new MIDIAdapter().registerCallback(forwardMIDIData).start();

app.get('/status', (req, res) => {
    res.status(200).send({ status: 'OK' });
});

function forwardMIDIData(deltaTime, message) {
    console.log(`Broadcasting to ${sockets.getCount()} sockets: ${message}`)
    sockets.broadcast('MIDI_DATA', { deltaTime, message });
}

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

process.on('SIGINT', () => {
    midi.close();
    process.exit();
});