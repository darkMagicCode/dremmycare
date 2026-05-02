/* ── Quiz State ── */
const scores = { oily: 0, dry: 0, normal: 0, combination: 0, sensitive: 0 };
let currentQ = 0;
const totalQ  = 5;

const results = {
  oily: {
    badge: '💧',
    title: 'بشرتك دهنية',
    desc: 'بشرتك تنتج زيوت أكتر من اللازم، وده بيسبب اللمعة والمسام الواسعة. الخبر الكويس؟ البشرة الدهنية بتتجعد أبطأ 😄',
    tips: [
      { icon: '🧼', text: 'غسيل لطيف مرتين يوميًا' },
      { icon: '💆', text: 'مرطب خفيف خالي من الزيوت' },
      { icon: '✨', text: 'نياسيناميد للتحكم في الزيوت' },
      { icon: '🌞', text: 'واقي شمس جل أو سيروم' },
    ]
  },
  dry: {
    badge: '🌵',
    title: 'بشرتك جافة',
    desc: 'بشرتك محتاجة ترطيب عميق ودعم الحاجز الجلدي. المكونات الصح هتغيري كل حاجة.',
    tips: [
      { icon: '💦', text: 'هيالورونيك أسيد للترطيب' },
      { icon: '🧴', text: 'مرطب غني بالسيراميد' },
      { icon: '🌙', text: 'مصل مغذي في الليل' },
      { icon: '🚿', text: 'تجنبي الغسيل بميه ساخنة' },
    ]
  },
  normal: {
    badge: '🌸',
    title: 'بشرتك عادية',
    desc: 'أنتي من المحظوظات! بشرتك متوازنة وخالية من المشاكل الكبيرة. المطلوب مجرد روتين بسيط للحفاظ على صحتها.',
    tips: [
      { icon: '✅', text: 'روتين بسيط صباح ومساء' },
      { icon: '🌞', text: 'واقي شمس يومي ضروري' },
      { icon: '💧', text: 'مرطب خفيف إلى متوسط' },
      { icon: '🍃', text: 'مكونات مضادة للأكسدة' },
    ]
  },
  combination: {
    badge: '🔀',
    title: 'بشرتك مختلطة',
    desc: 'بشرتك مزيج من الدهون في منطقة T-zone (الجبهة والأنف والذقن) وجفاف في الخدين. محتاجة روتين ذكي.',
    tips: [
      { icon: '🗺️', text: 'عاملي كل منطقة بشكل منفصل' },
      { icon: '⚖️', text: 'مرطب متوازن للوجه كله' },
      { icon: '🎯', text: 'أقنعة موجهة للمناطق الدهنية' },
      { icon: '🌿', text: 'نياسيناميد للتوازن' },
    ]
  },
  sensitive: {
    badge: '🌹',
    title: 'بشرتك حساسة',
    desc: 'بشرتك بتتفاعل مع المكونات والعوامل الخارجية بسهولة. محتاجة منتجات لطيفة مختبرة وخالية من المهيجات.',
    tips: [
      { icon: '🌿', text: 'منتجات خالية من العطور' },
      { icon: '🧪', text: 'اعملي باتش تست دايمًا' },
      { icon: '💙', text: 'مكونات مهدئة: ألوفيرا، كالامين' },
      { icon: '🚫', text: 'تجنبي الأحماض والرتينول في البداية' },
    ]
  }
};

function selectOption(btn, type) {
  const question = btn.closest('.quiz-question');
  question.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
  btn.classList.add('selected');
  scores[type]++;

  setTimeout(() => {
    if (currentQ < totalQ - 1) {
      nextQuestion();
    } else {
      showResult();
    }
  }, 320);
}

function nextQuestion() {
  const questions = document.querySelectorAll('.quiz-question');
  questions[currentQ].classList.remove('active');
  currentQ++;
  questions[currentQ].classList.add('active');
  updateProgress();
}

function updateProgress() {
  const pct = ((currentQ + 1) / totalQ) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  const labels = ['١', '٢', '٣', '٤', '٥'];
  document.getElementById('progressLabel').textContent = `سؤال ${labels[currentQ]} من ٥`;
}

function showResult() {
  document.getElementById('quizCard').style.display     = 'none';
  document.getElementById('quizProgress').style.display = 'none';

  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const r = results[winner];

  document.getElementById('resultBadge').textContent  = r.badge;
  document.getElementById('resultTitle').textContent  = r.title;
  document.getElementById('resultDesc').textContent   = r.desc;

  const tipsEl = document.getElementById('resultTips');
  tipsEl.innerHTML = r.tips.map(t =>
    `<div class="result-tip"><span>${t.icon}</span><span>${t.text}</span></div>`
  ).join('');

  document.getElementById('quizResult').style.display = 'block';
}

function resetQuiz() {
  Object.keys(scores).forEach(k => scores[k] = 0);
  currentQ = 0;

  document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
  document.querySelectorAll('.quiz-question').forEach((q, i) => {
    q.classList.toggle('active', i === 0);
  });

  document.getElementById('quizResult').style.display  = 'none';
  document.getElementById('quizCard').style.display    = '';
  document.getElementById('quizProgress').style.display = '';
  updateProgress();
  document.getElementById('progressFill').style.width = '20%';
  document.getElementById('progressLabel').textContent = 'سؤال ١ من ٥';
}

/* ── Wire up quiz option clicks ── */
document.querySelectorAll('.quiz-option').forEach(btn => {
  btn.addEventListener('click', () => selectOption(btn, btn.dataset.type));
});

/* ── FAQ Accordion ── */
document.querySelectorAll('.faq-item__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-item__q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});

/* ── Mobile Nav ── */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
function closeMobileNav() { mobileNav.classList.remove('open'); }

/* ── Chatbot ── */
let chatbotOpen = false;

function toggleChatbot() {
  chatbotOpen = !chatbotOpen;
  const panel  = document.getElementById('chatbotPanel');
  const iconO  = document.querySelector('.chatbot-toggle__icon--open');
  const iconC  = document.querySelector('.chatbot-toggle__icon--close');
  panel.style.display = chatbotOpen ? 'block' : 'none';
  iconO.style.display = chatbotOpen ? 'none'  : '';
  iconC.style.display = chatbotOpen ? ''       : 'none';
}

function openChatbot() {
  if (!chatbotOpen) toggleChatbot();
  document.getElementById('chatbotWidget').scrollIntoView({ behavior: 'smooth', block: 'end' });
}

const botReplies = {
  quiz:     'خليكِ مع كويز البشرة بتاعنا في الأعلى! 👆 ٥ أسئلة بسيطة وهتعرفي نوع بشرتك وأنسب المنتجات ليكِ 🌸',
  products: 'عندنا تشكيلة كاملة لكل أنواع البشرة 🧴 تقدري تبدئي بكويز البشرة وهنوصيك بالمنتجات المناسبة، أو تواصلي معانا على الواتساب للمساعدة المباشرة.',
  order:    'للاستفسار عن طلبك، تواصلي معانا على الواتساب وهنتابع معك فورًا 💬 — أو ابعثيلي رقم طلبك هنا وأنا هساعدك.',
  human:    'بكل سرور! 💖 تقدري تتواصلي معانا مباشرة على الواتساب وهيردوا عليكِ في أقل من دقائق: <a href="https://wa.me/201000000000" target="_blank" rel="noopener" style="color:var(--clr-primary);font-weight:700;">اضغطي هنا للواتساب</a>',
  default:  'شكرًا لتواصلك! 🌸 سؤالك وصلنا. لو محتاجة رد سريع، تواصلي على الواتساب وهيردوا عليكِ فورًا.'
};

function addMessage(text, sender) {
  const msgs = document.getElementById('chatbotMessages');
  const div  = document.createElement('div');
  div.className = `chatbot-msg chatbot-msg--${sender}`;
  div.innerHTML = `<p>${text}</p>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function handleQuickReply(type) {
  document.getElementById('quickReplies').remove();
  const labels = {
    quiz:     '🧴 أعرف نوع بشرتي',
    products: '🛍️ اعرف المنتجات',
    order:    '📦 استفسار عن طلبي',
    human:    '👩 كلام مع شخص حقيقي'
  };
  addMessage(labels[type], 'user');
  setTimeout(() => addMessage(botReplies[type] || botReplies.default, 'bot'), 600);
}

function sendChatMessage() {
  const input = document.getElementById('chatbotInput');
  const text  = input.value.trim();
  if (!text) return;

  // Remove quick replies if still visible
  const qr = document.getElementById('quickReplies');
  if (qr) qr.remove();

  addMessage(text, 'user');
  input.value = '';

  setTimeout(() => addMessage(botReplies.default, 'bot'), 700);
}

function handleChatEnter(e) {
  if (e.key === 'Enter') sendChatMessage();
}

/* ── Smooth scroll offset for sticky header ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = document.querySelector('.header').offsetHeight + 16;
    const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
