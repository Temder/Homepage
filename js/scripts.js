 // Navbar fading effect
 (function($) {
     $('div li').click(function() {
         $(this).addClass('active').siblings('li').removeClass('active');
         $('section:nth-of-type(' + $(this).data('rel') + ')').stop().fadeIn(500, 'linear').siblings('section').stop().fadeOut(500, 'linear');
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
     var number = document.getElementsByClassName('overlay').length;
     for (var i = 0, n = number; i < n; i++) {
         document.getElementsByClassName('overlay')[i].style.display = "none";
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

 // Volume

 var slider = document.getElementById("volumeSlider");
 var output = document.getElementById("volume");
 output.innerHTML = slider.value;

 slider.oninput = function() {
     output.innerHTML = this.value;

     for (var i = 1; i <= document.getElementsByClassName('overlay').length; i++) {
         var audio = document.getElementById(i);
         audio.volume = slider.value / 100;
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




 // List sorter
 var list, i, switching, b, shouldSwitch;
 list = document.getElementById("id01");
 switching = true;
 // Make a loop that will continue until no switching has been done
 while (switching) {
     // Start by saying: no switching is done
     switching = false;
     b = list.getElementsByTagName("a");
     // Loop through all list items
     for (i = 0; i < (b.length - 1); i++) {
         // Start by saying there should be no switching
         shouldSwitch = false;
         // Check if the next item should switch place with the current item
         if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
             //If next item is alphabetically lower than current item, mark as a switch and break the loop
             shouldSwitch = true;
             break;
         }
     }
     if (shouldSwitch) {
         // If a switch has been marked, make the switch and mark the switch as done
         b[i].parentNode.insertBefore(b[i + 1], b[i]);
         switching = true;
     }
 }




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