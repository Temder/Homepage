<?php if ($i == 0) {
    echo("
        <div id='panoViewer'></div>
    ");
} else {
    $j = $i - 1;
    $src = $pano_images[$j];
    echo("<input id='pano$j' class='panoPreview' type='image' src='$src' style='width: 200px; padding: 0px; border-radius: 20px; margin: 5px;' onclick='loadPanorama(`$src`, $j)'>
    ");
}?>