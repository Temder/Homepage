<div class="p-5 box">
    <div class="lang de" style="text-align: left;">
        <h2>
            <img style="height: <?=$free_img_height[$i]?>; <?php if ($free_names_en[$i] == " - Free Steam Singleplayer") {echo("float: left; transform: translateY(-20px);");} else {echo("float: right;");}?>padding-left: 20px;" src="<?=$free_picture_paths[$i]?>" />
            <?=$free_names_de[$i]?>
        </h2><br />
        <h4>Beschreibung</h4>
        <div style="transform: translateX(15px);"><?=$free_descriptions_de[$i]?></div><br />
        <h4>Anleitung</h4>
        <div style="transform: translateX(15px);"><?=$free_instructions_de[$i]?></div><br />
        <?php
            if ($free_names_en[$i] == "Online Fix - Free Multiplayer Games") {
                $free_download_text = "Vorgefertigte Spiele";
                $free_download_image_path = "images/raft.png";
            } else {
                if ($free_download_urls[$i] != "") {
                    $free_download_text = "Download";
                    $free_download_image_path = "images/android.png";
                } else {
                    $free_download_text = "Download";
                    $free_download_image_path = "";
                }
            }
            include("./includes/imageLink.php");
        ?>
    </div>
    <div class="lang en" style="text-align: left;">
        <h2>
            <img style="height: <?=$free_img_height[$i]?>; <?php if ($free_names_en[$i] == " - Free Steam Singleplayer") {echo("float: left; transform: translateY(-20px);");} else {echo("float: right;");}?>padding-left: 20px;" src="<?=$free_picture_paths[$i]?>" />
            <?=$free_names_en[$i]?>
        </h2><br />
        <h4>Description</h4>
        <div style="transform: translateX(15px);"><?=$free_descriptions_en[$i]?></div><br />
        <h4>Instructions</h4>
        <div style="transform: translateX(15px);"><?=$free_instructions_en[$i]?></div><br />
        <?php
            if ($free_names_en[$i] == "Online Fix - Free Multiplayer Games") {
                $free_download_text = "Premade games";
                $free_download_image_path = "images/raft.png";
            } else {
                if ($free_download_urls[$i] != "") {
                    $free_download_text = "Download";
                    $free_download_image_path = "images/android.png";
                } else {
                    $free_download_text = "Download";
                    $free_download_image_path = "";
                }
            }
            include("./includes/imageLink.php");
        ?>
    </div>
</div>