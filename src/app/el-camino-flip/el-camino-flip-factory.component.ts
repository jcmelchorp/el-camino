import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LayoutService } from "../layout/layout.service";
import { CommonModule, NgFor } from "@angular/common";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatSliderModule } from "@angular/material/slider";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Subject } from "rxjs";

@Component({
    selector: 'app-flip-factory',
    imports: [CommonModule, MatSliderModule, NgFor, MatButtonModule, MatCardModule, MatInputModule, FormsModule],
    template: `
    <div  class="flex flex-row flex-wrap justify-center gap-5">
          <button mat-raised-button type="button" *ngFor="let item of todo" class="" (click)="insertBlock(item)"
          [ngStyle]="{
            filter: (layoutService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
            width: '80px',
            height: '80px',
            border:'2px solid darkgray',
            background: 'center / cover no-repeat url(paths/' + item.split('.')[0] + '.png' + ')',
            }">
          <span>{{item}}</span>
        </button>
        </div>
        <div  class="flex flex-row flex-wrap justify-center items-center gap-5">
            <span>Columnas: {{cols}}</span>
            <mat-slider  min="2" max="20" step="1" showTickMarks discrete>
          <input class="w-1/3 m-8" [(ngModel)]="cols" matSliderThumb>
          </mat-slider>
        </div>

<div class="flex flex-row justify-center">
        <mat-card style="width: calc({{cols}}*80px);" >
            <div class="flex flex-wrap">


            @for ( item of newlev|async; track $index) {      
            <button type="button"
            (click)="rotate(item,$index)"
            [@rotateState]="item.split('.')[1]"

            [ngStyle]="{
            filter: (layoutService.appTheme() == 'dark') ? 'invert(0%)' : 'invert(100%)',
            width: '80px',
            height: '80px',
            border:'2px solid darkgray',
            background: 'center / cover no-repeat url(paths/' + item.split('.')[0] + '.png' + ')',
            }"></button>
            }



                    </div>
                    <pre>{{newlev|async}}</pre>

        </mat-card>
        </div>
        `,
    styles: [`
    :host {
      display: block;
    }
    `], changeDetection: ChangeDetectionStrategy.OnPush,
animations:[
    trigger('rotateState', [
      state('0', style({ transform: 'rotate(0deg)' })),
      state('1', style({ transform: 'rotate(90deg)' })),
      state('2', style({ transform: 'rotate(180deg)' })),
      state('3', style({ transform: 'rotate(270deg)' })),
      transition('* => *', animate('100ms ease-in-out')),
    ])
  ] ,
     providers: []
})
export class ElCaminoFlipFactoryComponent {
    cols: number = 2
    todo = ['B.0', 'C.0', 'D.0', 'E.0', 'L.0', 'O.0', 'S.0', 'T.0'];
    newlevel:string[]=[];
    newlev: Subject<string[]> = new Subject()
    layoutService: LayoutService = inject(LayoutService)
    insertBlock(item: string) {
        this.newlevel.push(item)
        this.newlev.next(this.newlevel)
        console.log(this.newlevel)
    }

    rotate(item: string,index:number) {
        var state =Number(item.split('.')[1]);
        let type =item.split('.')[0];
        var nextState
        switch (type) {
          case 'S':
            nextState = (state! + 1) % 2;
            break;
          case 'B':
            nextState = 0;
            break;
          default:
            nextState = (state! + 1) % 4;
            break;
        }
    
      this.newlevel[index]!=type+'.'+nextState
      this.newlev.next(this.newlevel)
      console.log(this.newlevel)

    }

}