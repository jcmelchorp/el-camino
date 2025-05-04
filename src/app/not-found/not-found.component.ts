import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink,MatButtonModule,MatIconModule],
  template: `
  <div id="parallax">
    <div class="h-1/2 flex flex-row justify-center items-center">
  <button mat-stroked-button type="button" [routerLink]="['/']">
    <mat-icon>gamepad</mat-icon>
    <span class="font-semibold text-2xl">El Camino</span>
  </button>
  </div>
  </div>
`,
  styleUrls: ['./not-found.component.css'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          transform: 'scale(1)',
          opacity: 1,
        })
      ),
      state(
        'close',
        style({
          transform: 'scale(0)',
          opacity: 0,
        })
      ),
      transition('open => close', [animate('0.25s ease-in')]),
      transition('close => open', [animate('0.25s ease-out')]),
    ]),
  ],
})
export class NotFoundComponent implements OnInit {
  ngOnInit(): void {
    document.addEventListener("mousemove", parallax);
    const elem = document.querySelector("#parallax");
    // Magic happens here
    function parallax(e: { clientX: any; clientY: any; }) {
      let _w = window.innerWidth / 2;
      let _h = window.innerHeight / 2;
      let _mouseX = e.clientX;
      let _mouseY = e.clientY;
      let _depth1 = `${50 - (_mouseX - _w) * 0.01}% ${50 - (_mouseY - _h) * 0.01}%`;
      let _depth2 = `${50 - (_mouseX - _w) * 0.02}% ${50 - (_mouseY - _h) * 0.02}%`;
      let _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${50 - (_mouseY - _h) * 0.06}%`;
      let x = `${_depth3}, ${_depth2}, ${_depth1}`;
      if (elem) {
        (elem as HTMLElement).style.backgroundPosition = x;
      }
    }
  }

}
