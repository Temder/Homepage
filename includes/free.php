<div class="p-4 box">
    <div class="lang de" style="text-align: left;">
        <h2>
            <img style="float: right;" src="<?=$free_picture_paths[$i]?>" />
            <?=$free_names_de[$i]?>
        </h2><br />
        <h4>Beschreibung</h4>
        <div><?=$free_descriptions_de[$i]?></div><br />
        <h4>Anleitung</h4>
        <div><?=$free_instructions_de[$i]?></div><br />
        <h4>Download</h4>
        <a <?php if ($free_download_urls[$i] != "") {echo("href='$free_download_urls[$i]'");} ?> 
            onmouseover="scaleImageUp('freeImg<?=$free_count[$i]?>')" 
                onfocus="scaleImageUp('freeImg<?=$free_count[$i]?>'), scrollToObject('freeImg<?=$free_count[$i]?>')" 
             onmouseout="scaleImageDown('freeImg<?=$free_count[$i]?>')" 
             onfocusout="scaleImageDown('freeImg<?=$free_count[$i]?>')">
            <img id="freeImg<?=$free_count[$i]?>" src="images/android.png" />
        </a>
        <ul style="list-style-type: decimal;">
            <li>apple</li>
            <li>banana</li>
            <li>pear</li>
        </ul>
    </div>
    <div class="lang en">
        <h2><?=$free_names_en[$i]?></h2>
        <h4>Description</h4>
        <?=$free_descriptions_en[$i]?><br /><br />
        <h4>Instructions</h4>
        <?=$free_instructions_en[$i]?><br /><br />
        <h4>Download</h4>
        <a href="<?=$free_download_urls[$i]?>">Link</a>
    </div>
</div>