import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NewLevelComponent } from '../new-level/new-level.component';
import { Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ElCaminoFlipService } from '../el-camino-flip/el-camino-flip.service';
import { Level } from '../el-camino-flip/el-camino-flip.model';

@Component({
  selector: 'app-levels',
  imports: [CommonModule, MatListModule, NewLevelComponent, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ElCaminoFlipService],
  styles: `
  `,
  template: `
  <div class="flex flex-row justify-start items-top">
    <div class="w-[150px] flex flex-col justify-start">
       <div class="font-semibold text-center text-3xl">Levels</div>
       <button mat-stroked-button color="primary" (click)="newLevel()">New Level</button>
         <mat-list class="h-[70vh] overflow-y-scroll">
      
       @for ( level of levels()?.slice()?.reverse(); track $index) {
         <mat-list-item (click)="selectLevel(level)">
           <span matListItemTitle>Level: {{level.index}}</span>
           <span matListItemLine> {{level.cols}}x{{level.cols}}</span>
         </mat-list-item>
        }
        </mat-list>
    </div>
     <app-new-level *ngIf="selectedLevel$ | async as level;else nolevel" [level]="level"></app-new-level> 
    <ng-template #nolevel></ng-template>
  </div>
`,
})
export class LevelsComponent {
  _gameService: ElCaminoFlipService = inject(ElCaminoFlipService)
  levels = this._gameService.levels
  selectedLevel: Subject<Level> = new Subject();
  selectedLevel$ = this.selectedLevel.asObservable();

  selectLevel(level: any) {
    console.log('Level ' + level.levelNum + ' selected', level)
    this.selectedLevel.next(level)
  }

  newLevel() {
    this.selectedLevel.next(
      {
         index: this.levels!.length, 
         cols: 3, 
         blocks: [
          { },{ },{ },{ },{ },{ },{ },{ }
        ] 
      }
    )
  }
}
