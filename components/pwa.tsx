'use client';
import {useEffect,useState} from 'react';
import {Download,WifiOff,RefreshCw,Share2} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
export default function Pwa(){
 const [prompt,setPrompt]=useState<any>(null),[installed,setInstalled]=useState(false),[offline,setOffline]=useState(false),[help,setHelp]=useState(false),[update,setUpdate]=useState<ServiceWorker|null>(null);
 useEffect(()=>{
 setInstalled(window.matchMedia('(display-mode: standalone)').matches||(navigator as any).standalone===true);setOffline(!navigator.onLine);
 const install=(e:Event)=>{e.preventDefault();setPrompt(e)},done=()=>{setInstalled(true);setPrompt(null)},online=()=>setOffline(false),off=()=>setOffline(true);
 window.addEventListener('beforeinstallprompt',install);window.addEventListener('appinstalled',done);window.addEventListener('online',online);window.addEventListener('offline',off);
 let disposed=false;
 if('serviceWorker'in navigator&&window.isSecureContext)navigator.serviceWorker.register('/sw.js',{scope:'/'}).then(reg=>{if(disposed)return;if(reg.waiting)setUpdate(reg.waiting);reg.addEventListener('updatefound',()=>{const w=reg.installing;if(w)w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller&&!disposed)setUpdate(w)})})}).catch(()=>{});
 return()=>{disposed=true;window.removeEventListener('beforeinstallprompt',install);window.removeEventListener('appinstalled',done);window.removeEventListener('online',online);window.removeEventListener('offline',off)};
 },[]);
 async function install(){if(!prompt){setHelp(true);return}await prompt.prompt();await prompt.userChoice;setPrompt(null)}
 return <>{!installed&&<button className="btn small pwa-install" onClick={install} aria-label="Instalar Bebida de Estrada"><Download size={16}/><span>Instalar app</span></button>}{offline&&<div className="connection-banner" role="status"><WifiOff size={16}/>Sem conexão. Reconecte para salvar avaliações.</div>}{update&&<button className="update-banner" onClick={()=>{navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true});update.postMessage({type:'SKIP_WAITING'})}}><RefreshCw size={16}/>Nova versão disponível · Atualizar</button>}<Dialog open={help} onOpenChange={setHelp}><DialogContent><DialogHeader><DialogTitle>Leve a estrada no seu celular.</DialogTitle><DialogDescription>Instale o Bebida de Estrada para abrir direto da tela inicial.</DialogDescription></DialogHeader><div className="install-step"><b>iPhone ou iPad · Safari</b><p>Toque em Compartilhar <Share2 size={15} style={{display:'inline'}}/>, depois em “Adicionar à Tela de Início” e confirme em “Adicionar”.</p></div><div className="install-step"><b>Android · Chrome</b><p>Abra o menu ⋮ e toque em “Instalar aplicativo” ou “Adicionar à tela inicial”.</p></div><p className="bottom-note">Se estiver numa prévia incorporada, abra o link do aplicativo diretamente no navegador. A instalação depende do suporte do navegador.</p></DialogContent></Dialog></>;
}
