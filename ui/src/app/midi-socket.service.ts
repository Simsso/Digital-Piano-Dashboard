import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class MidiSocketService {

  private socket;
  private callbacks: Function[];
  private time: number = 0;

  constructor() {
    this.socket = io('http://192.168.0.121:3000');
    this.callbacks = [];
    this.socket.on('MIDI_DATA', (data) => { this._handleEvent(data); });
  }

  _handleEvent({ deltaTime, message }) {
    // process raaw data
    const [status, data1, data2] = message;
    this.time += deltaTime;
    const data = { deltaTime, time: this.time, status, data1, data2 };
    this.callbacks.forEach(c => c(data));
  }

  register(callback: Function) {
    this.callbacks.push(callback);
  }

}
