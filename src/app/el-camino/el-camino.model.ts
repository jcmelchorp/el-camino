export interface LevelTiles {
  id:string;
  level:number;
  cols:number;
  blocks:TileExtended[];
}

export interface TileFigure {
  index: number;
  type: TileType;
  rot: number;
}

export interface TileExtended extends TileFigure {
  image?: string;
  currentRotation?: number;
  correctRotation?: number;
  success?: boolean;
}

export enum TileType {
  N,
  B,
  C,
  E,
  S,
}

export function tileImageFromType(type: TileType): string {
  var image:string='';
  switch (type) {
    case TileType.B:
      image = '/x_blank.png';
      break;
    case TileType.C:
      image = '/x_curve.png';
      break;
    case TileType.E:
      image = '/x_end.png';
      break;
    case TileType.S:
      image = '/x_line.png';
      break;
  }
  return image;
}

export type TileFileType = keyof typeof TileType;
