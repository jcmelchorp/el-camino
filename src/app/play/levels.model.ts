export interface Level {
    index:number;
    cols?:number;
    blocks?:Block[];
}

export interface Block {
index?: number;
type?: 'B'|'C'|'D'|'E'|'L'|'O'|'S'|'T';
state?: number;
keyState:number;
success?:boolean;
}