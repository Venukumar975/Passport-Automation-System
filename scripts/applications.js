// applications.js
// Handles night mode, tabs and search filtering for applications page
(function(){
  function setDark(d){
    document.documentElement.classList.toggle('dark', d);
    const btn = document.getElementById('mode-toggle');
    if(btn) btn.textContent = d ? '🌙' : '☀️';
    try{ localStorage.setItem('pa_dark', d ? '1' : '0'); }catch(e){}
  }

  document.addEventListener('DOMContentLoaded', function(){
    // restore dark
    const stored = (localStorage.getItem('pa_dark') === '1');
    setDark(stored);

    const toggle = document.getElementById('mode-toggle');
    if(toggle) toggle.addEventListener('click', function(){ setDark(!document.documentElement.classList.contains('dark')); });

    // tabs
    const tabs = document.querySelectorAll('.tabs button');
    const cards = Array.from(document.querySelectorAll('#cards .app-card'));
    function applyFilter(filter){
      tabs.forEach(t=> t.classList.toggle('active', t.dataset.filter === filter));
      cards.forEach(card=>{
        const status = (card.dataset.status||'').toUpperCase();
        let show = true;
        if(filter === 'drafts') show = (status === 'DRAFT');
        else if(filter === 'active') show = (['SUBMITTED','VERIFIED'].includes(status));
        else if(filter === 'completed') show = (['APPROVED','REJECTED'].includes(status));
        // else all
        card.style.display = show ? '' : 'none';
      });
    }
    tabs.forEach(t=> t.addEventListener('click', ()=> applyFilter(t.dataset.filter)));

    // search
    const search = document.getElementById('search');
    if(search){
      search.addEventListener('input', function(){
        const v = this.value.trim().toLowerCase();
        cards.forEach(card=>{
          const id = (card.dataset.id||'').toLowerCase();
          const name = (card.dataset.name||'').toLowerCase();
          const matches = !v || id.includes(v) || name.includes(v);
          // keep honoring tab filter: if currently hidden by tab, leave hidden
          if(card.style.display === 'none' && !matches){ card.style.display = 'none'; return; }
          card.style.display = matches ? '' : 'none';
        });
      });
    }
  });
})();


// applications.js
export function getDateEle() {
  return document.getElementById("dateTime");
}
