// Function to add click handlers to specific links
document.addEventListener('DOMContentLoaded', function() {
    // Get all links with the specific class
    const anchorLinks = document.querySelectorAll('a.anchor-link');
    
    // Add click handler to each link
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const url = new URL(this.href);
            if (url.hash) {
                localStorage.setItem('savedAnchor', url.hash.substring(1));
            }
        });
    });

    // Handle saved anchor scrolling
    const savedAnchor = localStorage.getItem('savedAnchor');
    if (savedAnchor) {
        const element = document.getElementById(savedAnchor);
        if (element && element.classList.contains('et_pb_toggle_close')) {
            element.querySelector('.et_pb_toggle_title').click()
            localStorage.removeItem('savedAnchor');
        }
    }
});