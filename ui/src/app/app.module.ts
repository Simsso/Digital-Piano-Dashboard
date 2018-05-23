import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { PianoCanvasComponent } from './piano-canvas/piano-canvas.component';


@NgModule({
  declarations: [
    AppComponent,
    PianoCanvasComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
