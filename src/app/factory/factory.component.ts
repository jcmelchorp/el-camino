import { Component, inject } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, CdkDragExit, CdkDragEnter, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { NgStyle } from '@angular/common';
import { LayoutService } from '../layout/layout.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {  TileExtended, TileType } from '../el-camino/el-camino.model';

@Component({
  selector: 'app-factory',
  template: `
  <div class="flex flex-col md:flex-row justify-evenly items-center">
    <div class="w-1/4 mx-5">
    <mat-form-field appearance="outline">
      <mat-label>Columnas</mat-label>
      <input matInput type="number" [(ngModel)]="cols"  min="3" max="20" step="1">
    </mat-form-field>

   
      <h2>To do</h2>
    
      <mat-grid-list cols="2" cdkDropList #todoList="cdkDropList" [cdkDropListData]="todo"
          [cdkDropListConnectedTo]="doneList" class="mat-grid-list"  (cdkDropListEntered)="entered($event)"
    (cdkDropListDropped)="drop($event)"
    (cdkDropListExited)="exited($event)">
        @for (item of todo; track item) {
          <mat-grid-tile class="mat-grid-tile" cdkDrag
          [ngStyle]="{
              filter: (themeService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
              background: 'center / cover no-repeat url(' + item.image + ')',
              border: '5px dashed darkgrey' ,
              'border-radius':'25px'
          }"></mat-grid-tile>
        }
      </mat-grid-list>
    </div>
    
    <mat-card class="w-3/4 min-w-1/4 max-w-[600px] mx-5">    
      <mat-card-content>
      <mat-grid-list cols="{{ cols }}" cdkDropList #doneList="cdkDropList" [cdkDropListData]="done"
          [cdkDropListConnectedTo]="todoList" class="m-5 min-h-[500px] mat-grid-list" (cdkDropListDropped)="drop($event)">
        @for (item of done; track item) {
          <mat-grid-tile  class="m-5 mat-grid-tile" cdkDrag (click)="rotate( item)" 
          [ngStyle]="{
              filter: (themeService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
              background: 'center / cover no-repeat url(' + item.image + ')',
               border: '4px dashed darkgrey' ,
              'border-radius':'25px'
            }">
                      <div class="example-custom-placeholder" *cdkDragPlaceholder></div>
            {{item.id}}
          </mat-grid-tile >
        }
      </mat-grid-list>
      </mat-card-content>
  
      </mat-card>
    </div>
  `,
  styleUrl: './factory.component.css',
  imports: [CdkDrag, CdkDropList,CdkDragPlaceholder,NgStyle,MatGridListModule,MatCardModule,FormsModule,ReactiveFormsModule,MatInputModule],
  animations: []
})
export class FactoryComponent {
  cols: number = 3;
  rows:number=this.cols;
  level:number=0;
  themeService:LayoutService=inject(LayoutService)
  todo: any[] = [
    {id:'',image:'x_blank.png', rotation:0,type:TileType.B},
    {id:'',image:'x_curve.png', rotation:0,type:TileType.C},
    {id:'',image:'x_end.png', rotation:0,type:TileType.E},
    {id:'',image:'x_line.png', rotation:0,type:TileType.S},
    // {id:'',image:'x_d_curve.png', rotation:0,type:TileType.N},
    // {id:'',image:'x_d_line.png', rotation:0,type:TileType.N}
  ];
  done: any[] = [  ];
  transferringItem: any | undefined = undefined;

  createGrid():void{
    this.done=[];
    for (let i = 1; i <= this.cols*this.cols; i++) {
      this.done.push({id:i.toString(),image:'x_blank.png', rotation:0,type:TileType.B})
    }
    console.log(this.done)
  } 
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer.id !== event.container.id) {
   copyArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    }

    this.transferringItem = undefined;
  }

  entered(e?: CdkDragEnter<any>) {
this.transferringItem = undefined;
  }

  exited(e: CdkDragExit<any>) {
    this.transferringItem = e.item.data;
  }
  // drop(event: CdkDragDrop<any[]>): void {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data,
  //         event.container.data,
  //         event.previousIndex,
  //         event.currentIndex);
  //   }
  // }
  rotate( tile: TileExtended){

  }
}
