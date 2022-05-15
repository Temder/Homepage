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

            phpinfo();
            
            require_once('includes/db_connect.php'); // Database connection file
            require_once('includes/functions.php');  // PHP functions file

            add_view($conn, $_SERVER['REMOTE_ADDR'], 1);
            views($conn);



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
            
            
            
            // Free Stuff

            $section_names = ["Free Things", "Kostenlose Dinge"];

            $free_count =    ["1",                      "2",                  "3",                            "4",                                  "5"];
            $free_names_en = ["Rokkr - Streaming App",  "xStream Kodi Addon", "Minecraft Windows 10 Edition", " - Free Steam Singleplayer",         "Online Fix - Free Multiplayer Games"];
            $free_names_de = ["Rokkr - Streaming App",  "xStream Kodi Addon", "Minecraft Windows 10 Edition", " - Kostenloser Steam Einzelspieler", "Online Fix - Kostenlose Mehrspieler Spiele"];

            $free_picture_paths = ["images/rokkr.png", "images/xstream.png", "images/McWin10.png", "images/SteamUnlocked.png", "images/SteamOnlineFix.png"];
            $free_img_height =      ["clamp(7.5rem, 10vw, 10rem)", "clamp(7.5rem, 10vw, 10rem)", "clamp(7.5rem, 10vw, 10rem)", "", "clamp(7.5rem, 10vw, 10rem)"];

            $free_descriptions_en = ["The xStream addon for Kodi offers a large selection of movies, series, TV and radio channels for free. It can be used on many platforms.",
                                     "Get Minecraft Windows 10 Edition for free and with working multiplayer.", 
                                     "SteamUnlocked lets you download a selection of Steam games for free.", 
                                     "Play popular games with multiplayer support for free with Online Fix."];
            $free_descriptions_de = ["Das xStream Addon für Kodi stellt eine große Auswahl an Filmen, Serien, Fernseh- und Radiosendern kostenlos zur Verfügung. Es kann auf vielen Platformen benutzt werden.",
                                     "Holen Sie sich Minecraft 10 Edition kostenlos und mit Mehrspieler Unterstützung.", 
                                     "SteamUnlocked lässt Sie eine Auswahl an Steam Spielen kostenlos herunterladen.", 
                                     "Spielen Sie kostenlos bekannte Spiele im Mehrspieler mit Online Fix."];
            $free_instructions_en = ["&bull; Download Kodi for the desired platform: <a target='_blank' href='https://kodi.tv/download/'>https://kodi.tv/download/</a>.<br />
                                      &bull; Download the <a href='http://repo.openkd.tv/------%20%20Wizard%20%20%20------/plugin.program.multiwizard-6.3.1.zip'>OpenKD addon</a> for Kodi. It includes xStream.<br />
                                      &bull; Open Kodi and enable the 'Unknown sources' option in the settings under 'System' - 'Add-ons'.  <br />
                                      &bull; In the settings go to 'Addons', click on 'Install from zip file' and select the downloaded file 'plugin.program.multiwizard-x.x.x.zip'.<br />
                                      &bull; The OpenKD Wizard will now open. In this one you have to choose a build and install it. After installation, Kodi will close.<br />
                                      &bull; Open Kodi again and wait for the additional required addons to be installed.<br />
                                      &bull; Now if you go to 'xStream' in the 'Filme-Serien' tab, you can use the global search to search for movies or series.",
                                     "&bull; Download one of the launchers (BlueSky, BLauncher) from the <a target='_blank' href='https://discord.gg/HEbWRhtHYX'>discord server</a> in the sub-server #releases<br />
                                      &bull; Unpack the archive.<br />
                                      &bull; Download the minecraft demo version from the microsoft store.<br />
                                      &bull; If you now open the file (.exe) in the unzipped folder and click on play in the launcher, the installed demo version of Minecraft becomes the full version.<br />
                                      &bull; If you have any questions or problems, you can ask them on the Discord server in the sub-server #support.", 
                                     "&bull; Go to the website <a target='_blank' href='https://steamunlocked.net'>https://steamunlocked.net</a>.<br />
                                      &bull; Find the game you want to play and click on the download button.<br />
                                      &bull; Wait until the time has expired and click on Free Download (you will have to click on it several times when a new browser window opens).<br />
                                      &bull; Extract the downloaded file to play the game.", 
                                     "&bull; Go to the website <a target='_blank' href='https://online-fix.me/'>https://online-fix.me/</a>.<br />
                                      &bull; You need to create a free account to download a game.<br />
                                      &bull; Find the game you want to play with multiplayer support.<br />
                                      &bull; If necessary, download the appropriate launcher. (<a target='_blank' href='https://store.steampowered.com/about/'>Steam</a>, <a target='_blank' href='https://www.epicgames.com/shadowcomplex/download'>Epic Games</a>)<br />
                                      &bull; Follow the instructions underneath the downloads to set up the game."];
            $free_instructions_de = ["&bull; Laden Sie sich Kodi für die gewünschte Platform herunter: <a target='_blank' href='https://kodi.tv/download/'>https://kodi.tv/download/</a>.<br />
                                      &bull; Laden Sie sich das <a href='http://repo.openkd.tv/------%20%20Wizard%20%20%20------/plugin.program.multiwizard-6.3.1.zip'>OpenKD Addon</a> für Kodi herunter. Es beinhaltet xStream.<br />
                                      &bull; Öffnen Sie Kodi und aktivieren Sie in den Einstellungen unter 'System' - 'Add-ons' die Option 'Unknown sources'.<br />
                                      &bull; Gehen Sie in den Einstellungen zu 'Addons', drücken Sie auf 'Install from zip file' und wählen Sie die heruntergeladene Datei 'plugin.program.multiwizard-x.x.x.zip' aus.<br />
                                      &bull; Nun öffnet sich der OpenKD Wizard. In diesem müssen Sie ein Build auswählen und installieren. Nach der Installation schließt sich Kodi.<br />
                                      &bull; Öffnen Sie Kodi erneut warten Sie bis die zusätzlich benötigten Addons sich installiert haben.<br />
                                      &bull; Wenn Sie nun im Tab 'Filme-Serien' auf 'xStream' gehen können Sie mithilfe der globalen Suche nach Filmen oder Serien suchen.",
                                     "&bull; Laden Sie sich einen der Launcher (BlueSky, BLauncher) von dem <a target='_blank' href='https://discord.gg/HEbWRhtHYX'>Discord Server</a> im Unterserver #releases herunter.<br />
                                      &bull; Entpacken Sie das Archiv.<br />
                                      &bull; Laden Sie sich im Microsoft Store die Minecraft Demo Version herunter.<br />
                                      &bull; Wenn Sie nun die Datei (.exe) im entpackten Ordner öffnen und im Launcher auf spielen klicken wird die installierte Demo Version von Minecraft zur Vollversion.<br />
                                      &bull; Bei Fragen können Sie diese auf dem Discord Server im Unterserver #support stellen.", 
                                     "&bull; Rufen Sie die Webseite <a target='_blank' href='https://steamunlocked.net'>https://steamunlocked.net</a> auf.<br />
                                      &bull; Finden Sie das Spiel, das Sie spielen möchten und klicken Sie auf den Download Knopf.<br />
                                      &bull; Warten Sie bis die Zeit abgelaufen ist und klicken Sie auf Free Download (Sie müssem mehrmals darauf klicken wenn sich ein neues Browser Fenster öffnet).<br />
                                      &bull; Entpacken Sie die heruntergeladene Datei um das Spiel zu spielen.",
                                     "&bull; Rufen Sie die Webseite <a target='_blank' href='https://online-fix.me/'>https://online-fix.me/</a> auf.<br />
                                      &bull; Sie müssen ein kostenloses Konto erstellen, um ein Spiel herunterzuladen.<br />
                                      &bull; Finden Sie das Spiel, das Sie mit Mehrspieler Unterstützung spielen möchten.<br />
                                      &bull; Laden Sie gegebenenfalls den entsprechenden Launcher herunter. (<a target='_blank' href='https://store.steampowered.com/about/'>Steam</a>, <a target='_blank' href='https://www.epicgames.com/shadowcomplex/download'>Epic Games</a>)<br />
                                      &bull; Folgen Sie den Anweisungen unterhalb der Downloads, um das Spiel einzurichten."];

            $free_download_urls = ["",
                                   "", 
                                   "", 
                                   "https://download1346.mediafire.com/u0d0dk7vh9fg/5ij4n6cytap6c9b/Raft.zip", "https://www.mediafire.com/file/26aqfo4fcibhlzy/Terraria%252BTModLoader.zip/file"];

            $hide_section = true;

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