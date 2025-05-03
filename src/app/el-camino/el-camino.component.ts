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
import { LevelTiles, TileExtended, TileType } from './el-camino.model';
import { map, Subject, Subscription, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  <div style="display: flex; flex-direction: column; justify-content: start;align-items:center">
    <h1 class="font-bold text-3xl">El camino</h1>
    <button [disabled]="disableButton" mat-raised-button type="button" (click)="nextLevel();">Inicio</button>
    <div *ngIf="level$ | async as level" style="width: 85%;max-width:500px; max-height:500px;padding-bottom:0;height:auto;">
      <ngx-spinner bdColor="#fff" size="large" color="#000" type="pacman" [fullScreen]="true"><p style="color:black;font-size:80px"  *ngIf="!(isLevelDone$|async)"> Level:{{level.level}}</p></ngx-spinner>
      <mat-grid-list class="mat-grid-list"  cols="{{ level.cols }}"
      [@glow]="glowState">
        <ng-container #container *ngFor="let tile of level.blocks; index as i">
          <mat-grid-tile class="mat-grid-tile" (click)="rotate(level, tile)" [@rotateState]="tile.currentRotation" 
          [ngStyle]="{
              filter: 'invert(100%)',
              background: 'center / cover no-repeat url(' + tile.image + ')',
              border: (tile.success && devMode) ? 'none//2px dashed #550055' : 'none',
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
      transition('* => *', animate('300ms ease-in-out')),
    ]),
    trigger('glow', [
      state('initial', style({
        boxShadow: '0 0 0 rgba(0, 0, 0, 0)' // No glow initially
      })),
      state('glowing', style({
         boxShadow: '0 0 20px rgba(0, 123, 255, 0.7)' // Blue glow
      })),
      transition('initial <=> glowing', animate('100ms ease-in-out'))
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
  element: HTMLBodyElement | null = null;
devMode:boolean=isDevMode();

  constructor(private spinner: NgxSpinnerService) {}
  
  ngAfterViewInit(): void {
    this.element = document.querySelector('body');

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
    switch (tile.type) {
      case TileType.S:
        tile.currentRotation = (tile.currentRotation! + 90) % 180;
        break;
      case TileType.B:
        tile.currentRotation = 0;
        tile.success = true;
        break;
      default:
        tile.currentRotation = (tile.currentRotation! + 90) % 360;
        break;
    }

    console.log(tile.currentRotation);
    if (tile.currentRotation === tile.correctRotation) {
      tile.success = true;
      // console.log(`Tile No. ${tile.index} success`);
    } else {
      tile.success = false;
    }

    let blocks = level.blocks.map((block) => {
      if (block.index === tile.index) {
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
         this.toggleGlow();
          
          setTimeout(() => {
            this.showSpinner()
            this.toggleGlow();
            this.currentLevel.next(this.levelCount++);

          }, 1000);
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

  enterFullscreen(element: HTMLElement): Promise<void> {
    if (element.requestFullscreen) {
        return element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
        return (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
        return (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
        return (element as any).msRequestFullscreen();
    } else {
        return Promise.reject(new Error('Fullscreen API is not supported.'));
    }
}
  exitFullscreen(): Promise<void> {
      if (document.exitFullscreen) {
          return document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
          return (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
          return (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
          return (document as any).msExitFullscreen();
      } else {
          return Promise.reject(new Error('Fullscreen API is not supported.'));
      }
  }
  toggleFullscreen() {
    if (this.element) {
      if (!document.fullscreenElement) {
        this.enterFullscreen(this.element)
          .then(() => console.log('Fullscreen on'))
          .catch((error) => console.error('Error toggling fullscreen:', error));
      } else {
        this.exitFullscreen()
        .then(() => console.log('Fullscreen off'))
        .catch((error) => console.error('Error toggling fullscreen:', error));
      }
    }
  }

  glowState: string = 'initial';
    
      toggleGlow() {
        this.glowState = this.glowState === 'initial' ? 'glowing' : 'initial';
      }
    
      onGlowStart() {
        console.log('Glow animation started');
      }
    
       onGlowDone() {
         console.log('Glow animation finished');
      }
}