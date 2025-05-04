import { Component, inject } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, CdkDragExit, CdkDragEnter, CdkDragPlaceholder, CdkDragStart, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { JsonPipe, KeyValuePipe, NgFor, NgStyle } from '@angular/common';
import { LayoutService } from '../layout/layout.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import {  LevelTiles, TileExtended, TileType } from '../el-camino/el-camino.model';
import { animate, state, style, transition, trigger } from '@angular/animations';



@Component({
  selector: 'app-factory',
  template: `
  <div class="flex flex-col md:flex-row justify-evenly items-start">
    <div class="w-1/4 mx-5">
    <div class="flex flex-row justify-evenly items-center">
    <mat-form-field appearance="outline">
      <mat-label>Columnas</mat-label>
      <input matInput type="number" [(ngModel)]="level.cols"  min="3" max="20" step="1">
    </mat-form-field>
    <mat-form-field appearance="outline">
      <mat-label>Nivel</mat-label>
      <input matInput type="number" [(ngModel)]="level.level"  min="1"  step="1">
    </mat-form-field>
    <mat-form-field appearance="outline">
      <mat-label>ID</mat-label>
      <input matInput  [(ngModel)]="level.id">
    </mat-form-field>
   </div>
   <h2>Formas</h2>
   <mat-grid-list cols="4" cdkDropList #todoList="cdkDropList" [cdkDropListData]="todo"  rowHeight="100px"
          [cdkDropListConnectedTo]="doneList" class="mat-grid-list"  
       >
          <mat-grid-tile *ngFor="let item of todo" class="mat-grid-tile" cdkDrag
          (cdkDragExited)="exited($event)"
          (cdkDragEntered)="entered($event)"
          
          [cdkDragData]="item"
          [ngStyle]="{
              filter: (themeService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
              background: 'center / cover no-repeat url(' + item.image + ')',
              border: '5px dashed darkgrey' ,
              'border-radius':'25px'
          }"></mat-grid-tile>
      </mat-grid-list>
      <div>
        <pre>{{level |json }}</pre>
      </div>
      </div>
    
    <mat-card class="w-1/2 mx-5" [ngStyle]="{'max-width':level.cols*105+'px'}">    
      <mat-card-content>
      <mat-grid-list id="new-level" cols="{{ level.cols }}" cdkDropList #doneList="cdkDropList" [cdkDropListData]="level.blocks" rowHeight="100px"
          [cdkDropListConnectedTo]="todoList" class=" mat-grid-list" (cdkDropListDropped)="drop($event)" [ngStyle]="{'max-width':level.cols*100+'px','min-height':level.cols*100+'px'}">
          <mat-grid-tile  *ngFor="let item of level.blocks; let i=index" class="mat-grid-tile" cdkDrag [@rotateState]="item.rot"
          (click)="rotate(item)"
          [cdkDragData]="item"
    (cdkDragStarted)="onDragStarted($event,i)"
    (cdkDragMoved)="onDragMove($event)"
    (cdkDragEnded)="onDragEnded($event,i)"
          [ngStyle]="{
              filter: (themeService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
              background: 'center / cover no-repeat url(' + item.image + ')',
               border: '4px dashed darkgrey' ,
              'border-radius':'25px'
            }">
                      <div class="example-custom-placeholder" *cdkDragPlaceholder></div>
                      <div class="block" *cdkDragPreview></div>
            <span class="font-normal text-2xl text-gray-500">{{item.index}}</span>
          </mat-grid-tile >
      </mat-grid-list>
      </mat-card-content>
  
      </mat-card>
    </div>
  `,
  styleUrl: './factory.component.css',
  imports: [NgFor,CdkDrag, CdkDropList,CdkDragPlaceholder,NgStyle,MatTreeModule,MatGridListModule,MatCardModule,FormsModule,ReactiveFormsModule,MatInputModule,JsonPipe],
  animations: [
    trigger('rotateState', [
      state('0', style({ transform: 'rotate(0deg)' })),
      state('90', style({ transform: 'rotate(90deg)' })),
      state('180', style({ transform: 'rotate(180deg)' })),
      state('270', style({ transform: 'rotate(270deg)' })),
      transition('* => *', animate('100ms ease-in-out')),
    ])
  ],
})
export class FactoryComponent {
  level:LevelTiles;
  counter:number=0;
  offset:any=100;

 
  themeService:LayoutService=inject(LayoutService)
  todo: TileExtended[] = [
    {image:'x_blank.png', rot:0,type:TileType.B},
    {image:'x_curve.png', rot:0,type:TileType.C},
    {image:'x_end.png', rot:0,type:TileType.E},
    {image:'x_line.png', rot:0,type:TileType.S},
    // {id:'',image:'x_d_curve.png', rotation:0,type:TileType.N},
    // {id:'',image:'x_d_line.png', rotation:0,type:TileType.N}
  ];
  // done: TileExtended[] = [  ];
  transferringItem: TileExtended | undefined = undefined;
constructor(){
  this.level={cols:3,blocks:[],id:'001',level:1};

}
 
  drop(event: CdkDragDrop<TileExtended[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else if (event.container.id === 'new-level') {
        event.previousContainer.data[event.previousIndex]= {...event.previousContainer.data[event.previousIndex], index:this.level.blocks.length+1};
        copyArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        }
      //  else {
      //   this.level.blocks.splice(event.container.data.indexOf(event.container.data[event.currentIndex]), 1);
      // }
    
  }

  dropErase(event: CdkDragDrop<TileExtended[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else if (event.previousContainer.id !== event.container.id) {
      //this.transferringItem = {...event.previousContainer.data[event.previousIndex], index:this.done.length+1};
      event.previousContainer.data[event.previousIndex]= {...event.previousContainer.data[event.previousIndex], index:this.level.blocks.length+1};
      //console.log(this.transferringItem);
   transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.container.data.length
    
    );
    }
  }

  entered(e?: CdkDragEnter<TileExtended>) {
this.transferringItem = undefined;
e!.item.data={} as TileExtended;
console.log( this.transferringItem )
  }

  exited(e: CdkDragExit<TileExtended>) {
    this.transferringItem = {...e.item.data,index:this.level.blocks.length+1};
    e.item.data={...e.item.data,index:this.level.blocks.length+1};
    console.log( this.transferringItem )
  }
 
  onDragStarted(event:CdkDragStart<any>,index:number)
  {
    //you can use
    // this.done[index].text="moved"
    // this.done[index].index=index;
    //or use
    event.source.data={};
    // event.source.data.text="moving...."
  }
  onDragEnded(event:CdkDragEnd<any>,index:number)
  {
    event.source.data={}
  }

  public onDragMove(event: CdkDragMove<any>): void {
    const el=(document.getElementsByClassName('cdk-drag-preview')[0])as any
    const xPos = event.pointerPosition.x - this.offset.x;
    const yPos = event.pointerPosition.y - this.offset.y;
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }
  rotate( tile: TileExtended){
      switch (tile.type) {
        case TileType.S:
          tile.rot = (tile.rot! + 90) % 180;
          break;
          case TileType.B:
            tile.rot =0;
            break;
        default:
          tile.rot = (tile.rot! + 90) % 360;
          break;
      }
  }
}
