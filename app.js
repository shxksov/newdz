/**
 * CineCrew — app.js  (v4)
 * ─────────────────────────────────────────────────────────────────
 *  § 1   i18n dictionary (EN / RU)
 *  § 2   App state
 *  § 3   DOM refs
 *  § 4   Theme toggle
 *  § 5   i18n apply
 *  § 6   SPA router
 *  § 7   Carousel  ← BUG FIX: dynamic step, boundary arrows, dot sync
 *  § 8   Feed filter
 *  § 9   Save buttons
 *  § 10  Follow buttons
 *  § 11  Profile tabs
 *  § 12  Sidebar collapse  ← BUG FIX: listener was missing
 *  § 13  Avatar & Banner upload (client-side, localStorage)
 *  § 14  Event binding
 *  § 15  Init
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   § 1 — i18n DICTIONARY
═══════════════════════════════════════════════════════════════ */
const DICT = {
  en: {
    /* Sidebar groups */
    group_core:        'Core',
    group_inspiration: 'Inspiration',
    group_industry:    'Industry',
    /* Nav items */
    nav_feed:      'Feed',
    nav_charts:    'Charts',
    nav_lighting:  'Lighting Setups',
    nav_gear:      'Gear Catalog',
    nav_jobs:      'Job Board',
    nav_creators:  'Creators',
    /* Sidebar UI */
    sidebar_collapse: 'Collapse',
    sidebar_expand:   'Expand',
    /* Theme */
    theme_label_dark:  'Dark Mode',
    theme_label_light: 'Light Mode',
    theme_label:       'Dark Mode',
    /* Search */
    search_placeholder: 'Search cinematographers, cameras, projects…',
    search_authors:  'Authors',
    search_cameras:  'Cameras',
    search_videos: 'Videos by title',
    search_projects: 'Projects',
    /* Feed filter */
    filter_all:   'All Content',
    filter_cine:  'Video / Cine',
    filter_photo: 'Photography',
    filter_edit:  'Editing',
    /* Feed sections */
    eyebrow_onset:      'On Set Right Now',
    section_backstages: 'Hot Backstages',
    eyebrow_community:  'Community Picks',
    section_references: 'Top References of the Week',
    eyebrow_algorithm:  'Algorithm Pick',
    section_newnames:   'New Names',
    /* Buttons */
    view_all:       'View all',
    read_more:      'Read More',
    follow:         'Follow',
    following:      'Following',
    view_breakdown: 'View Breakdown',
    add_shot:       'Add Shot',
    coming_soon_btn:'Coming Soon',
    /* Backstage cards */
    card1_title:   'How we lit the rain scene in "Hollow Hours" with only 3 HMIs and a lot of faith',
    card1_excerpt: "DP Mariana Sousa breaks down the 14-hour night shoot that became the film's most talked-about sequence — minimal gear, maximum atmosphere.",
    card2_title:   'Chasing the last 11 minutes of light: a desert campaign story',
    card2_excerpt: "When the director wants magic hour and you have a 40-person crew, 4 cameras, and the sun has other plans — this is the backstage you didn't see.",
    card3_title:   'Building a 1970s broadcast set on a $12k budget — production design deep dive',
    card3_excerpt: "Nostalgia isn't cheap. Unless you know which vintage fixtures still hold up, and which Chinese knockoffs will actually save your shoot.",
    /* Profile */
    edit_cover:       'Edit Cover',
    edit_profile:     'Edit Profile',
    share_profile:    'Share Profile',
    message_btn:      'Message',
    affiliation_label:'Production / Affiliation:',
    affiliation_name: 'Studio Lumen GmbH',
    guild_label:      'BSC Member',
    stat_setups:      'setups shared',
    stat_saves:       'saves received',
    stat_avg_rating:  'avg. rating',
    stat_following:   'following',
    tab_shots:   'My Shots',
    tab_saved:   'Saved References',
    tab_drafts:  'Draft Setups',
    saved_empty:  'Save shots from the feed to see them here.',
    drafts_empty: 'No draft setups yet. Start building a lighting rig.',
    /* Upload */
    upload_processing: 'Processing…',
    upload_err_type:   'Only JPG, PNG or WebP images are allowed.',
    upload_err_size:   'File is too large. Maximum size is 5 MB.',
    /* Placeholders */
    placeholder_charts:   { icon: '📈', title: 'Charts',          sub: 'Weekly trending shots, rising DPs, and camera gear rankings — launching soon.' },
    placeholder_lighting: { icon: '💡', title: 'Lighting Setups', sub: 'A deep-dive library of professional lighting diagrams, organized by mood and genre.' },
    placeholder_gear:     { icon: '🎥', title: 'Gear Catalog',    sub: 'Every camera body, lens, and rig used across the CineCrew community — searchable by spec.' },
    placeholder_jobs:     { icon: '💼', title: 'Job Board',       sub: '12 open roles in production: 2nd AC, gaffer, DIT, and more. Filter by city or remote.' },
    placeholder_creators: { icon: '👥', title: 'Creators',        sub: 'Discover cinematographers by style, gear, and reputation score. Build your network.' },
  },

  ru: {
    group_core:        'Основное',
    group_inspiration: 'Вдохновение',
    group_industry:    'Индустрия',
    nav_feed:      'Лента',
    nav_charts:    'Чарты',
    nav_lighting:  'Схемы света',
    nav_gear:      'Каталог техники',
    nav_jobs:      'Вакансии',
    nav_creators:  'Авторы',
    sidebar_collapse: 'Свернуть',
    sidebar_expand:   'Развернуть',
    theme_label_dark:  'Тёмная тема',
    theme_label_light: 'Светлая тема',
    theme_label:       'Тёмная тема',
    search_placeholder: 'Поиск операторов, камер, проектов…',
    search_authors:  'Авторы',
    search_cameras:  'Камеры',
    search_videos: 'Видео по названию',
    search_projects: 'Проекты',
    filter_all:   'Весь контент',
    filter_cine:  'Видео / Кино',
    filter_photo: 'Фотография',
    filter_edit:  'Монтаж',
    eyebrow_onset:      'Сейчас на съёмках',
    section_backstages: 'Горячие backstage',
    eyebrow_community:  'Выбор сообщества',
    section_references: 'Топ референсов недели',
    eyebrow_algorithm:  'По рекомендации',
    section_newnames:   'Новые имена',
    view_all:       'Смотреть все',
    read_more:      'Читать',
    follow:         'Подписаться',
    following:      'Вы подписаны',
    view_breakdown: 'Разбор кадра',
    add_shot:       'Добавить кадр',
    coming_soon_btn:'Скоро',
    card1_title:   'Как мы осветили сцену дождя в «Hollow Hours» тремя HMI и верой в проект',
    card1_excerpt: 'Оператор Мариана Соуза разбирает 14-часовую ночную съёмку, ставшую самой обсуждаемой сценой фильма — минимум техники, максимум атмосферы.',
    card2_title:   'В погоне за последними 11 минутами света: история рекламной съёмки в пустыне',
    card2_excerpt: 'Когда режиссёр хочет золотой час, а у вас 40 человек в группе, 4 камеры и солнце с другими планами — это тот backstage, который вы не видели.',
    card3_title:   'Съёмочная площадка в стиле 70-х за $12 тыс. — разбор производственного дизайна',
    card3_excerpt: 'Ностальгия — удовольствие не из дешёвых. Если только вы не знаете, какие винтажные приборы ещё работают, а какие китайские аналоги реально спасут съёмку.',
    edit_cover:       'Изменить обложку',
    edit_profile:     'Редактировать',
    share_profile:    'Поделиться',
    message_btn:      'Написать',
    affiliation_label:'Продакшн / Аффилиация:',
    affiliation_name: 'Studio Lumen GmbH',
    guild_label:      'Член BSC',
    stat_setups:      'сетапов опубликовано',
    stat_saves:       'сохранений получено',
    stat_avg_rating:  'средняя оценка',
    stat_following:   'подписок',
    tab_shots:   'Мои кадры',
    tab_saved:   'Сохранённые',
    tab_drafts:  'Черновики',
    saved_empty:  'Сохраняйте кадры из ленты, и они появятся здесь.',
    drafts_empty: 'Черновиков пока нет. Начните собирать световую схему.',
    upload_processing: 'Обработка…',
    upload_err_type:   'Допустимы только файлы JPG, PNG или WebP.',
    upload_err_size:   'Файл слишком большой. Максимальный размер — 5 МБ.',
    placeholder_charts:   { icon: '📈', title: 'Чарты',            sub: 'Трендовые кадры недели, восходящие операторы и рейтинги техники — уже скоро.' },
    placeholder_lighting: { icon: '💡', title: 'Схемы света',      sub: 'Библиотека профессиональных световых диаграмм, отсортированных по настроению и жанру.' },
    placeholder_gear:     { icon: '🎥', title: 'Каталог техники',  sub: 'Все камеры, объективы и риги, используемые в сообществе CineCrew — с поиском по характеристикам.' },
    placeholder_jobs:     { icon: '💼', title: 'Вакансии',         sub: '12 открытых позиций в производстве: 2nd AC, осветитель, DIT и другие. Фильтр по городу или удалёнке.' },
    placeholder_creators: { icon: '👥', title: 'Авторы',           sub: 'Открывайте операторов по стилю, технике и репутации. Расширяйте сеть контактов.' },
  }
};


/* ═══════════════════════════════════════════════════════════════
   § 2 — APP STATE
═══════════════════════════════════════════════════════════════ */
const state = {
  lang:           localStorage.getItem('cc_lang')   || 'en',
  theme:          localStorage.getItem('cc_theme')  || 'dark',
  view:           'feed',
  carouselIndex:  0,
  sidebarCollapsed: localStorage.getItem('cc_sidebar') === 'collapsed',
  feedFilter:     'all',
};


/* ═══════════════════════════════════════════════════════════════
   § 3 — DOM REFS
═══════════════════════════════════════════════════════════════ */
let R = {};  // short alias for refs

function gatherRefs() {
  R = {
    html:          document.documentElement,
    /* Sidebar */
    sidebar:       document.getElementById('sidebar'),
    collapseBtn:   document.getElementById('sidebarCollapseBtn'),
    collapseLbl:   document.querySelector('.collapse-btn-label'),
    themeToggle:   document.getElementById('themeToggle'),
    toggleLabel:   document.querySelector('.toggle-label'),
    navItems:      document.querySelectorAll('.nav-item[data-view]'),
    /* Topbar */
    userPill:      document.getElementById('userPill'),
    langBtns:      document.querySelectorAll('.lang-btn'),
    searchInput:   document.getElementById('searchInput'),
    searchCat:     document.getElementById('searchCategory'),
    /* Views */
    viewFeed:        document.getElementById('view-feed'),
    viewProfile:     document.getElementById('view-profile'),
    viewPlaceholder: document.getElementById('view-placeholder'),
    phIcon:  document.getElementById('placeholderIcon'),
    phTitle: document.getElementById('placeholderTitle'),
    phSub:   document.getElementById('placeholderSub'),
    /* Carousel */
    carousel: document.getElementById('backstageCarousel'),
    prevBtn:  document.getElementById('prevBtn'),
    nextBtn:  document.getElementById('nextBtn'),
    dots:     document.querySelectorAll('#carouselDots .dot'),
    /* Feed filter */
    filterBtns: document.querySelectorAll('.feed-filter-btn[data-filter]'),
    shotCards:  document.querySelectorAll('#shotGrid .shot-card[data-discipline]'),
    /* Profile */
    profileTabs:    document.querySelectorAll('.profile-tab[data-tab]'),
    /* Upload */
    profileCover:     document.getElementById('profileCover'),
    profileAvatarEl:  document.getElementById('profileAvatarEl'),
    avatarWrap:       document.getElementById('avatarWrap'),
    avatarOverlay:    document.getElementById('avatarUploadOverlay'),
    bannerEditBtn:    document.getElementById('bannerEditBtn'),
    bannerInput:      document.getElementById('bannerFileInput'),
    avatarInput:      document.getElementById('avatarFileInput'),
    progressWrap:     document.getElementById('uploadProgressWrap'),
    progressBar:      document.getElementById('uploadProgressBar'),
    progressLabel:    document.getElementById('uploadProgressLabel'),
    errorToast:       document.getElementById('uploadErrorToast'),
    errorMsg:         document.getElementById('uploadErrorMsg'),
  };
}


/* ═══════════════════════════════════════════════════════════════
   § 4 — THEME
═══════════════════════════════════════════════════════════════ */
function applyTheme(theme) {
  state.theme = theme;
  R.html.setAttribute('data-theme', theme);
  localStorage.setItem('cc_theme', theme);

  const t = DICT[state.lang];
  R.toggleLabel.textContent = theme === 'dark' ? t.theme_label_dark : t.theme_label_light;
}

function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}


/* ═══════════════════════════════════════════════════════════════
   § 5 — i18n
═══════════════════════════════════════════════════════════════ */
function applyLang(lang) {
  state.lang = lang;
  localStorage.setItem('cc_lang', lang);
  R.html.setAttribute('lang', lang);

  const t = DICT[lang];

  /* All data-i18n text nodes */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (typeof t[key] === 'string') el.textContent = t[key];
  });

  /* Placeholder attributes */
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.setAttribute('placeholder', t[key]);
  });

  /* Select options */
  const opts = R.searchCat ? R.searchCat.querySelectorAll('option') : [];
  if (opts[0]) { opts[0].value = 'authors'; opts[0].textContent = t.search_authors || (lang === 'en' ? 'Authors' : 'Авторы'); }
  if (opts[1]) { opts[1].value = 'videos'; opts[1].textContent = t.search_videos || (lang === 'en' ? 'Videos by title' : 'Видео по названию'); }

  /* Sync theme label, follow buttons, collapse label */
  applyTheme(state.theme);
  syncCollapseBtnLabel();

  document.querySelectorAll('.follow-btn.following').forEach(btn => {
    const sp = btn.querySelector('[data-i18n="follow"]');
    if (sp) sp.textContent = t.following;
  });

  R.langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

  /* Re-render placeholder if active */
  if (state.view !== 'feed' && state.view !== 'profile') renderPlaceholder(state.view);
}


/* ═══════════════════════════════════════════════════════════════
   § 6 — SPA ROUTER
═══════════════════════════════════════════════════════════════ */
function showView(id) {
  R.viewFeed.style.display        = 'none';
  R.viewProfile.style.display     = 'none';
  R.viewPlaceholder.style.display = 'none';

  if (id === 'feed')          R.viewFeed.style.display        = '';
  else if (id === 'profile')  R.viewProfile.style.display     = '';
  else { R.viewPlaceholder.style.display = ''; renderPlaceholder(id); }
}

function renderPlaceholder(viewKey) {
  const t    = DICT[state.lang];
  const data = t[`placeholder_${viewKey}`];
  if (!data) return;
  R.phIcon.textContent  = data.icon;
  R.phTitle.textContent = data.title;
  R.phSub.textContent   = data.sub;
  const csBtn = R.viewPlaceholder.querySelector('[data-i18n="coming_soon_btn"]');
  if (csBtn) csBtn.textContent = t.coming_soon_btn;
}

function navigateTo(view) {
  state.view = view;
  R.navItems.forEach(item => item.classList.toggle('active', item.dataset.view === view));
  showView(view);
}

function navigateToProfile() {
  state.view = 'profile';
  R.navItems.forEach(item => item.classList.remove('active'));
  showView('profile');
}


/* ═══════════════════════════════════════════════════════════════
   § 7 — CAROUSEL
   ─────────────────────────────────────────────────────────────
   Root cause of the arrow freeze:
     The old code called scrollCarousel(direction) which added
     direction to carouselIndex, then re-queried cards and tried
     to scroll to card.offsetLeft. But offsetLeft is relative to
     the scroll container's padding-box, NOT absolute from 0.
     When the container itself had scrolled, offsetLeft of
     non-first cards was much smaller than expected, so the
     computed scroll target was wrong — the browser jumped back
     and the index / arrow state fell out of sync on subsequent
     clicks.

   Fix:
     1. Compute the step as (cardWidth + gap) explicitly from the
        live DOM, not a cached number.
     2. Use scrollLeft = targetIndex * step directly — no
        reliance on per-card offsetLeft.
     3. Arrow enabled/disabled state is set atomically inside
        updateCarouselUI(), called from both button clicks and
        the debounced scroll listener.
     4. The scroll-sync debounce is raised to 120 ms so a smooth-
        scroll animation (which runs ~300 ms) doesn't interrupt
        itself with a stale index read.
═══════════════════════════════════════════════════════════════ */

/** Return the pixel step for one slide (card width + CSS gap). */
function getCarouselStep() {
  if (!R.carousel) return 0;
  const card = R.carousel.querySelector('.backstage-card');
  if (!card) return 0;
  /* gap is on the flex container; read it from computed styles */
  const gap = parseFloat(getComputedStyle(R.carousel).gap) || 18;
  return card.offsetWidth + gap;
}

function getCarouselTotal() {
  return R.carousel ? R.carousel.querySelectorAll('.backstage-card').length : 0;
}

/**
 * Move carousel to an absolute index.
 * Safe to call with any integer — clamps to [0, total-1].
 */
function moveCarouselTo(targetIndex) {
  const total = getCarouselTotal();
  if (!total) return;

  /* Clamp */
  targetIndex = Math.max(0, Math.min(targetIndex, total - 1));
  state.carouselIndex = targetIndex;

  /* Scroll using step × index — no reliance on card.offsetLeft */
  const step = getCarouselStep();
  R.carousel.scrollTo({ left: step * targetIndex, behavior: 'smooth' });

  updateCarouselUI();
}

/** Sync dots + arrow disabled states to current state.carouselIndex */
function updateCarouselUI() {
  const total = getCarouselTotal();

  /* Dots */
  R.dots.forEach((dot, i) => dot.classList.toggle('active', i === state.carouselIndex));

  /* Arrows: disable at boundaries */
  if (R.prevBtn) R.prevBtn.disabled = (state.carouselIndex === 0);
  if (R.nextBtn) R.nextBtn.disabled = (state.carouselIndex >= total - 1);
}

/** Debounced handler for manual scroll (touch / trackpad swipe). */
let _scrollTimer = null;
function onCarouselScroll() {
  clearTimeout(_scrollTimer);
  _scrollTimer = setTimeout(() => {
    if (!R.carousel) return;
    const step = getCarouselStep();
    if (!step) return;
    const rawIndex = R.carousel.scrollLeft / step;
    /* Round — gives correct index even mid-momentum scroll */
    state.carouselIndex = Math.max(0,
      Math.min(Math.round(rawIndex), getCarouselTotal() - 1));
    updateCarouselUI();
  }, 120); /* 120 ms — long enough for smooth-scroll to settle */
}


/* ═══════════════════════════════════════════════════════════════
   § 8 — FEED FILTER
═══════════════════════════════════════════════════════════════ */
function applyFeedFilter(filter) {
  state.feedFilter = filter;

  R.filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));

  R.shotCards.forEach(card => {
    const disc = card.dataset.discipline || 'all';
    const hidden = (filter !== 'all') && (disc !== filter);
    card.classList.toggle('filter-hidden', hidden);
  });
}


/* ═══════════════════════════════════════════════════════════════
   § 9 — SAVE BUTTONS
═══════════════════════════════════════════════════════════════ */
function initSaveBtns() {
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.classList.toggle('saved');
      const path = btn.querySelector('svg path');
      if (path) path.setAttribute('fill', btn.classList.contains('saved') ? 'currentColor' : 'none');
      btn.setAttribute('title', btn.classList.contains('saved') ? 'Saved' : 'Save');
    });
  });
}


/* ═══════════════════════════════════════════════════════════════
   § 10 — FOLLOW BUTTONS
═══════════════════════════════════════════════════════════════ */
function initFollowBtns() {
  document.querySelectorAll('.follow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const following = btn.classList.toggle('following');
      const sp = btn.querySelector('[data-i18n="follow"]');
      if (sp) sp.textContent = DICT[state.lang][following ? 'following' : 'follow'];
    });
  });
}


/* ═══════════════════════════════════════════════════════════════
   § 11 — PROFILE TABS
═══════════════════════════════════════════════════════════════ */
function initProfileTabs() {
  R.profileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      R.profileTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.profile-tab-content').forEach(p => (p.style.display = 'none'));
      const panel = document.getElementById(`profile-tab-${tab.dataset.tab}`);
      if (panel) panel.style.display = '';
    });
  });
}


/* ═══════════════════════════════════════════════════════════════
   § 12 — SIDEBAR COLLAPSE  (BUG FIX: listener was missing)
═══════════════════════════════════════════════════════════════ */

/** Update the collapse button label text to match sidebar state */
function syncCollapseBtnLabel() {
  if (!R.collapseLbl) return;
  const t = DICT[state.lang];
  R.collapseLbl.textContent = state.sidebarCollapsed ? t.sidebar_expand : t.sidebar_collapse;
}

function toggleSidebar() {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  R.sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
  /* Persist so state survives page reload */
  localStorage.setItem('cc_sidebar', state.sidebarCollapsed ? 'collapsed' : 'expanded');
  syncCollapseBtnLabel();
}

/** ResizeObserver: auto-collapse below 900 px, restore above it */
function initResponsiveSidebar() {
  if (!window.ResizeObserver) return;

  const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
      const narrow = entry.contentRect.width < 900;
      /* Only auto-manage when user hasn't pinned a preference at ≥900 px */
      if (narrow) {
        R.sidebar.classList.add('collapsed');
      } else if (!state.sidebarCollapsed) {
        /* Restore to expanded only if the user hadn't manually collapsed */
        R.sidebar.classList.remove('collapsed');
      }
    }
  });

  observer.observe(document.body);
}


/* ═══════════════════════════════════════════════════════════════
   § 13 — AVATAR & BANNER UPLOAD
   ─────────────────────────────────────────────────────────────
   Spec:
   • Allowed formats: JPG, PNG, WebP
   • Max size: 5 MB
   • No backend: convert to base64, persist in localStorage
   • Loading state: animated progress bar during FileReader read
   • Errors: inline toast
═══════════════════════════════════════════════════════════════ */

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES     = 5 * 1024 * 1024; // 5 MB

/** Show error toast with a message, auto-hide after 4 s */
function showUploadError(msgKey) {
  if (!R.errorToast) return;
  R.errorMsg.textContent = DICT[state.lang][msgKey] || msgKey;
  R.errorToast.classList.add('active');
  setTimeout(() => R.errorToast.classList.remove('active'), 4000);
}

/** Animate the progress bar (simulated — FileReader has no real progress for base64) */
function startProgress() {
  if (!R.progressWrap) return;
  R.progressWrap.classList.add('active');
  R.progressBar.style.width = '0%';
  /* Ramp quickly to 80 %, pause, then complete in onload */
  let pct = 0;
  const iv = setInterval(() => {
    pct = Math.min(pct + 8, 80);
    R.progressBar.style.width = pct + '%';
    if (pct >= 80) clearInterval(iv);
  }, 30);
  return iv;
}

function finishProgress(iv) {
  clearInterval(iv);
  R.progressBar.style.width = '100%';
  setTimeout(() => {
    R.progressWrap.classList.remove('active');
    R.progressBar.style.width = '0%';
  }, 380);
}

/**
 * Validate and read a file as base64.
 * @param {File}     file
 * @param {Function} onSuccess  called with (base64DataURL)
 */
function processUpload(file, onSuccess) {
  /* Type check */
  if (!ALLOWED_TYPES.has(file.type)) {
    showUploadError('upload_err_type');
    return;
  }
  /* Size check */
  if (file.size > MAX_BYTES) {
    showUploadError('upload_err_size');
    return;
  }

  const iv  = startProgress();
  const fr  = new FileReader();

  fr.onload = e => {
    finishProgress(iv);
    onSuccess(e.target.result);
  };

  fr.onerror = () => {
    finishProgress(iv);
    showUploadError('upload_err_type');
  };

  fr.readAsDataURL(file);
}

/* ── Avatar upload ── */
function applyAvatar(dataURL) {
  const el = R.profileAvatarEl;
  if (!el) return;
  /* Replace text initials with an <img> inside the avatar circle */
  el.innerHTML = '';
  const img = document.createElement('img');
  img.src    = dataURL;
  img.alt    = 'Profile avatar';
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
  el.appendChild(img);
  el.classList.add('has-image');
  localStorage.setItem('cc_avatar', dataURL);
}

function restoreAvatar() {
  const saved = localStorage.getItem('cc_avatar');
  if (saved) applyAvatar(saved);
}

/* ── Banner upload ── */
function applyBanner(dataURL) {
  if (!R.profileCover) return;
  R.profileCover.style.backgroundImage = `url("${dataURL}")`;
  localStorage.setItem('cc_banner', dataURL);
}

function restoreBanner() {
  const saved = localStorage.getItem('cc_banner');
  if (saved) applyBanner(saved);
}

/* ── Wire upload triggers ── */
function initUploads() {
  /* Avatar: clicking the hover overlay opens the file picker */
  if (R.avatarOverlay && R.avatarInput) {
    const openAvatarPicker = () => R.avatarInput.click();
    R.avatarOverlay.addEventListener('click', openAvatarPicker);
    R.avatarOverlay.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAvatarPicker(); }
    });
    R.avatarInput.addEventListener('change', () => {
      const file = R.avatarInput.files[0];
      if (file) processUpload(file, applyAvatar);
      R.avatarInput.value = ''; /* reset so same file can be re-picked */
    });
  }

  /* Banner: clicking the edit button opens the file picker */
  if (R.bannerEditBtn && R.bannerInput) {
    R.bannerEditBtn.addEventListener('click', e => {
      e.preventDefault();
      R.bannerInput.click();
    });
    R.bannerInput.addEventListener('change', () => {
      const file = R.bannerInput.files[0];
      if (file) processUpload(file, applyBanner);
      R.bannerInput.value = '';
    });
  }

  /* Restore on load */
  restoreAvatar();
  restoreBanner();
}


/* ═══════════════════════════════════════════════════════════════
   § 14 — EVENT BINDING
═══════════════════════════════════════════════════════════════ */
function bindEvents() {

  /* Theme */
  R.themeToggle.addEventListener('click', toggleTheme);

  /* Sidebar collapse (BUG FIX §12 — was never bound) */
  if (R.collapseBtn) R.collapseBtn.addEventListener('click', toggleSidebar);

  /* Nav items */
  R.navItems.forEach(item => {
    item.addEventListener('click', e => { e.preventDefault(); navigateTo(item.dataset.view); });
  });

  /* User pill → profile */
  R.userPill.addEventListener('click', navigateToProfile);
  R.userPill.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateToProfile(); }
  });

  /* Language picker */
  R.langBtns.forEach(btn => btn.addEventListener('click', () => applyLang(btn.dataset.lang)));

  /* Carousel arrow buttons (BUG FIX §7) */
  if (R.prevBtn) {
    R.prevBtn.addEventListener('click', () => moveCarouselTo(state.carouselIndex - 1));
  }
  if (R.nextBtn) {
    R.nextBtn.addEventListener('click', () => moveCarouselTo(state.carouselIndex + 1));
  }

  /* Carousel dot clicks */
  R.dots.forEach((dot, i) => {
    dot.addEventListener('click', () => moveCarouselTo(i));
  });

  /* Carousel manual scroll sync */
  if (R.carousel) {
    R.carousel.addEventListener('scroll', onCarouselScroll, { passive: true });
  }

  /* Feed filters */
  R.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => applyFeedFilter(btn.dataset.filter));
  });

  /* Save & Follow */
  initSaveBtns();
  initFollowBtns();

  /* Profile tabs */
  initProfileTabs();

  /* Uploads */
  initUploads();

  /* Responsive sidebar */
  initResponsiveSidebar();
}


/* ═══════════════════════════════════════════════════════════════
   § 15 — INIT
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  gatherRefs();
  bindEvents();

  /* Restore persisted sidebar state BEFORE first render */
  if (state.sidebarCollapsed) R.sidebar.classList.add('collapsed');

  /* Theme first (sets toggle label); lang second (re-sets label in correct locale) */
  applyTheme(state.theme);
  applyLang(state.lang);

  /* Initial view */
  navigateTo('feed');

  /* Carousel initial UI state (prev disabled at index 0) */
  updateCarouselUI();
});
