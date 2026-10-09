/* YumCheck 웹앱 (AI 없는 버전)
 * 흐름: 프로필 설정 → 사진 촬영 → 음식 선택 → 재료와 프로필 비교 → 경고
 * 저장: 브라우저 localStorage (서버 없음)
 */
(() => {
  'use strict';

  /* ───────── 문구 (한국어 / English) ───────── */
  const I18N = {
    ko: {
      tabHome: '홈', tabProfile: '내 정보',
      obWelcomeTitle: 'Check It.<br>Yum It.',
      obWelcomeSub: '음식 사진 한 장으로<br>나에게 위험한 재료를 확인하세요.',
      obStart: '시작하기',
      obLangLabel: '언어 / Language',
      obStep: (n) => `${n} / 2단계`,
      obAllergyTitle: '알러지가 있는 재료를 선택해 주세요',
      obAllergySub: '여러 개 선택할 수 있어요. 없으면 그냥 다음으로 넘어가세요.',
      obReligionTitle: '종교·식이 제한을 선택해 주세요',
      obReligionSub: '종교는 하나, 식단은 해당하는 것만 골라주세요.',
      next: '다음', back: '이전', done: '완료',
      religion: '종교', diet: '식단',
      homeHeroTitle: '이 음식,<br>지금 먹어도 될까?',
      homeHeroSub: '사진을 찍고 음식을 고르면 내 정보와 비교해 알려드려요.',
      takePhoto: '사진 찍기', fromGallery: '앨범에서 선택', searchNoPhoto: '사진 없이 음식 검색',
      myProfile: '내 체크 항목', edit: '수정',
      noRestrictions: '등록한 알러지·식이 제한이 없어요.',
      recent: '최근 확인한 음식', noRecent: '아직 확인한 음식이 없어요.', clearHistory: '기록 지우기',
      scanTitle: '어떤 음식인가요?',
      scanSub: '음식 자동 인식(AI)은 준비 중이에요. 목록에서 음식을 골라주세요.',
      searchPh: '음식 이름 검색 (예: 김치찌개, burger)',
      catAll: '전체', catKorean: '한식', catWestern: '양식',
      noResult: '찾는 음식이 아직 DB에 없어요.',
      retake: '다시 찍기',
      mainIngr: '주요 재료', hiddenIngr: '숨은 재료',
      hiddenHint: '눈에 잘 안 보이지만 자주 들어가는 재료예요.',
      vDanger: '섭취 주의', vCaution: '확인 필요', vSafe: '위험 재료 없음',
      vDangerSub: (n) => `내 정보와 맞지 않는 재료가 ${n}개 있어요.`,
      vCautionSub: '식당에 한 번 더 확인해 보세요.',
      vSafeSub: '등록한 정보 기준으로 걸리는 재료가 없어요.',
      alertTitle: '알러지 위험', restrictTitle: '섭취 제한 재료', cautionTitle: '확인이 필요한 재료',
      warnFood: '경고 식품',
      warnMsg: (names) => `이 음식에는 ${names} 성분이 포함되어 있을 수 있습니다. 섭취에 주의하세요.`,
      cautionMsg: (names) => `${names} 포함 가능. 조리 방식·인증 여부를 확인하세요.`,
      hiddenTag: '숨은 재료',
      disclaimer: '식당마다 레시피가 다를 수 있어요. 알러지가 심하다면 꼭 직원에게 확인하세요.',
      showStaff: '직원에게 보여주기', checkAnother: '다른 음식 확인',
      staffTitle: '직원에게 보여주세요',
      staffIntro: '저는 다음 음식을 먹을 수 없어요:',
      staffAllergy: '알러지', staffAvoid: '먹지 않는 음식',
      staffQ: (dish) => `이 메뉴(${dish})에 위 재료가 들어가나요?`,
      close: '닫기',
      profileTitle: '내 정보', allergies: '알러지', language: '언어',
      resetAll: '모든 데이터 초기화', resetConfirm: '프로필과 기록을 모두 지울까요?',
      saved: '저장했어요', historyCleared: '기록을 지웠어요',
      allergyLabel: '알러지',
      justNow: '방금', minAgo: (m) => `${m}분 전`, hourAgo: (h) => `${h}시간 전`, dayAgo: (d) => `${d}일 전`,
      photoError: '사진을 불러오지 못했어요. 다시 시도해 주세요.',
    },
    en: {
      tabHome: 'Home', tabProfile: 'Profile',
      obWelcomeTitle: 'Check It.<br>Yum It.',
      obWelcomeSub: 'One photo of your food tells you<br>which ingredients are risky for you.',
      obStart: 'Get started',
      obLangLabel: 'Language / 언어',
      obStep: (n) => `Step ${n} of 2`,
      obAllergyTitle: 'Select your food allergies',
      obAllergySub: 'Pick as many as apply. If none, just tap Next.',
      obReligionTitle: 'Religious & dietary restrictions',
      obReligionSub: 'Choose one religion and any diets that apply.',
      next: 'Next', back: 'Back', done: 'Done',
      religion: 'Religion', diet: 'Diet',
      homeHeroTitle: 'Is this food<br>safe for me?',
      homeHeroSub: 'Snap a photo, pick the dish, and we’ll check it against your profile.',
      takePhoto: 'Take a photo', fromGallery: 'Choose from album', searchNoPhoto: 'Search without a photo',
      myProfile: 'What I check for', edit: 'Edit',
      noRestrictions: 'No allergies or restrictions saved yet.',
      recent: 'Recent checks', noRecent: 'No checks yet.', clearHistory: 'Clear history',
      scanTitle: 'What dish is this?',
      scanSub: 'Automatic AI recognition is coming soon. Please pick the dish from the list.',
      searchPh: 'Search dishes (e.g. burger, 김치찌개)',
      catAll: 'All', catKorean: 'Korean', catWestern: 'Western',
      noResult: 'That dish isn’t in our database yet.',
      retake: 'Retake',
      mainIngr: 'Main ingredients', hiddenIngr: 'Hidden ingredients',
      hiddenHint: 'Often used, but hard to see.',
      vDanger: 'Avoid', vCaution: 'Check first', vSafe: 'No risky ingredients',
      vDangerSub: (n) => `${n} ingredient${n > 1 ? 's' : ''} conflict${n > 1 ? '' : 's'} with your profile.`,
      vCautionSub: 'Double-check with the restaurant.',
      vSafeSub: 'Nothing conflicts with your saved profile.',
      alertTitle: 'Allergy risk', restrictTitle: 'Restricted ingredients', cautionTitle: 'Needs checking',
      warnFood: 'Warning',
      warnMsg: (names) => `This dish may contain ${names}. Please be careful.`,
      cautionMsg: (names) => `May contain ${names}. Ask how it’s prepared or certified.`,
      hiddenTag: 'hidden',
      disclaimer: 'Recipes vary by restaurant. If your allergy is severe, always confirm with the staff.',
      showStaff: 'Show to staff', checkAnother: 'Check another dish',
      staffTitle: 'Please show this to the staff',
      staffIntro: 'I cannot eat the following:',
      staffAllergy: 'Allergies', staffAvoid: 'I don’t eat',
      staffQ: (dish) => `Does this dish (${dish}) contain any of these?`,
      close: 'Close',
      profileTitle: 'Profile', allergies: 'Allergies', language: 'Language',
      resetAll: 'Reset all data', resetConfirm: 'Delete your profile and history?',
      saved: 'Saved', historyCleared: 'History cleared',
      allergyLabel: 'Allergy',
      justNow: 'just now', minAgo: (m) => `${m} min ago`, hourAgo: (h) => `${h} h ago`, dayAgo: (d) => `${d} d ago`,
      photoError: 'Couldn’t load the photo. Please try again.',
    },
  };

  /* ───────── 저장소 (localStorage, 실패해도 앱은 동작) ───────── */
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem('yumcheck.' + key); return v ? JSON.parse(v) : fallback; }
      catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem('yumcheck.' + key, JSON.stringify(val)); return true; }
      catch { return false; }
    },
    clear() {
      try { Object.keys(localStorage).filter(k => k.startsWith('yumcheck.')).forEach(k => localStorage.removeItem(k)); }
      catch { /* ignore */ }
    },
  };

  const defaultLang = (navigator.language || 'en').toLowerCase().startsWith('ko') ? 'ko' : 'en';
  const state = {
    lang: store.get('lang', defaultLang),
    profile: store.get('profile', null), // { allergies:[], religion:'none', diets:[] }
    history: store.get('history', []),    // [{ id, foodId, ts, thumb, verdict }]
    photo: null,       // 현재 촬영한 사진 (dataURL)
    thumb: null,       // 기록용 작은 사진
    draft: null,       // 온보딩 중인 프로필
    scanCat: 'all',
    scanQuery: '',
  };

  const t = (key, ...args) => {
    const v = I18N[state.lang][key];
    return typeof v === 'function' ? v(...args) : (v ?? key);
  };
  const L = (obj) => obj[state.lang] ?? obj.en;          // {ko, en} → 현재 언어
  const other = (obj) => obj[state.lang === 'ko' ? 'en' : 'ko'];
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const view = $('#view');

  /* ───────── 핵심 로직: 재료 ↔ 프로필 비교 ───────── */
  const tagLabel = (tag) => {
    const a = ALLERGENS.find(x => x.id === tag);
    return a ? L(a) : (CATEGORY_LABELS[tag] ? L(CATEGORY_LABELS[tag]) : tag);
  };

  function evaluate(food, profile) {
    const p = profile || { allergies: [], religion: 'none', diets: [] };
    const religion = RELIGIONS.find(r => r.id === p.religion) || RELIGIONS[0];
    const diets = DIETS.filter(d => p.diets.includes(d.id));
    const rank = { safe: 0, caution: 1, danger: 2 };

    const check = (ingId, hidden) => {
      const ing = INGREDIENTS[ingId];
      const reasons = [];
      ing.tags.forEach(tag => {
        if (p.allergies.includes(tag)) reasons.push({ level: 'danger', label: `${t('allergyLabel')}: ${tagLabel(tag)}` });
        if (religion.danger.includes(tag)) reasons.push({ level: 'danger', label: L(religion) });
        else if (religion.caution.includes(tag)) reasons.push({ level: 'caution', label: L(religion) });
        diets.forEach(d => { if (d.danger.includes(tag)) reasons.push({ level: 'danger', label: L(d) }); });
      });
      // 같은 사유 중복 제거
      const seen = new Set();
      const uniq = reasons.filter(r => !seen.has(r.label) && seen.add(r.label));
      const level = uniq.reduce((m, r) => rank[r.level] > rank[m] ? r.level : m, 'safe');
      return { id: ingId, ing, hidden, level, reasons: uniq };
    };

    const items = [
      ...food.ingredients.map(id => check(id, false)),
      ...food.hidden.map(id => check(id, true)),
    ];
    const verdict = items.reduce((m, i) => rank[i.level] > rank[m] ? i.level : m, 'safe');
    return { items, verdict };
  }

  /* ───────── 라우팅 (뒤로가기 버튼 지원) ───────── */
  function go(name, params = {}, { replace = false } = {}) {
    const s = { name, params };
    if (replace) history.replaceState(s, '');
    else history.pushState(s, '');
    render(s);
  }
  window.addEventListener('popstate', (e) => render(e.state || { name: 'home', params: {} }));

  function render(s) {
    if (!state.profile && s.name !== 'onboarding') s = { name: 'onboarding', params: { step: 0 } };
    document.documentElement.lang = state.lang;
    document.body.dataset.view = s.name;
    const fn = VIEWS[s.name] || VIEWS.home;
    view.innerHTML = fn(s.params || {});
    view.scrollTop = 0; window.scrollTo(0, 0);
    if (AFTER[s.name]) AFTER[s.name](s.params || {});
    updateChrome(s.name);
  }

  function updateChrome(name) {
    document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === state.lang));
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === name));
  }

  const current = () => history.state || { name: 'home', params: {} };

  /* ───────── 화면들 ───────── */
  const chip = (emoji, text, cls = '') => `<span class="chip ${cls}">${emoji ? `<i>${emoji}</i>` : ''}${esc(text)}</span>`;

  function selectionMarkup(p) {
    return `
      <div class="pick-grid">
        ${ALLERGENS.map(a => `
          <button class="pick ${p.allergies.includes(a.id) ? 'on' : ''}" data-toggle-allergy="${a.id}" aria-pressed="${p.allergies.includes(a.id)}">
            <span class="pick-emoji">${a.emoji}</span>
            <span class="pick-name">${esc(L(a))}</span>
            <span class="pick-check" aria-hidden="true"></span>
          </button>`).join('')}
      </div>`;
  }

  function religionMarkup(p) {
    return `
      <h3 class="label">${t('religion')}</h3>
      <div class="radio-list">
        ${RELIGIONS.map(r => `
          <button class="radio ${p.religion === r.id ? 'on' : ''}" data-religion="${r.id}" role="radio" aria-checked="${p.religion === r.id}">
            <span class="radio-dot"></span>
            <span class="radio-emoji">${r.emoji}</span>
            <span class="radio-text"><b>${esc(L(r))}</b>${r.noteKo ? `<small>${esc(state.lang === 'ko' ? r.noteKo : r.noteEn)}</small>` : ''}</span>
          </button>`).join('')}
      </div>
      <h3 class="label">${t('diet')}</h3>
      <div class="radio-list">
        ${DIETS.map(d => `
          <button class="radio check ${p.diets.includes(d.id) ? 'on' : ''}" data-diet="${d.id}" aria-pressed="${p.diets.includes(d.id)}">
            <span class="radio-dot"></span>
            <span class="radio-emoji">${d.emoji}</span>
            <span class="radio-text"><b>${esc(L(d))}</b></span>
          </button>`).join('')}
      </div>`;
  }

  function profileChips(p) {
    const chips = [];
    p.allergies.forEach(id => { const a = ALLERGENS.find(x => x.id === id); if (a) chips.push(chip(a.emoji, L(a), 'danger')); });
    const r = RELIGIONS.find(x => x.id === p.religion);
    if (r && r.id !== 'none' && (r.danger.length || r.caution.length)) chips.push(chip(r.emoji, L(r), 'neutral'));
    DIETS.filter(d => p.diets.includes(d.id)).forEach(d => chips.push(chip(d.emoji, L(d), 'neutral')));
    return chips.length ? `<div class="chips">${chips.join('')}</div>` : `<p class="muted">${t('noRestrictions')}</p>`;
  }

  function timeAgo(ts) {
    const m = Math.floor((Date.now() - ts) / 60000);
    if (m < 1) return t('justNow');
    if (m < 60) return t('minAgo', m);
    const h = Math.floor(m / 60);
    if (h < 24) return t('hourAgo', h);
    return t('dayAgo', Math.floor(h / 24));
  }

  const verdictIcon = {
    danger: '<svg viewBox="0 0 24 24"><path d="M12 3 2 20h20L12 3z" fill="currentColor"/><path d="M12 10v4" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.2" fill="#fff"/></svg>',
    caution: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 7v6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="16.5" r="1.2" fill="#fff"/></svg>',
    safe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="m7.5 12 3 3 6-6" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  const VIEWS = {
    onboarding({ step = 0 }) {
      if (!state.draft) state.draft = { allergies: [], religion: 'none', diets: [] };
      const d = state.draft;
      if (step === 0) {
        return `
          <section class="ob-welcome">
            <div class="ob-logo">
              <svg viewBox="0 0 40 40" fill="none"><circle cx="24" cy="20" r="14" stroke="#fff" stroke-width="3"/><circle cx="24" cy="20" r="9" fill="#fff"/><path d="M19 20l3 3 5-5" stroke="#4a6f1e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="6" y="9" width="3" height="14" rx="1.5" fill="#fff"/><circle cx="7.5" cy="7" r="2.5" fill="#fff"/></svg>
              <span>YUMCHECK</span>
            </div>
            <h1>${t('obWelcomeTitle')}</h1>
            <p>${t('obWelcomeSub')}</p>
            <div class="ob-lang">
              <span>${t('obLangLabel')}</span>
              <div class="seg">
                <button data-lang="ko" class="${state.lang === 'ko' ? 'on' : ''}">한국어</button>
                <button data-lang="en" class="${state.lang === 'en' ? 'on' : ''}">English</button>
              </div>
            </div>
            <button class="btn btn-white btn-lg" data-ob="1">${t('obStart')} →</button>
          </section>`;
      }
      if (step === 1) {
        return `
          <section class="ob">
            <div class="ob-progress"><span style="width:50%"></span></div>
            <p class="ob-step">${t('obStep', 1)}</p>
            <h2>${t('obAllergyTitle')}</h2>
            <p class="muted">${t('obAllergySub')}</p>
            ${selectionMarkup(d)}
            <div class="ob-actions">
              <button class="btn btn-ghost" data-ob="0">${t('back')}</button>
              <button class="btn btn-primary" data-ob="2">${t('next')}</button>
            </div>
          </section>`;
      }
      return `
        <section class="ob">
          <div class="ob-progress"><span style="width:100%"></span></div>
          <p class="ob-step">${t('obStep', 2)}</p>
          <h2>${t('obReligionTitle')}</h2>
          <p class="muted">${t('obReligionSub')}</p>
          ${religionMarkup(d)}
          <div class="ob-actions">
            <button class="btn btn-ghost" data-ob="1">${t('back')}</button>
            <button class="btn btn-primary" data-ob-finish>${t('done')}</button>
          </div>
        </section>`;
    },

    home() {
      const p = state.profile;
      const hist = state.history.slice(0, 10);
      return `
        <section class="hero-card">
          <h1>${t('homeHeroTitle')}</h1>
          <p>${t('homeHeroSub')}</p>
          <button class="btn btn-white btn-lg" data-action="camera">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/></svg>
            ${t('takePhoto')}
          </button>
          <div class="hero-links">
            <button data-action="gallery">${t('fromGallery')}</button>
            <span>·</span>
            <button data-action="search">${t('searchNoPhoto')}</button>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <h2>${t('myProfile')}</h2>
            <button class="link" data-go="profile">${t('edit')}</button>
          </div>
          ${profileChips(p)}
        </section>

        <section class="card">
          <div class="card-head">
            <h2>${t('recent')}</h2>
            ${hist.length ? `<button class="link muted-link" data-action="clear-history">${t('clearHistory')}</button>` : ''}
          </div>
          ${hist.length ? `<ul class="history">${hist.map(h => {
            const f = FOODS.find(x => x.id === h.foodId); if (!f) return '';
            const v = evaluate(f, p).verdict;
            return `
              <li><button data-open-history="${h.id}">
                <span class="h-thumb">${h.thumb ? `<img src="${h.thumb}" alt="">` : f.emoji}</span>
                <span class="h-text"><b>${esc(L(f))}</b><small>${timeAgo(h.ts)}</small></span>
                <span class="badge ${v}">${t(v === 'danger' ? 'vDanger' : v === 'caution' ? 'vCaution' : 'vSafe')}</span>
              </button></li>`;
          }).join('')}</ul>` : `<p class="muted">${t('noRecent')}</p>`}
        </section>`;
    },

    scan() {
      return `
        <section class="scan">
          <div class="scan-photo ${state.photo ? '' : 'empty'}">
            ${state.photo ? `<img src="${state.photo}" alt="">` : `<span class="scan-empty-icon">🍽️</span>`}
            <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
            ${state.photo ? `<button class="retake" data-action="camera">↺ ${t('retake')}</button>` : ''}
          </div>
          <div class="sheet">
            <h2>${t('scanTitle')}</h2>
            <p class="muted small">${t('scanSub')}</p>
            <label class="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input type="search" id="foodSearch" placeholder="${esc(t('searchPh'))}" value="${esc(state.scanQuery)}" autocomplete="off" />
            </label>
            <div class="seg seg-full" id="catSeg">
              ${['all', 'korean', 'western'].map(c => `<button data-cat="${c}" class="${state.scanCat === c ? 'on' : ''}">${t(c === 'all' ? 'catAll' : c === 'korean' ? 'catKorean' : 'catWestern')}</button>`).join('')}
            </div>
            <ul class="food-list" id="foodList"></ul>
          </div>
        </section>`;
    },

    result({ foodId, historyId, fresh }) {
      const f = FOODS.find(x => x.id === foodId);
      if (!f) return VIEWS.home();
      const h = historyId ? state.history.find(x => x.id === historyId) : null;
      const photo = (fresh && state.photo) || (h && h.thumb);
      const { items, verdict } = evaluate(f, state.profile);
      const bad = items.filter(i => i.level === 'danger');
      const warn = items.filter(i => i.level === 'caution');
      const names = (arr) => arr.map(i => `'${esc(L(i.ing))}'`).join(', ');

      const row = (i) => `
        <li class="ing ${i.level}">
          <span class="dot"></span>
          <span class="ing-name">${esc(L(i.ing))}${i.level === 'danger' ? ' <span class="warn-ico">⚠️</span>' : ''}</span>
          ${i.reasons.length ? `<span class="reasons">${i.reasons.map(r => `<em class="${r.level}">${esc(r.label)}</em>`).join('')}</span>` : ''}
        </li>`;

      return `
        <section class="result">
          <div class="result-photo">
            ${photo ? `<img src="${photo}" alt="">` : `<span class="big-emoji">${f.emoji}</span>`}
          </div>
          <div class="result-body">
            <div class="result-title">
              <h1>${esc(L(f))}</h1>
              <span class="sub">${esc(other(f))}</span>
            </div>

            <div class="verdict ${verdict}">
              <span class="v-icon">${verdictIcon[verdict]}</span>
              <div>
                <b>${t(verdict === 'danger' ? 'vDanger' : verdict === 'caution' ? 'vCaution' : 'vSafe')}</b>
                <small>${verdict === 'danger' ? t('vDangerSub', bad.length) : verdict === 'caution' ? t('vCautionSub') : t('vSafeSub')}</small>
              </div>
            </div>

            ${bad.length ? `
              <div class="alert-card">
                <h3><span>⚠️</span> ${t(bad.some(i => i.reasons.some(r => r.level === 'danger' && r.label.startsWith(t('allergyLabel')))) ? 'alertTitle' : 'restrictTitle')}</h3>
                <p class="alert-food">${t('warnFood')} : <b>${bad.map(i => esc(L(i.ing))).join(', ')}</b></p>
                <p class="alert-msg">${t('warnMsg', `<b>${names(bad)}</b>`)}</p>
              </div>` : ''}
            ${warn.length ? `
              <div class="alert-card caution">
                <h3><span>❕</span> ${t('cautionTitle')}</h3>
                <p class="alert-msg">${t('cautionMsg', `<b>${names(warn)}</b>`)}</p>
              </div>` : ''}

            <h3 class="label">${t('mainIngr')}</h3>
            <ul class="ing-list">${items.filter(i => !i.hidden).map(row).join('')}</ul>

            <h3 class="label">${t('hiddenIngr')} <small>${t('hiddenHint')}</small></h3>
            <ul class="ing-list hidden-list">${items.filter(i => i.hidden).map(row).join('')}</ul>

            <p class="disclaimer">${t('disclaimer')}</p>

            <div class="result-actions">
              ${verdict !== 'safe' ? `<button class="btn btn-primary btn-lg" data-staff="${f.id}">🙋 ${t('showStaff')}</button>` : ''}
              <button class="btn ${verdict !== 'safe' ? 'btn-outline' : 'btn-primary'} btn-lg" data-action="camera">${t('checkAnother')}</button>
            </div>
          </div>
        </section>`;
    },

    staff({ foodId }) {
      const f = FOODS.find(x => x.id === foodId);
      const p = state.profile;
      const religion = RELIGIONS.find(r => r.id === p.religion);
      const block = (lang) => {
        const T = (k, ...a) => { const v = I18N[lang][k]; return typeof v === 'function' ? v(...a) : v; };
        const allergies = p.allergies.map(id => ALLERGENS.find(a => a.id === id)[lang]);
        const avoid = new Set();
        if (religion) religion.danger.forEach(tag => avoid.add(tag));
        DIETS.filter(d => p.diets.includes(d.id)).forEach(d => d.danger.forEach(tag => avoid.add(tag)));
        const avoidNames = [...avoid].filter(tag => !p.allergies.includes(tag)).map(tag => {
          const a = ALLERGENS.find(x => x.id === tag); return a ? a[lang] : CATEGORY_LABELS[tag][lang];
        });
        return `
          <div class="staff-block" lang="${lang}">
            <p class="staff-intro">${T('staffIntro')}</p>
            ${allergies.length ? `<p class="staff-line"><small>${T('staffAllergy')}</small><b>${esc(allergies.join(', '))}</b></p>` : ''}
            ${avoidNames.length ? `<p class="staff-line"><small>${T('staffAvoid')}</small><b>${esc(avoidNames.join(', '))}</b></p>` : ''}
            ${religion && (religion.danger.length || religion.caution.length) ? `<p class="staff-line"><small>${T('religion')}</small><b>${esc(religion[lang])}</b></p>` : ''}
            ${f ? `<p class="staff-q">${esc(T('staffQ', f[lang]))}</p>` : ''}
          </div>`;
      };
      return `
        <section class="staff">
          <p class="staff-head">${t('staffTitle')}</p>
          ${block('en')}
          <hr>
          ${block('ko')}
          <button class="btn btn-white btn-lg" data-back>${t('close')}</button>
        </section>`;
    },

    profile() {
      const p = state.profile;
      return `
        <section class="page">
          <h1 class="page-title">${t('profileTitle')}</h1>
          <section class="card">
            <h2>${t('allergies')}</h2>
            ${selectionMarkup(p)}
          </section>
          <section class="card">
            ${religionMarkup(p)}
          </section>
          <section class="card">
            <h2>${t('language')}</h2>
            <div class="seg seg-full">
              <button data-lang="ko" class="${state.lang === 'ko' ? 'on' : ''}">한국어</button>
              <button data-lang="en" class="${state.lang === 'en' ? 'on' : ''}">English</button>
            </div>
          </section>
          <button class="btn btn-danger-ghost" data-action="reset">${t('resetAll')}</button>
          <p class="version">YumCheck web · v0.1 (no-AI)</p>
        </section>`;
    },
  };

  /* 화면 렌더 후 처리 */
  const AFTER = {
    scan() {
      const input = $('#foodSearch');
      const draw = () => {
        const q = state.scanQuery.trim().toLowerCase().replace(/\s+/g, '');
        const list = FOODS.filter(f => state.scanCat === 'all' || f.cat === state.scanCat)
          .filter(f => !q || [f.ko, f.en, ...f.aliases].some(n => n.toLowerCase().replace(/\s+/g, '').includes(q)));
        $('#foodList').innerHTML = list.length ? list.map(f => {
          const v = evaluate(f, state.profile).verdict;
          return `
            <li><button data-pick-food="${f.id}">
              <span class="f-emoji">${f.emoji}</span>
              <span class="f-text"><b>${esc(L(f))}</b><small>${esc(other(f))}</small></span>
              <span class="mini ${v}" title="${t(v === 'danger' ? 'vDanger' : v === 'caution' ? 'vCaution' : 'vSafe')}"></span>
            </button></li>`;
        }).join('') : `<li class="empty">${t('noResult')}</li>`;
      };
      input.addEventListener('input', () => { state.scanQuery = input.value; draw(); });
      draw();
    },
  };

  /* ───────── 사진 처리 ───────── */
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('load')); };
      img.src = url;
    });
  }
  function resize(img, max, quality) {
    const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * s);
    c.height = Math.round(img.naturalHeight * s);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', quality);
  }
  async function onPhoto(file) {
    if (!file) return;
    try {
      const img = await loadImage(file);
      state.photo = resize(img, 1080, 0.82);
      state.thumb = resize(img, 400, 0.7);
      state.scanQuery = '';
      if (current().name === 'scan') go('scan', {}, { replace: true }); else go('scan');
    } catch {
      toast(t('photoError'));
    }
  }
  ['cameraInput', 'galleryInput'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('change', () => { onPhoto(el.files[0]); el.value = ''; });
  });

  /* ───────── 기록 ───────── */
  function addHistory(foodId) {
    const entry = { id: Date.now().toString(36), foodId, ts: Date.now(), thumb: state.thumb };
    state.history = [entry, ...state.history].slice(0, 20);
    if (!store.set('history', state.history)) {
      // 저장 공간 부족 → 사진 빼고 저장
      state.history = state.history.map(h => ({ ...h, thumb: null }));
      store.set('history', state.history);
    }
    return entry;
  }

  /* ───────── 토스트 ───────── */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  /* ───────── 클릭 처리 ───────── */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, [data-go]');
    if (!el) return;
    const d = el.dataset;
    const editing = current().name === 'onboarding' ? state.draft : state.profile;
    const saveProfile = () => {
      if (current().name !== 'onboarding') { store.set('profile', state.profile); toast(t('saved')); }
    };

    if (d.lang) {
      state.lang = d.lang; store.set('lang', d.lang);
      render(current()); return;
    }
    if (d.go) { go(d.go); return; }
    if (d.back !== undefined) { history.back(); return; }

    if (d.action === 'camera') { $('#cameraInput').click(); return; }
    if (d.action === 'gallery') { $('#galleryInput').click(); return; }
    if (d.action === 'search') { state.photo = null; state.thumb = null; state.scanQuery = ''; go('scan'); return; }
    if (d.action === 'clear-history') { state.history = []; store.set('history', []); toast(t('historyCleared')); render(current()); return; }
    if (d.action === 'reset') {
      if (confirm(t('resetConfirm'))) {
        store.clear();
        state.profile = null; state.history = []; state.draft = null; state.photo = null;
        go('onboarding', { step: 0 }, { replace: true });
      }
      return;
    }

    // 온보딩 단계 이동
    if (d.ob !== undefined) { go('onboarding', { step: Number(d.ob) }, { replace: true }); return; }
    if (d.obFinish !== undefined) {
      state.profile = state.draft; state.draft = null;
      store.set('profile', state.profile);
      go('home', {}, { replace: true }); return;
    }

    // 프로필 선택 (온보딩/내 정보 공통)
    if (d.toggleAllergy) {
      const list = editing.allergies;
      const i = list.indexOf(d.toggleAllergy);
      i >= 0 ? list.splice(i, 1) : list.push(d.toggleAllergy);
      el.classList.toggle('on'); el.setAttribute('aria-pressed', el.classList.contains('on'));
      saveProfile(); return;
    }
    if (d.religion) {
      editing.religion = d.religion;
      el.parentElement.querySelectorAll('[data-religion]').forEach(b => {
        b.classList.toggle('on', b === el); b.setAttribute('aria-checked', b === el);
      });
      saveProfile(); return;
    }
    if (d.diet) {
      const list = editing.diets;
      const i = list.indexOf(d.diet);
      i >= 0 ? list.splice(i, 1) : list.push(d.diet);
      el.classList.toggle('on'); el.setAttribute('aria-pressed', el.classList.contains('on'));
      saveProfile(); return;
    }

    // 음식 선택/결과
    if (d.cat) {
      state.scanCat = d.cat;
      el.parentElement.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('on', b === el));
      AFTER.scan(); return;
    }
    if (d.pickFood) {
      const h = addHistory(d.pickFood);
      go('result', { foodId: d.pickFood, historyId: h.id, fresh: true }, { replace: true });
      return;
    }
    if (d.openHistory) {
      const h = state.history.find(x => x.id === d.openHistory);
      if (h) go('result', { foodId: h.foodId, historyId: h.id });
      return;
    }
    if (d.staff) { go('staff', { foodId: d.staff }); return; }
  });

  /* ───────── 시작 ───────── */
  const start = state.profile ? { name: 'home', params: {} } : { name: 'onboarding', params: { step: 0 } };
  history.replaceState(start, '');
  render(start);
})();
