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

  width: number;
  height: number;

  readonly keyCount: number = 88;
  readonly lowestKey: number = 21;

  keyPushed: boolean[] = [];

  constructor(private midiInput: MidiSocketService) {
    this.midiInput.register(this.processNewMIDIData.bind(this));
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
    this.updateDimensions();

    const keyWidth = this.width / this.keyCount;
    for (let i = this.lowestKey, j = 0; i < this.lowestKey + this.keyCount; i++, j++) {
      const pressed: boolean = this.keyPushed[i];
      this.ctx.fillStyle = pressed ? '#DD0031' : '#FFFFFF';
      this.ctx.fillRect(j * keyWidth, 0, keyWidth, this.height);
    }

    requestAnimationFrame(this.drawState.bind(this));
  }

  processNewMIDIData(data) {
    console.log(data);
    if (data.status === 144) { // push down
      this.keyPushed[data.data1] = true;
    }
    if (data.status === 128) { // released
      this.keyPushed[data.data1] = false;
    }
  }

  updateDimensions() {
    this.width = this.ctx.canvas.clientWidth;
    this.height = this.ctx.canvas.clientHeight;

  }

}
