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

  public readonly width: number = 1760;
  public readonly height: number = 1000;
  private readonly whiteKeyWidth: number = this.width / PianoCanvasComponent.whiteKeyCount;
  private readonly blackKeyWidth: number = this.whiteKeyWidth / 2;

  readonly pianoHeight: number = 200;
  readonly keyHistoryHeight: number = this.height - this.pianoHeight;
  private readonly lowestKey: number = 21;

  private readonly keys: PianoKey[] = [];
  private readonly keysBW: PianoKey[] = [];

  private pianoTime = 0;
  private realTime = 0;

  private renderWindowSpan = 5;

  private keyXPositions: number[] = [];

  // colors
  private colorWhiteKey = '#FAFAFA';
  private colorBlackKey = '#212121';
  private colorKeySeparator = '#BDBDBD';
  private colorPianoTopRim = '#8B0000';
  private colorWhiteKeyPushed = '#FF8A65';
  private colorBlackKeyPushed = '#713131';
  private colorHistoryBackground = '#FFFFFF';
  private colorHistoryActive = '#BF360C';

  constructor(private midiInput: MidiSocketService) {
    this.midiInput.register(this.processNewMIDIData.bind(this));
    for (let i = 0; i < PianoCanvasComponent.keyCount; i++) {
      this.keys.push(new PianoKey(i));
    }
    this.keysBW = this.keys.slice(0).sort((a, b) => {
      if (a.black !== b.black) {
        if (a.black) { return 1; }
        return -1;
      }
      return a.getId() - b.getId();
    });

    this.keysBW.forEach((k, i) => {
      if (k.black) {
        this.keyXPositions[k.getId()] = (k.getId() + .5) / (PianoCanvasComponent.keyCount + 1) * this.width;
      } else {
        this.keyXPositions[k.getId()] = i / PianoCanvasComponent.whiteKeyCount * this.width;
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.drawState();
  }

  drawPianoKeys() {
    // draw white keys first, because the black keys overlap them
    this.keysBW.forEach(this.drawKey.bind(this));
    this.ctx.fillStyle = this.colorPianoTopRim;
    this.ctx.fillRect(0, this.keyHistoryHeight, this.width, 5);
  }

  drawKey(key: PianoKey, nthKeyOfColor: number) {
    const xPosition: number = this.keyXPositions[key.getId()];
    const width: number = key.black ? this.blackKeyWidth : this.whiteKeyWidth;
    const height: number = key.black ? this.pianoHeight / 3 * 2 : this.pianoHeight;
    let color: string = key.black ? this.colorBlackKey : this.colorWhiteKey;

    if (key.isPushed()) {
      color = key.black ? this.colorBlackKeyPushed : this.colorWhiteKeyPushed;
    }

    this.ctx.fillStyle = color;
    this.ctx.fillRect(xPosition, this.keyHistoryHeight, width, height);

    // draw key separators
    if (!key.black && nthKeyOfColor > 0 && !key.isPushed()) {
      this.ctx.strokeStyle = this.colorKeySeparator;
      this.ctx.beginPath();
      this.ctx.moveTo(xPosition, this.keyHistoryHeight);
      this.ctx.lineTo(xPosition, this.height);
      this.ctx.stroke();
    }
  }

  drawState() {
    this.drawPianoKeys();
    const currentPianoTime = (Date.now() / 1000 - this.realTime) + this.pianoTime;
    const lowestPianoTime = currentPianoTime - this.renderWindowSpan;
    this.keysBW.forEach(k => {
      this.clearKeyBar(k);
      k.getRecent(this.renderWindowSpan, currentPianoTime)
        .forEach(e => this.drawKeyPressedBar(k, e.getNormalized(lowestPianoTime, currentPianoTime)));
    });

    requestAnimationFrame(this.drawState.bind(this));
  }

  clearKeyBar(key: PianoKey) {
    this.ctx.fillStyle = this.colorHistoryBackground;
    this.ctx.fillRect(this.keyXPositions[key.getId()], 0, key.black ? this.blackKeyWidth : this.whiteKeyWidth, this.keyHistoryHeight);
  }

  drawKeyPressedBar(key: PianoKey, normalizedEvent: KeyPushEvent) {
    this.ctx.fillStyle = this.colorHistoryActive;
    const x = this.keyXPositions[key.getId()];
    const y = Math.min(Math.round(normalizedEvent.getStart() * this.keyHistoryHeight), this.keyHistoryHeight);
    const width = key.black ? this.blackKeyWidth : this.whiteKeyWidth;
    const height = Math.round(normalizedEvent.getDuration(1) * this.keyHistoryHeight);
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

  public setRenderWindowSpan(event) {
    this.renderWindowSpan = Math.max(event.target.value, 1);
  }

}
