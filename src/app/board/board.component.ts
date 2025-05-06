import { CdkDrag, CdkDragEnter, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { LayoutService } from '../layout/layout.service';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';

const COLORS = [
  '#ea4335',
  '#4285f4',
  '#fbbc04',
  '#34a853',
  '#fa7b17',
  '#f538a0',
  '#a142f4',
  '#24c1e0',
  '#9aa0a6',
  '#5195ea',
  '#e25142',
  '#f5c518',
  '#41af6a',
  '#f6aea9',
  '#a50e0e',
  '#aecbfa',
  '#174ea6',
  '#fde293',
  '#a8dab5',
  '#0d652d',
  '#fdc69c',
  '#fba9d6',
  '#c92786',
  '#d7aefb',
  '#8430ce',
  '#a1e4f2',
  '#007b83',
  '#e8eaed',
  '#b9d4f6',
  '#f3b9b3',
  '#fbe7a2',
  '#b3dfc3',
];

function getColor() {
  return COLORS[Math.floor(Math.random() * 32)];
}
@Component({
  selector: 'app-board',
  imports: [CommonModule,MatGridListModule,MatButtonModule,MatIconModule, CdkDropList, CdkDrag],
  template: `<mat-grid-list cols="3" rowHeight="1:1" gutterSize="2px">
  <mat-grid-tile
    *ngFor="let card of cards; let i = index"
    [colspan]="1"
    [rowspan]="1"
  >

    <div cdkDropList [cdkDropListConnectedTo]="drops" [cdkDropListData]="i">
    <span class="absolute top-10 left-10 bottom-0 right-0 font-light text-4xl text-neutral-600">{{i}}</span>
      <div
      (click)="rotate(card,i)"
        cdkDrag
        (cdkDragEntered)="entered($event)"
        [cdkDragData]="i"
        class="absolute top-0 left-0 bottom-0 right-0 flex flex-row justify-between align-top text-2xl text-neutral-200"
        [ngStyle]="{
          filter: (layoutService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
          background: 'center / cover no-repeat url(paths/' + card.split('.')[0] + '.png' + ')',
        }"
            [@rotateState]="card.split('.')[1]"
      >
      </div>
    
    </div>
  </mat-grid-tile>
</mat-grid-list>
`,
  styleUrl: './board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[
    trigger('rotateState', [
      state('0', style({ transform: 'rotate(0deg)' })),
      state('1', style({ transform: 'rotate(90deg)' })),
      state('2', style({ transform: 'rotate(180deg)' })),
      state('3', style({ transform: 'rotate(270deg)' })),
      transition('* => *', animate('100ms ease-in-out')),
    ])
  ]
})
export class BoardComponent implements AfterViewInit  {
  layoutService:LayoutService=inject(LayoutService)

  entered($event: CdkDragEnter) {
    console.log($event.item.data, $event.container.data);
    moveItemInArray(this.cards, $event.item.data, $event.container.data);
  }
 

  @ViewChildren(CdkDropList)
  dropsQuery!: QueryList<CdkDropList>;

  drops!: CdkDropList[];

  ngAfterViewInit() {
    this.dropsQuery.changes.subscribe(() => {
      this.drops = this.dropsQuery.toArray();
    });
    Promise.resolve().then(() => {
      this.drops = this.dropsQuery.toArray();
      console.log(this.drops);
    });
  }

  /** Based on the screen size, switch from standard to one column per row */
 @Input() cards = 'C.1 S.0 E.1 C.0 S.0 C.2 B.0 B.0 E.2'.split(' ');

  rotate(card:string,index:number) {
    let type=card.split('.')[0]
    let state=card.split('.')[1];
    var nextState
    if (state=='S'){
       nextState=(parseInt(state)+1)%2
    } else {
       nextState=(parseInt(state)+1)%4
    }
    this.cards[index]=type+'.'+nextState
  }
}
