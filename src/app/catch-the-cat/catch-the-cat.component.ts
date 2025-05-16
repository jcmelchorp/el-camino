import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


declare global {
  interface Window {
    CatchTheCatGame: any;
  }
}

@Component({
  selector: 'app-catch-the-cat',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatInputModule],
  template: `
    <div class="flex flex-col items-center">
      <h1 class="font-bold text-3xl">Atrapa al gato</h1>
      <!-- <p class="font-semibold text-lg">Play 'till you get sick.</p> -->
      <!-- <div class="p-4 flex flex-row justify-between">
          Ancho:
          <p-input-number
            showButtons
            mode="decimal"
            type="number"
            [(ngModel)]="width"
          />
          Alto:
          <p-input-number
            showButtons
            mode="decimal"
            type="number"
            [(ngModel)]="height"
          />
        </div> -->
      <button
        mat-fab extended       
        type="button"
        (click)="blocked=!blocked"
        onclick="start(width,height)"
        [disabled]="blocked"
      >Inicio
      </button>
      <!-- <button mat-raised-button color="accent">Instructions</button> -->
      <div class="flex flex-col justify-between">
      
        <div class="catch-the-cat" id="catch-the-cat"></div>
      </div>
    </div>
  `,
})
export class CatchTheCatComponent implements OnInit {
  width!: number;
  height!: number;
  radius!: number;
   blocked: boolean=false;


  ngOnInit() {
    this.blocked = false;
     this.width = 20;
    this.height = 15;
    this.radius = 12;
    this.loadScript();
  }



  loadScript(){
    const script = document.createElement('script') as HTMLScriptElement;
    script.type = 'text/javascript';
    script.src = 'catch-the-cat/catch-the-cat.js';
    script.async = true;

    document.getElementsByTagName('head')[0].appendChild(script);
    const config = document.createElement('script') as HTMLScriptElement;
    config.type = 'text/javascript';
    config.text = `
    var width = ${this.width};
    var height = ${this.height};
    function start(width,height) {
    window.CatchTheCatGame = new CatchTheCatGame({
      w: width,
      h: height,
      r: 12,
      backgroundColor: 0xfafafaff,
      parent: 'catch-the-cat',
      statusBarAlign: 'center',
      credit: '2025 © Pete Sahatt',
    });
  }
    `;

    document.getElementsByTagName('head')[0].appendChild(config);
  }


}
