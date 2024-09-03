import { Directive, ElementRef, Input, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[appScrollTrigger]'
})
export class ScrollTriggerDirective implements OnInit {
  @Input() targetNumber!: number;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.el.nativeElement.innerText = '0';
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const elementPosition = this.el.nativeElement.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementPosition < windowHeight && this.el.nativeElement.innerText === '0') {
      this.startCounting();
    }
  }

  private startCounting() {
    const speed = 200;
    const updateCount = () => {
      const count = +this.el.nativeElement.innerText;
      const increment = this.targetNumber / speed;

      if (count < this.targetNumber) {
        this.el.nativeElement.innerText = Math.ceil(count + increment).toString();
        setTimeout(updateCount, 20);
      } else {
        this.el.nativeElement.innerText = this.targetNumber.toString();
      }
    };

    updateCount();
  }
}
