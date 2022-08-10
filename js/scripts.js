// Variables

var bgBlendMode = "color"; // (1: color, color-burn, color-dodge, darken, difference, exclusion, hard-light, hue, lighten, luminosity, multiply, normal, overlay, saturation, screen, soft-light)
var bgColorR = 41; // (41 - 255)
var bgColorG = 45; // (45 - 255)
var bgColorB = 62; // (62 - 225)
var bgIntensity = 0; // (0 - 100)
var volume = 50; // (0 - 100)

var savedLayouts = new Array();


var bg = document.getElementById('bg');

var sliderI = document.getElementById("intensitySlider");
var outputI = document.getElementById("intensity");

var dpBlendmode = document.getElementById("blendmode");

var sliderV = document.getElementById("volumeSlider");
var outputV = document.getElementById("volume");

var save = document.getElementById("save");
var load = document.getElementById("load");
var reset = document.getElementById("reset");
var inputBgConf = document.getElementById("inputBgConf");

var openSVG = document.getElementById("open");
var openNav = document.getElementById("openClick");

var dpSPA = document.getElementsByClassName("choose");

var dlLayouts = document.getElementById("layouts");




// Navbar Fading Effect

(function($) {
    $('div li').click(function() {
        $(this).addClass('active').siblings('li').removeClass('active');
        $('section:nth-of-type(' + $(this).data('rel') + ')').stop().fadeIn(500, 'linear').siblings('section').stop().fadeOut(500, 'linear');
    });
    $('div li').keydown(function() {
        if (event.which == 13) {
            $(this).addClass('active').siblings('li').removeClass('active');
            $('section:nth-of-type(' + $(this).data('rel') + ')').stop().fadeIn(500, 'linear').siblings('section').stop().fadeOut(500, 'linear');
        }
    });
})(jQuery);




// Radio Player

jQuery(document).ready(function($) {
    $("audio").on("play", function(me) {
        $("audio").each(function(i, e) {
            if (e !== me.currentTarget) {
                this.pause();
                this.currentTime = 0;
            }
        });
    });
})

function play(e, f) {
    var de = document.getElementById(e);

    // Delete all overlays
    var number = document.getElementsByClassName('playingOverlay').length;
    for (var i = 0, n = number; i < n; i++) {
        document.getElementsByClassName('playingOverlay')[i].style.display = "none";
    }
    // Avoid caching a stream
    if (de.paused) {
        url = de.src.split("?")[0];
        var de1 = url + "?" + new Date().getTime();
        document.getElementById(e).src = de1;
        // Mark active station with a overlay

        document.getElementById(f).style.display = "block";

        de.play();

        de.style.display = "block";
        de.onended = function() {
            if (document.getElementById(e + 1)) {
                play(e + 1);
            } else {
                play(1);
            }
        }
    } else {
        de.pause();
    }
}




// Language Changer

var language = window.navigator.userLanguage || window.navigator.language;

if (language.indexOf('de') !== -1) {
    testsprache = 'de';
} else {
    testsprache = 'en';
}
// Append browser language to the body
$('body').attr("id", 'lang-' + testsprache);
// Change website language
$(".languageswitcher").on('click', function(e) {
    e.preventDefault();
    $("body").attr("id", 'lang-' + $(this).attr('lang'));
});




// Search In List

$(document).ready(function() {
    $("#searchEN").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#id01 *").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function() {
    $("#searchDE").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#id01 *").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});




// Volume

outputV.innerHTML = sliderV.value = volume;

for (var i = 1; i <= document.getElementsByClassName('playingOverlay').length; i++) {
    var audio = document.getElementById(i);
    audio.volume = volume / 100;
}

sliderV.oninput = function() {
    outputV.innerHTML = volume = this.value;
    for (var i = 1; i <= document.getElementsByClassName('playingOverlay').length; i++) {
        var audio = document.getElementById(i);
        audio.volume = volume / 100;
    }
}




/*// Background Color

sliderCR.value = bgColorR;
sliderCB.value = bgColorB;
sliderCG.value = bgColorG;

bg.style.backgroundColor = "rgb(" + bgColorR + ", " + bgColorG + ", " + bgColorB + ", " + bgIntensity / 100 + ")";

sliderCR.oninput = function() {
    bgColorR = this.value;
    bg.style.backgroundColor = "rgb(" + bgColorR + ", " + bgColorG + ", " + bgColorB + ", " + bgIntensity / 100 + ")";
}
sliderCB.oninput = function() {
    bgColorB = this.value;
    bg.style.backgroundColor = "rgb(" + bgColorR + ", " + bgColorG + ", " + bgColorB + ", " + bgIntensity / 100 + ")";
}
sliderCG.oninput = function() {
    bgColorG = this.value;
    bg.style.backgroundColor = "rgb(" + bgColorR + ", " + bgColorG + ", " + bgColorB + ", " + bgIntensity / 100 + ")";
}*/




// Background Blend Mode

dpBlendmode.value = bgBlendMode;
bg.style.backgroundBlendMode = bgBlendMode;

dpBlendmode.oninput = function() {
    bg.style.backgroundBlendMode = this.value;
}




// Web Storage

if (localStorage.getItem("savedLayouts") != null) {
    savedLayouts = JSON.parse(localStorage.getItem("savedLayouts"));
}

save.onclick = function() {
    localStorage.setItem("volume" + "_" + escape(inputBgConf.value), volume);
    localStorage.setItem("bgIntensity" + "_" + escape(inputBgConf.value), bgIntensity);
    localStorage.setItem("bgRed" + "_" + escape(inputBgConf.value), bgColorR);
    localStorage.setItem("bgGreen" + "_" + escape(inputBgConf.value), bgColorG);
    localStorage.setItem("bgBlue" + "_" + escape(inputBgConf.value), bgColorB);
    localStorage.setItem("bgBlendmode" + "_" + escape(inputBgConf.value), dpBlendmode.value);

    savedLayouts[savedLayouts.length] = inputBgConf.value;
    updateLayoutDatalist();
    localStorage.setItem("savedLayouts", JSON.stringify(savedLayouts));
}

load.onclick = function() {
    volume = localStorage.getItem("volume" + "_" + escape(inputBgConf.value));
    bgIntensity = localStorage.getItem("bgIntensity" + "_" + escape(inputBgConf.value));
    bgColorR = localStorage.getItem("bgRed" + "_" + escape(inputBgConf.value));
    bgColorG = localStorage.getItem("bgGreen" + "_" + escape(inputBgConf.value));
    bgColorB = localStorage.getItem("bgBlue" + "_" + escape(inputBgConf.value));
    bgBlendMode = localStorage.getItem("bgBlendmode" + "_" + escape(inputBgConf.value));

    updateLayoutDatalist();

    if (localStorage.getItem("volume" + "_" + escape(inputBgConf.value)) != null && localStorage.getItem("bgIntensity" + "_" + escape(inputBgConf.value)) != null && localStorage.getItem("bgRed" + "_" + escape(inputBgConf.value)) != null && localStorage.getItem("bgGreen" + "_" + escape(inputBgConf.value)) != null && localStorage.getItem("bgBlue" + "_" + escape(inputBgConf.value)) != null && localStorage.getItem("bgBlendmode" + "_" + escape(inputBgConf.value)) != null) {
        sliderV.value = outputV.innerHTML = volume;
        for (var i = 1; i <= document.getElementsByClassName('playingOverlay').length; i++) {
            var audio = document.getElementById(i);
            audio.volume = volume / 100;
        }
        colorWheel.color.alpha = bgIntensity;
        dpBlendmode.value = bgBlendMode;

        bg.style.backgroundColor = "rgba(" + bgColorR + ", " + bgColorG + ", " + bgColorB + ", " + bgIntensity / 100 + ")";
        bg.style.backgroundBlendMode = bgBlendMode;
    }
}

reset.onclick = function() {
    volume = 50;
    bgIntensity = 0;
    bgColorR = 41;
    bgColorG = 45;
    bgColorB = 62;
    bgBlendMode = "color";

    sliderV.value = outputV.innerHTML = volume;
    for (var i = 1; i <= document.getElementsByClassName('playingOverlay').length; i++) {
        var audio = document.getElementById(i);
        audio.volume = volume / 100;
    }
    colorWheel.color.alpha = bgIntensity;
    dpBlendmode.value = bgBlendMode;

    bg.style.backgroundColor = "rgba(" + bgColorR + ", " + bgColorG + ", " + bgColorB + ", " + bgIntensity / 100 + ")";
    bg.style.backgroundBlendMode = bgBlendMode;
}




// Nav Open And Close

openNav.onclick = function() {
    if (document.getElementsByClassName("nav")[0].style.display == "block") {
        document.getElementsByClassName("nav")[0].style.display = "none";
    } else {
        document.getElementsByClassName("nav")[0].style.display = "block";
    }
}

openSVG.onkeydown = function(e) {
    if (!e) {
        var e = window.event;
    }
    if (e.keyCode == 13) {
        if (document.getElementsByClassName("nav")[0].style.display == "block") {
            document.getElementsByClassName("nav")[0].style.display = "none";
        } else {
            document.getElementsByClassName("nav")[0].style.display = "block";
        }
    }
}

$(window).resize(function() {
    if (window.innerWidth > 900) {
        document.getElementsByClassName("nav")[0].style.display = "block";
    }
    if (window.innerWidth < 900) {
        document.getElementsByClassName("nav")[0].style.display = "none";
    }
});




// Image Scale

function scaleImageUp(object) {
    if (document.getElementById(object)) {
        document.getElementById(object).style.transform = "scale(1.25)";
    }
}

function scaleImageDown(object) {
    if (document.getElementById(object)) {
        document.getElementById(object).style.transform = "scale(1)";
    }
}




// Scroll To Object

function scrollToObject(object) {
    document.getElementById(object).scrollIntoView({ behavior: "auto", block: "center" });
}




// Saved Layouts

function updateLayoutDatalist() {
    var str = '';
    for (var i = 0; i < savedLayouts.length; i++) {
        str += '<option value="' + savedLayouts[i] + '"></option>\n';
    }

    dlLayouts.innerHTML = str;
}

updateLayoutDatalist();




// Color Picker

var colorWheel = new iro.ColorPicker("#colorWheelDemo", {
    layout: [{
            component: iro.ui.Wheel,
            options: {
                width: 200,
                layoutDirection: "horizontal",
                wheelLightness: true,
                wheelAngle: 0,
                wheelDirection: "anticlockwise"
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                width: 200,
                layoutDirection: "horizontal",
                sliderType: 'alpha', // can also be 'saturation', 'value', 'alpha' or 'kelvin',
                sliderShape: 'box',
                activeIndex: 2
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                width: 200,
                layoutDirection: "horizontal",
                sliderType: 'value', // can also be 'saturation', 'value', 'alpha' or 'kelvin',
                sliderShape: 'box',
                activeIndex: 2
            }
        }
    ]
});

colorWheel.color.alpha = bgIntensity * 0.01;

colorWheel.on('color:change', function(color, changes) {
    // when the color has changed, the callback gets passed the color object and an object providing which color channels (out of H, S, V) have changed.
    bgColorR = colorWheel.color.red;
    bgColorB = colorWheel.color.blue;
    bgColorG = colorWheel.color.green;
    bgIntensity = colorWheel.color.alpha * 100;
    bg.style.backgroundColor = "rgb(" + bgColorR + ", " + bgColorG + ", " + bgColorB + ", " + bgIntensity / 100 + ")";
})