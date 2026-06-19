/* ============================================
   DORAMA BRASIL - Catalogo de Videos
   ============================================ */

var CATEGORIES = [
    { id: 'romance', name: 'Romance', icon: '\uD83C\uDF38' },
    { id: 'comedia', name: 'Com\u00e9dia Rom\u00e2ntica', icon: '\uD83D\uDE02' },
    { id: 'drama', name: 'Drama', icon: '\uD83C\uDFAD' },
    { id: 'acao', name: 'A\u00e7\u00e3o & Suspense', icon: '\uD83D\uDD25' },
    { id: 'fantasia', name: 'Fantasia', icon: '\u2728' },
    { id: 'historico', name: 'Hist\u00f3rico', icon: '\uD83C\uDFEF' }
];

var CATALOG = [
    /* ---- Romance (19) ---- */
    { id: 'Esx2H_KDkGM', cat: 'romance' },
    { id: 'i4iX-zfyRVE', cat: 'romance' },
    { id: 'SYzkLNyAPgo', cat: 'romance' },
    { id: 'd9uAqx5beNU', cat: 'romance' },
    { id: 'DrSWwJeXPM4', cat: 'romance' },
    { id: 'iv37_cepkoE', cat: 'romance' },
    { id: '4KY6ZqaXQTk', cat: 'romance' },
    { id: '2YOLniJtTUE', cat: 'romance' },
    { id: 'hBxgMRU0rgk', cat: 'romance' },
    { id: '2MMqhyTjKVo', cat: 'romance' },
    { id: 'RVpCYxhnSdQ', cat: 'romance' },
    { id: '55VwezlzMFY', cat: 'romance' },
    { id: 'i_vfRx7RZYk', cat: 'romance' },
    { id: '_XfOoTJZb3I', cat: 'romance' },
    { id: '8mh2UqGywCw', cat: 'romance' },
    { id: '9c_hIoBO26I', cat: 'romance' },
    { id: 'ch4ypmpI2Rc', cat: 'romance' },
    { id: 't1g9j44WCb4', cat: 'romance' },
    { id: 'NfCXmMuVMY4', cat: 'romance' },

    /* ---- Com\u00e9dia Rom\u00e2ntica (19) ---- */
    { id: 'vZxmv4jDdi4', cat: 'comedia' },
    { id: 'rT1O8P8Ru0U', cat: 'comedia' },
    { id: 'E1LTggMI4l0', cat: 'comedia' },
    { id: 'iAdltyjChqA', cat: 'comedia' },
    { id: 'q2Ybp21Eing', cat: 'comedia' },
    { id: 'nc7wmEgghCs', cat: 'comedia' },
    { id: 'nZnWnGOcDZY', cat: 'comedia' },
    { id: 'v9wU2JRoewM', cat: 'comedia' },
    { id: 'MhspJaLxwe4', cat: 'comedia' },
    { id: 'bthk1OhddGc', cat: 'comedia' },
    { id: '1RNv2w2_zvA', cat: 'comedia' },
    { id: '1kT9EIsAras', cat: 'comedia' },
    { id: 'mg-c_c9thu8', cat: 'comedia' },
    { id: 'tBkBV_lwKGQ', cat: 'comedia' },
    { id: '4VnF_bC3twE', cat: 'comedia' },
    { id: '7vV6La6neTE', cat: 'comedia' },
    { id: 'ZjXd16i4qGY', cat: 'comedia' },
    { id: 'Gq7cJ_jP_3o', cat: 'comedia' },

    /* ---- Drama (19) ---- */
    { id: 'wfr33Oc2VsY', cat: 'drama' },
    { id: '88zQ2m3iN_0', cat: 'drama' },
    { id: 'FTsieSFGxNw', cat: 'drama' },
    { id: '7aXwdeEvntI', cat: 'drama' },
    { id: 'CfQ0Um-bd_I', cat: 'drama' },
    { id: 'pgOVSnieK4I', cat: 'drama' },
    { id: 'nbsUjQtY05g', cat: 'drama' },
    { id: 'jxJl7zZ9T5E', cat: 'drama' },
    { id: 'dNqb93A7fJQ', cat: 'drama' },
    { id: '8UGSqDuOb4w', cat: 'drama' },
    { id: 'Qf-EFugruaU', cat: 'drama' },
    { id: 'iHdaKr777W4', cat: 'drama' },
    { id: 'lRaXEcBR7uQ', cat: 'drama' },
    { id: 'PowS8vWMhlc', cat: 'drama' },
    { id: 'ReuLp89S3Do', cat: 'drama' },
    { id: 'BHWT42AytOQ', cat: 'drama' },
    { id: 'Gp7m5E6dK0U', cat: 'drama' },
    { id: '_YR2ZtM0dAk', cat: 'drama' },
    { id: '-czGFY_yJBg', cat: 'drama' },

    /* ---- A\u00e7\u00e3o & Suspense (19) ---- */
    { id: '30I8JTPl7So', cat: 'acao' },
    { id: 'qTi8jZRhizA', cat: 'acao' },
    { id: 'WnHpHQKRZCs', cat: 'acao' },
    { id: '2NYpjPOGzVA', cat: 'acao' },
    { id: '4vvuWX-F3bo', cat: 'acao' },
    { id: 'u5Bb8cVrvHk', cat: 'acao' },
    { id: 'Rb1WHnzOVOY', cat: 'acao' },
    { id: 'o7xEr36j8qQ', cat: 'acao' },
    { id: '0Z8ZsFIiOzc', cat: 'acao' },
    { id: 'zk299HzFvN8', cat: 'acao' },
    { id: 'Kckem6OOO1w', cat: 'acao' },
    { id: 'wO1E9vz0zmw', cat: 'acao' },
    { id: 'oz8LI_wg-Jo', cat: 'acao' },
    { id: '6E65ADV3-_k', cat: 'acao' },
    { id: 'lT25lnrhkTg', cat: 'acao' },
    { id: '6p22a14oj_0', cat: 'acao' },
    { id: 'MbRy7mdlgLM', cat: 'acao' },
    { id: 's3apM2h3zRg', cat: 'acao' },
    { id: 'h-7KkJq38lg', cat: 'acao' },

    /* ---- Fantasia (20) ---- */
    { id: '6c1KKkt4ZfI', cat: 'fantasia' },
    { id: 'RhlVtWnPlq0', cat: 'fantasia' },
    { id: 'J5pGxMzkIB4', cat: 'fantasia' },
    { id: 'bcm-L3tGltM', cat: 'fantasia' },
    { id: 'F5mKlnQI65E', cat: 'fantasia' },
    { id: 'DwXZyZl5IyI', cat: 'fantasia' },
    { id: 'UzzZOBsUtZk', cat: 'fantasia' },
    { id: 'xtdIBakm5MI', cat: 'fantasia' },
    { id: 'fDPeTgaN9H0', cat: 'fantasia' },
    { id: '9GQ-lz3F_KA', cat: 'fantasia' },
    { id: 'svo-utZfiao', cat: 'fantasia' },
    { id: 'btwFNQrY72Q', cat: 'fantasia' },
    { id: '2V3xJKoPBpw', cat: 'fantasia' },
    { id: 'VSykQUSE_M8', cat: 'fantasia' },
    { id: 'JBlfJTRYz3A', cat: 'fantasia' },
    { id: 'LZoWw3PXdv8', cat: 'fantasia' },
    { id: 'i2H53zv8-oo', cat: 'fantasia' },
    { id: 'xJuOXfyy9tc', cat: 'fantasia' },
    { id: 'oAd_Df8AGgE', cat: 'fantasia' },
    { id: 'bmELjdZfa8w', cat: 'fantasia' },

    /* ---- Hist\u00f3rico (19) ---- */
    { id: '2IkQERymL0U', cat: 'historico' },
    { id: '-8hwU9CdDhI', cat: 'historico' },
    { id: '4Tif_qTDnmk', cat: 'historico' },
    { id: '5HE76aE6uqo', cat: 'historico' },
    { id: 'yCvjhAmwQA8', cat: 'historico' },
    { id: '4b5eF1bSaBA', cat: 'historico' },
    { id: 'HrY2Hg--00w', cat: 'historico' },
    { id: 'Gp2d6NGAbM0', cat: 'historico' },
    { id: 'ZfMOZMUkQJQ', cat: 'historico' },
    { id: 'mjTj780WAnM', cat: 'historico' },
    { id: 'VUb9Uu_4ziE', cat: 'historico' },
    { id: 'CQ31NZCJm04', cat: 'historico' },
    { id: '8wlLJYeeGaM', cat: 'historico' },
    { id: 'iwTRUdYJKiA', cat: 'historico' },
    { id: 'Q4RkSMDKXTQ', cat: 'historico' },
    { id: '-NIyVS2x3qk', cat: 'historico' },
    { id: '4Ib9YO7mKVY', cat: 'historico' },
    { id: '-RLpEwTSYuI', cat: 'historico' },
    { id: '5NYpswU1fxE', cat: 'historico' }
];

function getCategoryInfo(catId) {
    for (var i = 0; i < CATEGORIES.length; i++) {
        if (CATEGORIES[i].id === catId) return CATEGORIES[i];
    }
    return { id: catId, name: catId, icon: '' };
}

function getThumbnail(id) {
    return 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
}

function getMaxThumbnail(id) {
    return 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg';
}

async function fetchVideoInfo(id) {
    try {
        var res = await fetch('https://noembed.com/embed?url=https://www.youtube.com/watch?v=' + id);
        var data = await res.json();
        return {
            title: data.title || 'Dorama',
            channel: data.author_name || ''
        };
    } catch (e) {
        return { title: 'Dorama', channel: '' };
    }
}

async function loadCatalog() {
    var cacheKey = 'dorama_catalog_v4';
    var cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            var parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
                return parsed.data;
            }
        } catch (e) { /* ignore bad cache */ }
    }

    var promises = CATALOG.map(function (video) {
        return fetchVideoInfo(video.id).then(function (info) {
            return {
                id: video.id,
                cat: video.cat,
                title: info.title,
                channel: info.channel,
                thumbnail: getThumbnail(video.id),
                maxThumbnail: getMaxThumbnail(video.id)
            };
        });
    });

    var data = await Promise.all(promises);

    localStorage.setItem(cacheKey, JSON.stringify({
        data: data,
        timestamp: Date.now()
    }));

    return data;
}
