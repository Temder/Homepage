<div class="p-4">
    <a id="picLinkMc" 
       href="<?=$game_urls[$i]?>" 
       target="_blank" 
       style="cursor: pointer;" 
       onmouseover="scaleImageUp('<?=$game_picture_scales[$i]?>')" 
           onfocus="scaleImageUp('<?=$game_picture_scales[$i]?>')" 
        onmouseout="scaleImageDown('<?=$game_picture_scales[$i]?>')" 
        onfocusout="scaleImageDown('<?=$game_picture_scales[$i]?>')">
        <img id="<?=$game_picture_scales[$i]?>" src="images/<?=$game_picture_paths[$i]?>">
    </a>
</div>