<div class="p-4 box">
    <h2 id="heading"><?=$app_names[$i]?></h2>
    <img src="images/<?=$app_picture_paths[$i]?>">
    <p class="lang de"><?=$app_descriptions_de[$i]?></p>
    <p class="lang en"><?=$app_descriptions_en[$i]?></p>
    <div class="download">
        <h4>Downloads</h4>
        <nobr>
            <a <?php if ($app_download_urls_android[$i] != "") {echo("href='$app_download_urls_android[$i]'");} ?> 
                onmouseover="scaleImageUp('appImg<?=$app_count[$i]?>')" 
                    onfocus="scaleImageUp('appImg<?=$app_count[$i]?>'), scrollToObject('appImg<?=$app_count[$i]?>')" 
                 onmouseout="scaleImageDown('appImg<?=$app_count[$i]?>')" 
                 onfocusout="scaleImageDown('appImg<?=$app_count[$i]?>')">
                <img id="appImg<?=$app_count[$i]?>" src="images/android.png" />
            </a>
            <a <?php if ($app_download_urls_windows[$i] != "") {echo("href='$app_download_urls_windows[$i]'");} ?> 
                onmouseover="scaleImageUp('appImg<?=$app_count[$i] + count($app_count)?>')" 
                    onfocus="scaleImageUp('appImg<?=$app_count[$i] + count($app_count)?>'), scrollToObject('appImg<?=$app_count[$i] + count($app_count)?>')" 
                 onmouseout="scaleImageDown('appImg<?=$app_count[$i] + count($app_count)?>')" 
                 onfocusout="scaleImageDown('appImg<?=$app_count[$i] + count($app_count)?>')">
                <img id="appImg<?=$app_count[$i] + count($app_count)?>" src="<?php if ($app_download_urls_windows[$i] == "") {echo ("images/cross.png");}else{echo ("images/windows.png");} ?>" />
            </a>
        </nobr>
    </div>
</div>