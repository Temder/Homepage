// #region Local storage
if (localStorage.getItem('current_page')) {
    var current_page = localStorage.getItem('current_page');
} else {
    var current_page = 'home';
    localStorage.setItem('current_page', current_page)
}
if (localStorage.getItem('language')) {
    var userLang = localStorage.getItem('language')
} else {
    var userLang = window.navigator.userLanguage || window.navigator.language;
}
if (localStorage.getItem('radios')) {
    var radios = JSON.parse(localStorage.getItem('radios'));
    /*{
        'https://static.radiodresden.de/cms/data/slp/Webradio/Radio_Dresden/radio-dresden.svg': 'https://edge12.radio.radiodresden.de/radiodresden-live/stream/mp3?aggregator=radioplayer&=&&___cb=148297866039774',
        'https://tse1.mm.bing.net/th?id=OIP.KVje53CP4WaY-QYELtFG6wHaHa&pid=Api': 'https://mdr-284320-0.sslcast.mdr.de/mdr/284320/0/mp3/high/stream.mp3',
        'https://i1.sndcdn.com/artworks-ym6rnHoPcSVPPyMA-Gkyisg-t500x500.jpg': 'http://streams.radiopsr.de/psr-live/mp3-192/mediaplayer'
    }*/// https://tse3.mm.bing.net/th?id=OIP.Sy64rn8wA7AMk6KvmTm-sQHaHa&pid=Api
} else {
    var radios = {};
    localStorage.setItem('radios', JSON.stringify(radios))
}
if (localStorage.getItem('volume')) {
    var volume = localStorage.getItem('volume');
} else {
    var volume = 100;
}
//#endregion




//#region Ajax content changing
function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('main').innerHTML = this.responseText;
            if(document.getElementById('radios') != null) {
                radio(radios);
            }
            if(document.getElementById('languageSelect') != null) {
                document.getElementById('languageSelect').value = shortLang;
            }
            if(document.getElementById('volumeSlider') != null) {
                document.getElementById('volumeSlider').value = volume;
                document.getElementById('volumeSlider').nextElementSibling.textContent = `${volume} %`;
            }
            if (document.querySelector('#cssImageGallery')) {
                const imgGallery = document.querySelector('#cssImageGallery');
                for (let i = 0; i < 10; i++) {
                    var randID = Math.floor(Math.random() * 86);
                    var randWidth = Math.floor(Math.random() * 200) + 100;
                    var randHeight = Math.floor(Math.random() * 200) + 100;
                    imgGallery.insertAdjacentHTML('afterbegin', `<div class="noselect" style="background-image: url('https://picsum.photos/id/${randID}/${randWidth}/${randHeight}');" tabindex="0"></div>`);
                }
            }
            if (document.querySelector('#calendar')) {
                initCalendar();
            }
        }
    };
    xhttp.open('GET', `subsites/${page}`, true);
    xhttp.send();
}
window.addEventListener('popstate', function(event) {
    radio_id = 0;
    current_page = document.location.hash.replace('#', '');
    loadPage(current_page + '.html');
    localStorage.setItem('current_page', current_page)
    document.querySelectorAll('nav > a').forEach(el => {
        el.classList.remove('active');
        if (document.location.hash == el.getAttribute('href')) {
            el.classList.add('active');
        }
    })
})

loadPage(`${current_page}.html`);
document.location.hash = current_page;
document.querySelectorAll('nav > a').forEach(el => {
    el.classList.remove('active');
    if (document.location.hash == el.getAttribute('href')) {
        el.classList.add('active');
    }
})
//#endregion




//#region Calendar
const current_date = new Date();
// Month in JavaScript is 0-indexed (January is 0, February is 1, etc), 
// but by using 0 as the day it will give us the last day of the prior
// month. So passing in 1 as the month number will return the last day
// of January, not February
function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}
function initCalendar() {
    var calendar = document.querySelector('#calendar');
    calendar.querySelector('#calendar-nav').textContent = `${current_date.toLocaleString(userLang, { month: 'long' })}, ${current_date.getFullYear()}`;
    for (let i = 1; i <= daysInMonth(current_date.getMonth() + 1, current_date.getFullYear()); i++) {
        calendar.querySelector('#calendar-view-month').insertAdjacentHTML('beforeend', `<div>${i}</div>`);
    }
}
//#endregion




//#region Language switcher
shortLang = userLang.split('-')[0];
document.body.setAttribute('id', 'lang-' + shortLang);

function setLanguage(lang) {
    userLang = lang;
    document.body.setAttribute('id', 'lang-' + lang);
    localStorage.setItem('language', lang);
}
//#endregion




//#region Radio
const radio_template = document.getElementById('radio-template');
const audio = document.querySelector('#audio-player');
var radio_id = 0;

function play(radio, src) {
    if (!audio.paused && radio.id.replace('radio', '') == audio.getAttribute('data-playing-station')) {
        radio.classList.remove('radio-active');
        audio.removeAttribute('data-playing-station');
        audio.pause();
        console.log(`pausing audio with station ${radio.id} and URL ${audio.src}`);
    } else {
        audio.src = src;
        audio.setAttribute('data-playing-station', radio.id.replace('radio', ''));
        document.querySelector('#radios').querySelectorAll('div > a:nth-child(1)').forEach(a => {
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
        if (audio.getAttribute('data-playing-station') == radio_id) {
            link.classList.add('radio-active');
        }

        document.styleSheets[0].insertRule(`#radio${radio_id}{background-image: url(${img});background-position: center center;background-size: cover;}`, document.styleSheets[0].cssRules.length - 5);
        document.getElementById('radios').appendChild(clone);
        radio_id++;
      
    })
}
//#endregion




//#region Scroll to active element
document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        setTimeout(function() {
            var activeElement = document.activeElement;
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 0);
    }
});
//#endregion




//#region Theme switcher
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
//#endregion




//#region Wave
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
//#endregion




//#region Volume
function setVolume(self, value) {
    volume = value;
    self.nextElementSibling.textContent = `${volume} %`;
    localStorage.setItem('volume', volume);
}
//#endregion