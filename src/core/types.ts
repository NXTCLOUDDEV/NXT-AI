export type ID=string;
export const now=()=>new Date().toISOString();
export function id(prefix:string):ID{return `${prefix}_${crypto.randomUUID().replaceAll("-","")}`;}
