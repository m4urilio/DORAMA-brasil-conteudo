/* ============================================
   DORAMA BRASIL - App Principal
   ============================================ */

var videos = [];
var modalEl, playerIframe;

document.addEventListener('DOMContentLoaded', init);

async function init() {
    modalEl = document.getElementById('modal');
    playerIframe = document.getElementById('player-iframe');

    videos = await loadCatalog();

    renderHero();
    renderCarousel('featured-carousel', SECTIONS.featured);
    renderCarousel('popular-carousel', SECTIONS.mostWatched);
    renderGrid();
    setupSearch();
    setupCarouselButtons();
    setupModal();
    setupMobileMenu();
    setupHeaderScroll();

    document.getElementById('loading').classList.add('hidden');
}

/* ---------- Hero ---------- */
function renderHero() {
    var video = videos[0];
    document.getElementById('hero-bg').style.backgroundImage = 'url(' + video.maxThumbnail + ')';
    document.getElementById('hero-title').textContent = video.title;
    document.getElementById('hero-channel').textContent = video.channel;
    document.getElementById('hero-btn').onclick = function () { openPlayer(0); };
}

/* ---------- Cards ---------- */
function createCard(index) {
    var video = videos[index];
    var card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-index', index);

    card.innerHTML =
        '<div class="card-thumb">' +
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

/* ---------- Carousels ---------- */
function renderCarousel(containerId, indices) {
    var container = document.getElementById(containerId);
    var fragment = document.createDocumentFragment();
    indices.forEach(function (i) { fragment.appendChild(createCard(i)); });
    container.appendChild(fragment);
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

/* ---------- Grid ---------- */
function renderGrid() {
    var grid = document.getElementById('all-grid');
    var fragment = document.createDocumentFragment();
    videos.forEach(function (_, i) { fragment.appendChild(createCard(i)); });
    grid.appendChild(fragment);
}

/* ---------- Player Modal ---------- */
function openPlayer(index) {
    var video = videos[index];
    playerIframe.src = 'https://www.youtube.com/embed/' + video.id + '?autoplay=1&rel=0&controls=0&modestbranding=1&showinfo=0&iv_load_policy=3&disablekb=1';
    document.getElementById('modal-title').textContent = video.title;
    document.getElementById('modal-channel').textContent = video.channel;

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

    var indices = [];
    for (var i = 0; i < videos.length; i++) {
        if (i !== currentIndex) indices.push(i);
    }
    // Shuffle and pick 6
    for (var j = indices.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var tmp = indices[j]; indices[j] = indices[k]; indices[k] = tmp;
    }
    indices = indices.slice(0, 6);

    var fragment = document.createDocumentFragment();
    indices.forEach(function (i) {
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
            if (v.title.toLowerCase().indexOf(query) !== -1) {
                matches.push({ video: v, index: i });
            }
        });

        resultsEl.innerHTML = '';

        if (matches.length === 0) {
            resultsEl.innerHTML = '<div class="search-empty">Nenhum dorama encontrado</div>';
        } else {
            matches.forEach(function (m) {
                var item = document.createElement('div');
                item.className = 'search-item';
                item.innerHTML =
                    '<img src="' + m.video.thumbnail + '" alt="">' +
                    '<div><h4>' + escapeHtml(m.video.title) + '</h4>' +
                    '<p>' + escapeHtml(m.video.channel) + '</p></div>';
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
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
        var current = window.scrollY;
        if (current > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = current;
    });
}
