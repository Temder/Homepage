<!DOCTYPE html>
<html>
    <head>
        <?php include("./includes/head.php"); ?>
    </head> 

    <body>
        <?php
            //ini_set('display_errors', 1);
            //ini_set('display_startup_errors', 1);
            //error_reporting(E_ALL);
            
            // Main
            
            //require_once('includes/db_connect.php'); // Database connection file
            //require_once('includes/functions.php');  // PHP functions file

            //add_view($conn, $_SERVER['REMOTE_ADDR'], 1);
            //views($conn);



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
            $app_imgsize = 125;

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

            $contact_text_en = "If you have any questions or encounter any problems, you can contact me through this.";
            $contact_text_de = "Wenn Sie Fragen haben oder Probleme auftreten, können Sie mich hierüber kontaktieren.";

            $hide_section = false;
            
            include("./includes/section.php");



            // Test
            
            $section_names = ["Test", "Test"];
            
            $test_count = ["1"];

            $test_panorama_paths = ["images/pano/pano0.jpg", "images/pano/pano1.jpg", "images/pano/pano2.jpg"];

            $hide_section = false;

            include("./includes/section.php");
            
            
            
            // Settings
            
            $section_names = ["Settings", "Einstellungen"];
            
            $settings_count = ["1"];

            $hide_section = false;

            include("./includes/section.php");


            
            // Footer
            
            include("./includes/footer.php");
        ?>
    </body>
    
    <?php include("./includes/foot.php"); ?>
</html>