/* ============================================
   DORAMA BRASIL - App Principal
   ============================================ */

var videos = [];
var modalEl, playerIframe;
var currentFilter = 'all';

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

    document.getElementById('loading').classList.add('hidden');
}

/* ---------- Hero ---------- */
function renderHero() {
    var idx = Math.floor(Math.random() * Math.min(20, videos.length));
    var video = videos[idx];
    document.getElementById('hero-bg').style.backgroundImage = 'url(' + video.maxThumbnail + ')';
    document.getElementById('hero-title').textContent = video.title;
    document.getElementById('hero-channel').textContent = video.channel;
    document.getElementById('hero-btn').onclick = function () { openPlayer(idx); };
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
