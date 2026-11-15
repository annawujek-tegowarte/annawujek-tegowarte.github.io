(()=>{
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(preference.matches||!('IntersectionObserver' in window))return;
 const targets=[...document.querySelectorAll('.welcome-photo,.welcome-content,.portfolio-intro,.about>div,.about>img,.grid article,.notes>div,.trusted-brands>h2,.brand-list li,.trusted-note,.contact-copy,.camera-accent')];
 let observer;
 const reveal=element=>{
  element.classList.add('is-visible');
  if(observer)observer.unobserve(element);
 };
 try{
  observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting)reveal(entry.target);});
  },{threshold:0.06,rootMargin:'0px 0px -20px 0px'});
  targets.forEach(element=>{
   const group=element.parentElement;
   const index=[...group.children].indexOf(element);
   const stagger=group.matches('.grid,.notes,.brand-list')?Math.min(index%4,3)*65:0;
   element.style.setProperty('--reveal-delay',stagger+'ms');
   element.classList.add('motion-reveal');
   observer.observe(element);
  });
  document.addEventListener('focusin',event=>{
   const target=event.target.closest('.motion-reveal');
   if(target)reveal(target);
  });
  const stop=()=>{if(preference.matches){observer.disconnect();targets.forEach(reveal);}};
  if(preference.addEventListener)preference.addEventListener('change',stop);
 }catch(error){targets.forEach(reveal);}
})();
