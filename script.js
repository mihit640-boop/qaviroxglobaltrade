
/* QAVIROX account authentication UI */
(() => {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginMsg = document.getElementById('loginMsg');
  const registerMsg = document.getElementById('registerMsg');
  const config = window.QAVIROX_SUPABASE_CONFIG || {};
  let client = null;
  if (config.url && config.publishableKey && window.supabase) {
    client = window.supabase.createClient(config.url, config.publishableKey);
  }
  const open = (mode='login') => { modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); switchMode(mode); };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); };
  const switchMode = (mode) => {
    const isLogin = mode === 'login';
    loginForm.classList.toggle('hidden', !isLogin);
    registerForm.classList.toggle('hidden', isLogin);
    document.querySelectorAll('[data-auth-tab]').forEach(b => b.classList.toggle('active', b.dataset.authTab === mode));
    loginMsg.textContent = ''; registerMsg.textContent = '';
  };
  document.querySelectorAll('[data-auth]').forEach(b => b.addEventListener('click', () => open(b.dataset.auth)));
  document.querySelectorAll('[data-auth-tab]').forEach(b => b.addEventListener('click', () => switchMode(b.dataset.authTab)));
  document.getElementById('authClose')?.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!client) { loginMsg.textContent = 'Account system is being connected. Please try again after setup.'; return; }
    loginMsg.textContent = 'Signing in…';
    const { error } = await client.auth.signInWithPassword({ email: loginEmail.value.trim(), password: loginPassword.value });
    loginMsg.textContent = error ? error.message : 'Login successful. Welcome to QAVIROX Global Trade!';
  });
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!client) { registerMsg.textContent = 'Account system is being connected. Please try again after setup.'; return; }
    registerMsg.textContent = 'Creating account…';
    const { error } = await client.auth.signUp({ email: registerEmail.value.trim(), password: registerPassword.value, options: { data: { full_name: registerName.value.trim() }, emailRedirectTo: window.location.origin + '/' } });
    registerMsg.textContent = error ? error.message : 'Registration successful. Please check your email to verify your account.';
  });
})();

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

document.getElementById('form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const f=e.target;
  const name=f.querySelector('input[placeholder="Your Name"]')?.value.trim()||'';
  const email=f.querySelector('input[placeholder="Email Address"]')?.value.trim()||'';
  const company=f.querySelector('input[placeholder="Company Name"]')?.value.trim()||'';
  const product=f.querySelector('input[placeholder="Product interested in"]')?.value.trim()||'';
  const enquiry=f.querySelector('textarea')?.value.trim()||'';
  const subject=encodeURIComponent('QAVIROX Global Trade — Product Enquiry');
  const body=encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nProduct: ${product}\n\nEnquiry:\n${enquiry}`
  );
  window.location.href=`mailto:mihitkashyap3315@gmail.com?subject=${subject}&body=${body}`;
  document.getElementById('msg').innerHTML='<b>Thank you!</b> Your email draft is ready. Please press Send in your email app to submit the enquiry.';
  f.reset();
});

render();
