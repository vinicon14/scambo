import type {Metadata,Viewport} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Bebida de Estrada — Estrada, café e descoberta',description:'Encontre paradas, descubra sabores e escolha os melhores cafés da estrada.',manifest:'/manifest.webmanifest',appleWebApp:{capable:true,title:'Bebida de Estrada',statusBarStyle:'default'},icons:{icon:'/icons/icon-192.png',apple:'/icons/apple-touch-icon.png'}};
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#163f35'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
