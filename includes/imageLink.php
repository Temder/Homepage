<h4><?=$free_download_text?></h4>
<a <?php if ($free_download_urls[$i] != "") {echo("href='$free_download_urls[$i]'");} ?>
    onmouseover="scaleImageUp('freeImg<?=$free_count[$i]?>')" 
        onfocus="scaleImageUp('freeImg<?=$free_count[$i]?>'), scrollToObject('freeImg<?=$free_count[$i]?>')" 
     onmouseout="scaleImageDown('freeImg<?=$free_count[$i]?>')" 
     onfocusout="scaleImageDown('freeImg<?=$free_count[$i]?>')">
    <img id="freeImg<?=$free_count[$i]?>" src="<?=$free_download_image_path?>"/>
</a>