<section class="section <?php if ($section_name == 'PD Games') {echo 'hideSection';}?>">
    <article>
        <h><?=$section_name?></h><br/><br/>
        <div class="d-flex flex-row flex-wrap justify-content-center">
            <?php
                if ($section_name == "Home") {
                    for ($i=0; $i < count($home_count); $i++) {
                        include("./includes/home.php");
                    }
                }
                if ($section_name == "PD Games") {
                    for ($i=0; $i < count($app_count); $i++) {
                        include("./includes/app.php");
                    }
                }
                if ($section_name == "Radio Stations") {
                    for ($i=0; $i < count($radio_count); $i++) {
                        include("./includes/radioStation.php");
                    }
                }
                if ($section_name == "Games") {
                    for ($i=0; $i < count($game_count); $i++) {
                        include("./includes/game.php");
                    }
                }
                if ($section_name == "Contact") {
                    for ($i=0; $i < count($contact_count); $i++) {
                        include("./includes/contact.php");
                    }
                }
                if ($section_name == "Test") {
                    for ($i=0; $i < count($test_count); $i++) {
                        include("./includes/test.php");
                    }
                }
                if ($section_name == "Settings") {
                    for ($i=0; $i < count($settings_count); $i++) {
                        include("./includes/settings.php");
                    }
                }
            ?>
        </div>
    </article>
</section>