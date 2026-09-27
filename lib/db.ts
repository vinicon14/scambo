import {env} from 'cloudflare:workers';
export function db(){return (env as unknown as {DB:D1Database}).DB}
export function bucket(){return (env as unknown as {BUCKET:R2Bucket}).BUCKET}
export function config(key:string){return (env as unknown as Record<string,string>)[key]}
