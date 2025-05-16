import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LayoutService } from "../layout/layout.service";
import { CommonModule, NgFor } from "@angular/common";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatSliderModule } from "@angular/material/slider";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Subject } from "rxjs";
import { MatGridListModule } from "@angular/material/grid-list";
import { Block } from "./el-camino-flip.model";

@Component({
  selector: 'app-flip-factory',
  imports: [CommonModule, MatGridListModule, MatSliderModule, NgFor, MatButtonModule, MatCardModule, MatInputModule, FormsModule],
  template: `
    <div  class="flex flex-row flex-wrap justify-center gap-2">
          <button mat-mini-fab *ngFor="let item of todo" (click)="insertBlock(item)"
          [ngStyle]="{
            filter: (layoutService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
            width: '55px',
            height: '55px',
            border:'1px solid white',
            background: 'center / cover no-repeat url(paths/' + item.split('.')[0] + '.svg' + ')',
            }">
        </button>
        </div>
        <div  class="flex flex-row flex-wrap justify-center items-center gap-5">
            <span>Columnas: {{cols}}</span>
            <mat-slider  min="2" max="20" step="1" showTickMarks discrete>
          <input class="w-1/3 m-8" [(ngModel)]="cols" matSliderThumb>
          </mat-slider>
        </div>

<div class="flex flex-row justify-center">
        <mat-card style="width: calc({{cols}}*80px);" >
        <mat-grid-list   cols="{{ cols! }}">
        <ng-container *ngFor="let item of newlev|async; index as i">
          <mat-grid-tile>
            <div>
            <span class="absolute top-0 left-2 bottom-0 right-0 font-light text-lg text-neutral-600">{{i}}</span>
            <div
             (click)="rotate(item,i)"
              class="absolute top-0 left-0 bottom-0 right-0 flex flex-row justify-between align-top text-2xl text-neutral-200"
        [ngStyle]="{
          filter: (layoutService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
          background: 'center / cover no-repeat url(paths/' + item.type + '.png)',
        }"
            [@rotateState]="item.state"
      >
            </div>
      </div>
          </mat-grid-tile>
        </ng-container>
      </mat-grid-list>

            <!-- <div class="flex flex-wrap">
            <ng-container #container *ngFor="let item of newlev|async; index as i">    
            <div mat-tile
            (click)="rotate(item,i)"
            [@rotateState]="item.split('.')[1]"
            [ngStyle]="{
            filter: (layoutService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
            width: '80px',
            height: '80px',
            border:'2px solid darkgray',
            background: 'center / cover no-repeat url(paths/' + item.split('.')[0] + '.png' + ')',
            }"></div>
        </ng-container>
                    </div>
                    <pre>{{newlev|async}}</pre> -->

        </mat-card>
        </div>
        <div class="flex flex-wrap justify-center">
        <p class="font-light text-sm" *ngFor="let block of newlev|async">{{ block.type + '.'+ block.state + '  '  }}</p>
        </div>

        `,
  styles: [`
    :host {
      display: block;
    }
    `], changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LayoutService],
  animations: [
    trigger('rotateState', [
      state('0', style({ transform: 'rotate(0deg)' })),
      state('1', style({ transform: 'rotate(90deg)' })),
      state('2', style({ transform: 'rotate(180deg)' })),
      state('3', style({ transform: 'rotate(270deg)' })),
      transition('* => *', animate('100ms ease-in-out')),
    ])
  ]
})
export class ElCaminoFlipFactoryComponent {
  cols: number = 2
  todo = ['B.0', 'C.0', 'D.0', 'E.0', 'L.0', 'O.0', 'S.0', 'T.0'];
  newlevel: Block[] = [];
  newlev: Subject<Block[]> = new Subject()
  layoutService: LayoutService = inject(LayoutService)
  insertBlock(item: string) {
    let block: Block = {
      type: item.split('.')[0],
      state: Number(item.split('.')[1])
    }
    this.newlevel.push(block)
    console.log(this.newlevel.map(block => block.type + '.' + block.state))
    this.newlev.next(this.newlevel)
  }

  rotate(card: Block, index: number) {
    let type = card.type;
    let state = card.state;
    var nextState
    switch (type) {
      case 'S':
        nextState = (state! + 1) % 2;
        break;
      case 'D':
        nextState = (state! + 1) % 2;
        break;
      case 'L':
        nextState = (state! + 1) % 2;
        break;
      case 'B':
        nextState = 0;
        break;
      case 'T':
        nextState = 0;
        break;
      case 'O':
        nextState = 0;
        break;
      default:
        nextState = (state! + 1) % 4;
        break;
    }

    this.newlevel.splice(index, 1, { type: type, state: nextState })
    this.newlev.next(this.newlevel)
    console.log(this.newlevel.map(block => block.type + '.' + block.state))

  }

}