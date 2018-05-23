import { PianoKey } from './../piano/piano-key';
import { KeyPushEvent } from './../piano/key-push-event';
import { MidiSocketService } from './../midi-socket.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-piano-canvas',
  templateUrl: './piano-canvas.component.html',
  styleUrls: ['./piano-canvas.component.css'],
  providers: [MidiSocketService]
})
export class PianoCanvasComponent implements OnInit, AfterViewInit {

  static readonly keyCount: number = 88;
  static readonly whiteKeyCount: number = 52;
  static readonly blackKeyCount: number = PianoCanvasComponent.keyCount - PianoCanvasComponent.whiteKeyCount;

  @ViewChild('pianoStateCanvas') canvasRef: ElementRef;
  ctx: CanvasRenderingContext2D;

  private readonly width: number = 880;
  private readonly height: number = 1000;
  private avgKeyWidth: number;
  private blackKeyWidth: number;
  private whiteKeyWidth: number;

  readonly pianoHeight: number = 200;
  readonly keyHistoryHeight: number = this.height - this.pianoHeight;
  private readonly lowestKey: number = 21;

  private readonly keys: PianoKey[] = [];

  private pianoTime = 0;
  private realTime = 0;

  private renderWindowSpan = 5;

  constructor(private midiInput: MidiSocketService) {
    this.midiInput.register(this.processNewMIDIData.bind(this));
    for (let i = 0; i < PianoCanvasComponent.keyCount; i++) {
      this.keys.push(new PianoKey(i));
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.ctx.fillStyle = '#DD0031';
    this.drawState();
  }

  drawPianoKeys() {
    this.avgKeyWidth = this.width / PianoCanvasComponent.keyCount;
    this.whiteKeyWidth = this.width / PianoCanvasComponent.whiteKeyCount;
    this.blackKeyWidth = this.whiteKeyWidth / 2;

    // draw white keys first, because the black keys overlap them
    this.keys.filter(k => !k.black).forEach(this.drawKey.bind(this));
    this.keys.filter(k => k.black).forEach(this.drawKey.bind(this));
  }

  drawKey(key: PianoKey, nthKeyOfColor: number) {
    let xPosition: number;
    let width: number;
    let height: number;
    let color: string;

    if (key.black) {
      width = this.blackKeyWidth;
      xPosition = key.getId() / PianoCanvasComponent.keyCount * this.width + width / 2;
      height = this.pianoHeight / 3 * 2;
      color = '#222';
    } else {
      width = this.whiteKeyWidth;
      xPosition = nthKeyOfColor / PianoCanvasComponent.whiteKeyCount * this.width;
      height = this.pianoHeight;
      color = '#EEE';
    }

    if (key.isPushed()) {
      color = '#22F';
    }


    this.ctx.fillStyle = color;
    this.ctx.fillRect(xPosition, this.keyHistoryHeight, width, height);
  }

  drawState() {
    this.drawPianoKeys();
    const currentPianoTime = (Date.now() / 1000 - this.realTime) + this.pianoTime;
    const lowestPianoTime = currentPianoTime - this.renderWindowSpan;
    this.keys.forEach(k => {
      this.clearKeyBar(k);
      k.getRecent(this.renderWindowSpan, currentPianoTime)
        .forEach(e => this.drawKeyPressedBar(k, e.getNormalized(lowestPianoTime, currentPianoTime), currentPianoTime));
    });

    requestAnimationFrame(this.drawState.bind(this));
  }

  clearKeyBar(key: PianoKey) {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(key.getId() * this.avgKeyWidth, 0, this.avgKeyWidth, this.keyHistoryHeight);
  }

  drawKeyPressedBar(key: PianoKey, normalizedEvent: KeyPushEvent, timeNow: number) {
    this.ctx.fillStyle = '#DD0031';
    const x = key.getId() * this.avgKeyWidth;
    const y = Math.min(Math.round(normalizedEvent.getStart() * this.keyHistoryHeight), this.keyHistoryHeight);
    const width = this.avgKeyWidth;
    const height = Math.round(normalizedEvent.getDuration(timeNow) * this.keyHistoryHeight);
    this.ctx.fillRect(x, y, width, height);
  }

  processNewMIDIData(data) {
    // update time reference
    this.pianoTime = data.time;
    this.realTime = Date.now() / 1000;

    const keyIndex = data.data1 - this.lowestKey;
    if (data.status === 144) { // push down
      this.keys[keyIndex].push(data.time);
    }
    if (data.status === 128) { // released
      this.keys[keyIndex].release(data.time);
    }
  }

}
