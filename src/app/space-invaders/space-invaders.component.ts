import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Host, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, fromEvent, merge, Observable, of, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-space-invaders',
  imports: [CommonModule,MatButtonModule],
  template: `
<link href='https://fonts.googleapis.com/css?family=Play:400,700' rel='stylesheet' type='text/css'>
<div class="flex flex-col items-center">
      <h1  *ngIf="!blocked" class="font-bold text-3xl">Invasores del espacio</h1>
  <button
        mat-fab extended       
        type="button"
        (click)="blocked=!blocked"
        onclick="start()"
       *ngIf="!blocked"
      >Inicio
      </button>
<canvas id="game-canvas" width="640" height="640"></canvas>
    </div>
 `,
  styles: [`
    :host {
      background-color: #222;
      width: 100%;
      height: 100%;
      overflow: hidden;   
     }

     canvas {
  display: block;
  margin: auto;
  position :absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimize-contrast
}
 ` ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class SpaceInvadersComponent implements OnInit
 {
  width!: number;
  height!: number;
  radius!: number;
   blocked: boolean=false;


  ngOnInit() {
    this.blocked = false;
    this.loadScript();
  }
  
  loadScript(){
    const script = document.createElement('script') as HTMLScriptElement;
    script.type = 'text/javascript';
    script.src = 'space-invaders/space-invaders.js';
    script.async = true;

    document.getElementsByTagName('head')[0].appendChild(script);
    const config = document.createElement('script') as HTMLScriptElement;
    config.type = 'text/javascript';
    config.text = `
    function start() {
  init();
  animate();
};
    `;

    document.getElementsByTagName('head')[0].appendChild(config);
  }
}