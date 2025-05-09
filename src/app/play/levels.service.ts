import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable, tap } from 'rxjs';
import { Block, Level } from './levels.model';

@Injectable({
  providedIn: 'root'
})
export class LevelsService {
  levels: any;
  constructor(private http: HttpClient) {
    this.levels = toSignal(this.getAll())
  }

  getAll(): Observable<Level[]> {
    return this.http.get<string[]>('levels.json').pipe(
      map((levels: string[]) => levels.map((level: string, i: number) => {
        let blocks = level.split(' ').map((tile: string, j: number) => {
          let type = tile.split('.')[0];
          let state = Number(tile.split('.')[1]);
          let nextState = Math.ceil(Math.random() * 4) % ((type == 'S' || type == 'L') ? 2 : 4)
          if (nextState == state) nextState = (nextState + 1) % ((type == 'S' || type == 'L') ? 2 : 4 )
          return {
            index: j,
            type: type,
            state: state,
            randState: (type == 'T' || type == 'B') ? 0 : nextState,
            success: (type == 'T' || type == 'B') ? true : false
          } as Block
        });
        return { index: i, cols: Math.sqrt(blocks.length), blocks: blocks } as Level
      })
      )
      // ,tap((levels) => console.log(levels))  
    )
  }
}
