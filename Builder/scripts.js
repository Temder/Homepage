const editMenu = document.getElementById('editMenu');
const ground = document.getElementById('ground');
const stdEle = document.getElementById('standard');
const templates = document.getElementsByTagName('template');

var currentEleEdit = null;
var objCount = 0;

editMenu.addEventListener('click', function (e) {
    if (e.target === editMenu && e.offsetX < 0) {
        editMenu.hidden = 'true';
        editMenu.innerHTML = '';
        currentEleEdit.style.outline = '';
    }
});
editMenu.oncontextmenu = function() {
    return false;
}

Array.from(templates).forEach(temp => {
    const tempClone = temp.content.cloneNode(true);
    const tempObjClone = tempClone.children[0].cloneNode(true);
    const div = document.createElement('div');

    div.addEventListener('click', () => {
        tempObjClone.id = objCount++;
        tempObjClone.draggable = true;
        var obj = tempObjClone.cloneNode(true);
        obj.ondragstart = drag;
        obj.onmousedown = function(event) {
            if (event.which == 3) {
                editMenu.innerHTML = '';
                var classList = document.createElement('ul');
                classList.id = 'classList';
                for (let i = 1; i <= 10; i++) {
                }
                var computedStyles = getComputedStyle(event.target)
                Array.from(computedStyles).forEach(attr => {
                    var value = computedStyles.getPropertyValue(attr);
                    classList.insertAdjacentHTML('beforeend', `<li>${attr}<input type="text" value="${value}" /></li>`);
                })

                if (currentEleEdit) {
                    currentEleEdit.style.outline = '';
                }
                var edit = temp.content.children[1].cloneNode(true);
                var mousePos = [event.clientX, event.clientY];
                editMenu.style.left = `calc(${mousePos[0]}px - ${ground.offsetLeft}px)`;
                editMenu.style.top = `calc(${mousePos[1]}px - ${ground.offsetTop}px)`;
                editMenu.removeAttribute('hidden');
                editMenu.appendChild(edit);
                edit.insertAdjacentHTML('afterend', '<hr style="margin-bottom: 0">');
                editMenu.appendChild(classList);
                editMenu.insertAdjacentHTML('beforeend', `<hr style="margin-top: 0"><div onclick="applyChanges('${event.target.id}')">✅</div>`);
                edit.removeAttribute('hidden');
                currentEleEdit = event.target;
                currentEleEdit.style.outline = 'solid red 2px';
                event.stopPropagation();
            }
        }
        obj.oncontextmenu = function() {
            return false;
        }
        ground.appendChild(obj);
    });
    div.appendChild(tempClone);
    stdEle.appendChild(div);
})

function applyChanges(ele) {
    
}
function changeTag(self) {
    var cloned = document.createElement(self.value);
    Array.from(currentEleEdit.attributes).forEach(ele => {
        cloned.setAttribute(ele.name, ele.value);
    })
    setEvents(cloned);
    cloned.insertAdjacentHTML('afterbegin', currentEleEdit.innerHTML);
    Array.from(cloned.children).forEach(child => {
        if (child.hasAttribute('draggable')) {
            setEvents(child);
        }
    })
    currentEleEdit.insertAdjacentElement('afterend', cloned);
    currentEleEdit.remove();
    currentEleEdit = cloned;
}

function setEvents(ele) {
    ele.ondragstart = drag;
    ele.onmousedown = function(event) {
        if (event.which == 3) {
            editMenu.innerHTML = '';
            if (currentEleEdit) {
                currentEleEdit.style.outline = '';
            }
            editMenu.removeAttribute('hidden');
            var mousePos = [event.clientX, event.clientY];
            editMenu.style.left = `calc(${mousePos[0]}px - ${ground.offsetLeft}px)`;
            editMenu.style.top = `calc(${mousePos[1]}px - ${ground.offsetTop}px)`;
            var edit = document.querySelector(`.${event.target.classList[0]}`).parentNode.children[1].cloneNode(true);
            editMenu.appendChild(edit);
            if (edit.getElementsByTagName('select').length != 0) {
                edit.getElementsByTagName('select')[0].value = currentEleEdit.tagName.toLowerCase();
            }
            currentEleEdit = event.target;
            currentEleEdit.style.outline = 'solid red 2px';
            edit.removeAttribute('hidden');
        }
    }
    ele.oncontextmenu = function() {
        return false;
    }
}

function drag(event) {
    console.log(event);
    event.dataTransfer.setData('text', event.target.id);
    event.target.style.position = 'absolute';
    event.target.style.transform = 'translateX(-10000px)';
    document.querySelectorAll('.field').forEach(el => el.remove());
    var html = '<div class="field"></div>';
    Array.from(ground.querySelectorAll('[data-candrop]')).forEach(ele => {
        if (ele !== ground) {
            if (ele !== event.target && ele.tagName !== 'BUTTON') {
                ele.insertAdjacentHTML('beforebegin', html);
            }
            if (ele.dataset.candrop === 'true') {
                if (ele.children.length === 0) {
                    ele.insertAdjacentHTML('afterbegin', html);
                } else {
                    ele.insertAdjacentHTML('beforeend', html);
                }
            }
        }
    });
    ground.insertAdjacentHTML('beforeend', html);
}
function allowDrop(event) {
    event.preventDefault();
    var nearestDistance = Infinity;
    document.querySelectorAll('.field').forEach(el => {
        var rect = el.getBoundingClientRect();
        var halfHeight = { x: rect.width / 2, y: rect.height / 2 };
        var distance = Math.abs(event.clientX - (rect.left + halfHeight.x)) + Math.abs(event.clientY - (rect.top + halfHeight.y));
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestField = el;
        }
        el.style.backgroundColor = 'gray';
    });
    if (nearestField) {
        nearestField.style.backgroundColor = 'var(--color-foreground)';
        nearestField.style.outline = 'solid 2px var(--color-background)';
    }
}
function drop(event) {
    event.preventDefault();
    var id = event.dataTransfer.getData('text');
    var draggedElement = document.getElementById(id);
    draggedElement.style.removeProperty('position');
    draggedElement.style.removeProperty('transform');
    nearestField.insertAdjacentElement('afterend', draggedElement);
    document.querySelectorAll('.field').forEach(el => el.remove());
}