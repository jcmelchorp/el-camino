import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, QueryList, ViewChildren } from '@angular/core';
import { BoardComponent } from "../board/board.component";

@Component({
  selector: 'app-board-container',
  imports: [BoardComponent],
  template: `<app-board></app-board>`,
  styleUrl: './board-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardContainerComponent { 
 

}
