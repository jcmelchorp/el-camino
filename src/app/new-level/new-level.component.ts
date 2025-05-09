import { Component, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDragDrop, moveItemInArray, copyArrayItem, CdkDragPlaceholder, CdkDragEnter } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout/layout.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Block, Level } from '../el-camino/el-camino.model';


@Component({
  selector: 'app-new-level',
  template: `
  <div class="flex flex-row justify-start items-start">
    <div class="w-[80px] mx-5 align-top">
      <span class="font-normal text-2xl">Formas</span>
    
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
        <div></div>
      </div>
    </div>
    
    <div class="w-1/2 mx-5">
      <span class="font-normal text-2xl">Nivel {{level.index}}</span>
    
      <mat-form-field>
      <mat-label>Columnas</mat-label>
      <input matInput type="number" [(ngModel)]="level.cols"  min="3" max="10" step="1">
    </mat-form-field>

    <mat-grid-list cols="{{level.cols!.toString()}}" rowHeight="1:1" gutterSize="0px" [ngStyle]="{'width':level.cols!*120+'px','height':level.cols!*120+'px'}">
 
    @for (card of level.blocks; track $index) {
      <mat-grid-tile
    class="list-item"
    [colspan]="1"
    [rowspan]="1"
  >
    <div cdkDropList [cdkDropListConnectedTo]="drops" [cdkDropListData]="$index">
    <span class="absolute top-10 left-10 bottom-0 right-0 font-light text-4xl text-neutral-600">{{$index}}</span>
      <div
      (click)="rotate(card,$index)"
        cdkDrag
        (cdkDragEntered)="entered($event)"
        [cdkDragData]="'$index'"
        class="absolute top-0 left-0 bottom-0 right-0 flex flex-row justify-between align-top text-2xl text-neutral-200"
        [ngStyle]="{
          filter: (layoutService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
          background: 'center / cover no-repeat url(paths/' + card.type + '.png)',
        }"
            [@rotateState]="card.randState"
      >
      </div>
    
    </div>
      
  </mat-grid-tile>
      }
</mat-grid-list>
    
<div class="card">
  <pre>{{level.blocks!.join(' ')| json}}</pre>
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
    @Input() level:Level={
      cols: 3, blocks: [],
      index: 0
    };
  
  layoutService:LayoutService=inject(LayoutService)
  todo = ['B.0','C.0','D.0','E.0','S.0','T.0'];
  entered($event: CdkDragEnter) {
    console.log($event.item.data, $event.container.data);
    moveItemInArray(this.level.blocks!, $event.item.data, $event.container.data);
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

  rotate(card:Block,index:number) {
    let type=card.type;
    let state=card.state;
    var nextState
    if (type=='S'){
       nextState=(state!+1)%2
    } else {
       nextState=(state!+1)%4
    }
    this.level.blocks![index]!=type+'.'+nextState
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
