<script src="https://cdn.jsdelivr.net/npm/@jaames/iro"></script>
<script src="js/scripts.js"></script>
    
<svg>
    <filter id="red-glow" filterUnits="userSpaceOnUse">
        <!-- blur the text at different levels-->
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur5"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur10"/>
        <!-- merge all the blurs except for the first one -->
        <feMerge result="blur-merged">
            <feMergeNode in="blur10"/>
            <feMergeNode in="blur20"/>
            <feMergeNode in="blur30"/>
            <feMergeNode in="blur50"/>
        </feMerge>
        <!-- recolour the merged blurs red-->
        <feColorMatrix result="red-blur" in="blur-merged" type="matrix"
                    values="0     0     0     0     0
                            0     0     0     0     0
                            0     0     1     1     0
                            0     0     0     1     0" />
        <feMerge>
            <feMergeNode in="red-blur"/>       <!-- largest blurs coloured red -->
            <feMergeNode in="blur5"/>          <!-- smallest blur left white -->
            <feMergeNode in="SourceGraphic"/>  <!-- original white text -->
        </feMerge>
    </filter>
</svg>