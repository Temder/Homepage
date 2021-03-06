 // Variables

 var bgBlendMode = "color"; // (1: color, color-burn, color-dodge, darken, difference, exclusion, hard-light, hue, lighten, luminosity, multiply, normal, overlay, saturation, screen, soft-light)
 var bgColorR = 41; // (41 - 255)
 var bgColorG = 45; // (45 - 255)
 var bgColorB = 62; // (62 - 225)
 var bgIntensity = 0; // (0 - 100)
 var volume = 50; // (0 - 100)


 var bg = document.getElementById('bg');

 var sliderI = document.getElementById("intensitySlider");
 var outputI = document.getElementById("intensity");

 var sliderCR = document.getElementById("colorSliderR");
 var sliderCG = document.getElementById("colorSliderG");
 var sliderCB = document.getElementById("colorSliderB");

 var dpBlendmode = document.getElementById('blendmode');

 var sliderV = document.getElementById("volumeSlider");
 var outputV = document.getElementById("volume");

 var save = document.getElementById('save');
 var load = document.getElementById('load');
 var reset = document.getElementById('reset');
 var inputBgConf = document.getElementById('inputBgConf');

 var openSVG = document.getElementById('open');
 var openNav = document.getElementById('openClick');

 var dpSPA = document.getElementsByClassName('choose');



 // Navbar fading effect

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




 // Language changer

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




 // Search in list

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




 // Background Intensity

 outputI.innerHTML = sliderI.value = bgIntensity;

 bg.style.backgroundColor = "rgb(" + bgColorR + ", " + bgColorG + ", " + bgColorB + ", " + bgIntensity / 100 + ")";

 sliderI.oninput = function() {
     outputI.innerHTML = bgIntensity = this.value;

     bg.style.backgroundColor = "rgb(" + bgColorR + ", " + bgColorG + ", " + bgColorB + ", " + bgIntensity / 100 + ")";
 }




 // Background Color

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
 }




 // Background blend mode

 dpBlendmode.value = bgBlendMode;
 bg.style.backgroundBlendMode = bgBlendMode;

 dpBlendmode.oninput = function() {
     bg.style.backgroundBlendMode = this.value;
 }




 // Cookies

 function createCookie(key, value, date) {
     let expiration = new Date(date).toUTCString();
     let cookie = escape(key) + "_" + escape(inputBgConf.value) + "=" + escape(value) + ";expires=" + expiration + ";";
     document.cookie = cookie;
     console.log(volume + ", " + bgIntensity + ", " + bgColorR + ", " + bgColorG + ", " + bgColorB + ", " + dpBlendmode);
 }

 function getCookie(cname) {
     var name = cname + "_" + escape(inputBgConf.value) + "=";
     var decodedCookie = decodeURIComponent(document.cookie);
     var ca = decodedCookie.split(';');
     for (var i = 0; i < ca.length; i++) {
         var c = ca[i];
         while (c.charAt(0) == ' ') {
             c = c.substring(1);
         }
         if (c.indexOf(name) == 0) {
             return c.substring(name.length, c.length);
         }
     }
     return "";
 }

 save.onclick = function() {
     createCookie("volume", volume);
     createCookie("bgIntensity", bgIntensity);
     createCookie("bgRed", bgColorR);
     createCookie("bgGreen", bgColorG);
     createCookie("bgBlue", bgColorB);
     createCookie("bgBlendmode", dpBlendmode.value);
 }

 load.onclick = function() {
     volume = getCookie("volume");
     bgIntensity = getCookie("bgIntensity");
     bgColorR = getCookie("bgRed");
     bgColorG = getCookie("bgGreen");
     bgColorB = getCookie("bgBlue");
     bgBlendMode = getCookie("bgBlendmode");

     if (volume != "" && bgIntensity != "" && bgColorR != "" && bgColorG != "" && bgColorB != "" && bgBlendMode != "") {
         sliderV.value = outputV.innerHTML = volume;
         for (var i = 1; i <= document.getElementsByClassName('playingOverlay').length; i++) {
             var audio = document.getElementById(i);
             audio.volume = volume / 100;
         }
         sliderI.value = outputI.innerHTML = bgIntensity;
         sliderCR.value = bgColorR;
         sliderCG.value = bgColorG;
         sliderCB.value = bgColorB;
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
     sliderI.value = outputI.innerHTML = bgIntensity;
     sliderCR.value = bgColorR;
     sliderCG.value = bgColorG;
     sliderCB.value = bgColorB;
     dpBlendmode.value = bgBlendMode;

     bg.style.backgroundColor = "rgba(" + bgColorR + ", " + bgColorG + ", " + bgColorB + ", " + bgIntensity / 100 + ")";
     bg.style.backgroundBlendMode = bgBlendMode;
 }




 // Nav open and close

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
     document.getElementById(object).style.transform = "scale(1.25)";
 }

 function scaleImageDown(object) {
     document.getElementById(object).style.transform = "scale(1)";
 }