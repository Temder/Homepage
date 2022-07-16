<div class="p-4">
    <!--<svg width="180" viewbox="0 0 90 90">
        <polygon points="20,45 45,20 70,45 62.5,45 62.5,70 50,70 50,55 45,55 45,43 47.5,43 50.5,40 50.5,35 47.5,32 42.5,32 39.5,35 39.5,40 42.5,43 45,43 45,55 40,55 40,70 27.5,70 27.5,45" />
    </svg>
    
    <a-scene>
        <a-sky src="images/a360.jpg"></a-sky>
    </a-scene>
    <iframe allowfullscreen src="../panorama.html"></iframe>-->

    <!--<script>
        function setPanoPath(number){
            viewer.destroy(panoramas[a]);
            a = number;
            var panorama = new PANOLENS.ImagePanorama("images/pano/pano"+number+".jpg");
            viewer.add(panorama);
        }
    </script>
    
    <div id="pano360" style="width: 45vw; height: 45vh;">
        <script>
            var container = document.querySelector("#pano360");
            const panoramas = new Array();
            for (let index = 0; index < 2; index++) {
                var panorama = new PANOLENS.ImagePanorama("images/pano/pano"+index+".jpg");
                panoramas.push(panorama);
            }
            console.log(panoramas);
            var viewer = new PANOLENS.Viewer({ container: container, autoRotate: true, autoRotateSpeed: 1, autoRotateActivationDuration: 0 });
            var a = 0;
            viewer.add(panorama[a]);
            viewer.addUpdateCallback(function() {
            });
        </script>
    </div>
    <div>
        <?php
            for ($i=0; $i < count($test_panorama_paths); $i++) {
                echo("<img class='panoPreview' src='".$test_panorama_paths[$i]."' onclick='"."setPanoPath(`".$i."`)' />");
            }
        ?>
    </div>-->

    <div class="wheel" id="colorWheelDemo"></div>
</div>
