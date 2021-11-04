<div class="lang de">
    <h4><?=$free_download_text?></h4>
    <a <?php if ($free_download_urls[$i] != "") {echo("href='$free_download_urls[$i]'");} ?>
        onmouseover="scaleImageUp('freeImg<?=$free_count[$i]?>')" 
            onfocus="scaleImageUp('freeImg<?=$free_count[$i]?>'), scrollToObject('freeImg<?=$free_count[$i]?>')" 
        onmouseout="scaleImageDown('freeImg<?=$free_count[$i]?>')" 
        onfocusout="scaleImageDown('freeImg<?=$free_count[$i]?>')">
        <?php if ($free_download_image_path != "") {echo("<img id='freeImg$free_count[$i]' src='$free_download_image_path' />");} else {echo("<div class='lang de' style='transform: translateX(15px);'>Kein direkter Download vefügbar.</div><div class='lang en' style='transform: translateX(15px);'>No direct download avaible.</div>");} ?>
    </a>
</div>
<div class="lang en">
    <h4><?=$free_download_text?></h4>
    <a <?php if ($free_download_urls[$i] != "") {echo("href='$free_download_urls[$i]'");} ?>
        onmouseover="scaleImageUp('freeImg<?=($free_count[$i] + count($free_count))?>')" 
            onfocus="scaleImageUp('freeImg<?=($free_count[$i] + count($free_count))?>'), scrollToObject('freeImg<?=($free_count[$i] + count($free_count))?>')" 
        onmouseout="scaleImageDown('freeImg<?=($free_count[$i] + count($free_count))?>')" 
        onfocusout="scaleImageDown('freeImg<?=($free_count[$i] + count($free_count))?>')">
        <?php if ($free_download_image_path != "") {echo("<img id='freeImg".($free_count[$i] + count($free_count))."' src='$free_download_image_path' />");} else {echo("<div class='lang de' style='transform: translateX(15px);'>Kein direkter Download vefügbar.</div><div class='lang en' style='transform: translateX(15px);'>No direct download avaible.</div>");} ?>
    </a>
</div>