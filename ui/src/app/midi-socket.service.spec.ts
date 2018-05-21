import { TestBed, inject } from '@angular/core/testing';

import { MidiSocketService } from './midi-socket.service';

describe('MidiSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MidiSocketService]
    });
  });

  it('should be created', inject([MidiSocketService], (service: MidiSocketService) => {
    expect(service).toBeTruthy();
  }));
});
