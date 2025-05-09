export interface LevelTiles {
  id:string;
  level:number;
  cols:number;
  blocks:TileExtended[];
}

export interface TileFigure {
  index?: number;
  type: string;
  rot: number;
}

export interface TileExtended extends TileFigure {
  image?: string;
  currentRotation?: number;
  correctRotation?: number;
  success?: boolean;
  text?:string;
}

