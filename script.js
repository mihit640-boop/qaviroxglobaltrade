const products = window.QAVIROX_PRODUCTS || [];
const grid = document.getElementById('productsGrid');
const none = document.getElementById('none');
const search = document.getElementById('search');
const count = document.getElementById('productCount');
let activeCat = 'all';

function categoryLabel(cat){
  return ({spice:'SPICES',grain:'GRAINS & MILLETS',pulse:'PULSES',other:'SEEDS & OTHER'})[cat] || 'PRODUCT';
}
function description(p){
  const d={
    spice:`Indian ${p.name} selected for flavour, aroma and versatile culinary use. Available in export-oriented whole or processed form as applicable.`,
    grain:`Quality Indian ${p.name} suitable for food, wholesale and export requirements, with packing and specifications discussed as per buyer needs.`,
    pulse:`Indian ${p.name} valued for everyday food applications and bulk trade. Available for export enquiry with buyer-specific grade and packing.`,
    other:`Indian ${p.name} sourced for food and ingredient applications. Final grade, packing and specifications can be aligned to buyer requirements.`
  }; return d[p.cat];
}
function card(p,i){
  return `<article class="product-card" data-cat="${p.cat}" data-name="${(p.name+' '+p.local).toLowerCase()}">
    <div class="product-img"><img loading="lazy" src="${p.image}" alt="${p.name} - ${p.local}"><span>${categoryLabel(p.cat)}</span></div>
    <div class="product-body"><h3>${p.name}</h3><small>${p.local}</small><p>${description(p).slice(0,112)}…</p><div class="card-actions"><button class="detail-btn" data-index="${i}">View Details →</button><a href="#contact" class="quote-link" data-product="${p.name}">Request Quote</a></div></div>
  </article>`;
}
function render(){
  const q=(search?.value||'').trim().toLowerCase();
  const filtered=products.filter(p=>(activeCat==='all'||p.cat===activeCat) && (!q || (p.name+' '+p.local+' '+p.cat).toLowerCase().includes(q)));
  grid.innerHTML=filtered.map(p=>card(p,products.indexOf(p))).join('');
  none.style.display=filtered.length?'none':'block';
  count.textContent=filtered.length;
  document.querySelectorAll('.detail-btn').forEach(b=>b.addEventListener('click',()=>openModal(+b.dataset.index)));
  document.querySelectorAll('.quote-link').forEach(a=>a.addEventListener('click',()=>{const s=document.getElementById('productSelect'); if(s) s.value=a.dataset.product;}));
}

function openModal(i){
  const p=products[i]; if(!p) return;
  document.getElementById('modalImg').src=p.image;
  document.getElementById('modalImg').alt=p.name;
  document.getElementById('modalCat').textContent=categoryLabel(p.cat);
  document.getElementById('modalTitle').textContent=p.name;
  document.getElementById('modalLocal').textContent=p.local;
  document.getElementById('modalDesc').textContent=description(p);
  document.getElementById('modalForm').textContent = p.cat==='spice' ? 'Whole / Powder / Crushed as applicable' : p.cat==='grain' ? 'Whole / Flour as applicable' : 'Whole / Split as applicable';
  const q=document.getElementById('modalQuote');
  q.onclick=()=>{const s=document.getElementById('productSelect'); if(s) s.value=p.name; closeModal();};
  const m=document.getElementById('productModal'); m.classList.add('open'); m.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
}
function closeModal(){const m=document.getElementById('productModal'); m.classList.remove('open'); m.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open');}

document.getElementById('modalClose').addEventListener('click',closeModal);
document.getElementById('productModal').addEventListener('click',e=>{if(e.target.id==='productModal') closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeModal();});

document.querySelectorAll('.cat').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.cat').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); activeCat=btn.dataset.cat; render();
}));
search?.addEventListener('input',render);

document.getElementById('menu')?.addEventListener('click',()=>document.getElementById('links').classList.toggle('open'));
document.querySelectorAll('#links a').forEach(a=>a.addEventListener('click',()=>document.getElementById('links').classList.remove('open')));

document.getElementById('form')?.addEventListener('submit',e=>{e.preventDefault(); document.getElementById('msg').innerHTML='<b>Thank you!</b> Your enquiry has been captured for this demo website. Connect a real email/CRM before commercial launch.'; e.target.reset();});

render();
