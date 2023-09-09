<section class="section<?php if ($section_hide == 'true') {echo ' hideSection';}?>">
    <article>
        <h class="lang en"><?=$section_names[0]?></h>
        <h class="lang de"><?=$section_names[1]?></h>
        <br/><br/>
        <div class="d-flex flex-row flex-wrap justify-content-center">
            <?php
                for ($i=0; $i < $section_count; $i++) { 
                    include("./includes/$section_names[2]");
                }
            ?>
        </div>
    </article>
</section>