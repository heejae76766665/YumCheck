// ── SCROLL NAV ──
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
});

// ── REVEAL ON SCROLL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ── COUNTER ANIMATION ──
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = el.dataset.float === 'true';
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counting').forEach(el => counterObserver.observe(el));

// ── PARTICLES ──
function createParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.width = p.style.height = (Math.random() * 6 + 3) + 'px';
    p.style.animationDuration = (Math.random() * 12 + 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
}
createParticles();

// ── PIPELINE TABS ──
const steps = document.querySelectorAll('.pipeline-step');
const details = document.querySelectorAll('.pipeline-detail');

const pipelineContent = [
  {
    title: 'YUM CHECK 앱',
    desc: '사용자가 YumCheck 앱을 실행하고 알러지 및 식이제한 정보를 사전에 등록합니다. 개인화된 프로필 기반으로 맞춤 분석을 제공합니다.',
    tags: ['iOS / Android', '프로필 등록', '알러지 설정'],
    bars: [
      { label: '사용자 편의성', val: 95 },
      { label: '설정 완성도', val: 88 }
    ]
  },
  {
    title: '음식 촬영',
    desc: '스마트폰 카메라로 음식을 촬영합니다. 실시간 가이드를 통해 최적의 각도와 거리를 안내하여 높은 인식률을 보장합니다.',
    tags: ['실시간 가이드', '고화질 캡처', '다각도 지원'],
    bars: [
      { label: '촬영 정확도', val: 92 },
      { label: '처리 속도', val: 97 }
    ]
  },
  {
    title: 'CNN 이미지 인식',
    desc: '딥러닝 CNN 모델이 음식 이미지를 분석하여 음식 종류와 주요 재료를 식별합니다. 1,000+ 한국 음식 데이터셋으로 학습되었습니다.',
    tags: ['CNN 모델', '1,000+ 음식', '실시간 추론'],
    bars: [
      { label: '음식 인식 정확도', val: 94 },
      { label: '재료 추출 정확도', val: 89 }
    ]
  },
  {
    title: 'LLM 알러지 분석',
    desc: 'LLM이 식별된 재료를 사용자 알러지 프로필과 대조 분석하여 위험 성분을 정확히 감지하고 자연어로 경고 메시지를 생성합니다.',
    tags: ['LLM 분석', '개인 맞춤', '자연어 경고'],
    bars: [
      { label: '알러지 감지율', val: 97 },
      { label: '오탐율 최소화', val: 96 }
    ]
  },
  {
    title: '결과 전달',
    desc: '분석 결과를 직관적인 UI로 즉시 표시합니다. 위험 성분 하이라이트, 심각도 등급, 대체 음식 추천까지 종합 리포트를 제공합니다.',
    tags: ['즉시 알림', '심각도 등급', '대체 추천'],
    bars: [
      { label: '사용자 만족도', val: 93 },
      { label: '응답 속도(초)', val: 98 }
    ]
  }
];

function updatePipelineDetail(index) {
  const d = pipelineContent[index];
  const detail = document.querySelector('.pipeline-detail');
  detail.innerHTML = `
    <div class="pipeline-detail-text">
      <h3>${d.title}</h3>
      <p>${d.desc}</p>
    </div>
    <div class="pipeline-detail-visual">
      ${d.tags.map(t => `<div class="detail-tag">${t}</div>`).join('')}
      ${d.bars.map(b => `
        <div>
          <div class="detail-bar-label"><span>${b.label}</span><span>${b.val}%</span></div>
          <div class="detail-bar"><div class="detail-bar-fill" style="width:${b.val}%"></div></div>
        </div>
      `).join('')}
    </div>
  `;
}

steps.forEach((step, i) => {
  step.addEventListener('click', () => {
    steps.forEach(s => s.classList.remove('active'));
    step.classList.add('active');
    updatePipelineDetail(i);
  });
});

// ── AUTO-CYCLE PIPELINE ──
let pipelineIndex = 0;
let pipelineTimer;
function cyclePipeline() {
  pipelineTimer = setInterval(() => {
    pipelineIndex = (pipelineIndex + 1) % steps.length;
    steps.forEach(s => s.classList.remove('active'));
    steps[pipelineIndex].classList.add('active');
    updatePipelineDetail(pipelineIndex);
  }, 3000);
}
cyclePipeline();
steps.forEach(step => {
  step.addEventListener('mouseenter', () => clearInterval(pipelineTimer));
  step.addEventListener('mouseleave', cyclePipeline);
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── FEATURE BAR ANIMATE ──
const fvBars = document.querySelectorAll('.fv-bar-fill');
const fvObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.getAttribute('data-width') || e.target.style.width;
      fvObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
fvBars.forEach(b => fvObserver.observe(b));
