//#region 1. Local storage
if (localStorage.getItem('current_page')) {
    var current_page = localStorage.getItem('current_page');
} else {
    var current_page = 'home';
    localStorage.setItem('current_page', current_page)
}
if (localStorage.getItem('language')) {
    var userLang = localStorage.getItem('language')
} else {
    var userLang = window.navigator.userLanguage || window.navigator.language;
}
var shortLang = userLang.split('-')[0];
if (localStorage.getItem('radios')) {
    var radios = JSON.parse(localStorage.getItem('radios'));
    /*{
        'https://static.radiodresden.de/cms/data/slp/Webradio/Radio_Dresden/radio-dresden.svg': 'https://edge12.radio.radiodresden.de/radiodresden-live/stream/mp3?aggregator=radioplayer&=&&___cb=148297866039774',
        'https://tse1.mm.bing.net/th?id=OIP.KVje53CP4WaY-QYELtFG6wHaHa&pid=Api': 'https://mdr-284320-0.sslcast.mdr.de/mdr/284320/0/mp3/high/stream.mp3',
        'https://i1.sndcdn.com/artworks-ym6rnHoPcSVPPyMA-Gkyisg-t500x500.jpg': 'http://streams.radiopsr.de/psr-live/mp3-192/mediaplayer'
    }*/// https://tse3.mm.bing.net/th?id=OIP.Sy64rn8wA7AMk6KvmTm-sQHaHa&pid=Api
} else {
    var radios = {};
    localStorage.setItem('radios', JSON.stringify(radios))
}
if (localStorage.getItem('volume')) {
    var volume = localStorage.getItem('volume');
} else {
    var volume = 100;
}
if (localStorage.getItem('wave')) {
    var showWave = localStorage.getItem('wave');
} else {
    var showWave = true;
}
if (localStorage.getItem('theme')) {
    var currentTheme = localStorage.getItem('theme');
} else {
    var currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
}
if (localStorage.getItem('background')) {
    var background = JSON.parse(localStorage.getItem('background'));
} else {
    var background = {
        type: 'color',
        color: 'var(--color-main-bg)',
        gradient: 'linear-gradient(purple, blue)',
        image: 'url(./images/background.jpg)'
    };
    localStorage.setItem('background', JSON.stringify(background))
}
if (localStorage.getItem('color_picker_knob_position')) {
    var color_picker_knob_position = JSON.parse(localStorage.getItem('color_picker_knob_position'));
} else {
    var color_picker_knob_position = { x: 0, y: 0 };
    localStorage.setItem('color_picker_knob_position', JSON.stringify(color_picker_knob_position));
}
//#endregion




//#region 2. Functions
function calculateRatio (a, b) {
    return (b == 0) ? a : calculateRatio (b, a%b);
}
function fileExists(image_url){
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
}
function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
function changeTheme() {
    Object.entries(cssVariables).forEach(([key, val]) => {
        var var1 = getComputedStyle(document.documentElement).getPropertyValue(key)
        var var2 = getComputedStyle(document.documentElement).getPropertyValue(val)
        document.documentElement.style.setProperty(key, var2);
        document.documentElement.style.setProperty(val, var1);
    })
}
//#endregion




//#region Ajax content changing
function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const urlFragment = window.location.hash.substring(1);
            document.getElementById('main').innerHTML = this.responseText;
            if (urlFragment == 'home') {
                fetchViews();
            }
            else if (urlFragment == 'radio-stations') {
                radio(radios);
            }
            else if (document.getElementById('languageSelect') != null) {
                document.getElementById('languageSelect').value = shortLang;
                document.getElementById('backgroundSelect').value = `${background.type}_${shortLang}`;
                document.getElementById('volumeSlider').value = volume;
                document.getElementById('volumeSlider').nextElementSibling.textContent = `${volume} %`;
                if (showWave == 'true') {
                    document.getElementById('waveSwitch').checked = true;
                }
            }
            else if (urlFragment == 'blog') {
                const imgGallery = document.getElementsByClassName('cssImageGallery')[0];
                for (let i = 0; i < 10; i++) {
                    var randID = Math.floor(Math.random() * 86);
                    var randWidth = Math.floor(Math.random() * 200) + 100;
                    var randHeight = Math.floor(Math.random() * 200) + 100;
                    imgGallery.insertAdjacentHTML('afterbegin', `<img src="https://picsum.photos/id/${randID}/${randWidth}/${randHeight}" tabindex="0"></div>`);
                }
                nav = document.getElementById('calendar-nav');
                nav.addEventListener('click', function (e) {
                    if (e.offsetX > nav.offsetWidth) {
                        if (current_view == 'week') {
                            changeWeek(1);
                        } else if (current_view == 'month') {
                            changeMonth(1);
                        }
                    } else if (e.offsetX < 0) {
                        if (current_view == 'week') {
                            changeWeek(-1);
                        } else if (current_view == 'month') {
                            changeMonth(-1);
                        }
                    }
                });
                document.getElementById('event-form').addEventListener('submit', function(event) {
                    event.preventDefault();
                    
                    const formData = new FormData(this);
                    const data = {};
                    formData.forEach((value, key) => (data[key] = value));
                    
                    fetch('/create_event', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    })
                    .then(response => response.text())
                    .then(data => {
                        console.log('Created Event');
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                    calendarShowEvents(this[2].value.substring(8, 10));
                });
                initCalendar(true);
                initSnake();
                displayTiles();
            }
            else if (urlFragment == 'image-generation') {
                var generatedImage = document.getElementById('generated-image');
                var width = document.getElementById('width');
                var height = document.getElementById('height');
                //var ratio = document.getElementById('aspect_ratio');

                async function getStatus() {
                    const response = await fetch('/generationStatus');
                    var status = await response.json();
                    console.log(status);
                    /*if (status.queue_size === 0) {
                        console.log("Nothing is being generated");
                    } else {
                    }*/
                }
                function set_ratio() {
                    var w = width.value;
                    var h = height.value;
                    if (w && h) {
                        console.log(`${w} : ${h}`);
                        var ratio_num = calculateRatio(w, h);
                        var ratio = [w/ratio_num, h/ratio_num];
                        console.log(`${ratio[0]} : ${ratio[1]}`);
                        generatedImage.style.aspectRatio = `${ratio[0]} / ${ratio[1]}`;
                    }
                }
                width.addEventListener("input", (event) => set_ratio());
                height.addEventListener("input", (event) => set_ratio());
                document.getElementById('get-status').addEventListener('click', async (event) => {
                    const response = await fetch('/generationStatus');
                    var status = await response.json();
                    console.log(status);
                });

                document.getElementById('image-form').addEventListener('submit', async (event) => {
                    event.preventDefault();

                    const prompt = document.getElementById('prompt').value;
                    const width = document.getElementById('width').value;
                    const height = document.getElementById('height').value;
                    //const style = document.getElementById('style').value;

                    const response = await fetch('/generate-image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ prompt, width, height })
                    });

                    const result = await response.json();
                    if (response.ok) {
                        generatedImage.src = result.imageUrl;
                        document.getElementById('img-container').insertAdjacentHTML('afterbegin', `<img src="${result.imageUrl}" />`);
                    } else {
                        alert('Failed to generate image');
                        console.log(response);
                    }
                });
                var images;
                async function fetchImages() {
                    try {
                        const response = await fetch('/images');
                        images = await response.json();
                        if (images.length == 0) {
                            document.getElementById('img-container').appendChild(document.createTextNode('No images found.'));
                            return;
                        }
                        images.sort((a, b) => {
                            let numA = parseInt(a.match(/\d+/)[0]);
                            let numB = parseInt(b.match(/\d+/)[0]);
                            return numA - numB;
                        });
                        images.forEach(img => {
                            document.getElementById('img-container').insertAdjacentHTML('afterbegin', `<img src="${img}" tabindex="0" />`);
                        });
                    } catch (error) {
                        console.error('Error fetching images:', error);
                    }
                }
                fetchImages();
                /*for (let i = 0; i < images.length; i++) {
                    ai_image_number = i;
                    if (!fileExists(`./images/generated_image${i}.jpg`)) {
                        break;
                    }
                    document.getElementById('img-container').insertAdjacentHTML('afterbegin', `<img src="./images/generated_image${i}.jpg" />`);
                }*/
                /*ratio.addEventListener("change", (event) => {
                    var selectedRatio = ratio[ratio.selectedIndex].innerHTML;
                    var selectedRatioSplit = selectedRatio.split(':');
                    generatedImage.width = selectedRatioSplit[0] * 100;
                    generatedImage.height = selectedRatioSplit[1] * 100;
                    generatedImage.style.aspectRatio = `${selectedRatioSplit[0]} / ${selectedRatioSplit[1]}`;
                });*/
            }
            else if (urlFragment == 'threejs') {
                initThree();
            }
            else if (urlFragment == 'settings') {
                if (document.getElementById('backgroundSelect').value.includes('color')) {
                    document.getElementsByClassName('colorPicker')[0].style.display = 'block';
                    colorPicker();
                }
            }
        }
    };
    xhttp.open('GET', `/${page}`, true);
    xhttp.send();
}
window.addEventListener('popstate', function(event) {
    radio_id = 0;
    current_page = document.location.hash.replace('#', '');
    loadPage(current_page + '.html');
    localStorage.setItem('current_page', current_page)
    document.querySelectorAll('nav > a').forEach(el => {
        el.classList.remove('active');
        if (document.location.hash == el.getAttribute('href')) {
            el.classList.add('active');
        }
    })
})

loadPage(`${current_page}.html`);
document.location.hash = current_page;
document.querySelectorAll('nav > a').forEach(el => {
    el.classList.remove('active');
    if (document.location.hash == el.getAttribute('href')) {
        el.classList.add('active');
    }
})
//#endregion




//#region Background switcher
document.documentElement.style.setProperty('--color-main-bg-custom', background.color);
function setBackgroundType(type) {
    type = type.replace(`_${shortLang}`, '');
    background.type = type;
    document.body.style.background = background[`${type}`];
    localStorage.setItem('background', JSON.stringify(background));
    if (['image', 'gradient'].includes(type)) {
        document.documentElement.style.setProperty('--text-shadow-enabled', '1');
        if (document.getElementById('colorPicker')) {
            document.getElementsByClassName('colorPicker')[0].style.display = 'none';
        }
    } else {
        document.documentElement.style.setProperty('--text-shadow-enabled', 'false');
        if (document.getElementById('colorPicker')) {
            document.getElementsByClassName('colorPicker')[0].style.display = 'block';
            colorPicker();
        }
    }
}
setBackgroundType(background.type);
//#endregion




//#region Color picker
function colorPicker() {
    // Cache DOM elements
    const colorKnob = document.getElementById('colorKnob');
    const colorPicker = document.getElementById('colorPicker');
    //const colorDisplay = document.getElementById('colorDisplay');
    const ctx = colorPicker.getContext('2d');
    
    // Set canvas size
    colorPicker.width = 200;
    colorPicker.height = 200;
    
    // Cache geometric values
    const rect = colorPicker.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY);

    // Draw color wheel using small segments
    for (let angle = 0; angle < 360; angle++) {
        const startAngle = (angle - 2) * Math.PI / 180;
        const endAngle = angle * Math.PI / 180;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius - 1, startAngle, endAngle);
        ctx.closePath();
        
        const hue = angle;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fill();
    }

    // Add white/black radial gradient
    const radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    radialGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    radialGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0)');
    radialGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0)');
    radialGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = radialGradient;
    ctx.fill();

    // Initialize knob position
    let isDragging = false;
    let animationFrameId = null;
    let currentX = centerX;
    let currentY = centerY;

    colorKnob.style.left = centerX + color_picker_knob_position.x + 'px';
    colorKnob.style.top = centerY + color_picker_knob_position.y + 'px';

    function updateColor(x, y) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        //colorDisplay.textContent = `Selected Color: ${rgbToHex(pixel[0], pixel[1], pixel[2])}`;
        //colorDisplay.style.color = color;
        colorKnob.style.backgroundColor = color;
        document.documentElement.style.setProperty('--color-main-bg-custom', color);
        background.color = color;
        localStorage.setItem('background', JSON.stringify(background));

        const luminance = getLuminance(pixel[0], pixel[1], pixel[2]);
        const changeTo = luminance < 0.5 ? 'dark' : 'light';
        if (changeTo != currentTheme) {
            currentTheme = changeTo;
            changeTheme();
        }
        document.body.style.backgroundColor = color;
        //document.documentElement.style.setProperty('--color-main-fg', textColor);
    }

    function handleKnobPosition(e) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Cache calculations
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const constrainedDistance = Math.min(distance, radius - 0.5);
        
        currentX = centerX + constrainedDistance * Math.cos(angle);
        currentY = centerY + constrainedDistance * Math.sin(angle);
        
        requestAnimationFrame(updateUI);
    }

    function updateUI() {
        colorKnob.style.left = currentX + 'px';
        colorKnob.style.top = currentY + 'px';
        color_picker_knob_position.x = parseInt(colorKnob.style.left) - centerX;
        color_picker_knob_position.y = parseInt(colorKnob.style.top) - centerY;
        localStorage.setItem('color_picker_knob_position', JSON.stringify(color_picker_knob_position));
        updateColor(currentX, currentY);
    }

    // Mouse events for dragging
    // Use passive listeners for better scroll performance
    colorKnob.addEventListener('pointerdown', () => isDragging = true, { passive: true });
    colorPicker.addEventListener('pointerdown', () => isDragging = true, { passive: true });

    document.addEventListener('pointermove', (e) => {
        if (isDragging) {
            handleKnobPosition(e);
        }
    }, { passive: true });
    
    document.addEventListener('pointerup', () => {
        isDragging = false;
        cancelAnimationFrame(animationFrameId);
    }, { passive: true });

    // Click event for direct color selection
    colorPicker.addEventListener('click', (e) => {
        if (e.target !== colorKnob) {
            handleKnobPosition(e);
        }
    }, { passive: true });

    // Initial color update
    updateColor(parseInt(colorKnob.style.left), parseInt(colorKnob.style.top));

    function rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    // Add fallback for pointer events
    if (!window.PointerEvent) {
        colorKnob.addEventListener('mousedown', () => isDragging = true);
        colorKnob.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove);
        
        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('touchend', () => isDragging = false);
    }

    // Fallback for requestAnimationFrame
    const requestFrame = window.requestAnimationFrame || 
                        window.webkitRequestAnimationFrame || 
                        window.mozRequestAnimationFrame || 
                        (cb => setTimeout(cb, 16));
}
//#endregion




//#region Calendar
const current_day = new Date();
var current_date;
var current_view;
var nav;
var view;
var events;

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}
Date.prototype.GetFirstDayOfWeek = function() {
    return (new Date(this.setDate(this.getDate() - this.getDay()+ (this.getDay() == 0 ? -6:1) )));
}
Date.prototype.GetLastDayOfWeek = function() {
    return (new Date(this.setDate(this.getDate() - this.getDay() + 7)));
}
function changeMonth(offset) {
    current_date.setDate(1)
    current_date.setMonth(current_date.getMonth() + offset);
    initCalendar(false);
}
function changeWeek(offset) {
    current_date.setDate(current_date.getDate() + (offset * 7));
    initCalendar(false);
}
function calendarChangeView(view) {
    current_view = view;
    initCalendar(false);
}
function calendarShowEvents(day) {
    events.innerHTML = `<div><b><u>${new Date(current_date.getFullYear(), current_date.getMonth(), day).toLocaleString(userLang, { weekday: 'long' })}, ${day}. ${current_date.toLocaleString(userLang, { month: 'long' })} ${current_date.getFullYear()}</u></b></div>`;
    var year = current_date.getFullYear();
    var month = current_date.getMonth() + 1;
    if (month.toString().length == 1) {
        month = `0${month}`;
    }
    if (day.toString().length == 1) {
        day = `0${day}`;
    }
    fetch(`/api/calendar/${year}-${month}-${day}`)
        .then(response => response.json())
        .then(day_events => {
            for (let i = 0; i < day_events.length; i++) {
                var html = `
                <div style="text-align: center;" onclick='this.remove(); calendarRemoveEvent(${day_events[i]['event_id']})'>
                    <div><b>${day_events[i]['title']}</b></div>
                    <div>${day_events[i]['description']}</div>
                    <div><div class="de">Zeit: </div><div class="en">Time: </div>${day_events[i]['start_time']} - ${day_events[i]['end_time']}</div>
                </div>`;
                events.insertAdjacentHTML('beforeend', html);
            }
        })
        .catch(error => {
            console.error('Error fetching day events:', error);
        });
}
function calendarRemoveEvent(event_id) {
    fetch(`/api/calendar/remove/${event_id}`)
        .catch(error => {
            console.error('Error sending remove event:', error);
        })
}
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}
function initCalendar(standard) {
    if (standard) {
        current_date = new Date();
        current_view = 'month';
    }
    var first_day_week = current_date.GetFirstDayOfWeek();
    var last_day_week = current_date.GetLastDayOfWeek();
    view = document.getElementById('calendar-view');
    events = document.getElementById('calendar-event');
    function addDay(day, monthOffset) {
        var weekday = new Date(current_date.getFullYear(), current_date.getMonth() + monthOffset, day);
        var weekdayShort = weekday.toLocaleString(userLang, { weekday: 'short' });
        if (isSameDay(weekday, current_day)) {
            view.insertAdjacentHTML('beforeend', `<div class="noselect today" onclick="calendarShowEvents(${day})"><div>${day}</div><div>${weekdayShort}</div></div>`);
        } else if (weekday.getDay() === 0 || weekday.getDay() === 6) {
            view.insertAdjacentHTML('beforeend', `<div class="noselect weekend" onclick="calendarShowEvents(${day})"><div>${day}</div><div>${weekdayShort}</div></div>`);
        } else {
            view.insertAdjacentHTML('beforeend', `<div class="noselect" onclick="calendarShowEvents(${day})"><div>${day}</div><div>${weekdayShort}</div></div>`);
        }
    }
    nav.textContent = `${current_date.toLocaleString(userLang, { month: 'long' })}, ${current_date.getFullYear()}`;
    view.innerHTML = '';
    if (current_view == 'week') {
        if (first_day_week.getDate() < last_day_week.getDate()) {
            for (let i = first_day_week.getDate(); i <= last_day_week.getDate(); i++) {
                addDay(i, 0);
            }
        } else {
            for (let i = first_day_week.getDate(); i <= daysInMonth(current_date.getMonth(), current_date.getFullYear()); i++) {
                addDay(i, -1);
            }
            for (let i = 1; i <= last_day_week.getDate(); i++) {
                addDay(i, 0);
            }
        }
    } else if (current_view == 'month') {
        var dim = daysInMonth(current_date.getMonth() + 1, current_date.getFullYear());
        var emptyDaysBefore = new Date(current_date.getFullYear(), current_date.getMonth(), 1).getDay() - 1;
        var emptyDaysAfter = 7 - ((dim + emptyDaysBefore) % 7);
        if (emptyDaysBefore == -1) { emptyDaysBefore = 6; }
        if (emptyDaysAfter == 7) { emptyDaysAfter = 0; }
        for (let i = 0; i < emptyDaysBefore; i++) {
            view.insertAdjacentHTML('beforeend', '<div class="noselect"></div>');
        }
        for (let i = 1; i <= dim; i++) {
            addDay(i, 0);
        }
        for (let i = 0; i < emptyDaysAfter; i++) {
            view.insertAdjacentHTML('beforeend', '<div class="noselect"></div>');
        }
    }
}
//#endregion




//#region ChatGPT Snake
var canvas;
var ctx;
var canvasSize;
function initSnake() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvasSize = canvas.width / gridSize;
    resetGame();
    setInterval(update, 100);
}
const gridSize = 20;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}
function drawSnake() {
    snake.forEach(segment => drawSquare(segment.x, segment.y, 'lime'));
}
function drawFood() {
    drawSquare(food.x, food.y, 'red');
}
function moveSnake() {
    const head = { x: (snake[0].x + direction.x + canvasSize) % canvasSize, y: (snake[0].y + direction.y + canvasSize) % canvasSize };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    if (isCollision(head)) {
        resetGame();
    }
}
function generateFood() {
    food = {
        x: Math.floor(Math.random() * canvasSize),
        y: Math.floor(Math.random() * canvasSize)
    };

    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}
function isCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    generateFood();
}
function update() {
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    drawSnake();
    drawFood();
    moveSnake();
}
function changeDirection(event) {
    var keyPressed = null;
    if (event.keyCode) {
        keyPressed = event.keyCode;
    } else {
        keyPressed = event;
    }
    const goingUp = direction.y === -1;
    const goingDown = direction.y === 1;
    const goingRight = direction.x === 1;
    const goingLeft = direction.x === -1;

    if ((keyPressed === 37 || keyPressed === 65) && !goingRight) { // Left arrow or 'A'
        direction = { x: -1, y: 0 };
    }
    if ((keyPressed === 38 || keyPressed === 87) && !goingDown) { // Up arrow or 'W'
        direction = { x: 0, y: -1 };
    }
    if ((keyPressed === 39 || keyPressed === 68) && !goingLeft) { // Right arrow or 'D'
        direction = { x: 1, y: 0 };
    }
    if ((keyPressed === 40 || keyPressed === 83) && !goingUp) { // Down arrow or 'S'
        direction = { x: 0, y: 1 };
    }
}

document.addEventListener('keydown', changeDirection);
//#endregion




//#region Google sheets data to design
async function fetchData() {
    const response = await fetch('https://docs.google.com/spreadsheets/d/1zBpsrdUATURiaGNlYA5HARufxfV7wHWR2xjB8X5Z6fk/gviz/tq?tqx=out:json&gid=1614622755');
    const text = await response.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    return json.table;
}

function createTile(item, titles) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.innerHTML = `
        ${item.c[titles.indexOf('Bild')].v ? `<img src="${item.c[titles.indexOf('Bild')].v}" alt="${item.c[titles.indexOf('Name')].v}">` : ''}
        <h3>${item.c[titles.indexOf('Name')].v}</h3>
        ${item.c[titles.indexOf('Beschreibung')] ? `<span>${item.c[titles.indexOf('Beschreibung')].v}</span>` : ''}
        <div>
            <strong>${item.c[titles.indexOf('Preis')].v == 0.0 ? 'Preis nach Absprache' : `${item.c[titles.indexOf('Preis')].f} pro Woche`}</strong>
            <div>${item.c[titles.indexOf('Verfügbar')].v} von ${item.c[titles.indexOf('Bestand')].v}<br>verfügbar</div>
        </div>
    `;
    return tile;
}

async function displayTiles() {
    const data = await fetchData();
    const titles = data.cols.map(col => col.label);
    const rows = data.rows;
    const tileList = document.getElementById('tile-list');
    rows.forEach(item => {
        const tile = createTile(item, titles);
        tileList.appendChild(tile);
    });
}
//#endregion




//#region Language switcher
document.body.setAttribute('id', 'lang-' + shortLang);

function setLanguage(lang) {
    userLang = lang;
    shortLang = userLang.split('-')[0];
    document.body.setAttribute('id', 'lang-' + lang);
    localStorage.setItem('language', lang);
    
    document.getElementById('backgroundSelect').value = `${background.type}_${shortLang}`;
}
//#endregion




//#region Radio
const radio_template = document.getElementById('radio-template');
const audio = document.getElementById('audio-player');
var radio_id = 0;

function play(radio, src) {
    if (!audio.paused && radio.id.replace('radio', '') == audio.getAttribute('data-playing-station')) {
        radio.classList.remove('radio-active');
        audio.removeAttribute('data-playing-station');
        audio.pause();
        console.log(`pausing audio with station ${radio.id} and URL ${audio.src}`);
    } else {
        audio.src = src;
        audio.setAttribute('data-playing-station', radio.id.replace('radio', ''));
        document.getElementById('radios').querySelectorAll('div > a:nth-child(1)').forEach(a => {
            a.classList.remove('radio-active');
        })
        radio.classList.add('radio-active');

        url = audio.src.split('?')[0];
        var e1 = url + '?' + new Date().getTime();
        audio.src = e1;

        audio.play();
        console.log(`playing audio with station ${radio.id} and URL ${audio.src}`);
    }
}

function remove(radio) {
    let img_url = window.getComputedStyle(radio, false).backgroundImage.slice(4, -1).replace(/"/g, "");
    delete radios[img_url]
    localStorage.setItem('radios', JSON.stringify(radios));
    radio.parentNode.parentNode.removeChild(radio.parentNode);
}

function addRadio() {
    let img = document.getElementById('radio-img').value;
    let src = document.getElementById('radio-src').value;
    if (img != '' && src != '') {
        document.getElementById('radio-img').value = document.getElementById('radio-src').value = '';
        let rad = {[img]: src};
        radio(rad);
        console.log(`Added ${rad} to local storage`);
        localStorage.setItem('radios', JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('radios')), rad)));
    }
}

function radio(r) {
    Object.entries(r).forEach(([img, src]) => {
        let clone = radio_template.content.cloneNode(true);
        var link = clone.querySelector('div > a:nth-child(1)');
        var del = clone.querySelector('div > a:nth-child(2)');

        link.id = `radio${radio_id}`;
        link.classList.add('radio-link');
        link.setAttribute("onclick", `play(${link.id}, "${src}")`);
        del.classList.add('radio-del');
        del.setAttribute("onclick", `remove(radio${radio_id})`);
        if (audio.getAttribute('data-playing-station') == radio_id) {
            link.classList.add('radio-active');
        }

        document.styleSheets[0].insertRule(`#radio${radio_id}{background-image: url(${img});background-position: center center;background-size: cover;}`, document.styleSheets[0].cssRules.length - 5);
        document.getElementById('radios').appendChild(clone);
        radio_id++;
      
    })
}
//#endregion




//#region Scroll to active element
document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        setTimeout(function() {
            var activeElement = document.activeElement;
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 0);
    }
});
//#endregion




//#region Show/Hide Element
function showHideEle(ele) {
    ele.classList.toggle('hidden')
}
//#endregion




//#region Theme switcher
var style = document.styleSheets[0].cssRules[0].style;
var userTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const cssVariables = {};
for (let i = 1; i < style.length; i=i+2) {
  cssVariables[style[i-1]] = style[i];
}

document.querySelectorAll('.changeTheme').forEach(el => {
    el.addEventListener('click', function() {
        changeTheme();
        currentTheme = currentTheme == 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
    })
})
if (userTheme != currentTheme) {
    changeTheme();
}
//#endregion




//#region THREE.js
//#endregion




//#region Wave
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

const wave = document.getElementById('wave');
var randDir = getRandom(200, 300);
var rand = getRandom(-1, 0.5);
var randColorChange = getRandom(9, 15);
var randHeightChange = getRandom(20, 45);

for (let i = 0; i < 5; i++) {
    var curve = `M0 400
                 v${-100 - i * randHeightChange}
                 c50 ${randDir}, 350 ${(100 - i * randHeightChange * 0.75) + randDir * rand}, 400 ${100 - i * randHeightChange * 0.75}
                 L400 400`;
    var svg = `<path d="${curve}" stroke-width="0" fill="hsl(204, 100%, ${30 + i * randColorChange}%)">
               <animate attributeName="d" values="${curve};
               M0 400
               v${-105 - i * randHeightChange}
               c250 ${randDir + 100}, 150 ${100 - i * randHeightChange * 0.75 + (randDir - 100) * rand}, 400 ${100 - i * randHeightChange * 0.75}
               L400 400;
               ${curve}" dur="5s" repeatCount="indefinite"/></path>`;
    wave.insertAdjacentHTML('afterbegin', svg);
}
function setWave(value) {
    showWave = value;
    localStorage.setItem('wave', value);
    showHideEle(wave);
}
if (showWave == 'false') {
    showHideEle(wave);
}
//#endregion




//#region Volume
function setVolume(self, value) {
    volume = value;
    self.nextElementSibling.textContent = `${volume} %`;
    localStorage.setItem('volume', volume);
}
//#endregion




//#region Views
function fetchViews() {
    fetch('/api/views')
        .then(response => response.json())
        .then(views => {
            document.getElementById('views-all').innerHTML = `<div>${views.reduce((sum, item) => sum + item.views, 0)}</div>`;
            document.getElementById('views-unique').innerHTML = `<div>${views.length}</div>`;
        })
        .catch(error => {
            console.error('Error fetching view count:', error);
            document.getElementById('views-all').textContent = document.getElementById('views-unique').textContent = 'Error';
        });
}
//#endregion