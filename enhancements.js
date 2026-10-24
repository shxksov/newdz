/* FrameData creator-first prototype enhancements. Front-end demo; no backend attached. */
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const ratingTools = {
    ru: [
      ['Композиция', 'Оцени баланс кадра, визуальную иерархию, кадрирование и читаемость ключевых элементов.'],
      ['VFX', 'Оцени качество трекинга, масок, композитинга, реалистичность и интеграцию эффектов.'],
      ['SFX', 'Оцени чистоту, выразительность и уместность звуковых эффектов и саунд-дизайна.'],
      ['Синхронизация и выражение трека', 'Насколько склейки, движения и визуальные акценты совпадают с ритмом и эмоциональным развитием трека.'],
      ['Личное впечатление', 'Насколько работа цепляет, вызывает эмоцию и хочется ли пересмотреть её. Это субъективный критерий.']
    ],
    en: [
      ['Composition', 'Consider framing, visual hierarchy, balance, and how clearly the key elements read.'],
      ['VFX', 'Rate tracking, masking, compositing, realism, and how naturally the effects integrate into the shot.'],
      ['SFX', 'Consider the clarity, impact, and suitability of sound effects and sound design.'],
      ['Track sync & expression', 'How well do cuts, motion, and visual accents follow the rhythm and emotional progression of the track?'],
      ['Personal impression', 'How engaging and emotionally effective is the work, and would you want to watch it again? This is subjective.']
    ]
  };
  const tools = () => ratingTools[(localStorage.getItem('cc_lang') || 'ru') === 'en' ? 'en' : 'ru'];
  let currentRatingCard = null;
  let toastTimer;

  function toast(message) {
    const el = $('#appToast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('visible'), 2800);
  }
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const focusable = $('input,button,textarea', modal);
    if (focusable) setTimeout(() => focusable.focus(), 30);
  }
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    if (!$('.modal-backdrop.open')) document.body.classList.remove('modal-open');
  }
  function buildRatingCriteria() {
    const root = $('#ratingCriteria');
    if (!root) return;
    const en = (localStorage.getItem('cc_lang') || 'ru') === 'en';
    root.innerHTML = tools().map(([name, help], i) => `<div class="rating-criterion"><div class="rating-criterion-head"><label for="score-${i}">${name}<span class="help-dot" tabindex="0" role="button" aria-label="${en ? 'Details: ' : 'Подробности: '}${name}" aria-describedby="score-help-${i}">?</span></label><strong class="score-value" id="score-value-${i}">8</strong></div><div class="criterion-help" id="score-help-${i}" role="tooltip">${help}</div><input id="score-${i}" type="range" min="0" max="10" step="1" value="8" data-score-index="${i}" aria-label="${name}"></div>`).join('');
    updateRatingAverage();
  }
  function updateRatingAverage() {
    const sliders = $$('[data-score-index]');
    if (!sliders.length) return;
    const values = sliders.map(el => Number(el.value));
    values.forEach((value, i) => { const label = $(`#score-value-${i}`); if (label) label.textContent = value; });
    const average = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    const output = $('#ratingAverage');
    if (output) output.innerHTML = `${average} <small>/ 10</small>`;
  }
  function openRating(card) {
    if (card && card.dataset.portfolio !== 'true') {
      toast('Автор не добавил эту работу в портфолио — доступно обычное взаимодействие.'); return;
    }
    currentRatingCard = card;
    const title = card?.dataset.title || 'Neon Nights — cinematic edit';
    $('#ratingVideoName').textContent = title;
    buildRatingCriteria(); openModal('ratingModal');
  }
  function createReel({ title, tags, portfolio, url, author = '@alex_kino' }) {
    const card = document.createElement('article');
    card.className = 'reel-card user-reel';
    card.dataset.title = title; card.dataset.author = author.replace(/^@/, ''); card.dataset.portfolio = String(portfolio); card.dataset.kind = 'creative';
    const preview = document.createElement('div'); preview.className = 'reel-preview uploaded-preview';
    const video = document.createElement('video'); video.src = url; video.controls = true; video.playsInline = true; video.preload = 'metadata';
    video.addEventListener('ended', () => { if (portfolio) openRating(card); });
    preview.append(video);
    const meta = document.createElement('div'); meta.className = 'reel-meta';
    const avatar = document.createElement('div'); avatar.className = 'reel-author-avatar'; avatar.textContent = 'AK';
    const copy = document.createElement('div'); copy.className = 'reel-author-copy';
    const strong = document.createElement('strong'); strong.textContent = author;
    const subtitle = document.createElement('span'); subtitle.textContent = title;
    const tagBox = document.createElement('div'); tagBox.className = 'reel-tags';
    tags.forEach(tag => { const t = document.createElement('span'); t.textContent = `#${tag.trim().replace(/^#/, '')}`; tagBox.append(t); });
    if (portfolio) { const t = document.createElement('span'); t.textContent = '#Portfolio'; tagBox.append(t); }
    copy.append(strong, subtitle, tagBox);
    const actions = document.createElement('div'); actions.className = 'reel-actions';
    const actionDefs = [['♡','Лайк','like-action'],['◇','Сохранить','save-action'],['↗','Поделиться','share-action']];
    actionDefs.forEach(([symbol, label, cls]) => { const b = document.createElement('button'); b.className = `reel-action ${cls}`; b.innerHTML = `${symbol}<small>${label}</small>`; b.type='button'; actions.append(b); });
    if (portfolio) { const b = document.createElement('button'); b.className='reel-action rate-action'; b.type='button'; b.innerHTML='★<small>Оценить</small>'; actions.append(b); }
    const comments = document.createElement('button'); comments.className='reel-action comment-action'; comments.type='button'; comments.innerHTML='☰<small>Комменты</small>'; actions.append(comments);
    meta.append(avatar, copy, actions); card.append(preview, meta);
    $('#reelsList').prepend(card);
    const profileTile = document.createElement('div'); profileTile.className='portfolio-tile';
    const tileTitle = document.createElement('strong'); tileTitle.textContent=title;
    const tileMeta = document.createElement('span'); tileMeta.textContent=portfolio ? '✦ Портфолио · ожидает оценок' : 'Видео';
    profileTile.append(tileTitle,tileMeta);
    const videoGrid = $('#profileVideoGrid'); if (videoGrid) { const empty=$('.portfolio-empty', videoGrid); if(empty) empty.remove(); videoGrid.prepend(profileTile); }
    if (portfolio) { const grid=$('#portfolioGrid'); if(grid) { const empty=$('.portfolio-empty',grid); if(empty) empty.remove(); const clone=profileTile.cloneNode(true); grid.prepend(clone); } }
    return card;
  }
  function setupSearchCategory(select) {
    const wrap = select.closest('.search-category');
    if (!wrap || wrap.querySelector('.search-category-trigger')) return;
    select.classList.add('search-category-native');
    const trigger = document.createElement('button');
    trigger.type = 'button'; trigger.className = 'search-category-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox'); trigger.setAttribute('aria-expanded', 'false');
    const caret = document.createElement('span'); caret.className = 'search-category-caret'; caret.setAttribute('aria-hidden','true'); caret.textContent = '▾';
    const label = document.createElement('span'); label.className = 'search-category-label';
    trigger.append(label, caret);
    const menu = document.createElement('div'); menu.className = 'search-category-menu'; menu.setAttribute('role','listbox'); menu.hidden = true;
    [...select.options].forEach(option => {
      const item = document.createElement('button'); item.type = 'button'; item.className = 'search-category-option';
      item.dataset.value = option.value; item.setAttribute('role','option'); item.textContent = option.textContent;
      item.addEventListener('click', () => {
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        menu.hidden = true; trigger.setAttribute('aria-expanded','false'); trigger.focus();
      });
      menu.append(item);
    });
    trigger.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; trigger.setAttribute('aria-expanded',String(open)); });
    trigger.addEventListener('keydown', e => { if(e.key==='ArrowDown' || e.key==='Enter' || e.key===' '){ e.preventDefault(); menu.hidden=false; trigger.setAttribute('aria-expanded','true'); menu.querySelector('.search-category-option[aria-selected="true"]')?.focus(); } else if(e.key==='Escape'){menu.hidden=true;trigger.setAttribute('aria-expanded','false');} });
    menu.addEventListener('keydown', e => { const items=[...menu.querySelectorAll('.search-category-option')]; const i=items.indexOf(document.activeElement); if(e.key==='ArrowDown'){e.preventDefault();items[Math.min(items.length-1,i+1)]?.focus();} else if(e.key==='ArrowUp'){e.preventDefault();items[Math.max(0,i-1)]?.focus();} else if(e.key==='Escape'){menu.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.focus();} });
    wrap.append(trigger, menu);
    document.addEventListener('click', e => { if(!wrap.contains(e.target)){menu.hidden=true;trigger.setAttribute('aria-expanded','false');} });
    refreshSearchCategory();
  }
  function refreshSearchCategory() {
    const select = $('#searchCategory'); const wrap = select?.closest('.search-category'); if(!select || !wrap) return;
    const label = $('.search-category-label', wrap); if(label) label.textContent=select.selectedOptions[0]?.textContent || '';
    $$('.search-category-option',wrap).forEach(item=>{const selected=item.dataset.value===select.value;item.classList.toggle('active',selected);item.setAttribute('aria-selected',String(selected));});
  }

  function init() {
    // Keep sidebar relevant to editors and creators.
    const search = $('#searchCategory');
    if (search) {
      [...search.options].forEach(option => { if (/camera|project/i.test(option.textContent)) option.remove(); });
      if (search.options[0]) { search.options[0].value = 'authors'; search.options[0].textContent = localStorage.getItem('cc_lang') === 'en' ? 'Authors' : 'Авторы'; }
      if (![...search.options].some(o => o.value === 'videos')) { const option=document.createElement('option'); option.value='videos'; option.textContent=localStorage.getItem('cc_lang') === 'en' ? 'Videos by title' : 'Видео по названию'; search.append(option); }
      // Keep the original compact search bar. Only the category picker gets a custom themed menu.
      search.value = search.value === 'videos' ? 'videos' : 'authors';
      setupSearchCategory(search);
      search.addEventListener('change', () => { const input=$('#searchInput'); const en=(localStorage.getItem('cc_lang')||'ru')==='en'; if(input) input.placeholder=search.value==='videos'?(en?'Search video titles…':'Поиск по названию видео…'):(en?'Search authors and editors…':'Поиск авторов и монтажёров…'); refreshSearchCategory(); });
      if ($('#searchInput')) $('#searchInput').placeholder=(localStorage.getItem('cc_lang')||'ru')==='en'?'Search authors and editors…':'Поиск авторов и монтажёров…';
    }
    // Replace old discipline filters with creator-centric choices.
    const photoFilter = $('[data-filter="photo"]'); if(photoFilter) photoFilter.remove();
    const filterBar=$('#feedFilterBar');
    if(filterBar) $$('[data-filter]',filterBar).forEach(btn=>{const span=$('span:not(.feed-filter-count)',btn); if(span && btn.dataset.filter==='all') span.textContent='Все видео'; if(span && btn.dataset.filter==='creative') span.textContent='Креативы'; if(span && btn.dataset.filter==='work') span.textContent='Рабочие ворки';});
    if(filterBar) filterBar.addEventListener('click',e=>{const btn=e.target.closest('[data-filter]'); if(!btn)return; $$('[data-filter]',filterBar).forEach(b=>b.classList.toggle('active',b===btn)); const mode=btn.dataset.filter; $$('.reel-card', $('#reelsList')).forEach(card=>{card.style.display=mode==='all'||card.dataset.kind===mode?'':'none';});});
    $('#openPublishBtn')?.addEventListener('click', () => openModal('publishModal'));
    $('#openSettingsBtn')?.addEventListener('click', () => openModal('settingsModal'));
    $('#editSoftwareBtn')?.addEventListener('click', () => {
      const selected = new Set($$('.software-tags .backstage-tag').map(el=>el.textContent.trim()));
      $$('#softwareOptions input[type=checkbox]').forEach(input => { input.checked = selected.has(input.value); });
      openModal('softwareModal');
    });
    $('#saveSoftwareBtn')?.addEventListener('click', () => {
      const chosen = $$('#softwareOptions input[type=checkbox]:checked').map(input=>input.value).slice(0,12);
      const container=$('.software-tags');
      $$('.software-tags .backstage-tag').forEach(el=>el.remove());
      chosen.forEach((name,i)=>{const tag=document.createElement('span');tag.className=`backstage-tag ${['tag-cyan','tag-amber','tag-violet'][i%3]}`;tag.textContent=name;container.insertBefore(tag,$('#editSoftwareBtn'));});
      closeModal('softwareModal'); toast('Теги программ обновлены.');
    });
    $$('.modal-backdrop').forEach(backdrop=>{backdrop.addEventListener('click',e=>{if(e.target===backdrop) closeModal(backdrop.id);});});
    $$('[data-close-modal]').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.dataset.closeModal)));
    document.addEventListener('keydown',e=>{if(e.key==='Escape') $$('.modal-backdrop.open').forEach(m=>closeModal(m.id));});
    $('#publishForm')?.addEventListener('submit',e=>{
      e.preventDefault(); const file=$('#videoFile').files[0]; const title=$('#videoTitle').value.trim();
      if(!file || !title) return;
      if(!file.type.startsWith('video/')) { toast('Пожалуйста, выбери видеофайл.'); return; }
      const tags=$('#videoTags').value.split(',').map(t=>t.trim()).filter(Boolean).slice(0,8);
      const portfolio=$('#portfolioToggle').checked; const url=URL.createObjectURL(file);
      const card=createReel({title,tags,portfolio,url});
      // Replace empty/profile demo state with this session's new item.
      $('#publishForm').reset(); closeModal('publishModal'); toast(portfolio?'Видео опубликовано и добавлено в портфолио.':'Видео опубликовано. Оценивание отключено.');
      card.scrollIntoView({behavior:'smooth',block:'center'});
    });
    $('#ratingCriteria')?.addEventListener('input', updateRatingAverage);
    $('#ratingForm')?.addEventListener('submit',e=>{e.preventDefault(); const avg=$('#ratingAverage').textContent.trim(); closeModal('ratingModal'); toast(`Демо-оценка ${avg} сохранена локально. Для общего рейтинга нужен сервер.`); if(currentRatingCard){const b=$('.rate-action',currentRatingCard); if(b) b.classList.add('rated');}});
    $$('[data-theme-choice]').forEach(btn=>btn.addEventListener('click',()=>{
      const theme=btn.dataset.themeChoice;
      if(theme==='dark'||theme==='light') document.documentElement.setAttribute('data-theme',theme);
      else document.documentElement.setAttribute('data-theme','midnight');
      localStorage.setItem('cc_theme',theme); $$('[data-theme-choice]').forEach(b=>b.classList.toggle('active',b===btn));
    }));
    $$('[data-lang-choice]').forEach(btn=>btn.addEventListener('click',()=>{const lang=btn.dataset.langChoice; const match=$(`.lang-btn[data-lang="${lang}"]`); if(match) match.click(); closeModal('settingsModal');}));
    document.addEventListener('click',e=>{
      const action=e.target.closest('.reel-action'); if(!action) return;
      const card=action.closest('.reel-card');
      if(action.classList.contains('like-action')) { action.classList.toggle('is-active'); action.firstChild.textContent=action.classList.contains('is-active')?'♥':'♡'; }
      else if(action.classList.contains('save-action')) { action.classList.toggle('is-active'); action.firstChild.textContent=action.classList.contains('is-active')?'◆':'◇'; toast(action.classList.contains('is-active')?'Добавлено в избранное':'Удалено из избранного'); }
      else if(action.classList.contains('share-action')) { e.preventDefault(); e.stopPropagation(); const shareText=`FrameData — ${card?.dataset.title || 'Видео'}: ${location.href}`; const copyFallback=()=>{try{const area=document.createElement('textarea');area.value=shareText;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();const ok=document.execCommand('copy');area.remove();toast(ok?'Ссылка скопирована':shareText);}catch(_){toast(shareText);}}; try { if(typeof navigator.share==='function') { Promise.resolve(navigator.share({title:card?.dataset.title||'FrameData',text:'Посмотри эту работу на FrameData',url:location.href})).then(()=>toast('Ссылка отправлена')).catch(()=>copyFallback()); } else if(navigator.clipboard?.writeText) { navigator.clipboard.writeText(shareText).then(()=>toast('Ссылка скопирована')).catch(copyFallback); } else copyFallback(); } catch(_) { copyFallback(); } }
      else if(action.classList.contains('rate-action')) openRating(card);
      else if(action.classList.contains('comment-action')) toast('Комментарии подключим следующим этапом.');
    });
    // Search the sample feed by author or video title.
    $('#searchInput')?.addEventListener('input',e=>{
      const q=e.target.value.trim().toLowerCase(); const mode=$('#searchCategory')?.value;
      $$('.reel-card').forEach(card=>{const haystack=mode==='videos'?(card.dataset.title||''):(card.dataset.author||''); card.style.display=!q||haystack.toLowerCase().includes(q)?'':'none';});
    });
    buildRatingCriteria();
  }
  const paletteVars = {
    'neutral-dark': {'--bg':'#0d0e10','--surface':'#16181c','--card':'#1e2026','--card-hover':'#282b32','--text-primary':'#f0f1f4','--text-secondary':'#a0a4ae','--text-muted':'#707580','--border':'rgba(255,255,255,.09)','--border-hover':'rgba(255,255,255,.18)','--accent-cyan':'#d4d7de','--text-on-accent':'#17191d'},
    'neutral-light': {'--bg':'#f2f3f5','--surface':'#ffffff','--card':'#ffffff','--card-hover':'#e9ebef','--text-primary':'#20232a','--text-secondary':'#606672','--text-muted':'#858b96','--border':'rgba(20,25,35,.12)','--border-hover':'rgba(20,25,35,.22)','--accent-cyan':'#303640','--text-on-accent':'#ffffff'},
    ocean: {'--bg':'#09151b','--surface':'#10232c','--card':'#17313d','--card-hover':'#1d3d4a','--text-primary':'#e7f5fa','--text-secondary':'#a5c4d0','--text-muted':'#7094a2','--border':'rgba(93,202,226,.16)','--border-hover':'rgba(93,202,226,.3)','--accent-cyan':'#5dc8e2','--text-on-accent':'#06151b'},
    violet: {'--bg':'#15101d','--surface':'#21172e','--card':'#2c203b','--card-hover':'#39294b','--text-primary':'#f4ecfb','--text-secondary':'#c4b2d5','--text-muted':'#9883ab','--border':'rgba(195,145,240,.16)','--border-hover':'rgba(195,145,240,.3)','--accent-cyan':'#c391f0','--text-on-accent':'#1b1025'},
    forest: {'--bg':'#101712','--surface':'#19251d','--card':'#223329','--card-hover':'#2b4033','--text-primary':'#edf6ef','--text-secondary':'#b2c9b8','--text-muted':'#829b89','--border':'rgba(137,202,154,.15)','--border-hover':'rgba(137,202,154,.3)','--accent-cyan':'#89ca9a','--text-on-accent':'#102016'},
    sunset: {'--bg':'#1a1210','--surface':'#281b18','--card':'#382521','--card-hover':'#49302a','--text-primary':'#fff0e9','--text-secondary':'#d7b6a8','--text-muted':'#a8897d','--border':'rgba(255,166,126,.15)','--border-hover':'rgba(255,166,126,.3)','--accent-cyan':'#ffa67e','--text-on-accent':'#28130d'},
    rose: {'--bg':'#1a1218','--surface':'#291b26','--card':'#382532','--card-hover':'#493044','--text-primary':'#fff0f7','--text-secondary':'#d7b5c8','--text-muted':'#a9899b','--border':'rgba(235,160,197,.15)','--border-hover':'rgba(235,160,197,.3)','--accent-cyan':'#eba0c5','--text-on-accent':'#291321'}
  };
  function applyPalette(name, persist=true) {
    const root=document.documentElement, palette=paletteVars[name]||paletteVars['neutral-dark'];
    root.dataset.palette=name;
    Object.entries(palette).forEach(([key,value])=>root.style.setProperty(key,value));
    // Bridge palette tokens to the legacy app's original CSS variables so every view follows the same palette.
    const aliases={'--bg-primary':'var(--bg)','--bg-secondary':'var(--surface)','--surface-card':'var(--card)','--surface-hover':'var(--card-hover)','--border-color':'var(--border)'};
    Object.entries(aliases).forEach(([key,value])=>root.style.setProperty(key,value));
    root.style.setProperty('--accent-cyan-dim', name==='neutral-light'?'rgba(48,54,64,.10)':'color-mix(in srgb, var(--accent-cyan) 13%, transparent)');
    // Keep the text legible on neutral and coloured accent surfaces.
    root.style.setProperty('--accent-cyan-dim', name==='neutral-light'?'rgba(48,54,64,.10)':'color-mix(in srgb, var(--accent-cyan) 13%, transparent)');
    $$('[data-palette-choice]').forEach(b=>{b.classList.toggle('active',b.dataset.paletteChoice===name);b.setAttribute('aria-pressed',String(b.dataset.paletteChoice===name));});
    if(persist) localStorage.setItem('fd_palette',name);
  }
  const uiText = {
    ru:{feedTitle:'Твоя лента вдохновения',feedSubtitle:'Монтажи, breakdown’ы и работы сообщества',discover:'FRAMEDATA / РЕКОМЕНДАЦИИ',forYou:'● ДЛЯ ВАС',all:'Все видео',creative:'Креативы',work:'Рабочие ворки',palette:'Цветовая палитра',paletteSub:'Выбери акцент и фон интерфейса',language:'Язык',languageSub:'Язык интерфейса',settings:'Настройки интерфейса',settingsSub:'Настрой внешний вид FrameData под себя.',theme:'Цветовая палитра',close:'Закрыть',share:'Поделиться',save:'Сохранить',rate:'Оценить',comments:'Комментарии',previous:'Предыдущее видео',next:'Следующее видео'},
    en:{feedTitle:'Your inspiration feed',feedSubtitle:'Edits, breakdowns and community work',discover:'FRAMEDATA / DISCOVER',forYou:'● FOR YOU',all:'All videos',creative:'Creatives',work:'Client work',palette:'Color palette',paletteSub:'Choose the interface accent and background',language:'Language',languageSub:'Interface language',settings:'Interface settings',settingsSub:'Personalize the look of FrameData.',theme:'Color palette',close:'Close',share:'Share',save:'Save',rate:'Rate',comments:'Comments',previous:'Previous video',next:'Next video'}
  };
  function applyUILanguage(lang) {
    const t=uiText[lang]||uiText.ru;
    if(typeof window.applyLang==='function') window.applyLang(lang);
    document.documentElement.lang=lang;
    document.title=lang==='en'?'FrameData — Creator Network':'FrameData — Сеть креаторов';
    const set=(selector,value)=>{const el=$(selector);if(el)el.textContent=value;};
    // Translate static text nodes throughout the entire app, including legacy profile, forms, footer and dialogs.
    const words = lang==='en' ? {
      'Лента':'Feed','Чарты':'Charts','Опубликовать':'Upload','Избранное':'Saved','Мой профиль':'My profile','Настройки':'Settings','Основное':'Core','Вдохновение':'Inspiration','Индустрия':'Industry',
      'Редактировать обложку':'Edit cover','Редактировать профиль':'Edit profile','Поделиться профилем':'Share profile','Сообщение':'Message','Видео':'Videos','Портфолио':'Portfolio','Сообщения':'Messages','Обо мне':'About me','Сохранённое':'Saved items',
      'Опубликовать видео':'Upload video','Видео-файл':'Video file','Название':'Title','Теги':'Tags','Добавить в портфолио':'Add to portfolio','Разрешить сообществу оценивать работу по профессиональным критериям':'Allow the community to rate this work using professional criteria','Опубликовать':'Publish',
      'Оценка работы':'Rate this work','Рецензия':'Review','необязательно':'optional','Что сработало особенно хорошо? Что можно улучшить?':'What worked especially well? What could be improved?','Средняя оценка':'Average score','Отправить оценку':'Submit rating',
      'Цветовая палитра':'Color palette','Выбери акцент и фон интерфейса':'Choose an accent and interface background','Тёмная':'Dark','Светлая':'Light','Океан':'Ocean','Аметист':'Amethyst','Лес':'Forest','Закат':'Sunset','Розовый кварц':'Rose quartz',
      'Язык':'Language','Язык интерфейса':'Interface language','Настройки интерфейса':'Interface settings','Настрой внешний вид FrameData под себя.':'Personalize the look of FrameData.','Закрыть':'Close','Поддержка':'Support','Бизнес':'Business','Сообщество':'Community',
      'Все видео':'All videos','Авторы':'Creators','Видео по названию':'Videos by title','Поиск по названию видео…':'Search video titles…','Поиск авторов и монтажёров…':'Search authors and editors…','Креативы':'Creatives','Рабочие ворки':'Client work','Предыдущее видео':'Previous video','Следующее видео':'Next video','Оценить':'Rate','Сохранить':'Save','Комментарии':'Comments','Поделиться':'Share',
      'Профессиональная сеть кинематографистов':'Professional filmmakers network','Отправить отзыв':'Submit feedback','Сообщить об ошибке':'Report a bug','Запросы о сотрудничестве':'Collaboration inquiries','Пресса и СМИ':'Press & media','Политика конфиденциальности':'Privacy policy','Условия использования':'Terms of use'
    } : {
      'Feed':'Лента','Charts':'Чарты','Upload':'Опубликовать','Saved':'Избранное','My profile':'Мой профиль','Settings':'Настройки','Core':'Основное','Inspiration':'Вдохновение','Industry':'Индустрия',
      'Edit Cover':'Редактировать обложку','Edit Profile':'Редактировать профиль','Share Profile':'Поделиться профилем','Message':'Сообщение','Videos':'Видео','Portfolio':'Портфолио','Messages':'Сообщения','About me':'Обо мне','Saved items':'Сохранённое',
      'Upload video':'Опубликовать видео','Video file':'Видео-файл','Title':'Название','Tags':'Теги','Add to portfolio':'Добавить в портфолио','Allow the community to rate this work using professional criteria':'Разрешить сообществу оценивать работу по профессиональным критериям','Publish':'Опубликовать',
      'Rate this work':'Оценка работы','Review':'Рецензия','optional':'необязательно','What worked especially well? What could be improved?':'Что сработало особенно хорошо? Что можно улучшить?','Average score':'Средняя оценка','Submit rating':'Отправить оценку',
      'Color palette':'Цветовая палитра','Choose an accent and interface background':'Выбери акцент и фон интерфейса','Dark':'Тёмная','Light':'Светлая','Ocean':'Океан','Amethyst':'Аметист','Forest':'Лес','Sunset':'Закат','Rose quartz':'Розовый кварц',
      'Language':'Язык','Interface language':'Язык интерфейса','Interface settings':'Настройки интерфейса','Personalize the look of FrameData.':'Настрой внешний вид FrameData под себя.','Close':'Закрыть','Support':'Поддержка','Business':'Бизнес','Community':'Сообщество',
      'All videos':'Все видео','Creators':'Авторы','Videos by title':'Видео по названию','Search video titles…':'Поиск по названию видео…','Search authors and editors…':'Поиск авторов и монтажёров…','Creatives':'Креативы','Client work':'Рабочие ворки','Previous video':'Предыдущее видео','Next video':'Следующее видео','Rate':'Оценить','Save':'Сохранить','Comments':'Комментарии','Share':'Поделиться',
      'Professional filmmakers network':'Профессиональная сеть кинематографистов','Submit feedback':'Отправить отзыв','Report a bug':'Сообщить об ошибке','Collaboration inquiries':'Запросы о сотрудничестве','Press & media':'Пресса и СМИ','Privacy policy':'Политика конфиденциальности','Terms of use':'Условия использования'
    };
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){const raw=node.nodeValue;const trimmed=raw.trim();if(words[trimmed])node.nodeValue=raw.replace(trimmed,words[trimmed]);}
    $$('[placeholder]').forEach(el=>{const v=el.getAttribute('placeholder');if(words[v])el.setAttribute('placeholder',words[v]);});
    $$('[title],[aria-label]').forEach(el=>['title','aria-label'].forEach(attr=>{const v=el.getAttribute(attr);if(v&&words[v])el.setAttribute(attr,words[v]);}));
    set('.reels-heading .section-eyebrow',t.discover);set('.reels-title',t.feedTitle);set('.reels-subtitle',t.feedSubtitle);set('.live-pill',t.forYou);
    const labels={'all':t.all,'creative':t.creative,'work':t.work};
    $$('[data-filter]').forEach(b=>{const span=$('span:not(.feed-filter-count)',b);if(span)span.textContent=labels[b.dataset.filter]||span.textContent;});
    set('[data-i18n="palette_title"]',t.palette);set('[data-i18n="palette_subtitle"]',t.paletteSub);set('[data-i18n="language_title"]',t.language);set('[data-i18n="language_subtitle"]',t.languageSub);set('#settingsTitle',t.settings);set('.settings-modal .modal-subtitle',t.settingsSub);
    const nav={'feed':lang==='en'?'Feed':'Лента','charts':lang==='en'?'Charts':'Чарты','publish':lang==='en'?'Upload':'Опубликовать','saved':lang==='en'?'Saved':'Избранное','profile':lang==='en'?'My profile':'Мой профиль','settings':lang==='en'?'Settings':'Настройки','creators':lang==='en'?'Creators':'Авторы','friends':lang==='en'?'Friends':'Друзья'};
    $$('.nav-item').forEach(el=>{const label=$('.sidebar-text-fade',el);const key=el.dataset.view;if(label&&nav[key])label.textContent=nav[key];});
    $$('[data-lang-choice]').forEach(b=>b.classList.toggle('active',b.dataset.langChoice===lang));
    $$('.share-action small').forEach(el=>el.textContent=t.share);$$('.save-action small').forEach(el=>el.textContent=t.save);$$('.rate-action small').forEach(el=>el.textContent=t.rate);$$('.comment-action small').forEach(el=>el.textContent=t.comments);
    $$('.feed-step-btn[data-step="-1"]').forEach(b=>b.title=t.previous);$$('.feed-step-btn[data-step="1"]').forEach(b=>b.title=t.next);
    const search=$('#searchCategory'); if(search){search.value=search.value==='videos'?'videos':'authors'; const input=$('#searchInput'); if(input) input.placeholder=search.value==='videos'?(lang==='en'?'Search video titles…':'Поиск по названию видео…'):(lang==='en'?'Search authors and editors…':'Поиск авторов и монтажёров…'); refreshSearchCategory();}
    localStorage.setItem('cc_lang',lang);
    renderCreatorLeaderboard();
  }
  const demoCreators = [
    {name:'@alex_kino', initials:'AK', avg:9.4, works:18, votes:426, specialty:'Cinematic · VFX'},
    {name:'@framebylena', initials:'FL', avg:9.7, works:4, votes:68, specialty:'AMV · Rhythm edits'},
    {name:'@mike.cut', initials:'MC', avg:9.1, works:31, votes:712, specialty:'Commercial · Motion'},
    {name:'@sora.frames', initials:'SF', avg:9.3, works:12, votes:203, specialty:'Color · Music videos'},
    {name:'@editbymax', initials:'EM', avg:8.9, works:26, votes:390, specialty:'VFX · Sound design'}
  ];
  function renderCreatorLeaderboard(){
    const root=$('#view-placeholder'); if(!root || root.style.display==='none') return;
    const activeView=$('.nav-item[data-view].active')?.dataset.view || '';
    const hero=$('.placeholder-hero',root);
    let board=$('#creatorLeaderboard');
    let friends=$('#friendsDirectory');
    if(activeView!=='creators'){
      if(board) board.remove();
      hero?.classList.remove('creator-leaderboard-hero');
      const coming=hero?.querySelector('[data-i18n="coming_soon_btn"]'); if(coming) coming.style.display='';
    }
    if(activeView!=='friends'){
      if(friends) friends.remove();
      if(hero) hero.style.display='';
    }
    if(activeView==='friends') { renderFriendsDirectory(root, hero); return; }
    const title=$('#placeholderTitle'); if(activeView!=='creators' || !title || !/автор|creator/i.test(title.textContent)) return;
    const en=(localStorage.getItem('cc_lang')||'ru')==='en';
    const score=c=>((c.avg * c.works + 8 * 5) / (c.works + 5));
    const ranked=[...demoCreators].sort((a,b)=>score(b)-score(a));
    if(!hero)return;
    hero.style.display='';
    hero.classList.add('creator-leaderboard-hero');
    if(!board){board=document.createElement('section');board.id='creatorLeaderboard';board.className='creator-leaderboard';hero.append(board);}
    board.innerHTML=`<div class="creator-board-head"><div><span class="section-eyebrow">${en?'PORTFOLIO RANKING':'РЕЙТИНГ ПОРТФОЛИО'}</span><h3>${en?'Top creators':'Лучшие авторы'}</h3><p>${en?'A demo ranking balancing portfolio ratings with the number of reviews.':'Демо-рейтинг учитывает среднюю оценку портфолио и количество полученных оценок.'}</p></div><span class="demo-chip">${en?'DEMO':'ДЕМО'}</span></div><div class="creator-rank-list">${ranked.map((c,i)=>`<article class="creator-rank-card"><span class="creator-rank-number">${String(i+1).padStart(2,'0')}</span><div class="creator-rank-avatar">${c.initials}</div><div class="creator-rank-main"><strong>${c.name}</strong><span>${c.specialty}</span><small>${c.works} ${en?'portfolio works':'работ в портфолио'} · ${c.votes} ${en?'ratings':'оценок'}</small></div><div class="creator-rank-score"><strong>${score(c).toFixed(2)}</strong><span>${en?'weighted score':'взвешенный балл'}</span></div></article>`).join('')}</div><p class="creator-board-note">${en?'Demo data only. The score balances average rating with the number of portfolio works, so a tiny portfolio does not automatically dominate. Real values will come from the rating database.':'Данные условные. Балл учитывает среднюю оценку и количество портфолио-работ, чтобы несколько удачных роликов не давали автоматического преимущества. Реальные значения появятся после подключения базы оценок.'}</p>`;
    const coming=hero.querySelector('[data-i18n="coming_soon_btn"]'); if(coming) coming.style.display='none';
  }
  const demoFriends = [
    {name:'@Friend1', initials:'F1', status:'В сети'},
    {name:'@Friend2', initials:'F2', status:'Был(а) недавно'},
    {name:'@Friend3', initials:'F3', status:'В сети'},
    {name:'@Friend4', initials:'F4', status:'В сети'}
  ];
  function renderFriendsDirectory(root, hero){
    if(hero) hero.style.display='none';
    let directory=$('#friendsDirectory');
    if(!directory){directory=document.createElement('section');directory.id='friendsDirectory';directory.className='friends-directory';root.append(directory);}
    const en=(localStorage.getItem('cc_lang')||'ru')==='en';
    directory.innerHTML=`<header class="friends-directory-head"><span class="section-eyebrow">${en?'YOUR NETWORK':'ТВОЁ ОКРУЖЕНИЕ'}</span><h2>${en?'Friends':'Друзья'}</h2><p>${en?'Open a creator profile or jump straight into a conversation.':'Открывай профиль креатора или сразу переходи к личному чату.'}</p><span class="demo-chip">${en?'DEMO':'ДЕМО'}</span></header><div class="friends-list">${demoFriends.map(f=>`<article class="friend-card"><div class="friend-avatar">${f.initials}</div><div class="friend-card-info"><strong>${f.name}</strong><small><i class="friend-status-dot"></i>${en?(f.status==='В сети'?'Online':'Recently active'):f.status}</small></div><div class="friend-card-actions"><button type="button" class="friend-profile-btn" data-friend="${f.name}" data-action="profile">${en?'Profile':'Профиль'}</button><button type="button" class="friend-chat-btn" data-friend="${f.name}" data-initials="${f.initials}" data-action="chat">✉ ${en?'Chat':'Чат'}</button></div></article>`).join('')}</div><p class="friends-demo-note">${en?'Demo friend list. Messaging is a local interface preview, not a live chat.':'Демонстрационный список друзей. Чат пока показывает интерфейс и не отправляет сообщения на сервер.'}</p>`;
    directory.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
      const name=button.dataset.friend; const initials=button.dataset.initials || demoFriends.find(f=>f.name===name)?.initials || name.slice(1,3).toUpperCase();
      const enNow=(localStorage.getItem('cc_lang')||'ru')==='en';
      const profileTab=document.querySelector('.profile-tab[data-tab="message"]');
      if(profileTab){document.querySelectorAll('.profile-tab').forEach(t=>t.classList.toggle('active',t===profileTab));document.querySelectorAll('.profile-tab-content').forEach(p=>p.style.display='none');const panel=$('#profile-tab-message');if(panel)panel.style.display='';}
      if($('#chatFriendName'))$('#chatFriendName').textContent=name;
      if($('#chatFriendAvatar'))$('#chatFriendAvatar').textContent=initials;
      if($('#chatPlaceholder'))$('#chatPlaceholder').textContent=button.dataset.action==='chat'?(enNow?`Conversation with ${name}. Send a message below.`:`Чат с ${name}. Напиши сообщение ниже.`):(enNow?`Profile preview for ${name}.`:`Профиль ${name} открыт в демо-режиме.`);
      const profileNav=$('.nav-item[data-view="profile"]'); if(profileNav) profileNav.click(); else if($('#userPill')) $('#userPill').click(); else { $('#view-placeholder').style.display='none'; $('#view-profile').style.display=''; }
      document.querySelectorAll('.nav-item[data-view]').forEach(n=>n.classList.toggle('active',n.dataset.view==='profile'));
      setTimeout(()=>{const tab=document.querySelector('.profile-tab[data-tab="message"]');if(tab)tab.click();},0);
    }));
  }
  document.addEventListener('click',e=>{if(e.target.closest('.nav-item[data-view="creators"], .nav-item[data-view="friends"], .nav-item[data-view="charts"], .nav-item[data-view="saved"]')) setTimeout(renderCreatorLeaderboard,0);});
  const messageForm=$('#demoMessageForm');messageForm?.addEventListener('submit',e=>{e.preventDefault();const input=$('#demoMessageInput');const text=input?.value.trim();if(!text)return;const line=document.createElement('p');line.className='demo-chat-message';line.textContent=text;$('#chatPlaceholder')?.appendChild(line);input.value='';});

  window.frameDataNavigate = view => { const item=$(`.nav-item[data-view="${view}"]`); if(item)item.click(); };

  function setupFeedPaging(){
    const list=$('#reelsList'); if(!list)return;
    if(!$('#feedPagingControls')){
      const controls=document.createElement('div');controls.id='feedPagingControls';controls.className='feed-paging-controls';
      controls.innerHTML='<button type="button" class="feed-step-btn" data-step="-1" aria-label="Предыдущее видео" title="Предыдущее видео">↑</button><button type="button" class="feed-step-btn" data-step="1" aria-label="Следующее видео" title="Следующее видео">↓</button>';
      document.body.append(controls);
      controls.addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b)stepFeed(Number(b.dataset.step));});
    }
    let wheelLock=false;
    function handleWheel(e){
      if(!e.target.closest('#view-feed')||e.target.closest('input,textarea,select,.modal-backdrop'))return;
      if(Math.abs(e.deltaY)<8)return;
      e.preventDefault(); if(wheelLock)return; wheelLock=true;stepFeed(e.deltaY>0?1:-1);setTimeout(()=>wheelLock=false,420);
    }
    window.addEventListener('wheel',handleWheel,{passive:false});
    const syncPagingVisibility=()=>{const feed=$('#view-feed');const active=!!feed && getComputedStyle(feed).display!=='none';const controls=$('#feedPagingControls');if(controls)controls.style.display=active?'flex':'none';};
    syncPagingVisibility();
    $$('.nav-item[data-view]').forEach(item=>item.addEventListener('click',()=>setTimeout(syncPagingVisibility,0)));
    window.addEventListener('resize',syncPagingVisibility);
    document.addEventListener('keydown',e=>{
      if($('.modal-backdrop.open')||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||''))return;
      if(!$('#view-feed')||$('#view-feed').style.display==='none')return;
      if(e.key==='ArrowDown'){e.preventDefault();stepFeed(1);}else if(e.key==='ArrowUp'){e.preventDefault();stepFeed(-1);}
    });
  }
  function stepFeed(direction){
    const cards=$$('.reel-card', $('#reelsList')).filter(c=>c.style.display!=='none');if(!cards.length)return;
    const viewportMid=window.innerHeight/2;let current=0,best=Infinity;
    cards.forEach((card,i)=>{const r=card.getBoundingClientRect();const d=Math.abs((r.top+r.height/2)-viewportMid);if(d<best){best=d;current=i;}});
    const next=Math.max(0,Math.min(cards.length-1,current+direction));
    cards[next].scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});
  }
  function initPersonalizationAndPaging(){
    $$('[data-palette-choice]').forEach(b=>b.addEventListener('click',()=>applyPalette(b.dataset.paletteChoice)));
    applyPalette(localStorage.getItem('fd_palette')||'neutral-dark',false);
    $$('[data-lang-choice]').forEach(b=>b.addEventListener('click',()=>{const lang=b.dataset.langChoice;applyUILanguage(lang);closeModal('settingsModal');}));
    $$('.lang-btn').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>applyUILanguage(b.dataset.lang),0)));
    applyUILanguage(localStorage.getItem('cc_lang')||'ru');
    setupFeedPaging();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{init();initPersonalizationAndPaging();}); else {init();initPersonalizationAndPaging();}
})();
