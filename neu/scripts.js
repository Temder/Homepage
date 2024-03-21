// Local Storage

if (localStorage.getItem('radios')) {
    var radios = JSON.parse(localStorage.getItem('radios'));
    console.log(radios);
    /*{
        'https://static.radiodresden.de/cms/data/slp/Webradio/Radio_Dresden/radio-dresden.svg': 'https://edge12.radio.radiodresden.de/radiodresden-live/stream/mp3?aggregator=radioplayer&=&&___cb=148297866039774',
        'https://tse1.mm.bing.net/th?id=OIP.KVje53CP4WaY-QYELtFG6wHaHa&pid=Api': 'https://mdr-284320-0.sslcast.mdr.de/mdr/284320/0/mp3/high/stream.mp3',
        'https://i1.sndcdn.com/artworks-ym6rnHoPcSVPPyMA-Gkyisg-t500x500.jpg': 'http://streams.radiopsr.de/psr-live/mp3-192/mediaplayer'
    }*/// https://tse3.mm.bing.net/th?id=OIP.Sy64rn8wA7AMk6KvmTm-sQHaHa&pid=Api
} else {
    localStorage.setItem('radios', JSON.stringify({}))
    var radios = {};
}


// Ajax content changing

function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('main').innerHTML = this.responseText;
            if(document.getElementById('radio-container') != null) {
                radio(radios);
            }
        }
    };
    xhttp.open('GET', `subsites/${page}`, true);
    xhttp.send();
}
window.addEventListener('popstate', function(event) {
    radio_id = 0;
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

style = document.styleSheets[0].cssRules[0].style;
const cssVariables = {};
for (let i = 1; i < style.length; i=i+2) {
  cssVariables[style[i-1]] = style[i];
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

const radio_template = document.getElementById('radio-template');
const audio = document.querySelector('#audio-player');
var radio_id = 0;

function play(radio, src) {
    if (!audio.paused && radio.id.replace('radio', '') == audio.getAttribute('data-playing-station')) {
        radio.classList.remove('radio-active');
        audio.pause();
        console.log(`pausing audio with station ${radio.id} and URL ${audio.src}`);
    } else {
        audio.src = src;
        audio.setAttribute('data-playing-station', radio.id.replace('radio', ''));
        document.querySelector('#radio-container').querySelectorAll('div > a:nth-child(1)').forEach(a => {
            a.classList.remove('radio-active');
        })
        radio.classList.add('radio-active');

        url = audio.src.split('?')[0];
        var e1 = url + '?' + new Date().getTime();
        audio.src = e1;

        audio.play();
        console.log(`playing audio with station ${radio.id} and URL ${audio.src}`);
    }
}

function remove(radio) {
    let img_url = window.getComputedStyle(radio, false).backgroundImage.slice(4, -1).replace(/"/g, "");
    delete radios[img_url]
    localStorage.setItem('radios', JSON.stringify(radios));
    radio.parentNode.parentNode.removeChild(radio.parentNode);
}

function addRadio() {
    let img = document.querySelector('#radio-img').value;
    let src = document.querySelector('#radio-src').value;
    if (img != '' && src != '') {
        document.querySelector('#radio-img').value = document.querySelector('#radio-src').value = '';
        let rad = {[img]: src};
        radio(rad);
        console.log(`Added ${rad} to local storage`);
        localStorage.setItem('radios', JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('radios')), rad)));
    }
}

function radio(r) {
    Object.entries(r).forEach(([img, src]) => {
        let clone = radio_template.content.cloneNode(true);
        var link = clone.querySelector('div > a:nth-child(1)');
        var del = clone.querySelector('div > a:nth-child(2)');
        link.id = `radio${radio_id}`;
        link.classList.add('radio-link');
        link.setAttribute("onclick", `play(${link.id}, "${src}")`);
        del.classList.add('radio-del');
        del.setAttribute("onclick", `remove(radio${radio_id})`);
        document.styleSheets[0].insertRule(`#radio${radio_id}{background-image: url(${img});background-size: contain;}`, document.styleSheets[0].cssRules.length - 5);
        /*document.styleSheets[0].insertRule(`#radio${radio_id}:hover{background-color: var(--color-radio-hover-1);background-blend-mode: saturation;}`, document.styleSheets[0].cssRules.length - 5);*/
        document.getElementById('radio-container').appendChild(clone);
        radio_id++;
    })
}