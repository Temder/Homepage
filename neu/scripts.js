// Local Storage

if (localStorage.getItem('radios')) {
    var radios = JSON.parse(localStorage.getItem('radios'));
    console.log(radios);
    /*{
        'https://static.radiodresden.de/cms/data/slp/Webradio/Radio_Dresden/radio-dresden.svg': 'https://edge12.radio.radiodresden.de/radiodresden-live/stream/mp3?aggregator=radioplayer&=&&___cb=148297866039774',
        'https://tse1.mm.bing.net/th?id=OIP.KVje53CP4WaY-QYELtFG6wHaHa&pid=Api': 'https://mdr-284320-0.sslcast.mdr.de/mdr/284320/0/mp3/high/stream.mp3',
        'https://i1.sndcdn.com/artworks-ym6rnHoPcSVPPyMA-Gkyisg-t500x500.jpg': 'http://streams.radiopsr.de/psr-live/mp3-192/mediaplayer'  //https://upload.radiopsr.de/production/static/1710348534675/36ac373e59412227091fb612f51fed11.svg
    }*/
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
var i = 0;

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

function addRadio() {
    let img = document.querySelector('#radio-img').value;
    let src = document.querySelector('#radio-src').value;
    document.querySelector('#radio-img').value = document.querySelector('#radio-src').value = '';
    let rad = {[img]: src};
    console.log(rad);
    radio(rad);
    localStorage.setItem('radios', JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('radios')), rad)));
}

function radio(r) {
    Object.entries(r).forEach(([img, src]) => {
        let clone = radio_template.content.cloneNode(true);
        var a = clone.querySelector('a');
        var audio = clone.querySelector('a > audio');
        a.id = `radio${i}`;
        a.setAttribute("onclick", `play(audio${i})`);
        audio.id = `audio${i}`;
        audio.src = src;
        document.styleSheets[0].insertRule(`#radio${i}:before{background: url(${img}) no-repeat center;background-size: contain;}`, document.styleSheets[0].cssRules.length - 5);
        document.styleSheets[0].insertRule(`#radio${i}:hover:before{background-color: var(--color-radio-hover-1);background-blend-mode: saturation;}`, document.styleSheets[0].cssRules.length - 5);
        document.getElementById('radio-container').appendChild(clone);
        i++;
    })
}