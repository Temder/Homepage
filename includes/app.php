<div class="p-2 box">
    <h2 id="heading"><?=$app_names[$i]?></h2>
    <img src="images/<?=$app_picture_paths[$i]?>" style="height: <?=$app_imgsize?>px;">
    <p class="lang de"><?=$app_descriptions_de[$i]?></p>
    <p class="lang en"><?=$app_descriptions_en[$i]?></p>
    <div class="download">
        <h4>Downloads</h4>
        <nobr>
            <a <?php if ($app_download_urls_android[$i] != "") {echo("href='$app_download_urls_android[$i]'");} ?> 
                onmouseover="scaleImageUp('appImg<?=$i + 1?>')" 
                    onfocus="scaleImageUp('appImg<?=$i + 1?>'), scrollToObject('appImg<?=$i + 1?>')" 
                 onmouseout="scaleImageDown('appImg<?=$i + 1?>')" 
                 onfocusout="scaleImageDown('appImg<?=$i + 1?>')">
                <img id="appImg<?=$i + 1?>" src="images/android.png" style="height: <?=$app_imgsize - 50?>px;" />
            </a>
            <a <?php if ($app_download_urls_windows[$i] != "") {echo("href='$app_download_urls_windows[$i]'");} ?> 
                onmouseover="scaleImageUp('appImg<?=$i + 1 + $section_count?>')" 
                    onfocus="scaleImageUp('appImg<?=$i + 1 + $section_count?>'), scrollToObject('appImg<?=$i + 1 + $section_count?>')" 
                 onmouseout="scaleImageDown('appImg<?=$i + 1 + $section_count?>')" 
                 onfocusout="scaleImageDown('appImg<?=$i + 1 + $section_count?>')">
                <img id="appImg<?=$i + 1 + $section_count?>" src="<?php if ($app_download_urls_windows[$i] == "") {echo ("images/cross.png");}else{echo ("images/windows.png");} ?>" style="height: <?=$app_imgsize - 50?>px;" />
            </a>
        </nobr>
    </div>
</div>