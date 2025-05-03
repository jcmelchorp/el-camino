import { Component } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-factory',
  template: `
    <div class="container">
      <h2>To do</h2>
    
      <div cdkDropList #todoList="cdkDropList" [cdkDropListData]="todo"
          [cdkDropListConnectedTo]="doneList" class="list" (cdkDropListDropped)="drop($event)">
        @for (item of todo; track item) {
          <div class="list-item" cdkDrag>{{item}}</div>
        }
      </div>
    </div>
    
    <div class="container">
      <h2>Done</h2>
    
      <div cdkDropList #doneList="cdkDropList" [cdkDropListData]="done"
          [cdkDropListConnectedTo]="todoList" class="list" (cdkDropListDropped)="drop($event)">
        @for (item of done; track item) {
          <div class="list-item" cdkDrag>{{item}}</div>
        }
      </div>
    </div>
    
  `,
  styleUrl: './factory.component.css',
  imports: [CdkDrag, CdkDropList]
})
export class FactoryComponent {
  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }
}
