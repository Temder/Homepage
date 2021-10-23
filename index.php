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
            $free_names_en = ["Rokkr - Streaming App",  "Minecraft Windows 10 Edition", "Steam Unlocked - Free Steam Singleplayer",         "Steam Fix - Free Steam Multiplayer"];
            $free_names_de = ["Rokkr - Streaming App",  "Minecraft Windows 10 Edition", "Steam Unlocked - Kostenloser Steam Einzelspieler", "Steam Fix - Kostenloser Steam Mehrspieler"];

            $free_picture_paths = ["images/rokkr.png", "images/McWin10.png", "", ""];

            $free_descriptions_en = ["", 
                                     "", 
                                     "", 
                                     ""];
            $free_descriptions_de = ["Mit Rokkr haben Sie das Angebot von vielen bekannten Streaming<br /> Diensten wie Netflix in einer App im Überblick", 
                                     "", 
                                     "", 
                                     ""];
            $free_instructions_en = ["", 
                                     "", 
                                     "", 
                                     ""];
            $free_instructions_de = ["<ul style='list-style-type: decimal;'><li>Laden Sie sich die modifizierte App herunter. (Sie wurde modifiziert<br /> um die Begrenzung von einer Stunde streamen am Tag aufzuheben.)</li>
                                      <li>Öffnen Sie die App und geben Sie eine sogenannte Bundle-URL ein: huhu.to, oha.to</li>
                                      <li>Nun steht ihnen eine große Auswahl an Filmen, Serien und Fernsehsendern zur Verfügung.</li></ul>",
                                     "", 
                                     "", 
                                     ""];

            $free_download_urls = ["https://www.dropbox.com/s/srp37et256ua7yz/Rokkr_Mod.apk?dl=1", 
                                   "", 
                                   "", 
                                   ""];

            $hide_section = true;

            include("./includes/section.php");



            // Footer
            
            include("./includes/footer.php");
        ?>
    </body>
    
    <?php include("./includes/foot.php"); ?>
</html>