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
            if (document.getElementById('views-all')) {
                fetchViews();
            }
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
            if (document.getElementById('cssImageGallery')) {
                const imgGallery = document.getElementById('cssImageGallery');
                for (let i = 0; i < 10; i++) {
                    var randID = Math.floor(Math.random() * 86);
                    var randWidth = Math.floor(Math.random() * 200) + 100;
                    var randHeight = Math.floor(Math.random() * 200) + 100;
                    imgGallery.insertAdjacentHTML('afterbegin', `<div class="noselect" style="background-image: url('https://picsum.photos/id/${randID}/${randWidth}/${randHeight}');" tabindex="0"></div>`);
                }
            }
            if (document.getElementById('calendar')) {
                nav = document.getElementById('calendar-nav');
                nav.addEventListener('click', function (e) {
                    if (e.offsetX > nav.offsetWidth) {
                        if (current_view == 'week') {
                            changeWeek(1);
                        } else if (current_view == 'month') {
                            changeMonth(1);
                        }
                    } else if (e.offsetX < 0) {
                        if (current_view == 'week') {
                            changeWeek(-1);
                        } else if (current_view == 'month') {
                            changeMonth(-1);
                        }
                    }
                });
                initCalendar(true);
            }
        }
    };
    xhttp.open('GET', `/${page}`, true);
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
var current_date;
var current_view;
var nav;
var view;
var events;

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}
Date.prototype.GetFirstDayOfWeek = function() {
    return (new Date(this.setDate(this.getDate() - this.getDay()+ (this.getDay() == 0 ? -6:1) )));
}
Date.prototype.GetLastDayOfWeek = function() {
    return (new Date(this.setDate(this.getDate() - this.getDay() + 7)));
}
function changeMonth(offset) {
    current_date.setDate(1)
    current_date.setMonth(current_date.getMonth() + offset);
    initCalendar(false);
}
function changeWeek(offset) {
    current_date.setDate(current_date.getDate() + (offset * 7));
    initCalendar(false);
}
function calendarChangeView(view) {
    current_view = view;
    initCalendar(false);
}
function calendarShowEvents(day) {
    events.innerHTML = `<div>${new Date(current_date.getFullYear(), current_date.getMonth(), day).toLocaleString(userLang, { weekday: 'long' })}, ${day}. ${current_date.toLocaleString(userLang, { month: 'long' })} ${current_date.getFullYear()}</div>`;
}
function initCalendar(standard) {
    if (standard) {
        current_date = new Date();
        current_view = 'month';
    }
    var first_day_week = current_date.GetFirstDayOfWeek();
    var last_day_week = current_date.GetLastDayOfWeek();
    view = document.getElementById('calendar-view');
    events = document.getElementById('calendar-event');
    function addDay(day, monthOffset) {
        var weekday = new Date(current_date.getFullYear(), current_date.getMonth() + monthOffset, day);
        var weekdayShort = weekday.toLocaleString(userLang, { weekday: 'short' });
        if (weekday.getDay() === 0 || weekday.getDay() === 6) {
            view.insertAdjacentHTML('beforeend', `<div class="noselect weekend" onclick="calendarShowEvents(${day})"><div>${day}</div><div>${weekdayShort}</div></div>`);
        } else {
            view.insertAdjacentHTML('beforeend', `<div class="noselect" onclick="calendarShowEvents(${day})"><div>${day}</div><div>${weekdayShort}</div></div>`);
        }
    }
    nav.textContent = `${current_date.toLocaleString(userLang, { month: 'long' })}, ${current_date.getFullYear()}`;
    view.innerHTML = '';
    if (current_view == 'week') {
        if (first_day_week.getDate() < last_day_week.getDate()) {
            for (let i = first_day_week.getDate(); i <= last_day_week.getDate(); i++) {
                addDay(i, 0);
            }
        } else {
            for (let i = first_day_week.getDate(); i <= daysInMonth(current_date.getMonth(), current_date.getFullYear()); i++) {
                addDay(i, -1);
            }
            for (let i = 1; i <= last_day_week.getDate(); i++) {
                addDay(i, 0);
            }
        }
    } else if (current_view == 'month') {
        var dim = daysInMonth(current_date.getMonth() + 1, current_date.getFullYear());
        var emptyDaysBefore = new Date(current_date.getFullYear(), current_date.getMonth(), 1).getDay() - 1;
        var emptyDaysAfter = 7 - ((dim + emptyDaysBefore) % 7);
        if (emptyDaysBefore == -1) { emptyDaysBefore = 6; }
        if (emptyDaysAfter == 7) { emptyDaysAfter = 0; }
        for (let i = 0; i < emptyDaysBefore; i++) {
            view.insertAdjacentHTML('beforeend', '<div class="noselect"></div>');
        }
        for (let i = 1; i <= dim; i++) {
            addDay(i, 0);
        }
        for (let i = 0; i < emptyDaysAfter; i++) {
            view.insertAdjacentHTML('beforeend', '<div class="noselect"></div>');
        }
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
const audio = document.getElementById('audio-player');
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
        document.getElementById('radios').querySelectorAll('div > a:nth-child(1)').forEach(a => {
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
    let img = document.getElementById('radio-img').value;
    let src = document.getElementById('radio-src').value;
    if (img != '' && src != '') {
        document.getElementById('radio-img').value = document.getElementById('radio-src').value = '';
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




//#region Views
function fetchViews() {
    fetch('/api/views')
        .then(response => response.json())
        .then(views => {
            document.getElementById('views-all').innerHTML = `<div>${views.count.reduce((sum, item) => sum + item.views, 0)}</div>`;
            document.getElementById('views-unique').innerHTML = `<div>${views.count.length}</div>`;
        })
        .catch(error => {
            console.error('Error fetching view count:', error);
            document.getElementById('views-all').textContent = document.getElementById('views-unique').textContent = 'Error';
        });
}
//#endregion