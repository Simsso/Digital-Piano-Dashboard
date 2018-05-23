import { KeyPushEvent } from './key-push-event';

export class PianoKey {

  private static maxHistoryCount = 50;
  private readonly history: KeyPushEvent[] = [];
  public readonly black: boolean;

  constructor(private readonly id: number) {
    this.black = [1, 3, 6, 8, 10].includes((id + 9) % 12);
  }

  public push(time: number): void {
    if (this.history.length > 0 && this.history[0].isOngoing()) {
      return;
    }
    this.history.unshift(new KeyPushEvent(time));
    this.history.splice(PianoKey.maxHistoryCount);
  }

  public release(time: number): void {
    if (this.history.length === 0) {
      return;
    }
    this.history[0].setEnd(time);
  }

  public isPushed(): boolean {
    return this.history.length > 0 && this.history[0].isOngoing();
  }

  public getRecent(timeSpan: number, now: number) {
    const furthestBack = now - timeSpan;
    return this.history.filter(e => e.activeAfter(furthestBack));
  }

  public getId(): number {
    return this.id;
  }
}
