// Ajax content changing

function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('main').innerHTML = this.responseText;
            if(document.getElementById('radio-container') != null) {
                var i = 0;
                Object.entries(radios).forEach(([img, src]) => {
                    let clone = radio_template.content.cloneNode(true);
                    var a = clone.querySelector('a');
                    var audio = clone.querySelector('a > audio')
                    a.id = `radio${i}`
                    a.setAttribute("onclick", `play(audio${i})`);
                    audio.id = `audio${i}`;
                    audio.src = src;
                    document.styleSheets[0].insertRule(`#radio${i}:before{background: url(${img}) no-repeat center;background-size: contain;}`, document.styleSheets[0].cssRules.length - 5)
                    document.styleSheets[0].insertRule(`#radio${i}:hover:before{background-color: var(--color-radio-hover-1);background-blend-mode: saturation;}`, document.styleSheets[0].cssRules.length - 5)
                    document.getElementById('radio-container').appendChild(clone);
                    i++;
                })
            }
        }
    };
    xhttp.open('GET', `subsites/${page}`, true);
    xhttp.send();
}
window.addEventListener('popstate', function(event) {
    loadPage(document.location.hash.replace('#', '') + '.html');
    document.querySelectorAll('nav > a').forEach(el => {
        el.classList.remove('active');
        if (document.location.hash == el.getAttribute('href')) {
            el.classList.add('active');
        }
    })
})
loadPage('home.html');
document.location.hash = 'home';


// Theme switcher

const cssVariables = {
    '--color-header-bg-1': '--color-header-bg-2',
    '--color-header-bg-hover-1': '--color-header-bg-hover-2',
    '--color-main-bg': '--color-main-fg',
    '--color-radio-hover-1': '--color-radio-hover-2',
    '--display-sun': '--display-moon'
}
document.querySelectorAll('.changeTheme').forEach(el => {
    el.addEventListener('click', function() {
        Object.entries(cssVariables).forEach(([key, val]) => {
            var var1 = getComputedStyle(document.documentElement).getPropertyValue(key)
            var var2 = getComputedStyle(document.documentElement).getPropertyValue(val)
            document.documentElement.style.setProperty(key, var2);
            document.documentElement.style.setProperty(val, var1);
        })
    })
})


// SVG wave

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
var randDir = getRandom(200, 300);
var rand = getRandom(-1, 0.5);
var randColorChange = getRandom(9, 15);
var randHeightChange = getRandom(20, 45);
for (let i = 0; i < 5; i++) {
    var curve = `M0 400
                 v${-100 - i * randHeightChange}
                 c50 ${randDir}, 350 ${(100 - i * randHeightChange * 0.75) + randDir * rand}, 400 ${100 - i * randHeightChange * 0.75}
                 L400 400`;
    var svg = `<path d="${curve}" stroke-width="0" fill="hsl(204, 100%, ${30 + i * randColorChange}%)">
               <animate attributeName="d" values="${curve};
               M0 400
               v${-105 - i * randHeightChange}
               c250 ${randDir + 100}, 150 ${100 - i * randHeightChange * 0.75 + (randDir - 100) * rand}, 400 ${100 - i * randHeightChange * 0.75}
               L400 400;
               ${curve}" dur="5s" repeatCount="indefinite"/></path>`;
    document.getElementById('wave').insertAdjacentHTML('afterbegin', svg);
}


// Radio

const radios = {
    'https://static.radiodresden.de/cms/data/slp/Webradio/Radio_Dresden/radio-dresden.svg': 'https://edge12.radio.radiodresden.de/radiodresden-live/stream/mp3?aggregator=radioplayer&=&&___cb=148297866039774',
    'https://tse1.mm.bing.net/th?id=OIP.KVje53CP4WaY-QYELtFG6wHaHa&pid=Api': 'https://mdr-284320-0.sslcast.mdr.de/mdr/284320/0/mp3/high/stream.mp3'
}
const radio_template = document.getElementById('radio-template');

function play(e) {
    if (e.paused) {
        url = e.src.split('?')[0];
        var e1 = url + '?' + new Date().getTime();
        e.src = e1;

        e.play();

        e.parentNode.classList.add('radio-active');
    } else {
        e.parentNode.classList.remove('radio-active');
        e.pause();
    }
}