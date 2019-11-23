import { Injectable } from '@angular/core';
import { Bubble } from '../interfaces/bubble';

@Injectable({
  providedIn: 'root'
})
export class IccServiceService {

  constructor() { }


  getICC(bubbles: { frame: number, bubbles: Bubble[] }[]) {
    const numBubbles = bubbles.map(b => {
      return b.bubbles.length;
    });
    let sum = 0;
    numBubbles.forEach(n => sum += n);
    const mean = sum / bubbles.length;
    let variance = 0;
    numBubbles.map(n => variance += Math.pow((n - mean), 2));
    variance = variance / numBubbles.length;

  }
}
