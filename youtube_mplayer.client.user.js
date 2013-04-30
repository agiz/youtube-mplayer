// ==UserScript==
// @name           mplayer for youtube
// @description    Chrome extension that plays youtube videos with mplayer.
// @author         Ziga Zupanec, agiz@github
// @include        http://www.youtube.com/watch?*
// @include        https://www.youtube.com/watch?*
// @version        1.0
// ==/UserScript==

function dumbDecode(s) {
    s = s.replace(/%21/g, '!');
    s = s.replace(/%22/g, '"');
    s = s.replace(/%2A/g, '*');
    s = s.replace(/%27/g, '\'');
    s = s.replace(/%28/g, '(');
    s = s.replace(/%29/g, ')');
    s = s.replace(/%3B/g, ';');
    s = s.replace(/%3A/g, ':');
    s = s.replace(/%40/g, '@');
    s = s.replace(/%26/g, '&');
    s = s.replace(/%3D/g, '=');
    s = s.replace(/%2B/g, '+');
    s = s.replace(/%24/g, '$');
    s = s.replace(/%2C/g, ',');
    s = s.replace(/%2F/g, '/');
    s = s.replace(/%3F/g, '?');
    s = s.replace(/%25/g, '%');
    s = s.replace(/%23/g, '#');
    s = s.replace(/%5B/g, '[');
    s = s.replace(/%5D/g, ']');
    return s;
}

function notify_server() {
    // itag values, order matters:
    var mp4_1080 = 37;
    var webm_1080 = 46;
    var mp4_720 = 22;
    var webm_720 = 45;
    var large = 44;
    var medium = 18;

    var trigger_url = 'http://127.0.0.1:9000/p?i=';

    var streams = ytplayer.config.args.url_encoded_fmt_stream_map.split(',');
    var a = [];
    for (var i in streams) {
        var s = streams[i].match(/itag=(\d+)/i);
        a[s[1]] = streams[i];
    }
    var best = a[mp4_1080] || a[webm_1080] || a[mp4_720] || a[webm_720] || a[large] || a[medium];
    best = dumbDecode(best);
    best = best.split('&');
    a = [];
    var b;
    best.map(function (x) { b = x.split('='), a[b[0]] = x });
    var aurl = a['url'].split('?');
    a['url'] = aurl[0].replace(/^url=/, '');
    b = aurl[1].split('=');
    a[b[0]] = aurl[1];
    a['sig'] = a['sig'].replace(/^sig=/, 'signature=');
    var u = a['url'] + '?' + [a['cp'], a['expire'], a['id'], a['ip'], a['ipbits'], a['itag'], a['key'], a['ratebypass'], a['sig'], a['source'], a['sparams'], a['upn']].join('&');
    document.body.innerHTML += '<img style="display:none" src="' + trigger_url + u + '" />';
}

var script = document.createElement('script');
script.textContent = dumbDecode.toString();
script.textContent += '(' + notify_server.toString() + '())';

window.addEventListener('load', function load(event) {
    window.removeEventListener('load', load, false);
    document.body.appendChild(script);
}, false);
