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

  @ViewChild('pianoStateCanvas') canvasRef: ElementRef;
  ctx: CanvasRenderingContext2D;

  private readonly width: number = 880;
  private readonly height: number = 1000;

  private readonly keyCount: number = 88;
  private readonly lowestKey: number = 21;


  private readonly keyWidth = this.width / this.keyCount;

  private readonly keys: PianoKey[] = [];

  private pianoTime = 0;
  private realTime = 0;

  private renderWindowSpan = 5;

  constructor(private midiInput: MidiSocketService) {
    this.midiInput.register(this.processNewMIDIData.bind(this));
    for (let i = 0; i < this.keyCount; i++) {
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
    // TODO
  }

  drawState() {
    const currentPianoTime = (Date.now() / 1000 - this.realTime) + this.pianoTime;
    const lowestPianoTime = currentPianoTime - this.renderWindowSpan;
    this.keys.forEach(k => {
      this.clearKeyBar(k.getId());
      k.getRecent(this.renderWindowSpan, currentPianoTime)
        .forEach(e => this.drawKeyPressedBar(k.getId(), e.getNormalized(lowestPianoTime, currentPianoTime), currentPianoTime));
    });

    requestAnimationFrame(this.drawState.bind(this));
  }

  clearKeyBar(keyIndex: number) {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(keyIndex * this.keyWidth, 0, this.keyWidth, this.height);
  }

  drawKeyPressedBar(keyIndex: number, normalizedEvent: KeyPushEvent, timeNow: number) {
    this.ctx.fillStyle = '#DD0031';
    this.ctx.fillRect(
      keyIndex * this.keyWidth,
      Math.round(normalizedEvent.getStart() * this.height),
      this.keyWidth,
      Math.round(normalizedEvent.getDuration(timeNow) * this.height));
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
