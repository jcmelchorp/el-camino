import { Component, inject } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, CdkDragExit, CdkDragEnter, CdkDragPlaceholder, CdkDragStart, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { JsonPipe, KeyValuePipe, NgFor, NgStyle } from '@angular/common';
import { LayoutService } from '../layout/layout.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Block, Level } from '../el-camino-flip/el-camino-flip.model';



@Component({
  selector: 'app-factory',
  template: `
  <div class="flex flex-col md:flex-row justify-around items-start">
    <div class="w-1/4 mx-5">
    <div class="flex flex-col">
    <div><mat-form-field >
      <mat-label>Columnas</mat-label>
      <input matInput type="number" [(ngModel)]="level.cols"  min="3" max="20" step="1">
    </mat-form-field></div>
    <div><mat-form-field >
      <mat-label>Nivel</mat-label>
      <input matInput type="number" [(ngModel)]="level.index"  min="1"  step="1">
    </mat-form-field></div>
   
   <h2>Formas</h2>
   <mat-grid-list cols="4" cdkDropList #todoList="cdkDropList" [cdkDropListData]="todo"  rowHeight="100px"
          [cdkDropListConnectedTo]="doneList" class="mat-grid-list" [ngStyle]="{'width':4*100+'px'}"  
       >
          <mat-grid-tile *ngFor="let item of todo" class="mat-grid-item" cdkDrag
          (cdkDragExited)="exited($event)"
          (cdkDragEntered)="entered($event)"
          
          [cdkDragData]="item"
          [ngStyle]="{
              filter: (themeService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
              background: 'center / cover no-repeat url(paths/' + item.type + ',png)',
              border: '5px dashed darkgrey' ,
              'border-radius':'25px'
          }"></mat-grid-tile>
      </mat-grid-list>
      <div>

        <pre *ngFor="let block of level.blocks">{{ {rot:block.state}| json}}</pre>
        <mat-grid-list class="mat-grid-list"  cols="{{ level.cols! }}">
        <ng-container *ngFor="let tile of level.blocks; index as i">
          <mat-grid-tile class="mat-grid-tile" 
          [ngStyle]="{
              filter: (themeService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
              background: 'center / cover no-repeat url(paths/' + tile.type + ',png)',
            }">
            <div><span></span></div>
          </mat-grid-tile>
        </ng-container>
      </mat-grid-list>
      </div>
      </div>
    
    <mat-card class="w-1/2 mx-5" [ngStyle]="{'max-width':level.cols!*110+'px'}">    
      <mat-card-content>
      <mat-grid-list id="new-level" cols="{{ level.cols!.toString() }}" cdkDropList #doneList="cdkDropList" [cdkDropListData]="level.blocks!" rowHeight="100px"
          [cdkDropListConnectedTo]="todoList" class=" mat-grid-list" (cdkDropListDropped)="drop($event)" [ngStyle]="{'max-width':level.cols!*100+'px','min-height':level.cols!*100+'px'}">
          <ng-container *ngFor="let item of level.blocks; index as i">
          <mat-grid-tile   class="mat-grid-item" cdkDrag [@rotateState]="item.state"
          (click)="rotate(item)"
          [cdkDragData]="item"
    (cdkDragStarted)="onDragStarted($event)"
    (cdkDragMoved)="onDragMove($event)"
    (cdkDragEnded)="onDragEnded($event)"
          [ngStyle]="{
              filter: (themeService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
              background: 'center / cover no-repeat url(' + item + ')',
               border: '4px dashed darkgrey' ,
              'border-radius':'25px'
            }">
                      <div  *cdkDragPreview></div>
            <span class="font-normal text-2xl text-gray-500">{{i}}</span>
          </mat-grid-tile >
          </ng-container>
          <div class="example-custom-placeholder" *cdkDragPlaceholder></div>

      </mat-grid-list>
      </mat-card-content>
  
      </mat-card>
    </div>
  `,
  styleUrl: './factory.component.css',
  imports: [NgFor, CdkDrag, CdkDropList, CdkDragPlaceholder, NgStyle, MatTreeModule, MatGridListModule, MatCardModule, FormsModule, ReactiveFormsModule, MatInputModule, JsonPipe],
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
  level!: Level;
  counter: number = 0;
  offset: any = 100;


  themeService: LayoutService = inject(LayoutService)
  todo: Block[] = [
    { state: 0, type: "B" },
    { state: 0, type: "C" },
    { state: 0, type: "E" },
    { state: 0, type: "S" },
    // {id:'',image:'x_d_curve.png', rotation:0,type:'N'},
    // {id:'',image:'x_d_line.png', rotation:0,type:'N'}
  ];
  // done: Block[] = [  ];
  transferringItem!: Block 


  drop(event: CdkDragDrop<Block[]>) {
    if (event.previousContainer === event.container) {
      // event.container.data[event.currentIndex]= {...event.container.data[event.currentIndex], index:event.previousIndex}
      // event.container.data[event.previousIndex]= {...event.container.data[event.previousIndex], index:event.currentIndex+1};

      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // event.container.data[event.previousIndex]= {...event.container.data[event.previousIndex], index:event.currentIndex};

    } else if (event.container.id === 'new-level') {
      // event.previousContainer.data[event.previousIndex]= {...event.previousContainer.data[event.previousIndex], index:event.currentIndex+1};
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    else if (event.container.id !== event.previousContainer.id) {
      event.container.data.splice(event.currentIndex, 1);
    }

  }

  dropErase(event: CdkDragDrop<Block[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else if (event.previousContainer.id !== event.container.id) {
      //this.transferringItem = {...event.previousContainer.data[event.previousIndex], index:this.done.length+1};
      event.previousContainer.data[event.previousIndex] = { ...event.previousContainer.data[event.previousIndex], index: event.currentIndex };
      //console.log(this.transferringItem);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.container.data.length

      );
    }
  }

  entered(e?: CdkDragEnter<Block>) {
    // this.transferringItem = undefined;
    e!.item.data = {} as Block;
    console.log(this.transferringItem)
  }

  exited(e: CdkDragExit<Block>) {
    this.transferringItem = { ...e.item.data };
    e.item.data = { ...e.item.data };
    console.log(this.transferringItem)
  }

  onDragStarted(event: CdkDragStart<Block[]>) {
    //you can use
    // this.done[index].text="moved"
    // this.done[index].index=index;
    //or use
    // event.source.data={};
    // event.source.data.text="moving...."
  }
  onDragEnded(event: CdkDragEnd<Block[]>) {
    // event.source.data={}
  }

  public onDragMove(event: CdkDragMove<any>): void {
    const el = (document.getElementsByClassName('cdk-drag-preview')[0]) as any
    const xPos = event.pointerPosition.x - this.offset.x;
    const yPos = event.pointerPosition.y - this.offset.y;
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }
  rotate(item: Block) {
    // var rot =Number(item.split('.')[1]);
    // let type =item.split('.')[0];

    switch (item.type) {
      case 'S':
        item.state = (item.state! + 1) % 2;
        break;
      case 'B':
        item.state = 0;
        break;
      default:
        item.state = (item.state! + 1) % 4;
        break;
    }
  }
}
