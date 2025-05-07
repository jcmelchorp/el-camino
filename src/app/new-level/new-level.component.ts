import { Component, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, CdkDragPlaceholder, CdkDragEnter } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout/layout.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { TileType } from '../el-camino/el-camino.model';
import { BoardComponent } from "../board/board.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export enum BlockTypes {
b,c,d,e,s,t
}

@Component({
  selector: 'app-new-level',
  template: `
    <div class="inline-block w-[80px] max-w-full mx-5 align-top">
      <h2>Formas</h2>
    
      <div cdkDropList id="todo-list" #todoList="cdkDropList" [cdkDropListData]="todo"
          [cdkDropListConnectedTo]="drops" class="list" (cdkDropListDropped)="drop($event)">
        @for (item of todo; track item) {
          <div class="list-item" cdkDrag [ngStyle]="{
            filter: (layoutService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
            background: 'center / cover no-repeat url(paths/' + item.split('.')[0] + '.png' + ')',
            }">
        <div class="custom-placeholder" *cdkDragPlaceholder></div>
          {{item}}
        </div>
        }
      </div>
    </div>
    
    <div class="inline-block mx-5">
      <h2>Nivel {{level.levelNum}}</h2>
    
      <mat-form-field>
      <mat-label>Columnas</mat-label>
      <input matInput type="number" [(ngModel)]="level.cols"  min="3" max="10" step="1">
    </mat-form-field>

    <mat-grid-list cols="{{level.cols.toString()}}" rowHeight="1:1" gutterSize="0px" [ngStyle]="{'width':level.cols*120+'px','height':level.cols*120+'px'}">
  <mat-grid-tile
    *ngFor="let card of level.blocks; let i = index"
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
    
<div class="card">
  <pre>{{level.blocks.join(' ')| json}}</pre>
</div>
      <!-- <mat-grid-list cols="{{level.cols.toString()}}" rowHeight="1:1" gutterSize="0px" 
      cdkDropList id="done-list" #doneList="cdkDropList" [cdkDropListData]="level.blocks" 
          [cdkDropListConnectedTo]="todoList" class="list" (cdkDropListDropped)="drop($event)"
          [ngStyle]="{'width':level.cols*100+'px','height':level.cols*100+'px'}">
        @for (item of level.blocks; track $index) {
          <mat-grid-tile class="list-item" cdkDrag [@rotateState]="item.split('.')[1]" 
          [ngStyle]="{
            filter: (layoutService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
            background: 'center / cover no-repeat url(paths/' + item.split('.')[0] + '.png' + ')',
            }">
                    <div class="custom-placeholder" *cdkDragPlaceholder></div>
            {{item}}
          </mat-grid-tile>
        }
      </mat-grid-list> -->
    </div>
    
  `,
  styleUrl: './new-level.component.css',
  imports: [CdkDrag, CdkDropList, CdkDragPlaceholder, CommonModule, MatGridListModule, MatButtonModule,MatInputModule, FormsModule, ReactiveFormsModule,MatIconModule],
  providers:[LayoutService],
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
export class NewLevelComponent {
    @Input() level:{ levelNum?: number, cols: number, blocks: string[] }={cols:3,blocks:[]};
  
  layoutService:LayoutService=inject(LayoutService)
  todo = ['B.0','C.0','D.0','E.0','S.0','T.0'];
  entered($event: CdkDragEnter) {
    console.log($event.item.data, $event.container.data);
    moveItemInArray(this.level.blocks, $event.item.data, $event.container.data);
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

  rotate(card:string,index:number) {
    let type=card.split('.')[0]
    let state=card.split('.')[1];
    var nextState
    if (state=='S'){
       nextState=(parseInt(state)+1)%2
    } else {
       nextState=(parseInt(state)+1)%4
    }
    this.level.blocks[index]=type+'.'+nextState
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (event.container.id === 'done-list') {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else if (event.container.id === 'todo-list') {
      event.previousContainer.data.splice(event.previousIndex, 1);
    }
  }
}
