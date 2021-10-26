<!DOCTYPE html>
<html>
    <head>
        <?php include("./includes/head.php"); ?>
    </head> 

    <body>
        <?php
            // Header

            include("./includes/header.php");



            // Home

            $section_names = ["Home", "Home"];

            $home_count = ["1"];

            $hide_section = false;

            include("./includes/section.php");



            // PD Games

            $section_names = ["PD Games", "PD Games"];

            $app_count =           ["1",            "2",            "3",            "4",            "5",            "6",            "7",            "8"];
            $app_names =           ["Super Code",   "Jump Jump 1",  "Jump Jump 2",  "Jump Jump 3D", "Mehrspieler",  "Malen",        "Fallen",       "Speed Slidder"];
            $app_picture_paths =   ["SC.png",       "JJ1.png",      "JJ2.png",      "JJ3D.png",     "Me.png",       "Ma.png",       "F.png",        "Ss.png"];

            $app_descriptions_en = ["Can you guess a hidden color code in 7 attempts?", 
                                    "Do you reach the black hole?", 
                                    "Can you manage to collect all the music notes in the game?",
                                    "There isn't a goal. Have fun.",
                                    "A hiding game for many players.",
                                    "Draw pictures or create cities.",
                                    "Collect the falling items quickly.",
                                    "How far can you get?"];
            $app_descriptions_de = ["Schaffen Sie es, einen versteckten Farbcode in 7 Versuchen zu erraten?",
                                    "Erreichen Sie das schwarze Loch?",
                                    "Schaffen Sie es alle Musik Noten einzusammeln?",
                                    "Es gibt noch kein Ziel. Haben Sie Spaß.",
                                    "Ein Versteckspiel für viele Spieler.",
                                    "Malen Sie Bilder oder erschaffen Sie Städte.",
                                    "Sammeln Sie die herunterfallenden Gegenstände schnell ein.",
                                    "Wie weit kommen Sie?"];
            $app_download_urls_android =   ["https://github.com/Temder/Homepage/releases/download/SC/SuperCode.apk",
                                            "https://github.com/Temder/Homepage/releases/download/JJ/JumpJump.apk",
                                            "https://github.com/Temder/Homepage/releases/download/JJ2/JumpJump2.apk",
                                            "https://github.com/Temder/Homepage/releases/download/JJ3D/JumpJump3D.apk",
                                            "https://github.com/Temder/Homepage/releases/download/MP3D/Multiplayer3D.apk",
                                            "https://github.com/Temder/Homepage/releases/download/DaC/Draw.apk",
                                            "https://github.com/Temder/Homepage/releases/download/FT/Fall.apk",
                                            "https://play.google.com/store/apps/details?id=com.PdGames.Leon.SpeedSlidder"];
            $app_download_urls_windows =   ["",
                                            "",
                                            "https://github.com/Temder/Homepage/releases/download/JJ2/JumpJump2.zip",
                                            "",
                                            "https://github.com/Temder/Homepage/releases/download/MP3D/Multiplayer3D.zip",
                                            "https://github.com/Temder/Homepage/releases/download/DaC/Draw.zip",
                                            "https://github.com/Temder/Homepage/releases/download/FT/Fall.zip",
                                            ""];

            $hide_section = true;

            include("./includes/section.php");



            // Radio Stations
            
            $section_names = ["Radio Stations", "Radio Stationen"];

            $radio_count = ["1",                "2",                    "3",            "4",            "5"];
            $radio_names = ["Radio Dresden",    "Radiowelle Pirna",     "HITMIX FM",    "DJ CryexX",    "HRP An Der Elbe"];

            $radio_picture_paths = ["https://www.phonostar.de/images/auto_created/Radio_Dresden_2184x184.png",
                                    "images/RadiowellePirna.png",
                                    "https://static.radio.de/images/broadcasts/b9/79/107096/2/c175.png",
                                    "images/djcryexx.png",
                                    "https://static.radio.de/images/broadcasts/19/3a/123134/1/c175.png"];
            $radio_stream_paths =  ["https://streams.bcs-systems.de/slp/live/dresden/mp3/radioplayer/web",
                                    "http://server29817.streamplus.de:10838/listen1",
                                    "https://hitmixfm.stream.laut.fm/hitmix_fm",
                                    "https://stream.laut.fm/djcryexx",
                                    "https://stream.laut.fm/hrp-an-der-elbe?ref=radiode"];

            $hide_section = false;

            include("./includes/section.php");



            // Games

            $section_names = ["Games", "Spiele"];
            
            $game_count = ["1", "2", "3"];

            $game_picture_paths =  ["Minecraft.png",
                                    "Terraria.png",
                                    "Mindustry.png"];
            $game_picture_scales = ["mc",
                                    "te",
                                    "mi"];
            $game_urls =   ["https://www.minecraft.net/",
                            "https://terraria.org/",
                            "https://mindustrygame.github.io/"];

            $hide_section = false;

            include("./includes/section.php");



            // Contact

            $section_names = ["Contact", "Kontakt"];

            $contact_count = ["1"];

            $hide_section = false;
            
            include("./includes/section.php");
            
            
            
            // Test
            
            $section_names = ["Test", "Test"];
            
            $test_count = ["1"];

            $hide_section = false;

            include("./includes/section.php");
            
            
            
            // Settings
            
            $section_names = ["Settings", "Einstellungen"];
            
            $settings_count = ["1"];

            $hide_section = false;

            include("./includes/section.php");



            // Free Stuff

            $section_names = ["Free Things", "Kostenlose Dinge"];

            $free_count =    ["1",                      "2",                            "3",                                                "4"];
            $free_names_en = ["Rokkr - Streaming App",  "Minecraft Windows 10 Edition", " - Free Steam Singleplayer",         "Online Fix - Free Multiplayer Games"];
            $free_names_de = ["Rokkr - Streaming App",  "Minecraft Windows 10 Edition", " - Kostenloser Steam Einzelspieler", "Online Fix - Kostenlose Mehrspieler Spiele"];

            $free_picture_paths = ["images/rokkr.png", "images/McWin10.png", "images/SteamUnlocked.png", "images/SteamOnlineFix.png"];

            $free_descriptions_en = ["With Rokkr you have an overview of many popular streaming services in one app", 
                                     "", 
                                     "", 
                                     "Play popular games with multiplayer support for free with Online Fix."];
            $free_descriptions_de = ["Mit Rokkr haben Sie das Angebot von vielen bekannten Streaming<br /> Diensten in einer App im Überblick", 
                                     "", 
                                     "", 
                                     "Spielen Sie kostenlos bekannte Spiele im Mehrspieler mit Online Fix."];
            $free_instructions_en = ["&bull; Download the modified app. (It was modified to remove the limit of one hour of streaming per day.)<br />
                                      &bull; Open the app and type in a so-called bundle URL: huhu.to, oha.to<br />
                                      &bull; Now you have a large selection of films, series and TV channels at your disposal.", 
                                     "&bull; <br />
                                      &bull; <br />
                                      &bull; ", 
                                     "&bull; <br />
                                      &bull; <br />
                                      &bull; ", 
                                     "&bull; <br />
                                      &bull; <br />
                                      &bull; "];
            $free_instructions_de = ["&bull; Laden Sie sich die modifizierte App herunter. (Sie wurde modifiziert<br /> um die Begrenzung von einer Stunde streamen am Tag aufzuheben.)<br />
                                      &bull; Öffnen Sie die App und geben Sie eine sogenannte Bundle-URL ein: huhu.to, oha.to<br />
                                      &bull; Nun steht ihnen eine große Auswahl an Filmen, Serien und Fernsehsendern zur Verfügung.",
                                     "&bull; <br />
                                      &bull; <br />
                                      &bull; ", 
                                     "&bull; <br />
                                      &bull; <br />
                                      &bull; ", 
                                     "&bull; Rufen Sie die Webseite <a target='_blank' href='https://online-fix.me/'>https://online-fix.me/</a> auf.<br />
                                      &bull; Sie müssen ein kostenloses Konto erstellen um ein Spiel runterzuladen.<br />
                                      &bull; Suchen Sie nach dem Spiel welches Sie im Mehrspieler spielen möchten.<br />
                                      &bull; Laden Sie sich gegebenenfalls den entsprechenden Launcher herunter. (<a target='_blank' href='https://store.steampowered.com/about/'>Steam</a>, <a target='_blank' href='https://www.epicgames.com/shadowcomplex/download'>Epic Games</a>)<br />
                                      &bull; Folgen Sie der Anleitung unter den Downloads um das Spiel einzurichten."];

            $free_download_count = ["1", "1", "1", "2"];
            $free_download_urls = ["https://www.dropbox.com/s/srp37et256ua7yz/Rokkr_Mod.apk?dl=1", 
                                   "", 
                                   "https://steamunlocked.net/", 
                                   "https://mega.nz/file/Wv4yXaJa#8E02MP8DxZzHm6J3VvIAROhZbVMfUzxx0lQYBPN4enw"];

            $hide_section = true;

            include("./includes/section.php");



            // Footer
            
            include("./includes/footer.php");
        ?>
    </body>
    
    <?php include("./includes/foot.php"); ?>
</html>
