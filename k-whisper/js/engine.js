/* ============================================
   K-WHISPER — Engine (State Machine + Renderer)
   ============================================ */

var KWhisper = (function () {
    'use strict';

    /* ---- State ---- */
    var state = {
        nodeId: null,
        interactions: 0,
        history: [],
        locked: false,
        storyData: null,
        avatarData: null,
        paywallCfg: null,
        pushTimers: [],
        isOpen: false,
        affinity: 0,
        maxAffinity: 30,
        paywallPending: false
    };

    /* ---- DOM refs ---- */
    var dom = {};

    /* ---- Callbacks ---- */
    var cb = {
        onRequestPause: null,
        onRequestResume: null,
        onPaywallShow: null,
        onChatOpen: null,
        onChatClose: null
    };

    /* ---- Audio ---- */
    var receiveSound = null;
    var sendSound = null;

    /* ========== Helpers ========== */

    function parseActions(text) {
        return text.replace(/\*([^*]+)\*/g, '<em class="kw-action">$1</em>');
    }

    function scrollChat() {
        if (dom.chat) dom.chat.scrollTop = dom.chat.scrollHeight;
    }

    function escapeId(storyId) {
        return 'kw_state_' + (storyId || '').replace(/[^a-z0-9_-]/gi, '_');
    }

    /* ========== Persistence ========== */

    function saveState() {
        try {
            localStorage.setItem(escapeId(state.storyData.story_id), JSON.stringify({
                nodeId: state.nodeId,
                interactions: state.interactions,
                history: state.history,
                locked: state.locked,
                affinity: state.affinity,
                paywallPending: state.paywallPending
            }));
        } catch (e) { /* silent */ }
    }

    function loadSavedState(storyId) {
        try {
            var s = localStorage.getItem(escapeId(storyId));
            return s ? JSON.parse(s) : null;
        } catch (e) { return null; }
    }

    function clearSavedState(storyId) {
        try { localStorage.removeItem(escapeId(storyId)); } catch (e) { /* */ }
    }

    /* ========== Audio ========== */

    function initSounds() {
        try {
            receiveSound = new Audio('k-whisper/audio/receive.mp3');
            sendSound = new Audio('k-whisper/audio/send.mp3');
            receiveSound.volume = 0.5;
            sendSound.volume = 0.5;
        } catch (e) { /* silent — arquivos nao encontrados */ }
    }

    function playReceiveSound() {
        if (!receiveSound) return;
        receiveSound.currentTime = 0;
        receiveSound.play().catch(function () {});
    }

    function playSendSound() {
        if (!sendSound) return;
        sendSound.currentTime = 0;
        sendSound.play().catch(function () {});
    }

    /* ========== Affinity Bar ========== */

    function updateAffinityBar(impact) {
        state.affinity = Math.max(0, Math.min(state.maxAffinity, state.affinity + impact));
        syncAffinityDOM();

        if (impact > 0 && dom.affinityFill) {
            dom.affinityFill.classList.add('kw-affinity-glow');
            setTimeout(function () {
                dom.affinityFill.classList.remove('kw-affinity-glow');
            }, 700);
        }
    }

    function syncAffinityDOM() {
        if (!dom.affinityFill) return;
        var pct = Math.min(100, (state.affinity / state.maxAffinity) * 100);
        dom.affinityFill.style.width = pct + '%';
    }

    /* ========== DOM Build ========== */

    function buildDOM(containerEl) {
        containerEl.innerHTML = '';
        containerEl.classList.add('kw-container');

        containerEl.innerHTML =
            /* Header */
            '<div class="kw-header">' +
                '<button class="kw-back" id="kw-back" aria-label="Voltar">' +
                    '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                '</button>' +
                '<div class="kw-header-avatar-wrap">' +
                    '<img class="kw-header-avatar" id="kw-h-avatar" src="" alt="">' +
                    '<span class="kw-online-dot"></span>' +
                '</div>' +
                '<div class="kw-header-info">' +
                    '<span class="kw-header-name" id="kw-h-name"></span>' +
                    '<span class="kw-header-status" id="kw-h-status"></span>' +
                '</div>' +
            '</div>' +
            /* Affinity Bar */
            '<div class="kw-affinity">' +
                '<div class="kw-affinity-row">' +
                    '<span class="kw-affinity-label">' +
                        '<svg class="kw-affinity-icon" viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' +
                        ' Afinidade' +
                    '</span>' +
                    '<span class="kw-affinity-value" id="kw-affinity-value">0</span>' +
                '</div>' +
                '<div class="kw-affinity-track">' +
                    '<div class="kw-affinity-fill" id="kw-affinity-fill"></div>' +
                '</div>' +
            '</div>' +
            /* Chat */
            '<div class="kw-chat" id="kw-chat"></div>' +
            /* Choices */
            '<div class="kw-choices" id="kw-choices"></div>' +
            /* Paywall (Zeigarnik) */
            '<div class="kw-paywall" id="kw-paywall">' +
                '<div class="kw-paywall-box">' +
                    '<div class="kw-paywall-lock">' +
                        '<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>' +
                    '</div>' +
                    '<h3 id="kw-pw-headline"></h3>' +
                    '<p id="kw-pw-subtext"></p>' +
                    '<a class="kw-paywall-cta" id="kw-pw-cta" href="#">' +
                        '<span id="kw-pw-cta-text"></span>' +
                    '</a>' +
                    '<span class="kw-paywall-price" id="kw-pw-price"></span>' +
                '</div>' +
            '</div>';

        dom.container = containerEl;
        dom.chat = containerEl.querySelector('#kw-chat');
        dom.choices = containerEl.querySelector('#kw-choices');
        dom.paywall = containerEl.querySelector('#kw-paywall');
        dom.hAvatar = containerEl.querySelector('#kw-h-avatar');
        dom.hName = containerEl.querySelector('#kw-h-name');
        dom.hStatus = containerEl.querySelector('#kw-h-status');
        dom.affinityFill = containerEl.querySelector('#kw-affinity-fill');
        dom.affinityValue = containerEl.querySelector('#kw-affinity-value');
        dom.pwHeadline = containerEl.querySelector('#kw-pw-headline');
        dom.pwSubtext = containerEl.querySelector('#kw-pw-subtext');
        dom.pwCta = containerEl.querySelector('#kw-pw-cta');
        dom.pwCtaText = containerEl.querySelector('#kw-pw-cta-text');
        dom.pwPrice = containerEl.querySelector('#kw-pw-price');

        containerEl.querySelector('#kw-back').addEventListener('click', closeChat);
    }

    /* ========== Notification Toast ========== */

    function ensureNotifEl() {
        if (document.getElementById('kw-notification')) {
            dom.notif = document.getElementById('kw-notification');
            return;
        }
        var el = document.createElement('div');
        el.className = 'kw-notification';
        el.id = 'kw-notification';
        el.innerHTML =
            '<div class="kw-notif-inner">' +
                '<img class="kw-notif-avatar" id="kw-n-avatar" src="" alt="">' +
                '<div class="kw-notif-body">' +
                    '<span class="kw-notif-app">K-Whisper</span>' +
                    '<span class="kw-notif-name" id="kw-n-name"></span>' +
                    '<p class="kw-notif-text" id="kw-n-text"></p>' +
                '</div>' +
            '</div>';
        document.body.appendChild(el);
        dom.notif = el;
    }

    function showNotification(pushCfg) {
        ensureNotifEl();
        var avatar = KW_AVATARS[pushCfg.avatar_id];
        if (!avatar) return;

        dom.notif.querySelector('#kw-n-avatar').src = avatar.avatar_img;
        dom.notif.querySelector('#kw-n-name').textContent = avatar.name;
        dom.notif.querySelector('#kw-n-text').textContent = pushCfg.preview_text;
        dom.notif.classList.add('visible');

        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        var hideTimer = setTimeout(function () {
            dom.notif.classList.remove('visible');
        }, 8000);

        dom.notif.onclick = function () {
            clearTimeout(hideTimer);
            dom.notif.classList.remove('visible');
            openChat(pushCfg.entry_node_id);
        };
    }

    /* ========== Chat Open / Close ========== */

    function openChat(entryNodeId) {
        state.isOpen = true;
        dom.container.classList.add('open');
        if (cb.onRequestPause) cb.onRequestPause();
        if (cb.onChatOpen) cb.onChatOpen();

        var saved = loadSavedState(state.storyData.story_id);
        if (saved && saved.history.length > 0) {
            restoreFromSave(saved);
        } else {
            state.nodeId = entryNodeId;
            state.interactions = 0;
            state.history = [];
            state.locked = false;
            state.affinity = 0;
            state.paywallPending = false;
            syncAffinityDOM();
            processNode(entryNodeId);
        }
    }

    function closeChat() {
        state.isOpen = false;
        dom.container.classList.remove('open');
        if (cb.onRequestResume) cb.onRequestResume();
        if (cb.onChatClose) cb.onChatClose();
    }

    function restoreFromSave(saved) {
        state.nodeId = saved.nodeId;
        state.interactions = saved.interactions;
        state.history = saved.history;
        state.locked = saved.locked;
        state.affinity = saved.affinity || 0;
        state.paywallPending = saved.paywallPending || false;

        syncAffinityDOM();

        dom.chat.innerHTML = '';
        for (var i = 0; i < saved.history.length; i++) {
            appendMessage(saved.history[i].role, saved.history[i].text, true);
        }
        scrollChat();

        if (state.locked) {
            showPaywall();
        } else {
            var node = state.storyData.nodes[state.nodeId];
            if (node && node.choices && node.choices.length > 0) {
                renderChoices(node.choices);
            }
        }
    }

    /* ========== Node Processing (Core Loop) ========== */

    function processNode(nodeId) {
        var node = state.storyData.nodes[nodeId];
        if (!node) return;

        state.nodeId = nodeId;
        dom.choices.innerHTML = '';
        dom.choices.classList.remove('visible');

        /* 1. Mostrar "Digitando..." */
        showTyping();
        dom.hStatus.textContent = 'Digitando...';
        dom.hStatus.classList.add('typing');

        /* 2. Apos delay, exibir mensagem */
        setTimeout(function () {
            hideTyping();
            dom.hStatus.textContent = state.avatarData.status;
            dom.hStatus.classList.remove('typing');

            var parsed = parseActions(node.message_text);
            appendMessage('avatar', parsed);
            playReceiveSound();
            state.history.push({ role: 'avatar', text: parsed });
            state.interactions++;
            saveState();
            scrollChat();

            /* 3. Checar paywall (Zeigarnik: seta flag mas NAO trava) */
            var cfg = state.paywallCfg;
            if (node.is_paywall_trigger || state.interactions >= cfg.max_free_interactions) {
                state.paywallPending = true;
            }

            /* 4. Exibir choices (mesmo com paywall pendente — Zeigarnik) */
            if (node.choices && node.choices.length > 0) {
                setTimeout(function () {
                    renderChoices(node.choices);
                }, 400);
            }
        }, node.typing_delay_ms || 1500);
    }

    /* ========== Message Rendering ========== */

    function appendMessage(role, html, instant) {
        var row = document.createElement('div');
        row.className = 'kw-msg kw-msg-' + role;

        if (role === 'avatar') {
            row.innerHTML =
                '<img class="kw-msg-avatar" src="' + state.avatarData.avatar_img + '" alt="">' +
                '<div class="kw-msg-bubble">' + html + '</div>';
        } else {
            row.innerHTML = '<div class="kw-msg-bubble">' + html + '</div>';
        }

        if (!instant) row.classList.add('kw-msg-enter');
        dom.chat.appendChild(row);
        scrollChat();
    }

    function showTyping() {
        var el = document.createElement('div');
        el.className = 'kw-typing';
        el.id = 'kw-typing-indicator';
        el.innerHTML =
            '<img class="kw-msg-avatar" src="' + state.avatarData.avatar_img + '" alt="">' +
            '<div class="kw-typing-dots"><span></span><span></span><span></span></div>';
        dom.chat.appendChild(el);
        scrollChat();
    }

    function hideTyping() {
        var el = document.getElementById('kw-typing-indicator');
        if (el) el.remove();
    }

    /* ========== Choices ========== */

    function renderChoices(choices) {
        dom.choices.innerHTML = '';
        for (var i = 0; i < choices.length; i++) {
            var c = choices[i];
            var btn = document.createElement('button');
            btn.className = 'kw-choice kw-tone-' + c.tone;
            btn.textContent = c.label;
            btn.setAttribute('data-next', c.next_node_id);
            btn.setAttribute('data-affinity', String(c.affinity_impact || 0));
            btn.addEventListener('click', handleChoiceClick);
            dom.choices.appendChild(btn);
        }
        dom.choices.classList.add('visible');
        scrollChat();
    }

    function handleChoiceClick() {
        var nextId = this.getAttribute('data-next');
        var label = this.textContent;
        var impact = parseInt(this.getAttribute('data-affinity') || '0', 10);

        playSendSound();
        appendMessage('user', label);
        state.history.push({ role: 'user', text: label });
        updateAffinityBar(impact);
        saveState();

        dom.choices.innerHTML = '';
        dom.choices.classList.remove('visible');

        /* Zeigarnik: se paywall pendente, intercepta APOS o clique */
        if (state.paywallPending) {
            state.locked = true;
            state.paywallPending = false;
            saveState();
            setTimeout(function () {
                showPaywall();
                if (cb.onPaywallShow) cb.onPaywallShow();
            }, 500);
            return;
        }

        setTimeout(function () {
            processNode(nextId);
        }, 300);
    }

    /* ========== Paywall ========== */

    function showPaywall() {
        var cfg = state.paywallCfg;
        dom.pwHeadline.textContent = cfg.headline;
        dom.pwSubtext.textContent = cfg.subtext;
        dom.pwCtaText.textContent = cfg.cta_text;
        dom.pwPrice.textContent = cfg.price;
        dom.pwCta.href = cfg.checkout_url;
        dom.paywall.classList.add('visible');
    }

    /* ========== Public API ========== */

    return {

        /**
         * Inicializa o componente K-Whisper.
         * @param {Object} config
         *   container        : string (seletor CSS) ou Element
         *   onRequestPause   : function — chamada ao abrir o chat (pausar video)
         *   onRequestResume  : function — chamada ao fechar o chat (retomar video)
         *   onPaywallShow    : function — chamada ao exibir o paywall
         *   onChatOpen       : function
         *   onChatClose      : function
         */
        init: function (config) {
            var el = typeof config.container === 'string'
                ? document.querySelector(config.container)
                : config.container;

            if (!el) { console.error('[K-Whisper] Container nao encontrado.'); return; }

            cb.onRequestPause = config.onRequestPause || null;
            cb.onRequestResume = config.onRequestResume || null;
            cb.onPaywallShow = config.onPaywallShow || null;
            cb.onChatOpen = config.onChatOpen || null;
            cb.onChatClose = config.onChatClose || null;

            buildDOM(el);
            ensureNotifEl();
            initSounds();
        },

        /**
         * Carrega uma historia e configura o avatar + paywall.
         */
        loadStory: function (storyData, paywallCfg) {
            state.storyData = storyData;
            state.avatarData = KW_AVATARS[storyData.avatar_id] || null;
            state.paywallCfg = paywallCfg || KW_PAYWALL_CONFIG;
            state.maxAffinity = state.paywallCfg.max_affinity || state.paywallCfg.max_free_interactions || 30;

            if (state.avatarData) {
                dom.hAvatar.src = state.avatarData.avatar_img;
                dom.hName.textContent = state.avatarData.name;
                dom.hStatus.textContent = state.avatarData.status;

                if (state.avatarData.bg_img && dom.chat) {
                    dom.chat.style.backgroundImage = 'url(' + state.avatarData.bg_img + ')';
                }
            }
        },

        /** Agenda uma Push Notification simulada. */
        schedulePush: function (pushCfg) {
            var tid = setTimeout(function () {
                showNotification(pushCfg);
            }, pushCfg.trigger_time_s * 1000);
            state.pushTimers.push(tid);
        },

        /** Dispara a notificacao imediatamente (para testes). */
        triggerPushNow: function (pushCfg) {
            showNotification(pushCfg);
        },

        /** Abre o chat diretamente (sem notificacao). */
        open: function (entryNodeId) {
            var firstNode = entryNodeId || Object.keys(state.storyData.nodes)[0];
            openChat(firstNode);
        },

        /** Fecha o chat. */
        close: function () {
            closeChat();
        },

        /** Reseta todo o estado e historico. */
        reset: function () {
            if (state.storyData) clearSavedState(state.storyData.story_id);
            state.nodeId = null;
            state.interactions = 0;
            state.history = [];
            state.locked = false;
            state.affinity = 0;
            state.paywallPending = false;
            if (dom.chat) dom.chat.innerHTML = '';
            if (dom.choices) { dom.choices.innerHTML = ''; dom.choices.classList.remove('visible'); }
            if (dom.paywall) dom.paywall.classList.remove('visible');
            syncAffinityDOM();
        },

        /** Destroi o componente. */
        destroy: function () {
            state.pushTimers.forEach(clearTimeout);
            state.pushTimers = [];
            if (dom.container) dom.container.innerHTML = '';
            if (dom.notif) dom.notif.remove();
            dom = {};
            state = {
                nodeId: null, interactions: 0, history: [], locked: false,
                storyData: null, avatarData: null, paywallCfg: null,
                pushTimers: [], isOpen: false,
                affinity: 0, maxAffinity: 30, paywallPending: false
            };
            receiveSound = null;
            sendSound = null;
        },

        /** Retorna snapshot do estado atual (para debug). */
        getState: function () {
            return {
                nodeId: state.nodeId,
                interactions: state.interactions,
                locked: state.locked,
                isOpen: state.isOpen,
                historyLength: state.history.length,
                affinity: state.affinity,
                paywallPending: state.paywallPending
            };
        }
    };
})();
