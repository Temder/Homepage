<div class="lang de">
    <h4><?=$free_download_text?></h4>
    <a <?php if ($free_download_urls[$i] != "") {echo("href='$free_download_urls[$i]'");} ?>
        onmouseover="scaleImageUp('freeImg<?=$i?>')" 
            onfocus="scaleImageUp('freeImg<?=$i?>'), scrollToObject('freeImg<?=$i?>')" 
        onmouseout="scaleImageDown('freeImg<?=$i?>')" 
        onfocusout="scaleImageDown('freeImg<?=$i?>')"
        target='_blank'>
        <?php if ($free_download_image_path != "") {echo("<img id='freeImg$i' src='$free_download_image_path' style='height: 85px;' />");} else {echo("<div class='lang de' style='transform: translateX(15px);'>Kein direkter Download vefügbar.</div><div class='lang en' style='transform: translateX(15px);'>No direct download avaible.</div>");} ?>
    </a>
    <?php if ($free_names_en[$i] == "Online Fix - Free Multiplayer Games") {
        echo("<a href='".$free_download_urls[$i + 1]."' target='_blank'>Terraria + TModLoader</a>");
    } ?>
</div>
<div class="lang en">
    <h4><?=$free_download_text?></h4>
    <a <?php if ($free_download_urls[$i] != "") {echo("href='$free_download_urls[$i]'");} ?>
        onmouseover="scaleImageUp('freeImg<?=($i + $section_count)?>')" 
            onfocus="scaleImageUp('freeImg<?=($i + $section_count)?>'), scrollToObject('freeImg<?=($i + $section_count)?>')" 
        onmouseout="scaleImageDown('freeImg<?=($i + $section_count)?>')" 
        onfocusout="scaleImageDown('freeImg<?=($i + $section_count)?>')"
        target='_blank'>
        <?php if ($free_download_image_path != "") {echo("<img id='freeImg".($i + $section_count)."' src='$free_download_image_path' style='height: 85px;' />");} else {echo("<div class='lang de' style='transform: translateX(15px);'>Kein direkter Download vefügbar.</div><div class='lang en' style='transform: translateX(15px);'>No direct download avaible.</div>");} ?>
    </a>
</div>