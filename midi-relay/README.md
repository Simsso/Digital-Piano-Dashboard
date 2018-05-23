# MIDI Relay
Node.js server that reads an incoming MIDI signal from the host and forwards it using websockets (socket.io).

## Setup and Run
```
git clone https://github.com/Simsso/Digital-Piano-Dashboard digital-piano-dashboard
cd ./digital-piano-dashboard/midi-relay
cp env.sample .env
npm ci
cd node_modules/midi
npm i
cd ../..
npm start
```