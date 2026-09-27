import {db,config} from './db';
export const uid=()=>crypto.randomUUID();
export const now=()=>new Date().toISOString();
export const clean=(v:unknown,max=500)=>String(v??'').trim().slice(0,max);
export function need(ok:unknown,message:string):asserts ok{if(!ok)throw new Error(message)}
export async function hash(s:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(x=>x.toString(16).padStart(2,'0')).join('')}
export async function protect(s:string){need(config('DATA_PEPPER'),'Serviço temporariamente indisponível.');return hash(config('DATA_PEPPER')+s)}
export async function password(p:string,salt:string){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(p),'PBKDF2',false,['deriveBits']);return Array.from(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:new TextEncoder().encode(salt),iterations:100000},k,256))).map(x=>x.toString(16).padStart(2,'0')).join('')}
export function docValid(s:string,type:string){if(/^(.)\1+$/.test(s))return false;const n=s.split('').map(Number);if(type==='cpf'){if(s.length!==11)return false;for(let j=9;j<11;j++){let sum=0;for(let i=0;i<j;i++)sum+=n[i]*(j+1-i);let c=(sum*10)%11;if(c===10)c=0;if(c!==n[j])return false}return true}if(s.length!==14)return false;for(let j=12;j<14;j++){let sum=0,w=j-7;for(let i=0;i<j;i++){sum+=n[i]*w;w--;if(w<2)w=9}const r=sum%11;if(n[j]!== (r<2?0:11-r))return false}return true}
export async function session(req:Request){const raw=(req.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('be_session='))?.slice(11);if(!raw)return null;const user=await db().prepare('SELECT u.id,u.name,u.email,u.role,u.cpfHash,u.cpfLast,u.phone FROM sessions s JOIN users u ON u.id=s.userId WHERE s.id=? AND s.expires>?').bind(await hash(raw),Date.now()).first<Record<string,any>>();if(user&&['ADMIN','SUPER_ADMIN'].includes(user.role))user.role=user.cpfHash?'TRAVELER':'BUSINESS';return user}
export async function rate(req:Request,kind:string,limit=30){const key=await protect(kind+':'+(req.headers.get('cf-connecting-ip')||'local'));const t=Date.now();const r=await db().prepare('INSERT INTO rate_limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires<? THEN 1 ELSE count+1 END,expires=CASE WHEN expires<? THEN ? ELSE expires END RETURNING count').bind(key,t+900000,t,t,t+900000).first<{count:number}>();need(r&&r.count<=limit,'Muitas tentativas. Aguarde 15 minutos.');}
export function distance(a:number,b:number,c:number,d:number){const rad=Math.PI/180;const x=Math.sin((c-a)*rad/2)**2+Math.cos(a*rad)*Math.cos(c*rad)*Math.sin((d-b)*rad/2)**2;return 6371000*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))}
export function secureEqual(a:string,b:string){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0}
export async function adminSession(req:Request){
 const raw=(req.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('be_admin='))?.slice(9);
 if(!raw||!config('ADMIN_PASSWORD_HASH'))return false;
 const result=await db().prepare('SELECT id FROM admin_sessions WHERE id=? AND expires>? AND credentialVersion=?').bind(await hash(raw),Date.now(),await hash(config('ADMIN_PASSWORD_HASH'))).first();
 return !!result;
}
