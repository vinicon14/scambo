import {db} from './db';
import {now,uid,need} from './security';
const dishQuestions=[
'Como você avalia o sabor do lanche?',
'Como você avalia a apresentação do lanche?',
'Como você avalia a qualidade dos ingredientes do lanche?',
'Como você avalia o frescor do lanche?',
'Como você avalia a temperatura em que o lanche foi servido?',
'Como você avalia a textura do lanche?',
'Como você avalia o equilíbrio dos sabores do lanche?',
'Como você avalia o aroma do lanche?',
'Como você avalia a qualidade do preparo do lanche?',
'Como você avalia o ponto de preparo do lanche?',
'Como você avalia a quantidade servida de lanche?',
'Como você avalia a proporção entre os ingredientes do lanche?',
'Como você avalia a harmonia dos ingredientes do lanche?',
'Como você avalia a consistência do lanche ao comer?',
'Como você avalia a combinação de texturas do lanche?',
'Como você avalia o acabamento do lanche?',
'Como você avalia a organização do lanche no prato ou na embalagem?',
'Como você avalia a facilidade de consumir o lanche?',
'Como você avalia o cuidado na montagem do lanche?',
'Como você avalia a aparência dos ingredientes do lanche?',
'Como você avalia a sensação do lanche na boca?',
'Como você avalia o sabor que o lanche deixa após comer?',
'Como você avalia o lanche em relação à descrição apresentada?',
'Como você avalia a relação entre a qualidade do lanche e o preço do combo?',
'Como você avalia a sensação de satisfação após consumir o lanche?',
'Como você avalia a experiência geral de comer este lanche?',
'Como você avalia o cuidado percebido na preparação deste lanche?'
];
const coffeeQuestions=[
'Como você avalia o sabor do café?',
'Como você avalia o aroma do café?',
'Como você avalia a temperatura em que o café foi servido?',
'Como você avalia a qualidade do café?',
'Como você avalia o frescor percebido do café?',
'Como você avalia o equilíbrio dos sabores do café?',
'Como você avalia a sensação do café na boca?',
'Como você avalia o sabor que o café deixa após beber?',
'Como você avalia o cuidado no preparo do café?',
'Como você avalia a apresentação do café?',
'Como você avalia a aparência do café servido?',
'Como você avalia a quantidade de café servida no combo?',
'Como você avalia a conservação do aroma durante o consumo?',
'Como você avalia a temperatura do café ao longo do consumo?',
'Como você avalia o café em relação à descrição apresentada?',
'Como você avalia a limpeza percebida do recipiente do café?',
'Como você avalia a relação entre a qualidade do café e o preço do combo?',
'Como você avalia a experiência geral de beber este café?'
];
export type Question={id:string;category:'dish'|'coffee';text:string};
export async function ensureQuestions(){
 if(await db().prepare("SELECT key FROM system_settings WHERE key='questions_bank_v1'").first())return;
 const rows=[...dishQuestions.map((text,i)=>({id:'dish-'+String(i+1).padStart(2,'0'),category:'dish',text})),...coffeeQuestions.map((text,i)=>({id:'coffee-'+String(i+1).padStart(2,'0'),category:'coffee',text}))];
 await db().batch([...rows.map(q=>db().prepare('INSERT OR IGNORE INTO questions (id,category,text,updatedAt) VALUES (?,?,?,?)').bind(q.id,q.category,q.text,now())),db().prepare("INSERT OR IGNORE INTO system_settings (key,value) VALUES ('questions_bank_v1','1')")]);
}
export async function assignedForm(userId:string,businessId:string,campaignId:string){
 const lookup=()=>db().prepare('SELECT * FROM review_forms WHERE userId=? AND businessId=? AND campaignId=?').bind(userId,businessId,campaignId).first<any>();
 let form=await lookup();
 if(!form){
  const dish=(await db().prepare("SELECT id,category,text FROM questions WHERE category='dish' ORDER BY RANDOM() LIMIT 3").all()).results;
  const coffee=(await db().prepare("SELECT id,category,text FROM questions WHERE category='coffee' ORDER BY RANDOM() LIMIT 2").all()).results;
  need(dish.length===3&&coffee.length===2,'O questionário está temporariamente indisponível.');
  await db().prepare('INSERT OR IGNORE INTO review_forms (id,userId,businessId,campaignId,questions,createdAt) VALUES (?,?,?,?,?,?)').bind(uid(),userId,businessId,campaignId,JSON.stringify([...dish,...coffee]),now()).run();
  form=await lookup();
 }
 return {id:form.id,questions:JSON.parse(form.questions) as Question[]};
}
