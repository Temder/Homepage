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
        Array.from(editMenu.querySelectorAll('#classList li[data-changed]')).forEach(ele => {
            ele.removeAttribute('data-changed')
        })
    } else if (e.target === editMenu && e.offsetX > e.target.style.width) {
        applyChanges(currentEleEdit.id);
    }
});
editMenu.oncontextmenu = function() {
    return false;
}

var style = document.createElement('div').style;
var name;
var names = [];
            
for (name in style) {
    switch (name) {
        case "parentRule":
        case "length":
        case "cssText":
            // Skip these
            break;
        default:
            names.push(name);
            break;
    }
}
cssRules = names.filter(str => str === str.toLowerCase());
// Custom sort function
const customSort = (a, b) => {
    // Remove vendor prefixes for comparison
    const aWithoutPrefix = a.replace(/^-(webkit|moz|ms|o)-/, '');
    const bWithoutPrefix = b.replace(/^-(webkit|moz|ms|o)-/, '');

    // Compare based on the rule without prefix
    if (aWithoutPrefix === bWithoutPrefix) {
        // If the base rule is the same, sort vendor-prefixed rules after the standard one
        return b.localeCompare(a);
    } else {
        // Otherwise, sort alphabetically by the base rule
        return aWithoutPrefix.localeCompare(bWithoutPrefix);
    }
};

// Sort the CSS rules using the custom sort function
const sortedRules = cssRules.sort(customSort);

Array.from(templates).forEach(temp => {
    const tempClone = temp.content.cloneNode(true);
    const tempObjClone = tempClone.children[0].cloneNode(true);
    const div = document.createElement('div');

    div.addEventListener('click', () => {
        tempObjClone.id = `e${objCount++}`;
        tempObjClone.draggable = true;
        var obj = tempObjClone.cloneNode(true);
        obj.ondragstart = drag;
        obj.onmousedown = function(event) {
            if (event.which == 3) {
                editMenu.innerHTML = '';
                var classList = document.createElement('ul');
                classList.id = 'classList';
                var computedStyles = getComputedStyle(event.target)
                var headStyle = document.querySelector('head style');
                Array.from(sortedRules).forEach(attr => {
                    if (headStyle && hasStyleRule(event.target.id, attr)) {
                        var value = getStyleRuleValue(event.target.id, attr);
                        classList.insertAdjacentHTML('beforeend', `<li data-changed="">${attr}<input type="text" value="${value}" oninput="this.parentElement.dataset.changed = '';" /></li>`);
                    } else {
                        var value = computedStyles.getPropertyValue(attr);
                        classList.insertAdjacentHTML('beforeend', `<li>${attr}<input type="text" value="${value}" oninput="this.parentElement.dataset.changed = '';" /></li>`);
                    }
                })

                if (currentEleEdit) {
                    currentEleEdit.style.outline = '';
                }
                var edit = temp.content.children[1].cloneNode(true);

                var mousePos = [event.clientX, event.clientY];
                editMenu.style.left = `calc(${mousePos[0]}px - ${ground.offsetLeft}px)`;
                editMenu.style.top = `calc(${mousePos[1] + 5}px - ${ground.offsetTop}px)`;

                editMenu.removeAttribute('hidden');
                editMenu.appendChild(edit);
                edit.insertAdjacentHTML('afterend', 'Search Rule<input oninput="searchRules(this)" style="margin: 1em 0 0 1em;" /><hr style="margin-bottom: 0">');
                editMenu.appendChild(classList);
                //editMenu.insertAdjacentHTML('beforeend', `<hr style="margin-top: 0"><div onclick="applyChanges('${event.target.id}')">✅</div>`);
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

function hasStyleRule(id, ruleName) {
    // Find the <style> element in the head
    const styleSheet = document.querySelector('head style');

    // If no stylesheet exists, return false
    if (!styleSheet) {
        return false;
    }

    // Get the stylesheet object from the <style> element
    const sheet = styleSheet.sheet || styleSheet.styleSheet;
    const rules = sheet.cssRules || sheet.rules;

    // Create a regex to find the specific rule
    const selector = `#${id}`;

    // Iterate through all the rules in the stylesheet
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];

        // Check if the rule's selectorText matches the id
        if (rule.selectorText.includes(selector)) {
            // Check if the specific rule exists in the style declaration
            if (rule.style[ruleName]) {
                return true;
            }
        }
    }

    return false;
}

function getStyleRuleValue(selector, property) {
    // Find the <style> element in the head
    let styleSheet = document.querySelector('head style');
    
    if (!styleSheet) {
        console.warn('No <style> element found in the <head>.');
        return null;
    }

    // Get the stylesheet's content
    let cssRules = styleSheet.textContent || '';

    // Create a RegExp to find the rule for the specific selector
    const eleType = document.getElementById(selector).classList[0]
    const regex = new RegExp(`${selector}.*{[^}]*}`, 'm');
    const match = cssRules.match(regex);

    if (match) {
        // Extract the rule content between the curly braces
        var ruleContent = '';
        if (!['container', 'text'].includes(eleType)) {
            ruleContent = match[0].replace(`${selector} ${eleType} {`, '').replace('}', '').trim();
        } else {
            ruleContent = match[0].replace(`${selector} {`, '').replace('}', '').trim();
        }

        // Convert rule content into an object with property-value pairs
        const ruleObject = ruleContent.split(';').reduce((acc, curr) => {
            if (curr.trim()) {
                let [prop, val] = curr.split(':');
                acc[prop.trim()] = val.trim();
            }
            return acc;
        }, {});

        // Return the value of the specified property
        return ruleObject[property] || null;
    } else {
        console.warn(`No rule found for selector: ${selector}`);
        return null;
    }
}

function addOrUpdateStyle(id, content) {
    // Check if there's already a stylesheet in the head
    let styleSheet = document.querySelector('head style');

    // If no stylesheet exists, create a new one and append it to the head
    if (!styleSheet) {
        styleSheet = document.createElement('style');
        document.head.appendChild(styleSheet);
    }

    // Get the existing CSS rules in the stylesheet
    let cssRules = styleSheet.textContent || '';

    // Create a RegExp to find if the style with the given id already exists
    const eleType = document.getElementById(id).classList[0]
    const regex = new RegExp(`#${id}.*{[^}]*}`, 'm');

    if (regex.test(cssRules)) {
        // If it exists, replace the existing rule with the new content
        if (!['container', 'text', undefined].includes(eleType) ) {
            cssRules = cssRules.replace(regex, `#${id} ${eleType} { ${content} }`);
        } else {
            cssRules = cssRules.replace(regex, `#${id} { ${content} }`);
        }
    } else {
        // If not, append the new rule
        if (!['container', 'text', undefined].includes(eleType)) {
            cssRules += `\n#${id} ${eleType} { ${content} }`;
        } else {
            cssRules += `\n#${id} { ${content} }`;
        }
    }

    // Update the styleSheet's content
    styleSheet.textContent = cssRules;
}


function applyChanges(id) {
    var styleSheetContent = '';
    Array.from(editMenu.querySelectorAll('#classList li[data-changed]')).forEach(ele => {
        styleSheetContent += `${ele.textContent}:${ele.children[0].value};`;
    })
    console.log(id);
    addOrUpdateStyle(id, styleSheetContent);
}
function changeTag(self) {
    var cloned = document.createElement(self.value);
    Array.from(currentEleEdit.attributes).forEach(ele => {
        cloned.setAttribute(ele.name, ele.value);
    })
    setEvents(cloned);
    console.log(currentEleEdit.innerHTML);
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
function searchRules(self) {
    
}
function setEvents(ele) {
    ele.ondragstart = drag;
    ele.onmousedown = function(event) {
        if (event.which == 3) {
            editMenu.innerHTML = '';
            var classList = document.createElement('ul');
            classList.id = 'classList';
            var computedStyles = getComputedStyle(event.target)
            var headStyle = document.querySelector('head style');
            Array.from(sortedRules).forEach(attr => {
                if (headStyle && hasStyleRule(event.target.id, attr)) {
                    var value = getStyleRuleValue(event.target.id, attr);
                    classList.insertAdjacentHTML('beforeend', `<li data-changed="">${attr}<input type="text" value="${value}" oninput="this.parentElement.dataset.changed = '';" /></li>`);
                } else {
                    var value = computedStyles.getPropertyValue(attr);
                    classList.insertAdjacentHTML('beforeend', `<li>${attr}<input type="text" value="${value}" oninput="this.parentElement.dataset.changed = '';" /></li>`);
                }
            })
            if (currentEleEdit) {
                currentEleEdit.style.outline = '';
            }
            editMenu.removeAttribute('hidden');
            var mousePos = [event.clientX, event.clientY];
            editMenu.style.left = `calc(${mousePos[0]}px - ${ground.offsetLeft}px)`;
            editMenu.style.top = `calc(${mousePos[1]}px - ${ground.offsetTop}px)`;
            var edit = document.querySelector(`.${event.target.classList[0]}`).parentNode.children[1].cloneNode(true);
            editMenu.appendChild(edit);
            edit.insertAdjacentHTML('afterend', '<hr style="margin-bottom: 0">');
            editMenu.appendChild(classList);
            if (edit.getElementsByTagName('select').length != 0) {
                edit.getElementsByTagName('select')[0].value = currentEleEdit.tagName.toLowerCase();
            }
            currentEleEdit = event.target;
            currentEleEdit.style.outline = 'solid red 2px';
            edit.removeAttribute('hidden');
            event.stopPropagation();
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
                    if (ele.tagName != 'P' || ele.tagName == 'P' && event.target.textContent == 'Text') {
                        ele.insertAdjacentHTML('afterbegin', html);
                    }
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