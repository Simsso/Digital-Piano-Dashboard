export class KeyPushEvent {
  private ongoing = true;
  private end: number;

  constructor(private readonly start: number) {
  }

  setEnd(end: number) {
    this.ongoing = false;
    this.end = end;
  }

  isOngoing(): boolean {
    return this.ongoing;
  }

  activeAfter(time: number): boolean {
    return this.isOngoing() || (this.end > time);
  }

  getNormalized(lowestTime: number, presentTime: number) {
    const durationReference = presentTime - lowestTime;
    const newStart = (this.start - lowestTime) / durationReference;
    const newEvent = new KeyPushEvent(newStart);
    if (this.isOngoing()) {
      return newEvent;
    }
    const newEnd = (this.end - lowestTime) / durationReference;
    newEvent.setEnd(newEnd);
    return newEvent;
  }

  getStart(): number {
    return this.start;
  }

  getEnd(orElse: number): number {
    if (this.isOngoing()) {
      return orElse;
    }
    return this.end;
  }

  getDuration(orElse: number): number {
    return this.getEnd(orElse) - this.getStart();
  }
}
