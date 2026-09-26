(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const path=location.pathname.split('/').pop()||'index.html';
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced) document.body.classList.add('reduce-motion');

  /* Global search index: one searchable catalog for the whole platform. */
  const SEARCH_INDEX=[
    ['Kurs','Konstitutsiyaviy huquq','Konstitutsiya inson huquqlari davlat hokimiyati sud tizimi','konstitutsiya.html'],
    ['Fan','Jinoyat huquqi','jinoyat javobgarlik jazo jinoyat tarkibi','fan-kurs.html?subject=jinoyat'],
    ['Fan','Jinoyat-protsessual huquq','jinoyat ishini yuritish dalillar protsess ishtirokchilari','fan-kurs.html?subject=jinoyat-protsessual'],
    ['Fan','Ma’muriy huquq','davlat boshqaruvi ma’muriy javobgarlik','fan-kurs.html?subject=mamuriy'],
    ['Fan','Fuqarolik huquqi','mulk shartnoma fuqarolik huquqiy munosabatlar','fan-kurs.html?subject=fuqarolik'],
    ['Fan','Davlat va huquq nazariyasi','davlat huquq huquqiy tizim nazariya','fan-kurs.html?subject=davlat-huquq-nazariyasi'],
    ['Fan','Xalqaro huquq','xalqaro shartnomalar subyektlar prinsiplar','fan-kurs.html?subject=xalqaro'],
    ['Fan','Matematik mantiq','to‘plam mantiq Eyler Venn mulohaza','fan-kurs.html?subject=matematik-mantiq'],
    ['Fan','Ingliz tili','speaking vocabulary grammar legal english','fan-kurs.html?subject=ingliz-tili'],
    ['Ma’ruza','Konstitutsiya tushunchasi va mohiyati','konstitutsiya asosiy qonun oliy yuridik kuch','maruza1.html'],
    ['Ma’ruza','Konstitutsiyaviy tuzum asoslari','suverenitet xalq hokimiyatchiligi hokimiyat bo‘linishi','maruza2.html'],
    ['Ma’ruza','Inson va fuqaroning asosiy huquqlari','inson huquqlari erkinlik iqtisodiy ijtimoiy madaniy','maruza3.html'],
    ['Ma’ruza','Fuqarolarning siyosiy huquqlari','saylov referendum murojaat siyosiy ishtirok','maruza4.html'],
    ['Ma’ruza','Davlat hokimiyati tizimi','qonun chiqaruvchi ijro etuvchi sud hokimiyati','maruza5.html'],
    ['Ma’ruza','O‘zbekiston Respublikasi Oliy Majlisi','parlament palatalar qonun chiqarish','maruza6.html'],
    ['Ma’ruza','O‘zbekiston Respublikasi Prezidenti','prezident konstitutsiyaviy maqom vakolatlar','maruza7.html'],
    ['Ma’ruza','Sud hokimiyati','sud mustaqillik adolat sud tizimi','maruza8.html'],
    ['Seminar','Seminarlar va muhokama savollari','seminar savollar huquqiy tahlil muhokama','seminarlar.html'],
    ['Test','Konstitutsiyaviy huquq testi','test savollar qiyinchilik timer natija huquqiy izoh','testlar.html'],
    ['Material','O‘quv materiallari','konspekt checklist takrorlash LexUZ manba','materiallar.html'],
    ['Video','Video darslar va vizual o‘rganish','video animatsiya mavzu dars vizual','videolar.html'],
    ['Aloqa','Aloqa va takliflar','xatolik taklif murojaat telefon','aloqa.html']
  ];

  /* Mobile navigation */
  const menuBtn=$('.menu-btn'), nav=$('.nav-links');
  if(menuBtn&&nav){
    menuBtn.addEventListener('click',()=>{
      const open=!nav.classList.contains('open');
      nav.classList.toggle('open',open); document.body.classList.toggle('no-scroll',open);
      menuBtn.setAttribute('aria-expanded',String(open)); menuBtn.textContent=open?'✕':'☰';
    });
    $$('.nav-links a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');document.body.classList.remove('no-scroll');
      menuBtn.setAttribute('aria-expanded','false');menuBtn.textContent='☰';
    }));
  }

  /* Page entrance + scroll reveal */
  document.documentElement.classList.add('js-ready');
  if(!reduced){
    requestAnimationFrame(()=>document.body.classList.add('page-ready'));
  } else document.body.classList.add('page-ready');
  const reveal=$$('.reveal,.reveal-left,.reveal-right');
  if(!reduced&&'IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target);}
    }),{threshold:.08,rootMargin:'0px 0px -30px 0px'});
    reveal.forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%8*45,280)}ms`;io.observe(el);});
  } else reveal.forEach(el=>el.classList.add('show'));

  /* Cinematic hero particles / floating glow */
  const motionStage=$('.motion-stage');
  if(motionStage&&!reduced){
    for(let i=0;i<18;i++){
      const dot=document.createElement('span'); dot.className='motion-dot';
      dot.style.setProperty('--x',`${(Math.random()*100).toFixed(2)}%`);
      dot.style.setProperty('--y',`${(Math.random()*100).toFixed(2)}%`);
      dot.style.setProperty('--d',`${(3+Math.random()*6).toFixed(2)}s`);
      dot.style.setProperty('--delay',`${(-Math.random()*6).toFixed(2)}s`);
      motionStage.appendChild(dot);
    }
  }

  /* Video-style cards: open a modal player with animated visuals. */
  const modal=document.createElement('div'); modal.className='video-modal'; modal.setAttribute('aria-hidden','true');
  modal.innerHTML='<div class="video-modal-backdrop" data-video-close></div><div class="video-modal-dialog" role="dialog" aria-modal="true" aria-label="Vizual dars"><button class="video-close" type="button" data-video-close>✕</button><div class="video-player"><div class="scanline"></div><video class="modal-video" data-modal-video playsinline muted loop controls preload="metadata"></video><div class="video-caption"><span class="video-kicker">LEGISTZONE VIZUAL DARS</span><strong data-video-title>Video dars</strong><span data-video-text>Vizual tushuntirish rejimi.</span></div></div></div>';
  document.body.appendChild(modal);
  const closeVideo=()=>{const mv=$('[data-modal-video]',modal); if(mv){mv.pause();mv.currentTime=0;} modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');};
  $$('[data-video-open]').forEach(btn=>btn.addEventListener('click',()=>{
    $('[data-video-title]',modal).textContent=btn.dataset.videoTitle||'Vizual dars';
    $('[data-video-text]',modal).textContent=btn.dataset.videoText||'Mavzuni vizual tarzda takrorlash.';
    const mv=$('[data-modal-video]',modal); if(mv){mv.src=btn.dataset.videoSrc||''; if(btn.dataset.videoSrc){mv.play().catch(()=>{});}}
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');
  }));
  $$('[data-video-close]',modal).forEach(el=>el.addEventListener('click',closeVideo));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeVideo();});

  /* Reading progress + top */
  let topBar=$('.progress-top'); if(!topBar){topBar=document.createElement('div');topBar.className='progress-top';document.body.appendChild(topBar);}
  const topBtn=$('.to-top');
  const scrollTick=()=>{
    const doc=document.documentElement, max=doc.scrollHeight-doc.clientHeight, pct=max>0?(doc.scrollTop/max)*100:0;
    topBar.style.width=`${pct}%`; if(topBtn) topBtn.classList.toggle('show',doc.scrollTop>500);
  };
  window.addEventListener('scroll',scrollTick,{passive:true}); scrollTick();
  topBtn&&topBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced?'auto':'smooth'}));

  /* Year */
  $$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  /* Local filters */
  const search=$('[data-search]');
  if(search){
    const selector=search.getAttribute('data-search'), cards=$$(selector), empty=$('[data-empty]');
    const run=()=>{const q=search.value.toLowerCase().trim();let n=0;cards.forEach(c=>{const ok=!q||c.innerText.toLowerCase().includes(q);c.style.display=ok?'':'none';if(ok)n++;});if(empty)empty.style.display=n?'none':'';};
    search.addEventListener('input',run);run();
  }

  /* Global search: filter local results or build them from the complete catalog. */
  const globalSearch=$('[data-global-search]');
  if(globalSearch){
    const resultsWrap=$('.search-results');
    const empty=$('[data-global-empty]');
    const render=()=>{
      const q=globalSearch.value.toLowerCase().trim();
      const matches=SEARCH_INDEX.filter(x=>!q || `${x[0]} ${x[1]} ${x[2]}`.toLowerCase().includes(q));
      if(resultsWrap){
        resultsWrap.innerHTML=matches.map((x,i)=>`<a class="search-result reveal show" href="${x[3]}"><div class="type">${x[0]}</div><h3>${x[1]}</h3><p>${x[2]}</p><span class="search-arrow">Ochish →</span></a>`).join('');
      }
      if(empty) empty.style.display=matches.length?'none':'';
    };
    globalSearch.addEventListener('input',render); render();
    const params=new URLSearchParams(location.search); const q=params.get('q'); if(q){globalSearch.value=q;render();}
  }

  /* Keyboard shortcut for global search */
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
      const target=globalSearch||null; if(target){e.preventDefault();target.focus();target.select();}
    }
    if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){
      if(globalSearch){e.preventDefault();globalSearch.focus();}
    }
  });

  /* Dynamic future-course page */
  if(path==='fan-kurs.html') {
    const cfg={
      'jinoyat':['🔴','Jinoyat huquqi','Jinoyat tushunchasi, jinoyat tarkibi, jinoiy javobgarlik va jazo institutlarini tizimli o‘rganish yo‘nalishi.'],
      'jinoyat-protsessual':['🟠','Jinoyat-protsessual huquq','Jinoyat ishlarini yuritish, protsess ishtirokchilari, dalillar va protsessual qarorlarni o‘rganish yo‘nalishi.'],
      'mamuriy':['🟢','Ma’muriy huquq','Davlat boshqaruvi, ma’muriy-huquqiy munosabatlar va ma’muriy javobgarlik yo‘nalishi.'],
      'fuqarolik':['📜','Fuqarolik huquqi','Mulkiy va shaxsiy nomulkiy munosabatlar, shartnomalar va fuqarolik huquqiy institutlari yo‘nalishi.'],
      'davlat-huquq-nazariyasi':['🏛️','Davlat va huquq nazariyasi','Davlat, huquq, huquqiy tizim va fundamental nazariy tushunchalarni o‘rganish yo‘nalishi.'],
      'xalqaro':['🌐','Xalqaro huquq','Xalqaro huquq manbalari, subyektlari va xalqaro-huquqiy munosabatlarni o‘rganish yo‘nalishi.'],
      'matematik-mantiq':['🧠','Matematik mantiq','To‘plamlar, mantiqiy amallar, mulohazalar va Eyler–Venn diagrammalari yo‘nalishi.'],
      'ingliz-tili':['🇬🇧','Ingliz tili','Speaking, akademik lug‘at, grammatika va huquqiy ingliz tili ko‘nikmalarini rivojlantirish yo‘nalishi.']
    };
    const key=new URLSearchParams(location.search).get('subject')||'jinoyat';
    const v=cfg[key]||cfg.jinoyat;
    const icon=$('.subject-icon'); const h=$('[data-fan-heading]'), title=$('[data-fan-title]'), desc=$('[data-fan-description]');
    if(icon) icon.textContent=v[0]; if(h) h.textContent=v[1]; if(title) title.textContent=v[1]; if(desc) desc.textContent=v[2];
    document.title=`${v[1]} — LEGISTZONE`;
  }

  /* Lecture completion + bookmark */
  const lessonMatch=path.match(/^maruza(\d+)\.html$/);
  if(lessonMatch){
    const lessonId=`maruza${lessonMatch[1]}`;
    const box=$('.content-actions'); const doneKey='lz_completed_lessons', markKey='lz_bookmarked_lessons';
    const getSet=k=>new Set(JSON.parse(localStorage.getItem(k)||'[]'));
    const done=getSet(doneKey), marks=getSet(markKey);
    if(box){
      const progress=document.createElement('div'); progress.className='lesson-progress'; progress.innerHTML='<span></span>'; box.parentElement.appendChild(progress);
      const tools=document.createElement('div'); tools.className='lesson-tools';
      const complete=document.createElement('button'); complete.type='button'; complete.className='btn btn-secondary lesson-complete'; complete.textContent=done.has(lessonId)?'✓ Dars tugallangan':'✓ Darsni tugatdim';
      const bookmark=document.createElement('button'); bookmark.type='button'; bookmark.className='btn btn-secondary bookmark-btn'; bookmark.textContent=marks.has(lessonId)?'★ Saqlangan':'☆ Saqlash'; if(marks.has(lessonId)) bookmark.classList.add('saved');
      tools.append(complete,bookmark); box.insertAdjacentElement('afterend',tools);
      complete.addEventListener('click',()=>{const s=getSet(doneKey);if(s.has(lessonId))s.delete(lessonId);else s.add(lessonId);localStorage.setItem(doneKey,JSON.stringify([...s]));const now=s.has(lessonId);complete.textContent=now?'✓ Dars tugallangan':'✓ Darsni tugatdim';complete.classList.toggle('done',now);});
      bookmark.addEventListener('click',()=>{const s=getSet(markKey);if(s.has(lessonId))s.delete(lessonId);else s.add(lessonId);localStorage.setItem(markKey,JSON.stringify([...s]));const now=s.has(lessonId);bookmark.textContent=now?'★ Saqlangan':'☆ Saqlash';bookmark.classList.toggle('saved',now);});
      const onScroll=()=>{const cards=$$('.article-card'), total=cards.length, visible=cards.filter(c=>c.getBoundingClientRect().top<window.innerHeight*.7).length;progress.firstElementChild.style.width=`${Math.min(100,Math.max(5,(visible/Math.max(1,total))*100))}%`;};
      window.addEventListener('scroll',onScroll,{passive:true});onScroll();
    }
  }

  /* Seminar controls */
  if(path==='seminarlar.html'){
    const first=$('.page-hero .box'), details=$$('details');
    if(first&&details.length){
      const wrap=document.createElement('div');wrap.className='content-actions';
      const allOpen=document.createElement('button');allOpen.type='button';allOpen.className='btn btn-secondary';allOpen.textContent='Barchasini ochish';
      const allClose=document.createElement('button');allClose.type='button';allClose.className='btn btn-secondary';allClose.textContent='Barchasini yopish';
      wrap.append(allOpen,allClose);first.appendChild(wrap);
      allOpen.addEventListener('click',()=>details.forEach(d=>d.open=true)); allClose.addEventListener('click',()=>details.forEach(d=>d.open=false));
    }
  }
  $$('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open&&!reduced&&d.animate)d.animate([{opacity:.7,transform:'translateY(-3px)'},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'});}));

  /* Contact form */
  const contact=$('[data-contact-form]');
  if(contact){
    const status=$('[data-contact-status]'), preview=$('[data-issue-preview]'), issueBtn=$('[data-issue-link]'), copyBtn=$('[data-copy-message]'), draftKey='lz_contact_draft';
    const fields={name:$('[name=name]',contact),email:$('[name=email]',contact),topic:$('[name=topic]',contact),message:$('[name=message]',contact)};
    try{const d=JSON.parse(localStorage.getItem(draftKey)||'null');if(d){Object.keys(fields).forEach(k=>{if(fields[k]&&d[k])fields[k].value=d[k];});}}catch(_){ }
    const getData=()=>Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v?v.value.trim():'']));
    const save=()=>{try{localStorage.setItem(draftKey,JSON.stringify(getData()));}catch(_){} if(status)status.textContent='Qoralama avtomatik saqlandi.';};
    Object.values(fields).forEach(f=>f&&f.addEventListener('input',save));
    contact.addEventListener('submit',e=>{e.preventDefault();const d=getData();if(!d.name||!d.topic||!d.message){status.className='contact-status error';status.textContent='Ism, mavzu va xabar maydonlari majburiy.';return;}const body=`Ism: ${d.name}\nEmail: ${d.email||'ko‘rsatilmagan'}\n\n${d.message}\n\n— LEGISTZONE aloqa formasi`;const url=`https://github.com/alisher-legistzone/LEGISTZONE/issues/new?title=${encodeURIComponent(d.topic)}&body=${encodeURIComponent(body)}`;issueBtn.href=url;preview.style.display='block';status.className='contact-status success';status.textContent='Xabar tayyor. “GitHub’da yuborish” orqali yuborishingiz mumkin.';});
    copyBtn&&copyBtn.addEventListener('click',async()=>{const d=getData();const txt=`Mavzu: ${d.topic}\nIsm: ${d.name}\nEmail: ${d.email}\n\n${d.message}`;try{await navigator.clipboard.writeText(txt);status.className='contact-status success';status.textContent='Xabar nusxalandi.';}catch(_){status.className='contact-status error';status.textContent='Brauzer nusxalashga ruxsat bermadi.';}});
  }

  /* Course dashboard progress */
  const courseProgress=$('[data-course-progress]');
  if(courseProgress){const done=new Set(JSON.parse(localStorage.getItem('lz_completed_lessons')||'[]'));const total=8;const pct=Math.round((done.size/total)*100);const bar=$('[data-course-bar]');const txt=$('[data-course-text]');if(bar)bar.style.width=`${pct}%`;if(txt)txt.textContent=`${done.size}/${total} ma’ruza tugallangan · ${pct}%`;}

  /* Advanced test engine */
  const testForm=$('[data-test-form]');
  if(testForm){
    const root=$('[data-quiz-root]',testForm), dataEl=$('#quiz-data'); let bank=[];try{bank=JSON.parse(dataEl?.textContent||'[]');}catch(e){bank=[];}
    const result=$('[data-result]'), timerEl=$('[data-test-timer]'), progress=$('[data-test-progress]'), progressText=$('[data-test-progress-text]'), high=$('[data-highscore]');
    const difficultyEl=$('[data-test-difficulty]'), countEl=$('[data-test-count]'), startBtn=$('[data-start-test]'), metaEl=$('[data-test-meta]'), navQ=$('[data-question-nav]');
    const key='lz_constitution_best_v3'; let selected=[], seconds=600, timer=null, submitted=false, started=false, current=0;
    function shuffle(a){return a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);}
    function fmt(s){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
    function scoreStore(){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch(_){return {}}}
    function saveBest(score,count){const d=scoreStore();const prev=Number(d[count]||0);if(score>prev){d[count]=score;localStorage.setItem(key,JSON.stringify(d));return score}return prev}
    function showBest(){const d=scoreStore();const count=countEl?.value||12;const val=Number(d[count]||0);if(high)high.textContent=val?`${val}/${count}`:'—';}
    function buildBank(){const diff=difficultyEl?.value||'all';let pool=diff==='all'?bank:bank.filter(q=>q.level===diff);if(pool.length<Number(countEl?.value||12))pool=bank;return pool;}
    function render(){root.innerHTML='';if(navQ)navQ.innerHTML='';current=0;selected.forEach((q,i)=>{const item=document.createElement('div');item.className='question reveal show';item.dataset.question='';item.dataset.answer=q.answer;item.dataset.explain=q.explain;item.dataset.source=q.source;item.dataset.level=q.level||'';item.innerHTML=`<div class="q-head"><span class="q-number">${String(i+1).padStart(2,'0')}</span><span class="tag">${q.level||'Aralash'}</span></div><h3>${q.q}</h3>${shuffle(q.options.map((text,idx)=>({text,value:String.fromCharCode(97+idx)}))).map(o=>`<label class="option"><input type="radio" name="quiz_${i}" value="${o.value}"> ${o.text}</label>`).join('')}<div class="answer-note"></div>`;root.appendChild(item);if(navQ){const n=document.createElement('button');n.type='button';n.className='question-dot';n.textContent=i+1;n.dataset.index=i;n.addEventListener('click',()=>scrollToQuestion(i));navQ.appendChild(n);}});$$('input[type=radio]',root).forEach(inp=>inp.addEventListener('change',()=>{updateProgress();startTimer();}));updateProgress();}
    function scrollToQuestion(i){const q=$$('[data-question]',root)[i];if(q){current=i;q.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});updateNav();}}
    function updateNav(){const qs=$$('[data-question]',root);$$('.question-dot',navQ||document).forEach((d,i)=>{const answered=!!$('input:checked',qs[i]);d.classList.toggle('answered',answered);d.classList.toggle('current',i===current);});}
    function updateProgress(){const qs=$$('[data-question]',root);const answered=qs.filter(q=>$('input:checked',q)).length;if(progress)progress.style.width=qs.length?(answered/qs.length*100)+'%':'0%';if(progressText)progressText.textContent=`${answered}/${qs.length} javob berildi`;updateNav();}
    function paintTimer(){if(timerEl)timerEl.textContent=fmt(seconds);timerEl?.classList.toggle('warning',seconds<=120&&seconds>30);timerEl?.classList.toggle('danger',seconds<=30);}
    function startTimer(){if(timer||submitted||!started)return;timer=setInterval(()=>{seconds--;paintTimer();if(seconds<=0){clearInterval(timer);timer=null;submit(true);}},1000)}
    function startTest(){const requested=Number(countEl?.value||12),pool=buildBank();selected=shuffle(pool).slice(0,Math.min(requested,pool.length));seconds=Math.max(60,Math.ceil(selected.length*45));submitted=false;started=true;result.style.display='none';if(timer){clearInterval(timer);timer=null;}metaEl.textContent=`${selected.length} ta savol · ${difficultyEl?.value==='all'?'aralash':difficultyEl.value} daraja`;render();paintTimer();showBest();window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});}
    function submit(force){if(submitted||!started)return;const qs=$$('[data-question]',root), unanswered=qs.filter(q=>!$('input:checked',q)).length;if(!force&&unanswered&&!window.confirm(`${unanswered} ta savol javobsiz. Natijani hozir hisoblaymizmi?`))return;submitted=true;if(timer){clearInterval(timer);timer=null;}let score=0;const breakdown={"Boshlang‘ich":[0,0],"O‘rta":[0,0],"Yuqori":[0,0]};qs.forEach(q=>{const picked=$('input:checked',q),correct=q.dataset.answer;q.classList.remove('correct','wrong','review');const level=q.dataset.level||'Boshlang‘ich';breakdown[level]=breakdown[level]||[0,0];breakdown[level][1]++;if(picked){const opt=picked.closest('.option');opt.classList.add('selected');if(picked.value===correct){score++;breakdown[level][0]++;q.classList.add('correct')}else q.classList.add('wrong')}else q.classList.add('wrong');const correctText=$(`input[value="${correct}"]`,q)?.parentElement?.textContent?.trim()||'';const note=$('.answer-note',q);note.innerHTML=`<strong>To‘g‘ri javob:</strong> ${correctText}<br><span>${q.dataset.explain}</span><br><small>Manba: ${q.dataset.source}</small>`;q.classList.add('review');});
      const total=qs.length,percent=total?Math.round(score/total*100):0,best=saveBest(score,total);if(high)high.textContent=`${best}/${total}`;const label=percent>=90?'Ajoyib natija':percent>=75?'Juda yaxshi':percent>=60?'Yaxshi, lekin mustahkamlash kerak':'Mavzuni qayta ko‘rib chiqing';
      if(result){const lines=Object.entries(breakdown).filter(([,v])=>v[1]).map(([k,v])=>`<div class="review-item"><strong>${k}</strong><span>${v[0]}/${v[1]} to‘g‘ri</span></div>`).join('');result.style.display='block';result.innerHTML=`<div class="result-score">${score}/${total}</div><div class="result-badge">${percent}% · ${label}</div><p class="muted" style="margin-top:10px">Natijangiz saqlandi. Har bir savol ostida huquqiy izoh va manba ko‘rsatilgan.</p><div class="review-list">${lines}</div><div class="result-actions"><button class="btn btn-primary" type="button" data-retry>Yangi variant</button><button class="btn btn-secondary" type="button" data-top>Yuqoriga</button><a class="btn btn-secondary" href="maruzalar.html">Ma’ruzalarni ko‘rish</a></div>`;result.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});$('[data-retry]',result).addEventListener('click',startTest);$('[data-top]',result).addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));}
    }
    testForm.addEventListener('submit',e=>{e.preventDefault();submit(false)}); startBtn?.addEventListener('click',startTest); difficultyEl?.addEventListener('change',showBest); countEl?.addEventListener('change',showBest); $('[data-reset-test]')?.addEventListener('click',()=>{localStorage.removeItem(key);showBest();}); showBest();paintTimer();
  }
})();
