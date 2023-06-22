<div class="p-4">
    <h3 class="lang en">Volume</h3>
    <h3 class="lang de">Lautstärke</h3>

    <div class="slidecontainer">
        <input autocomplete="off" type="range" min="0" max="100" id="volumeSlider" class="slider">
    </div>
    <span id="volume"></span> %
</div>
<div class="p-4">
    <h3 class="lang en">Background Color</h3>
    <h3 class="lang de">Hintergrundfarbe</h3>

    <div class="wheel" id="colorWheelDemo"></div>
</div>
<div class="p-4">
    <h3 class="lang en">Background Blend Mode</h3>
    <h3 class="lang de">Hintergrundmischmodus</h3>

    <select autocomplete="off" id="blendmode">
        <option value="color">Color</option>
        <option value="color-burn">Color Burn</option>
        <option value="color-dodge">Color Dodge</option>
        <option value="darken">Darken</option>
        <option value="difference">Difference</option>
        <option value="exclusion">Exclusion</option>
        <option value="hard-light">Hard Light</option>
        <option value="hue">Hue</option>
        <option value="lighten">Lighten</option>
        <option value="luminosity">Luminosity</option>
        <option value="multiply">Multiply</option>
        <option value="normal">Normal</option>
        <option value="overlay">Overlay</option>
        <option value="saturation">Saturation</option>
        <option value="screen">Screen</option>
        <option value="soft-light">Soft Light</option>
    </select>
</div>
<div class="p-4">
    <h3 class="lang en">Background Configuration</h3>
    <h3 class="lang de">Hintergrundkonfiguration</h3>
    <button id="save" style="background-color: greenyellow; border: 0px; border-radius: 5px;"><div class="lang de">speichern</div><div class="lang en">save</div></button>
    <button id="load" style="background-color: aqua; border: 0px; border-radius: 5px;"><div class="lang de">laden</div><div class="lang en">load</div></button>
    <button id="reset" style="background-color: red; border: 0px; border-radius: 5px;"><div class="lang de">reset</div><div class="lang en">reset</div></button>
    <input id="inputBgConf" autocomplete=off list="layouts" type="text" name="bgConf" style="color: white;">
    <datalist id="layouts">
    </datalist>
</div>