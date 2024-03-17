// Ajax content changing

function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("main").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", page, true);
    xhttp.send();
}
loadPage('radio.html');
document.location.hash = 'radio';
window.addEventListener('popstate', function(event) {
    loadPage(document.location.hash.replace('#', '') + '.html');
    document.querySelectorAll('nav > a').forEach(el => {
        el.classList.remove('active');
        if (document.location.hash == el.getAttribute('href')) {
            el.classList.add('active');
        }
    })
})


// Theme switcher

const cssVariables = {
    '--color-header-bg-1': '--color-header-bg-2',
    '--color-header-bg-hover-1': '--color-header-bg-hover-2',
    '--color-main-bg': '--color-main-fg',
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

function play(e) {
    var de = document.getElementById(e);

    if (de.paused) {
        url = de.src.split('?')[0];
        var de1 = url + '?' + new Date().getTime();
        document.getElementById(e).src = de1;

        de.play();

        de.parentNode.classList.add('radio-active');
        de.onended = function() {
            if (document.getElementById(e + 1)) {
                play(e + 1);
            } else {
                play(1);
            }
        }
    } else {
        de.parentNode.classList.remove('radio-active');
        de.pause();
    }
}

/*document.querySelector('html > body > div#main > div > div.radio-player').forEach(radio => {
    radio.addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          radio.click();
        }
      }); 
}); */