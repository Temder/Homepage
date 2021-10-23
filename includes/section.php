<section class="section <?php if ($hide_section == 'true') {echo 'hideSection';}?>">
    <article>
        <h class="lang en"><?=$section_names[0]?></h>
        <h class="lang de"><?=$section_names[1]?></h>
        <br/><br/>
        <div class="d-flex flex-row flex-wrap justify-content-center">
            <?php
                if ($section_names[0] == "Home") {
                    for ($i=0; $i < count($home_count); $i++) {
                        include("./includes/home.php");
                    }
                }
                if ($section_names[0] == "PD Games") {
                    for ($i=0; $i < count($app_count); $i++) {
                        include("./includes/app.php");
                    }
                }
                if ($section_names[0] == "Radio Stations") {
                    for ($i=0; $i < count($radio_count); $i++) {
                        include("./includes/radioStation.php");
                    }
                }
                if ($section_names[0] == "Games") {
                    for ($i=0; $i < count($game_count); $i++) {
                        include("./includes/game.php");
                    }
                }
                if ($section_names[0] == "Contact") {
                    for ($i=0; $i < count($contact_count); $i++) {
                        include("./includes/contact.php");
                    }
                }
                if ($section_names[0] == "Test") {
                    for ($i=0; $i < count($test_count); $i++) {
                        include("./includes/test.php");
                    }
                }
                if ($section_names[0] == "Settings") {
                    for ($i=0; $i < count($settings_count); $i++) {
                        include("./includes/settings.php");
                    }
                }
            ?>
        </div>
    </article>
</section>