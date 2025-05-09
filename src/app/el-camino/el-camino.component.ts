import { ChangeDetectionStrategy, Component, inject, isDevMode, OnInit, Signal } from '@angular/core';
import { ElCaminoService } from './el-camino.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { map, Subject, tap } from 'rxjs';
import { LayoutService } from '../layout/layout.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Block, Level } from './el-camino.model';

@Component({
  selector: 'app-play',
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    NgxSpinnerModule,
    MatIconModule
  ],
  template: `
   <div class="pt-10" style="display: flex; flex-direction: column; justify-content: start;align-items:center">
    @if (!disableButton) {
      <img width="80px" src="desert-logo.png" alt="El camino brand">
    <button color="primary"  mat-fab extended type="button" (click)="nextLevel()" >
      <mat-icon>route</mat-icon><span class="font-medium text-3xl">Inicio</span>
    </button>
    }

    <div *ngIf="level$ | async as level" style="width: 85%;max-width:500px; max-height:500px;padding-bottom:0;height:auto;">
      <ngx-spinner bdColor="#fff" size="medium" color="#111" type="pacman" [fullScreen]="false"><p class="font-light text-5xl"> Level:{{level.index}}</p></ngx-spinner>
      <mat-grid-list class="mat-grid-list"  cols="{{ level.cols }}"
      [@glow]="(isLevelDone$|async)">

        <ng-container #container *ngFor="let tile of level.blocks; index as i">
          <mat-grid-tile class="mat-grid-tile" (click)="rotate(level, tile)" 
          [ngStyle]="{
              filter: (layoutService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
              background: 'center / cover no-repeat url(paths/' + tile.type + '.png)',
              border: (tile.success && devMode) ? 'none//1px dashed #550055' : 'none',
            }"
            [@rotateState]="tile.randState"
            >
            <div><span></span></div>
          </mat-grid-tile>
        </ng-container>
      </mat-grid-list>
    </div>
  </div>
`,
  styles:[`
  :host {
    display: block;
  }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('rotateState', [
      state('0', style({ transform: 'rotate(0deg)' })),
      state('1', style({ transform: 'rotate(90deg)' })),
      state('2', style({ transform: 'rotate(180deg)' })),
      state('3', style({ transform: 'rotate(270deg)' })),
      transition('* => *', animate('100ms ease-in-out')),
    ]),
    trigger('glow', [
      state('false', style({
        boxShadow: '0 0 0 rgba(0, 0, 0, 0)' // No glow initially
      })),
      state('true', style({
        boxShadow: '0 0 30px rgba(0, 123, 255, 0.7)' // Blue glow
      })),
      transition('false <=> true', animate('1000ms ease-in-out'))
    ])
  ],
  providers: [ElCaminoService, NgxSpinnerService]
})
export class ElCaminoComponent  implements OnInit {
  layoutService: LayoutService = inject(LayoutService)
  disableButton: boolean = false;
  levelCount: number = 0;
  currentLevel: Subject<number> = new Subject();
  currentLevel$ = this.currentLevel.asObservable();
  levels: Signal<Level[]|undefined> = inject(ElCaminoService).levels;
  level: Subject<Level> = new Subject();
  level$ = this.level.asObservable();
  isLevelDone: Subject<boolean> = new Subject();
  isLevelDone$ = this.isLevelDone.asObservable();
  devMode: boolean = isDevMode();
  glowState: boolean = false;

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.level$ = this.currentLevel$.pipe(
      tap((num: number) => console.log(num)),
      map((num: number) => this.levels()!.find(l => l.index == num)!),
      tap((level: Level) => {
        this.disableButton = true;
        this.isLevelDone.next(false);
        this.level.next(level);
        console.log(level);
      }),
    )
  }


  nextLevel() {
    this.currentLevel.next(this.levelCount++);
  }

  rotate(level: Level, tile: Block) {
    switch (tile.type) {
      case 'S':
        tile.randState = (tile.randState! + 1) % 2
        break;
      case 'L':
        tile.randState = (tile.randState! + 1) % 2
        break;
      case 'T':
        tile.randState = 0
        break;
      case 'B':
        tile.randState = 0
        break;
      case 'O':
        tile.randState = 0
        break;
      case 'C':
        tile.randState = (tile.randState! + 1) % 4          
        break;
      case 'E':
        tile.randState = (tile.randState! + 1) % 4          
        break;
    }
    // console.log(tile.currentRotation);
    if (tile.randState === tile.state) {
      tile.success = true;
      console.log(`Tile No. ${tile.index} success`);
    } else {
      tile.success = false;
    }

    let blocks = level.blocks!.map((block, i) => {
      if (i === tile.index) {
        return tile;
      } else {
        return block;
      }
    });

    this.level.next({
      index: level.index,
      cols: level.cols,
      blocks: blocks,
    } as Level);

    this.isLevelDone$ = this.level.pipe(
      map((level) => !level.blocks!.map((block) => block.success).includes(false)),
      tap((stop) => {
        if (stop) {
          console.log('Done');
          //  this.toggleGlow();
          this.showSpinner()

          setTimeout(() => {
            this.currentLevel.next(this.levelCount++);

          }, 500);
        } else {
          console.log('Not yet');
        }
      }),
    );
  }

  showSpinner() {
    this.spinner.show(undefined, {
      type: 'pacman',
      size: 'large',
      bdColor: this.layoutService.appTheme()=='dark'?'black':'white',
      color: this.layoutService.appTheme()=='dark'?'white':'black',
      fullScreen: false,
    });
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
      //this.toggleGlow()
    }, 1500);
  }


  toggleGlow() {
    this.glowState = this.glowState === false ? true : false;
  }

  onGlowStart() {
    console.log('Glow animation started');
  }

  onGlowDone() {
    console.log('Glow animation finished');
  }
}
