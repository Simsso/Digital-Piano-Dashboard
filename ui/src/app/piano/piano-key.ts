import { KeyPushEvent } from './key-push-event';
import { TimeSpan } from '../util/time-span';

export class PianoKey {

  private static maxHistoryCount = 50;
  private readonly history: KeyPushEvent[] = [];

  constructor(private readonly id: number) {
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

  public getRecent(timeSpan: TimeSpan, now: number) {
    const furthestBack = now - timeSpan.seconds;
    return this.history.filter(e => e.activeAfter(furthestBack));
  }

  public getId(): number {
    return this.id;
  }
}
