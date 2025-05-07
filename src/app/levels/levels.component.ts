import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ElCaminoService } from '../el-camino/el-camino.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NewLevelComponent } from '../new-level/new-level.component';
import { Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-levels',
  imports: [CommonModule, MatListModule, NewLevelComponent, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ElCaminoService],
  styles: `
  `,
  template: `
  <div class="flex flex-row justify-start items-top">
    <div class="w-[150px] flex flex-col justify-start">
       <h1 class="font-semibold text-center text-2xl">Levels</h1>
       <button mat-stroked-button color="primary" (click)="newLevel()">New Level</button>
         <mat-list class="h-[70vh] overflow-y-scroll">
      
       @for ( level of levels?.slice()?.reverse(); track $index) {
         <mat-list-item (click)="selectLevel(level)">
           <span matListItemTitle>Level: {{level.levelNum}}</span>
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
  _gameService: ElCaminoService = inject(ElCaminoService)
  levels = this._gameService.signalLevels()?.map(
    (level, i) => {
      return { levelNum: i, cols: Math.sqrt(level.length), blocks: level }
    }
  );
  selectedLevel: Subject<{ levelNum: number, cols: number, blocks: string[] }> = new Subject();
  selectedLevel$ = this.selectedLevel.asObservable();

  selectLevel(level: any) {
    console.log('Level ' + level.levelNum + ' selected', level)
    this.selectedLevel.next(level)
  }

  newLevel() {
    let i = this.levels!.length;
    this.selectedLevel.next({ levelNum: i, cols: 3, blocks: [] })
  }
}
