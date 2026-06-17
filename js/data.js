/* ============================================
   DORAMA BRASIL - Catalogo de Videos
   ============================================ */

const CATALOG = [
    { id: 'Esx2H_KDkGM' },
    { id: 'i4iX-zfyRVE' },
    { id: 'SYzkLNyAPgo' },
    { id: 'd9uAqx5beNU' },
    { id: 'DrSWwJeXPM4' },
    { id: 'iv37_cepkoE' },
    { id: '4KY6ZqaXQTk' },
    { id: '2YOLniJtTUE' },
    { id: 'hBxgMRU0rgk' },
    { id: '2MMqhyTjKVo' },
    { id: 'RVpCYxhnSdQ' },
    { id: '55VwezlzMFY' },
    { id: 'i_vfRx7RZYk' },
    { id: '_XfOoTJZb3I' },
    { id: '8mh2UqGywCw' },
    { id: '9c_hIoBO26I' },
    { id: 'ch4ypmpI2Rc' },
    { id: 't1g9j44WCb4' },
    { id: 'NfCXmMuVMY4' },
    { id: 'vZxmv4jDdi4' },
    { id: 'rT1O8P8Ru0U' },
    { id: 'E1LTggMI4l0' },
    { id: 'iAdltyjChqA' },
    { id: 'q2Ybp21Eing' },
    { id: 'nc7wmEgghCs' }
];

const SECTIONS = {
    featured: [0, 1, 2, 3, 4, 5, 6, 7],
    mostWatched: [8, 9, 10, 11, 12, 13, 14, 15, 16]
};

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
    var cached = localStorage.getItem('dorama_catalog');
    if (cached) {
        try {
            var parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
                return parsed.data;
            }
        } catch (e) { /* ignore bad cache */ }
    }

    var promises = CATALOG.map(function (video) {
        return fetchVideoInfo(video.id).then(function (info) {
            return {
                id: video.id,
                title: info.title,
                channel: info.channel,
                thumbnail: getThumbnail(video.id),
                maxThumbnail: getMaxThumbnail(video.id)
            };
        });
    });

    var data = await Promise.all(promises);

    localStorage.setItem('dorama_catalog', JSON.stringify({
        data: data,
        timestamp: Date.now()
    }));

    return data;
}
