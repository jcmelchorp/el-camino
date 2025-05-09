import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  isDevMode,
  OnInit,
} from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ElCaminoService } from './el-camino.service';
import { LevelTiles, TileExtended } from './el-camino.model';
import { map, Subject, Subscription, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutService } from '../layout/layout.service';

@Component({
  selector: 'app-el-camino',
  imports: [
    CommonModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    NgxSpinnerModule,
    MatIconModule,
  ],
  template: `
  <div class="pt-10" style="display: flex; flex-direction: column; justify-content: start;align-items:center">
    
    <button color="primary" *ngIf="!disableButton" [disabled]="disableButton" mat-fab extended type="button" (click)="nextLevel();">
      <mat-icon>route</mat-icon><span>Inicio</span></button>
    <div *ngIf="level$ | async as level" style="width: 85%;max-width:500px; max-height:500px;padding-bottom:0;height:auto;">
      <ngx-spinner bdColor="#fff" size="medium" color="#111" type="pacman" [fullScreen]="false"><p class="font-light text-5xl"> Level:{{level.level}}</p></ngx-spinner>
      <mat-grid-list class="mat-grid-list"  cols="{{ level.cols }}"
      [@glow]="(isLevelDone$|async)">

        <ng-container #container *ngFor="let tile of level.blocks; index as i">
          <mat-grid-tile class="mat-grid-tile" (click)="rotate(level, tile)" [@rotateState]="tile.rot"
          [ngStyle]="{
              filter: (themeService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
              background: 'center / cover no-repeat url(' + tile.image + ')',
              border: (tile.success && devMode) ? 'none//1px dashed #550055' : 'none',
            }">
            <div><span></span></div>
          </mat-grid-tile>
        </ng-container>
      </mat-grid-list>
    </div>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('rotateState', [
      state('0', style({ transform: 'rotate(0deg)' })),
      state('90', style({ transform: 'rotate(90deg)' })),
      state('180', style({ transform: 'rotate(180deg)' })),
      state('270', style({ transform: 'rotate(270deg)' })),
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
  providers: [ElCaminoService,NgxSpinnerService],
})
export class ElCaminoComponent implements OnInit,AfterViewInit {
  levelCount: number = 1;
  currentLevel: Subject<number> = new Subject();
  currentLevel$ = this.currentLevel.asObservable();
  _elCaminoService = inject(ElCaminoService);
  levels? = this._elCaminoService.levels();
  level: Subject<LevelTiles> = new Subject();
  level$ = this.level.asObservable();
  disableButton: boolean = false;
  isLevelDone: Subject<boolean> = new Subject();
  isLevelDone$ = this.isLevelDone.asObservable();
  subscription!: Subscription;
devMode:boolean=isDevMode();
themeService:LayoutService=inject(LayoutService)

  constructor(private spinner: NgxSpinnerService) {}
  
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {

    this.level$ = this.currentLevel$.pipe(
      map((num: number) => this.levels![num - 1]),
      tap((level) => {
        this.disableButton = true;
        this.isLevelDone.next(false);
        this.level.next(level);
        console.log(level);
      }),
    );

  }

  nextLevel() {
    this.currentLevel.next(this.levelCount++);
  }

  rotate(level: LevelTiles, tile: TileExtended) {
    tile = {...tile, success: false}
    switch (tile.type) {
      case 'S':
        tile.currentRotation = (tile.currentRotation! + 90) % 180;
        break;
      default:
        tile.currentRotation = (tile.currentRotation! + 90) % 360;
        break;
    }
    // console.log(tile.currentRotation);
    if (tile.currentRotation === tile.correctRotation) {
      tile.success = true;
      // console.log(`Tile No. ${tile.index} success`);
    } else {
      tile.success = false;
    }

    let blocks = level.blocks.map((block,i) => {
      if (i === tile.index) {
        return tile;
      } else {
        return block;
      }
    });

    this.level.next({
      id: level.id,
      level: level.level,
      blocks: blocks,
    } as LevelTiles);

    this.isLevelDone$ = this.level.pipe(
      map((level) => {
        return !level.blocks
          .map((block) => {
            return block.success;
          })
          .includes(false);
      }),
      tap((stop) => {
        if (stop) {
          // console.log('Done');
        //  this.toggleGlow();
         this.showSpinner()

          setTimeout(() => {
            this.currentLevel.next(this.levelCount++);

          }, 500);
        } else {
          // console.log('Not yet');
        }
      }),
    );
  }

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
        //this.toggleGlow()
    }, 1500);
  }

 

  glowState: boolean = false;
    
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