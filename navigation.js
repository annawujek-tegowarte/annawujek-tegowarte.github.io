(()=>{
 const key='tegowarte-internal-navigation';
 const destination=new URL(location.href);
 const isPortfolio=/\/(ugc|tegowarte)\.html$/.test(destination.pathname);
 const kind=performance.getEntriesByType('navigation')[0]?.type;
 let permitted=false;
 try{
  const entry=JSON.parse(sessionStorage.getItem(key)||'null');
  sessionStorage.removeItem(key);
  permitted=entry?.path===destination.pathname&&Date.now()-entry.time<15000;
 }catch{
  try{permitted=new URL(document.referrer).origin===location.origin;}catch{}
 }
 if(isPortfolio&&!permitted&&kind!=='reload'&&kind!=='back_forward'){
  location.replace(new URL('index.html',location.href).href);
  return;
 }
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest('a[href]');
  if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
  const url=new URL(link.href,location.href);
  if(url.origin!==location.origin||!/\/(ugc|tegowarte)\.html$/.test(url.pathname))return;
  try{sessionStorage.setItem(key,JSON.stringify({path:url.pathname,time:Date.now()}));}catch{}
 },true);
})();
