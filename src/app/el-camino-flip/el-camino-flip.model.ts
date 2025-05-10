export interface Level {
    index:number;
    cols?:number;
    blocks?:Block[];
}

export interface Block {
index?: number;
type?: string;
state?: number;
randState?:number;
success?:boolean;
}