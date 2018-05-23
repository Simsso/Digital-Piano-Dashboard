import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class MidiSocketService {

  private socket;
  private callbacks: Function[];
  private time = 0;

  constructor() {
    this.socket = io('http://localhost:3000');
    this.callbacks = [];
    this.socket.on('MIDI_DATA', (data) => { this._handleEvent(data); });
  }

  _handleEvent({ deltaTime, message }) {
    console.log(`${message} (${deltaTime})`);
    // process raw data
    const [status, data1, data2] = message;
    this.time += deltaTime;
    const data = { deltaTime, time: this.time, status, data1, data2 };
    this.callbacks.forEach(c => c(data));
  }

  register(callback: Function) {
    this.callbacks.push(callback);
  }

}
