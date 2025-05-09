import { Injectable, Signal, signal } from '@angular/core';
import {
  LevelTiles,
  TileExtended
} from './el-camino.model';
import { from, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

const levs: string[] = [
  'E.3 E.1 B.0 B.0',
  'E.3 C.2 B.0 E.2',
  'E.3 C.2 E.3 C.3',
  'C.1 S.0 C.2 C.0 E.1 S.1 B.0 B.0 E.2',
  'C.1 S.0 C.2 C.0 E.1 S.1 E.3 S.0 C.3',
  'C.1 S.0 E.1 S.1 C.1 C.2 C.0 C.3 E.2',
  'C.1 C.2 B.0 S.1 C.0 E.1 C.0 E.1 B.0',
  'E.3 C.2 E.0 C.1 C.3 S.1 C.0 S.0 C.3',
  'E.3 S.0 C.2 C.1 S.0 C.3 E.2 B.0 B.0',
  'C.1 S.0 E.1 C.0 S.0 C.2 B.0 B.0 E.2',
  'C.1 C.2 E.0 S.1 C.0 C.3 C.0 E.1 B.0',
  'E.0 B.0 E.0 C.0 C.2 S.1 B.0 C.0 C.3',
  'C.1 C.2 E.0 S.1 S.1 S.1 E.2 C.0 C.3',
  'B.1 C.1 C.2 E.0 S.1 E.2 C.0 C.3 B.0',
  'C.1 E.1 E.0 S.1 C.1 C.3 C.0 C.3 B.0',
  'C.1 C.2 B.0 B.0 S.1 C.0 S.0 C.2 S.1 E.3 S.0 C.3 C.0 S.0 E.1 B.0',
  'B.0 E.0 C.1 C.2 B.0 C.0 C.3 S.1 C.1 S.0 E.1 S.1 C.0 S.0 S.0 C.3',
  'C.1 S.0 S.0 C.2 E.2 C.1 S.0 C.3 C.1 C.3 E.3 C.2 C.0 S.0 S.0 C.3',
  'C.1 S.0 S.0 C.2 S.1 C.1 C.2 S.1 S.1 S.1 E.2 S.1 E.2 C.0 S.0 C.3',
  'E.0 C.1 C.2 B.0 C.0 C.3 C.0 C.2 C.1 S.0 C.2 S.1 C.0 E.1 C.0 C.3',
  'C.1 S.0 C.2 E.0 S.1 E.3 C.3 S.1 S.1 C.1 C.2 S.1 C.0 C.3 C.0 C.3',
  'B.0 E.0 C.1 C.2 B.0 S.1 E.2 S.1 C.1 C.3 C.1 C.3 C.0 S.0 C.3 B.0',
  'E.0 C.1 S.0 C.2 C.0 C.3 C.1 C.3 E.3 C.2 C.0 C.2 B.0 C.0 S.0 C.3',
  'C.1 C.2 C.1 E.1 S.1 C.0 C.3 B.0 C.0 S.0 S.0 C.2 E.3 S.0 S.0 C.3',
  'C.1 E.1 C.1 C.2 C.0 S.0 C.3 S.1 C.1 S.0 C.2 S.1 C.0 E.1 C.0 C.3',
  'C.1 S.0 E.1 E.0 S.1 C.1 C.2 S.1 C.0 C.3 S.1 S.1 B.0 B.0 C.0 C.3',
  'C.1 S.0 S.0 C.2 S.1 C.1 C.2 S.1 S.1 S.1 E.2 S.1 C.0 C.3 E.3 C.3',
  'C.1 S.0 S.0 C.2 C.0 E.1 E.0 S.1 C.1 S.0 C.3 S.1 C.0 S.0 S.0 C.3',
  'E.0 C.1 C.2 E.0 C.0 C.3 S.1 S.1 C.1 S.0 C.3 S.1 C.0 S.0 S.0 C.3',
  'E.3 S.0 C.2 E.0 C.1 S.0 C.3 S.1 S.1 C.1 C.2 S.1 C.0 C.3 C.0 C.3',
  'B.0 B.0 C.1 C.2 C.1 E.1 S.1 S.1 S.1 C.1 C.3 S.1 C.0 C.3 B.0 E.2',
  'C.1 S.0 C.2 C.1 C.2 S.1 E.0 S.1 S.1 S.1 C.0 C.3 S.1 S.1 S.1 C.1 S.0 C.3 E.2 S.1 C.0 S.0 S.0 S.0 C.3',
  'C.1 S.0 C.2 C.1 C.2 C.0 C.2 E.2 S.1 S.1 C.1 C.3 B.0 S.1 S.1 C.0 S.0 S.0 C.3 S.1 E.3 S.0 S.0 S.0 C.3',
  'C.1 C.2 B.0 C.1 C.2 S.1 S.1 C.1 C.3 S.1 S.1 E.2 S.1 C.1 C.3 S.1 C.1 C.3 C.0 C.2 C.0 C.3 E.3 S.0 C.3',
  'C.1 C.2 C.1 C.2 E.0 S.1 C.0 C.3 C.0 C.3 C.0 C.2 C.1 S.0 E.1 C.1 C.3 C.0 S.0 C.2 C.0 S.0 S.0 S.0 C.3',
  'C.1 S.0 C.2 C.1 C.2 S.1 E.0 S.1 S.1 S.1 C.0 C.3 C.0 C.3 S.1 C.1 S.0 S.0 S.0 C.3 C.0 S.0 S.0 S.0 E.1',
  'C.1 S.0 S.0 S.0 C.2 C.0 C.2 E.3 C.2 S.1 C.1 C.3 B.0 C.0 C.3 C.0 C.2 E.0 B.0 B.0 B.0 C.0 C.3 B.0 B.0',
  'C.1 S.0 C.2 C.1 C.2 C.0 C.2 S.1 E.2 S.1 C.1 C.3 C.0 S.0 C.3 C.0 C.2 C.1 C.2 E.0 B.0 C.0 C.3 C.0 C.3',
  'B.0 C.1 S.0 E.1 E.0 C.1 C.3 C.1 C.2 S.1 C.0 C.2 S.1 C.0 C.3 B.0 C.0 C.3 B.0 B.0 B.0 B.0 B.0 B.0 B.0',
  'E.0 C.1 C.2 C.1 C.2 C.0 C.3 C.0 C.3 S.1 C.1 S.0 S.0 C.2 S.1 S.1 C.1 C.2 S.1 S.1 C.0 C.3 E.2 C.0 C.3',
  'C.1 E.1 C.1 C.2 B.0 C.0 C.2 S.1 C.0 C.2 C.1 C.3 C.0 C.2 E.2 C.0 S.0 C.2 C.0 C.2 B.0 B.0 C.0 S.0 C.3',
  'E.0 B.0 C.1 S.0 C.2 C.0 C.2 S.1 C.1 C.3 C.1 C.3 E.2 C.0 C.2 C.0 C.2 C.1 C.2 S.1 B.0 C.0 C.3 C.0 C.3',
  'C.1 C.2 E.0 C.1 C.2 S.1 C.0 C.3 S.1 S.1 C.0 S.0 S.0 C.3 S.1 C.1 C.2 B.0 C.1 C.3 E.2 C.0 S.0 C.3 B.0',
  'B.0 C.1 C.2 B.0 B.0 C.1 C.3 S.1 C.1 E.1 C.0 C.2 S.1 C.0 C.2 C.1 C.3 C.0 S.1 C.3 C.0 S.0 S.0 E.1 B.0',
  'C.1 E.1 B.0 E.3 C.2 S.1 C.1 C.2 B.0 S.1 S.1 S.1 C.0 C.2 S.1 S.1 C.0 C.2 S.1 S.1 C.0 S.0 C.3 C.0 C.3',
  'E.3 C.2 E.3 S.0 C.2 C.1 C.3 C.1 C.2 S.1 C.0 S.0 C.3 S.1 S.1 B.0 B.0 C.1 C.3 S.1 B.0 B.0 C.0 S.0 C.3',
  'E.0 C.1 C.2 C.1 S.0 C.2 C.0 C.3 S.1 E.2 C.1 C.3 B.0 B.0 C.0 S.0 C.3 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0',
  'E.3 C.2 C.1 C.2 B.0 B.0 C.1 C.3 S.1 C.0 S.0 C.2 C.0 C.2 C.0 S.0 C.2 S.1 B.0 S.1 C.1 S.0 C.3 S.1 B.0 S.1 S.1 B.0 E.3 C.3 B.0 C.0 C.3 B.0 B.0 B.0',
  'B.0 C.1 S.0 C.2 C.1 C.2 C.1 C.3 C.1 C.3 S.1 S.1 C.0 C.2 C.0 S.0 C.3 S.1 B.0 E.2 C.1 C.2 C.1 C.3 C.1 E.1 S.1 S.1 C.0 C.2 C.0 S.0 C.3 C.0 S.0 C.3',
  'C.1 C.2 B.0 B.0 B.0 B.0 S.1 C.0 S.0 S.0 S.0 C.2 S.1 C.1 S.0 S.0 C.2 S.1 S.1 C.0 C.2 B.0 S.1 S.1 S.1 E.0 S.1 B.0 E.2 S.1 C.0 C.3 C.0 S.0 S.0 C.3',
  'C.1 S.0 C.2 C.1 C.2 E.0 C.0 C.2 S.1 S.1 C.0 C.3 C.1 C.3 S.1 C.0 S.0 C.2 C.0 C.2 C.0 S.0 S.0 C.3 C.1 C.3 C.1 S.0 S.0 C.2 C.0 S.0 C.3 E.3 S.0 C.3',
  'E.3 C.2 C.1 C.2 B.0 B.0 C.1 C.3 S.1 C.0 S.0 C.2 C.0 C.2 C.0 S.0 C.2 S.1 B.0 S.1 C.1 S.0 C.3 S.1 B.0 S.1 S.1 B.0 E.3 C.3 B.0 C.0 C.3 B.0 B.0 B.0',
  'C.1 C.2 C.1 S.0 E.1 B.0 B.0 S.1 C.0 C.3 C.1 S.0 S.0 C.2 C.0 S.0 C.2 C.0 C.2 C.1 C.3 B.0 C.1 C.3 B.0 E.2 C.0 C.2 C.1 C.3 C.1 S.0 S.0 S.0 C.3 C.0 C.2 C.0 C.2 B.0 B.0 B.0 B.0 C.0 S.0 C.3 B.0 B.0 B.0',
  'B.0 C.1 S.0 S.0 S.0 S.0 E.1 C.1 C.3 C.1 C.2 B.0 C.1 C.2 C.0 C.2 S.1 S.1 E.3 C.3 S.1 B.0 S.1 S.1 C.0 S.0 S.0 C.3 C.1 C.3 C.0 C.2 C.1 S.0 C.2 C.0 C.2 B.0 C.0 C.3 C.1 C.3 B.0 C.0 S.0 S.0 S.0 C.3 B.0',
  'B.0 B.0 B.0 B.0 B.0 C.1 C.2 C.1 S.0 S.0 S.0 C.2 S.1 S.1 S.1 C.1 C.2 E.0 S.1 S.1 S.1 S.1 S.1 C.0 C.3 C.0 C.3 S.1 C.0 C.3 E.0 C.1 C.2 C.1 C.3 B.0 B.0 C.0 C.3 C.0 C.3 B.0 B.0 B.0 B.0 B.0 B.0 B.0 B.0',
  'B.0 B.0 B.0 B.0 B.0 B.0 B.0 C.1 S.0 C.2 C.1 S.0 C.2 E.0 S.1 E.0 C.0 T.0 S.0 C.3 S.1 S.1 C.0 S.0 C.3 B.0 C.1 C.3 S.1 B.0 C.1 S.0 C.2 C.0 C.2 S.1 C.1 C.3 C.1 C.3 C.1 C.3 C.0 C.3 B.0 C.0 S.0 C.3 B.0',
  'C.1 S.0 C.2 C.1 S.0 C.2 B.0 S.1 E.0 C.0 T.0 S.0 C.3 B.0 S.1 C.0 S.0 T.0 C.2 C.1 C.2 C.0 S.0 S.0 T.0 T.0 C.3 S.1 C.1 S.0 C.2 S.1 C.0 S.0 S.0 C.3 C.0 C.2 S.1 C.0 S.0 E.1 B.0 B.0 C.0 C.3 B.0 B.0 B.0',
  'C.1 S.0 S.0 C.2 B.0 B.0 C.1 C.2 C.0 C.2 E.0 S.1 C.1 C.2 S.1 S.1 B.0 C.0 C.3 S.1 S.1 C.0 C.3 S.1 C.1 S.0 S.0 C.3 C.0 S.0 C.2 S.1 C.0 S.0 S.0 C.2 C.1 S.0 C.3 S.1 B.0 C.1 C.2 S.1 S.1 C.1 C.2 S.1 C.1 C.3 C.0 C.3 C.0 C.3 S.1 S.1 C.0 S.0 S.0 S.0 S.0 S.0 C.3 E.2',
  'E.0 C.1 C.2 C.1 S.0 S.0 C.2 B.0 B.0 C.0 C.3 S.1 C.0 S.0 C.2 C.0 C.2 B.0 B.0 C.1 C.3 C.1 C.2 S.1 C.1 C.3 B.0 B.0 C.0 S.0 C.3 C.0 C.3 C.0 S.0 C.2 C.1 C.2 B.0 C.1 S.0 C.2 C.1 S.0 C.3 S.1 C.0 C.2 S.1 C.1 C.3 C.0 C.2 B.0 C.0 C.2 S.1 S.1 S.1 C.1 S.0 C.3 B.0 C.1 C.3 C.0 C.3 S.1 C.0 S.0 S.0 C.2 C.0 S.0 S.0 E.1 C.0 S.0 S.0 S.0 C.3'
];
@Injectable()
export class ElCaminoService {
  levels$!: Observable<LevelTiles[]>;
  levels: Signal<LevelTiles[] | undefined>;
  signalLevels: Signal<string[][] | undefined>;
  constructor() {
    this.levels$ = this.getBlocks();
    this.levels = toSignal(this.levels$);
    this.signalLevels = toSignal(this.getAll());
  }

  getAll():Observable<string[][]> {
    return of(levs).pipe(
      map((levels) =>
        levels.map((level) => level.split(' '))));
    }

    getLevel(numLev:number): Observable<string[]> {
      return of(levs[numLev]).pipe(
        map((level) => level.split(' ')));
    }

  getBlocks(): Observable<LevelTiles[]> {
    return of(levs).pipe(
      map((levels) =>
        levels.map((level,j) => {
          var blocks= level.split(' ').map((tile,i) => {
            let type= tile.split('.')[0];
            var rot =Number(tile.split('.')[1]);

            let iniRot
            if (type == 'E' || type == 'C') iniRot = (Math.floor(Math.random() * 4) ) % 4;
            if (type == 'S') iniRot = (Math.floor(Math.random() * 2) ) % 2;
            if (iniRot == rot) {
              switch (type) {
                case 'E':
                  iniRot = (iniRot + 1) % 4;
                  break;
                case 'C':
                  iniRot = (iniRot + 1) % 4;
                  break;
                case 'S':
                  iniRot = (iniRot + 1) % 2;
                  break;
                case 'B':
                  iniRot = 0;
                  break;
              }
            }
            return {
              index: i,
              type: type,
              image: 'paths/'+type+'.png',
              currentRotation: iniRot,
              correctRotation: rot,
              success: (type == 'B'|| iniRot == rot)
            } as TileExtended;
          });
          return {
            id: j.toString(),
            level: j,
            cols: Math.sqrt(blocks.length),
            blocks: blocks,
          } as LevelTiles;
        }),
      ),
      tap((levels) => console.log(levels)),
    );
  }

  //   getTilesByLevel(level: number): Observable<TileExtended> {
  //     return of(levels[level - 1]).pipe(
  //       map((tiles) => {
  //         console.log(Object.values(tiles) as TileFigure[]);
  //         return (Object.values(tiles) as TileFigure[]).map((tile) => {
  //           var extendedTile: TileExtended = {
  //             index: tile.index,
  //             type: tile.type,
  //             image: tileImageFromType(tile.type),
  //             currentRotation: 0,
  //             correctRotation: tile.rot,
  //             success: 0 - tile.rot == 0 ? true : false,
  //           } as TileExtended;
  //           console.log(extendedTile)

  //           return extendedTile;
  //         });
  //       }),
  //       tap((tiles) => console.log(tiles))
  //     );
  //   }
}
