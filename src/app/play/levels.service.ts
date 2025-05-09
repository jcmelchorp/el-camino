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

  getAll():Observable<Level[]> {
    return this.http.get<string[]>('levels.json').pipe(
      map((levels: string[]) => levels.map((level: string, i: number) => {
        let blocks = level.split(' ').map((tile: string, j: number) => {
          return {
            index: j,
            type: tile.split('.')[0],
            state:  tile.split('.')[0] === 'B' ? 0 : ( Number(tile.split('.')[1]) + 1) % ( tile.split('.')[0] === 'S' ? 2 : 4),
            keyState:  Number(tile.split('.')[1]),
            success:  tile.split('.')[0] === 'B' ? true : false
          } as Block
        });
        return { index: i, cols: Math.sqrt(blocks.length), blocks: blocks } as Level
      })
    )
    // ,tap((levels) => console.log(levels))  
  )
  } 
}
