import { Directive, AfterViewInit, ElementRef, Input } from '@angular/core';

import { fromEvent } from 'rxjs';
import { pairwise, map, exhaustMap, filter, startWith, delay } from 'rxjs/operators';

interface ScrollPosition {
  sH: number;
  sT: number;
  cH: number;
}

const DEFAULT_SCROLL_POSITION: ScrollPosition = {
  sH: 0,
  sT: 0,
  cH: 0
};

@Directive({
  selector: '[appInfiniteScroller]'
})
export class InfiniteScrollerDirective implements AfterViewInit {

  private scrollEvent$;

  private userScrolledDown$;

  private requestStream$;

  private requestOnScroll$;

  @Input()
  scrollCallback;

  @Input()
  immediateCallback;

  @Input()
  scrollPercent = 90;

  constructor(private elm: ElementRef) { }

  ngAfterViewInit() {

    this.registerScrollEvent();

    this.streamScrollEvents();

    this.requestCallbackOnScroll();

  }

  private registerScrollEvent() {

    // this.scrollEvent$ = Observable.fromEvent(this.elm.nativeElement, 'scroll');
    this.scrollEvent$ = fromEvent(this.elm.nativeElement, 'scroll');

  }

  private streamScrollEvents() {
    this.userScrolledDown$ = this.scrollEvent$.pipe(
      map((e: any): ScrollPosition => ({
        sH: e.target.scrollHeight,
        sT: e.target.scrollTop,
        cH: e.target.clientHeight
      }))
      , pairwise()
      , filter(positions => this.isUserScrollingDown(positions) && this.isScrollExpectedPercent(positions[1])));
  }

  private requestCallbackOnScroll() {
    this.requestOnScroll$ = this.userScrolledDown$;

    if (this.immediateCallback) {
      this.requestOnScroll$ = this.requestOnScroll$.pipe(
        startWith([DEFAULT_SCROLL_POSITION, DEFAULT_SCROLL_POSITION]),
        delay(0));
    }

    this.requestOnScroll$.pipe(
      exhaustMap(() => {
        return this.scrollCallback();
      }))
      .subscribe((data) => {  }, (err) => console.log(err));

  }

  private isUserScrollingDown = (positions) => {
    return positions[0].sT < positions[1].sT;
  }

  private isScrollExpectedPercent = (position) => {
    return ((position.sT + position.cH) / position.sH) > (this.scrollPercent / 100);
  }

}
