/* ============================================
   DORAMA BRASIL - App Principal
   ============================================ */

var videos = [];
var modalEl, playerIframe;
var currentFilter = 'all';

/* Hero carousel */
var HERO_VIDEO_IDS = [
    'Esx2H_KDkGM', 'i4iX-zfyRVE', 'SYzkLNyAPgo', 'd9uAqx5beNU',
    'DrSWwJeXPM4', 'iv37_cepkoE', '4KY6ZqaXQTk'
];
var heroVideoIndices = [];
var heroSlideIndex = 0;
var heroInterval = null;

/* Hero timer (premium upsell) */
var heroTimer = null;
var isHeroVideo = false;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    modalEl = document.getElementById('modal');
    playerIframe = document.getElementById('player-iframe');

    videos = await loadCatalog();

    renderHero();
    renderFeatured();
    renderCategoryTabs();
    renderGrid();
    updateVideoCount();
    setupSearch();
    setupCarouselButtons();
    setupModal();
    setupMobileMenu();
    setupHeaderScroll();
    setupBackToTop();
    setupSupport();
    setupRoulette();
    setupTikTok();
    setupPremiumPopup();

    document.getElementById('loading').classList.add('hidden');
}

/* ---------- Hero Carousel ---------- */
function renderHero() {
    heroVideoIndices = [];
    HERO_VIDEO_IDS.forEach(function (hid) {
        for (var i = 0; i < videos.length; i++) {
            if (videos[i].id === hid) { heroVideoIndices.push(i); break; }
        }
    });
    if (heroVideoIndices.length === 0) return;

    heroSlideIndex = 0;
    updateHeroContent(0);

    var dotsContainer = document.getElementById('hero-dots');
    dotsContainer.innerHTML = '';
    for (var d = 0; d < heroVideoIndices.length; d++) {
        var dot = document.createElement('button');
        dot.className = 'hero-dot' + (d === 0 ? ' active' : '');
        dot.setAttribute('data-slide', String(d));
        dot.addEventListener('click', function () {
            goToHeroSlide(parseInt(this.getAttribute('data-slide')));
            resetHeroInterval();
        });
        dotsContainer.appendChild(dot);
    }

    document.getElementById('hero-prev').addEventListener('click', function () {
        var prev = (heroSlideIndex - 1 + heroVideoIndices.length) % heroVideoIndices.length;
        goToHeroSlide(prev);
        resetHeroInterval();
    });
    document.getElementById('hero-next').addEventListener('click', function () {
        var next = (heroSlideIndex + 1) % heroVideoIndices.length;
        goToHeroSlide(next);
        resetHeroInterval();
    });

    startHeroInterval();
}

function updateHeroContent(slideIndex) {
    var vidIdx = heroVideoIndices[slideIndex];
    var video = videos[vidIdx];
    document.getElementById('hero-bg').style.backgroundImage = 'url(' + video.maxThumbnail + ')';
    document.getElementById('hero-title').textContent = video.title;
    document.getElementById('hero-channel').textContent = video.channel;
    document.getElementById('hero-btn').onclick = function () { openHeroPlayer(vidIdx); };
}

function goToHeroSlide(slideIndex) {
    if (slideIndex === heroSlideIndex) return;
    heroSlideIndex = slideIndex;

    var content = document.querySelector('.hero-content');
    var bg = document.getElementById('hero-bg');

    content.style.transform = 'translateX(-100%)';
    content.style.opacity = '0';
    bg.style.opacity = '0';

    setTimeout(function () {
        updateHeroContent(slideIndex);

        content.style.transition = 'none';
        content.style.transform = 'translateX(80%)';
        void content.offsetHeight;

        content.style.transition = '';
        content.style.transform = 'translateX(0)';
        content.style.opacity = '1';
        bg.style.opacity = '1';
    }, 450);

    document.querySelectorAll('.hero-dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === slideIndex);
    });
}

function startHeroInterval() {
    heroInterval = setInterval(function () {
        var next = (heroSlideIndex + 1) % heroVideoIndices.length;
        goToHeroSlide(next);
    }, 2000);
}

function resetHeroInterval() {
    if (heroInterval) clearInterval(heroInterval);
    startHeroInterval();
}

/* ---------- Cards ---------- */
function createCard(index, showBadge) {
    var video = videos[index];
    var catInfo = getCategoryInfo(video.cat);
    var card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-index', index);
    card.setAttribute('data-cat', video.cat);

    var badgeHtml = '';
    if (showBadge !== false) {
        badgeHtml = '<span class="card-badge">' + catInfo.icon + ' ' + escapeHtml(catInfo.name) + '</span>';
    }

    card.innerHTML =
        '<div class="card-thumb">' +
            badgeHtml +
            '<img src="' + video.thumbnail + '" alt="' + escapeHtml(video.title) + '" loading="lazy">' +
            '<div class="card-overlay">' +
                '<div class="play-icon"><svg viewBox="0 0 24 24" width="36" height="36" fill="white"><path d="M8 5v14l11-7z"/></svg></div>' +
            '</div>' +
        '</div>' +
        '<div class="card-info">' +
            '<h3 class="card-title">' + escapeHtml(video.title) + '</h3>' +
            '<p class="card-channel">' + escapeHtml(video.channel) + '</p>' +
        '</div>';

    card.addEventListener('click', function () { openPlayer(index); });
    return card;
}

function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ---------- Featured Carousel ---------- */
function renderFeatured() {
    var container = document.getElementById('featured-carousel');
    var indices = [];
    for (var i = 0; i < videos.length; i++) indices.push(i);
    shuffle(indices);
    var picks = indices.slice(0, 12);

    var fragment = document.createDocumentFragment();
    picks.forEach(function (i) { fragment.appendChild(createCard(i)); });
    container.appendChild(fragment);
}

function shuffle(arr) {
    for (var j = arr.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var tmp = arr[j]; arr[j] = arr[k]; arr[k] = tmp;
    }
    return arr;
}

function setupCarouselButtons() {
    document.querySelectorAll('.carousel-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = btn.getAttribute('data-target');
            var dir = parseInt(btn.getAttribute('data-dir'), 10);
            var carousel = document.getElementById(targetId);
            var scrollAmount = carousel.offsetWidth * 0.75;
            carousel.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
        });
    });
}

/* ---------- Category Tabs ---------- */
function renderCategoryTabs() {
    var container = document.getElementById('category-tabs');
    var fragment = document.createDocumentFragment();

    var allTab = document.createElement('button');
    allTab.className = 'cat-tab active';
    allTab.setAttribute('data-cat', 'all');
    allTab.textContent = 'Todos';
    allTab.addEventListener('click', function () { filterByCategory('all'); });
    fragment.appendChild(allTab);

    CATEGORIES.forEach(function (cat) {
        var tab = document.createElement('button');
        tab.className = 'cat-tab';
        tab.setAttribute('data-cat', cat.id);
        tab.textContent = cat.icon + ' ' + cat.name;
        tab.addEventListener('click', function () { filterByCategory(cat.id); });
        fragment.appendChild(tab);
    });

    container.appendChild(fragment);
}

function filterByCategory(catId) {
    currentFilter = catId;

    document.querySelectorAll('.cat-tab').forEach(function (tab) {
        tab.classList.toggle('active', tab.getAttribute('data-cat') === catId);
    });

    renderGrid();
    updateVideoCount();
}

function updateVideoCount() {
    var count = getFilteredIndices().length;
    var label = count === 1 ? '1 dorama' : count + ' doramas';
    document.getElementById('video-count').textContent = label;
}

function getFilteredIndices() {
    var indices = [];
    videos.forEach(function (v, i) {
        if (currentFilter === 'all' || v.cat === currentFilter) {
            indices.push(i);
        }
    });
    return indices;
}

/* ---------- Grid ---------- */
function renderGrid() {
    var grid = document.getElementById('catalog-grid');
    grid.innerHTML = '';

    var indices = getFilteredIndices();
    var fragment = document.createDocumentFragment();

    indices.forEach(function (i, pos) {
        var card = createCard(i, currentFilter === 'all');
        card.style.animationDelay = Math.min(pos * 0.03, 0.5) + 's';
        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}

/* ---------- Player Modal ---------- */
function openPlayer(index) {
    if (window.innerWidth <= 768) {
        openTikTokPlayer(index);
        return;
    }
    var video = videos[index];
    var catInfo = getCategoryInfo(video.cat);

    playerIframe.src = 'https://www.youtube-nocookie.com/embed/' + video.id + '?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1';
    document.getElementById('modal-title').textContent = video.title;
    document.getElementById('modal-channel').textContent = video.channel;
    document.getElementById('modal-badge').textContent = catInfo.icon + ' ' + catInfo.name;

    renderSuggestions(index);
    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    playerIframe.src = '';
    modalEl.classList.remove('active');
    document.body.style.overflow = '';
    clearHeroTimer();
}

function renderSuggestions(currentIndex) {
    var container = document.getElementById('suggestions-row');
    container.innerHTML = '';

    var currentCat = videos[currentIndex].cat;
    var sameCat = [];
    var otherCat = [];

    for (var i = 0; i < videos.length; i++) {
        if (i === currentIndex) continue;
        if (videos[i].cat === currentCat) {
            sameCat.push(i);
        } else {
            otherCat.push(i);
        }
    }

    shuffle(sameCat);
    shuffle(otherCat);
    var picks = sameCat.slice(0, 4).concat(otherCat.slice(0, 4));
    shuffle(picks);

    var fragment = document.createDocumentFragment();
    picks.forEach(function (i) {
        var card = createCard(i);
        card.classList.add('suggestion-card');
        fragment.appendChild(card);
    });
    container.appendChild(fragment);
}

function setupModal() {
    modalEl.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    modalEl.querySelector('.modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });
}

/* ---------- Search ---------- */
function setupSearch() {
    var input = document.getElementById('search-input');
    var resultsEl = document.getElementById('search-results');

    input.addEventListener('input', function () {
        var query = input.value.toLowerCase().trim();
        if (query.length < 2) {
            resultsEl.classList.remove('active');
            resultsEl.innerHTML = '';
            return;
        }

        var matches = [];
        videos.forEach(function (v, i) {
            if (v.title.toLowerCase().indexOf(query) !== -1 ||
                v.channel.toLowerCase().indexOf(query) !== -1) {
                matches.push({ video: v, index: i });
            }
        });

        resultsEl.innerHTML = '';

        if (matches.length === 0) {
            resultsEl.innerHTML = '<div class="search-empty">Nenhum dorama encontrado</div>';
        } else {
            matches.slice(0, 12).forEach(function (m) {
                var catInfo = getCategoryInfo(m.video.cat);
                var item = document.createElement('div');
                item.className = 'search-item';
                item.innerHTML =
                    '<img src="' + m.video.thumbnail + '" alt="">' +
                    '<div class="search-item-info"><h4>' + escapeHtml(m.video.title) + '</h4>' +
                    '<p>' + escapeHtml(m.video.channel) + '</p>' +
                    '<span class="search-item-cat">' + catInfo.icon + ' ' + escapeHtml(catInfo.name) + '</span></div>';
                item.addEventListener('click', function () {
                    openPlayer(m.index);
                    input.value = '';
                    resultsEl.classList.remove('active');
                });
                resultsEl.appendChild(item);
            });
        }
        resultsEl.classList.add('active');
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-container')) {
            resultsEl.classList.remove('active');
        }
    });
}

/* ---------- Mobile Menu ---------- */
function setupMobileMenu() {
    var toggle = document.getElementById('menu-toggle');
    var navLinks = document.getElementById('nav-links');

    toggle.addEventListener('click', function () {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* ---------- Header Scroll ---------- */
function setupHeaderScroll() {
    var header = document.getElementById('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ---------- Support ---------- */
function setupSupport() {
    var btn = document.getElementById('support-btn');
    var modal = document.getElementById('support-modal');
    var closeBtn = document.getElementById('support-close');
    var backdrop = modal.querySelector('.support-backdrop');
    var copyBtn = document.getElementById('support-copy-btn');
    var emailEl = document.getElementById('support-email');
    var copyLabel = document.getElementById('copy-label');

    function openSupport() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSupport() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', openSupport);
    closeBtn.addEventListener('click', closeSupport);
    backdrop.addEventListener('click', closeSupport);

    copyBtn.addEventListener('click', function () {
        var email = emailEl.textContent;
        navigator.clipboard.writeText(email).then(function () {
            copyLabel.textContent = 'Copiado!';
            setTimeout(function () { copyLabel.textContent = 'Copiar'; }, 2000);
        });
    });
}

/* ---------- Back to Top ---------- */
function setupBackToTop() {
    var btn = document.getElementById('back-to-top');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 600) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================
   HERO TIMER + PREMIUM UPSELL
   ============================================ */
function openHeroPlayer(index) {
    isHeroVideo = true;
    clearHeroTimer();
    heroTimer = setTimeout(showPremiumPopup, 10 * 60 * 1000);
    openPlayer(index);
}

function clearHeroTimer() {
    if (heroTimer) {
        clearTimeout(heroTimer);
        heroTimer = null;
    }
    isHeroVideo = false;
}

function showPremiumPopup() {
    playerIframe.src = '';
    document.getElementById('tiktok-iframe').src = '';
    document.getElementById('premium-modal').classList.add('active');
    heroTimer = null;
}

function closePremiumPopup() {
    document.getElementById('premium-modal').classList.remove('active');
    playerIframe.src = '';
    modalEl.classList.remove('active');
    document.getElementById('tiktok-iframe').src = '';
    document.getElementById('tiktok-player').classList.remove('active');
    document.body.style.overflow = '';
    clearHeroTimer();
}

function setupPremiumPopup() {
    document.getElementById('premium-skip').addEventListener('click', closePremiumPopup);
    document.querySelector('.premium-backdrop').addEventListener('click', closePremiumPopup);
}

/* ============================================
   ROULETTE
   ============================================ */
var rouletteCtx, rouletteAngle = 0, rouletteSpinning = false;
var roulettePicks = [];
var rouletteAudioCtx;
var rouletteSize = 340;

var ROULETTE_COLORS = [
    '#E8A0BF', '#9B7CB8', '#F2C4D6', '#A78BBA',
    '#D4789F', '#C4A0D9', '#DBA0C4', '#8E6CAF',
    '#F5D5E0', '#B8A9C9', '#E0B0D5', '#7B5EA7'
];

function setupRoulette() {
    var canvas = document.getElementById('roulette-canvas');
    var dpr = window.devicePixelRatio || 1;
    rouletteSize = Math.min(340, window.innerWidth - 64);
    canvas.style.width = rouletteSize + 'px';
    canvas.style.height = rouletteSize + 'px';
    canvas.width = rouletteSize * dpr;
    canvas.height = rouletteSize * dpr;
    rouletteCtx = canvas.getContext('2d');
    rouletteCtx.scale(dpr, dpr);

    refreshRoulettePicks();

    document.fonts.ready.then(function () {
        drawRouletteWheel();
    });

    document.getElementById('roulette-spin').addEventListener('click', spinRoulette);
}

function refreshRoulettePicks() {
    var indices = [];
    for (var i = 0; i < videos.length; i++) indices.push(i);
    shuffle(indices);
    roulettePicks = indices.slice(0, 12);
}

function drawRouletteWheel() {
    var ctx = rouletteCtx;
    var cx = rouletteSize / 2;
    var cy = rouletteSize / 2;
    var r = cx - 6;
    var segments = 12;
    var arc = (2 * Math.PI) / segments;

    ctx.clearRect(0, 0, rouletteSize, rouletteSize);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rouletteAngle);

    for (var i = 0; i < segments; i++) {
        var startA = -Math.PI / 2 + i * arc;
        var endA = startA + arc;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r, startA, endA);
        ctx.closePath();
        ctx.fillStyle = ROULETTE_COLORS[i];
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.save();
        ctx.rotate(startA + arc / 2);
        ctx.fillStyle = '#fff';
        var fontSize = rouletteSize < 300 ? 9 : 11;
        ctx.font = 'bold ' + fontSize + 'px Poppins, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 2;
        var maxChars = rouletteSize < 300 ? 12 : 16;
        var title = videos[roulettePicks[i]] ? videos[roulettePicks[i]].title : '';
        if (title.length > maxChars) title = title.substring(0, maxChars) + '..';
        ctx.fillText(title, r - 14, 0);
        ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, 2 * Math.PI);
    var grad = ctx.createLinearGradient(-22, -22, 22, 22);
    grad.addColorStop(0, '#E8A0BF');
    grad.addColorStop(1, '#B8A9C9');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'transparent';
    ctx.fillText('?', 0, 1);

    ctx.restore();
}

function spinRoulette() {
    if (rouletteSpinning || videos.length === 0) return;
    rouletteSpinning = true;

    if (!rouletteAudioCtx) {
        rouletteAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    refreshRoulettePicks();
    drawRouletteWheel();

    var targetIndex = Math.floor(Math.random() * 12);
    var arc = (2 * Math.PI) / 12;
    var fullRotations = (6 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
    var segmentOffset = targetIndex * arc + arc / 2;
    var totalSpin = fullRotations + segmentOffset;

    var startAngle = rouletteAngle;
    var startTime = performance.now();
    var duration = 4000 + Math.random() * 1500;
    var lastTickSeg = -1;

    document.getElementById('roulette-spin').classList.add('spinning');

    function animate(now) {
        var elapsed = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);

        rouletteAngle = startAngle + totalSpin * eased;

        var currentSeg = getRouletteSegment();
        if (currentSeg !== lastTickSeg) {
            playTickSound();
            lastTickSeg = currentSeg;
        }

        drawRouletteWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            rouletteSpinning = false;
            document.getElementById('roulette-spin').classList.remove('spinning');
            setTimeout(function () {
                openPlayer(roulettePicks[targetIndex]);
            }, 600);
        }
    }

    requestAnimationFrame(animate);
}

function getRouletteSegment() {
    var arc = (2 * Math.PI) / 12;
    var norm = ((-rouletteAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    return Math.floor(norm / arc) % 12;
}

function playTickSound() {
    if (!rouletteAudioCtx) return;
    try {
        var osc = rouletteAudioCtx.createOscillator();
        var gain = rouletteAudioCtx.createGain();
        osc.connect(gain);
        gain.connect(rouletteAudioCtx.destination);
        osc.frequency.value = 600 + Math.random() * 300;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.12, rouletteAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, rouletteAudioCtx.currentTime + 0.06);
        osc.start(rouletteAudioCtx.currentTime);
        osc.stop(rouletteAudioCtx.currentTime + 0.06);
    } catch (e) { /* silent fail */ }
}

/* ============================================
   TIKTOK PLAYER (MOBILE)
   ============================================ */
var tiktokPlaylist = [];
var tiktokCurrentIdx = 0;
var tiktokTouchStartY = 0;
var tiktokTouchDelta = 0;
var tiktokSwiping = false;

function setupTikTok() {
    var player = document.getElementById('tiktok-player');
    var closeBtn = document.getElementById('tiktok-close');
    var prevBtn = document.getElementById('tiktok-prev');
    var nextBtn = document.getElementById('tiktok-next');
    var swipeArea = document.getElementById('tiktok-swipe-area');

    closeBtn.addEventListener('click', closeTikTokPlayer);

    prevBtn.addEventListener('click', function () {
        navigateTikTok(-1);
    });

    nextBtn.addEventListener('click', function () {
        navigateTikTok(1);
    });

    swipeArea.addEventListener('touchstart', function (e) {
        tiktokTouchStartY = e.touches[0].clientY;
        tiktokSwiping = true;
        tiktokTouchDelta = 0;
    }, { passive: true });

    swipeArea.addEventListener('touchmove', function (e) {
        if (!tiktokSwiping) return;
        tiktokTouchDelta = tiktokTouchStartY - e.touches[0].clientY;
        var wrap = document.getElementById('tiktok-video-wrap');
        var clamp = Math.max(-120, Math.min(120, -tiktokTouchDelta));
        wrap.style.transition = 'none';
        wrap.style.transform = 'translateY(' + clamp + 'px)';
    }, { passive: true });

    swipeArea.addEventListener('touchend', function () {
        if (!tiktokSwiping) return;
        tiktokSwiping = false;
        var wrap = document.getElementById('tiktok-video-wrap');
        wrap.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1)';
        wrap.style.transform = 'translateY(0)';

        if (Math.abs(tiktokTouchDelta) > 80) {
            navigateTikTok(tiktokTouchDelta > 0 ? 1 : -1);
        }
    });

    document.addEventListener('keydown', function (e) {
        if (!document.getElementById('tiktok-player').classList.contains('active')) return;
        if (e.key === 'Escape') closeTikTokPlayer();
    });
}

function openTikTokPlayer(index) {
    tiktokPlaylist = [index];
    var others = [];
    for (var i = 0; i < videos.length; i++) {
        if (i !== index) others.push(i);
    }
    shuffle(others);
    tiktokPlaylist = tiktokPlaylist.concat(others);
    tiktokCurrentIdx = 0;

    loadTikTokVideo();
    document.getElementById('tiktok-player').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTikTokPlayer() {
    document.getElementById('tiktok-iframe').src = '';
    document.getElementById('tiktok-player').classList.remove('active');
    document.body.style.overflow = '';
    clearHeroTimer();
}

function loadTikTokVideo() {
    var vidIndex = tiktokPlaylist[tiktokCurrentIdx];
    var video = videos[vidIndex];
    var catInfo = getCategoryInfo(video.cat);

    document.getElementById('tiktok-iframe').src =
        'https://www.youtube-nocookie.com/embed/' + video.id +
        '?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1';
    document.getElementById('tiktok-title').textContent = video.title;
    document.getElementById('tiktok-channel').textContent = video.channel;
    document.getElementById('tiktok-badge').textContent = catInfo.icon + ' ' + catInfo.name;
}

function navigateTikTok(direction) {
    var newIdx = tiktokCurrentIdx + direction;
    if (newIdx < 0 || newIdx >= tiktokPlaylist.length) return;

    tiktokCurrentIdx = newIdx;
    var wrap = document.getElementById('tiktok-video-wrap');
    var from = direction > 0 ? '100%' : '-100%';
    wrap.style.transition = 'none';
    wrap.style.transform = 'translateY(' + from + ')';

    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            wrap.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1)';
            wrap.style.transform = 'translateY(0)';
        });
    });

    loadTikTokVideo();
}
