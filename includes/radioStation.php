<div class="p-2">
    <div style="position: relative;">
        <div class="playingOverlay">
            <svg class="logo" width="50" height="50" viewBox="0 0 245 238" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M101.837 53.1138L218.836 120.135C230.548 126.844 230.577 143.727 218.887 150.476L101.431 218.289C89.742 225.038 75.1358 216.572 75.1816 203.074L75.6386 68.2394C75.6841 54.8207 90.1933 46.4438 101.837 53.1138Z" stroke="white" stroke-width="15"/>
            </svg>
        </div>
    </div>

    <input class="radio <?php if ($radio_names[$i] != 'Radiowelle Pirna') {echo 'round';}?>" onclick="play(1, 'r1')" type="image" src="<?=$radio_picture_paths[$i]?>" alt="Stream: Radio Dresden">
    <h3><?=$radio_names[$i]?></h3>
    <audio tabindex="-1" style="display:none" id="<?=$radio_count[$i]?>" src="<?=$radio_stream_paths[$i]?>" preload="none"></audio>
</div>