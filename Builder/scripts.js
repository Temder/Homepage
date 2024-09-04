const editMenu = document.getElementById('editMenu');
const ground = document.getElementById('ground');
const output = document.getElementById('output');
const stdEle = document.getElementById('standard');
const templates = document.getElementsByTagName('template');
const overlay = document.createElement('div');

const singleElements = ['container', 'heading', 'hr', 'pre', 'text', undefined];

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
    } else if (e.target === editMenu && e.offsetX > editMenu.offsetWidth) {
        applyCSS(currentEleEdit.id);
    }
});
editMenu.oncontextmenu = function() {
    return false;
}

var style = document.createElement('div').style;
var attr;
var names = [];
            
for (attr in style) {
    switch (attr) {
        case "parentRule":
        case "length":
        case "cssText":
        case "item":
            // Skip these
            break;
        default:
            names.push(attr);
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
                editMenu.innerHTML = '<details><summary>CSS Rules</summary></details>';
                var details = editMenu.getElementsByTagName('details')[0];
                var search = document.createElement('input');
                var classList = document.createElement('ul');
                var computedStyles = getComputedStyle(event.target);
                var headStyle = document.querySelector('head style');
                var edit = temp.content.children[1].cloneNode(true);

                if (currentEleEdit) {
                    currentEleEdit.style.outline = '';
                }
                currentEleEdit = event.target;
                currentEleEdit.style.outline = 'solid red 2px';

                search.addEventListener('input', searchRules);
                search.style.margin = '1em 0 0 1em';
                classList.id = 'classList';
                classList.innerHTML = '<div></div>';
                Array.from(sortedRules).forEach(attr => {
                    if (headStyle && hasStyleRule(event.target.id, attr)) {
                        var value = getStyleRuleValue(event.target.id, attr);
                        classList.children[0].insertAdjacentHTML('beforeend', `<li data-changed="">${attr}<input type="text" value="${value}" oninput="this.parentElement.dataset.changed = '';" /></li>`);
                    } else {
                        var value = computedStyles.getPropertyValue(attr);
                        classList.insertAdjacentHTML('beforeend', `<li>${attr}<input type="text" value="${value}" oninput="this.parentElement.dataset.changed = '';" /></li>`);
                    }
                })
                if (edit.getElementsByTagName('input').length != 0) {
                    edit.getElementsByTagName('input')[0].value = currentEleEdit.textContent.trim();
                }

                var mousePos = [event.clientX, event.clientY];
                editMenu.style.left = `calc(${mousePos[0]}px - ${ground.offsetLeft}px)`;
                editMenu.style.top = `calc(${mousePos[1] + 5}px - ${ground.offsetTop}px)`;

                editMenu.removeAttribute('hidden');
                editMenu.insertAdjacentElement('afterbegin', edit);
                edit.insertAdjacentHTML('afterend', '<hr>');
                details.insertAdjacentText('afterbegin', 'Search Rule');
                details.appendChild(search);
                details.appendChild(classList);
                edit.removeAttribute('hidden');
                event.stopPropagation();
            }
        }
        obj.oncontextmenu = function() {
            return false;
        }
        obj.onmouseover = function(event) {
            event.target.style.border = 'solid rgb(133, 63, 214) 5px';
        }
        ground.appendChild(obj);
        output.querySelector('pre').innerText = formatHTML(simplifyHtml(ground.innerHTML).trimStart());
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
        if (!singleElements.includes(eleType)) {
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
        if (!singleElements.includes(eleType) ) {
            cssRules = cssRules.replace(regex, `#${id} ${eleType} { ${content} }`);
        } else {
            cssRules = cssRules.replace(regex, `#${id} { ${content} }`);
        }
    } else {
        // If not, append the new rule
        if (!singleElements.includes(eleType)) {
            cssRules += `\n#${id} ${eleType} { ${content} }`;
        } else {
            cssRules += `\n#${id} { ${content} }`;
        }
    }

    // Update the styleSheet's content
    styleSheet.textContent = cssRules;
}

function applyCSS(id) {
    var styleSheetContent = '';
    const eleType = document.getElementById(id).classList[0]
    Array.from(editMenu.querySelectorAll('#classList li[data-changed]')).forEach(ele => {
        if (singleElements.includes(eleType)) {
            currentEleEdit.style[`${ele.textContent}`] = '';
        } else {
            currentEleEdit.children[0].style[`${ele.textContent}`] = '';
        }
        styleSheetContent += `${ele.textContent}:${ele.children[0].value};`;
        classList.children[0].insertAdjacentElement('beforeend', ele);
    })
    console.log(id);
    addOrUpdateStyle(id, styleSheetContent);
    output.querySelector('pre:last-of-type').innerText = formatCSS(document.querySelector('head style').textContent || '');
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
    output.querySelector('pre').innerText = formatHTML(simplifyHtml(ground.innerHTML).trimStart());
}
function changeText(self) {
    const eleType = currentEleEdit.classList[0]
    var txt = self.value;
    console.log(eleType);
    if (singleElements.includes(eleType)) {
        currentEleEdit.textContent = txt;
    } else {
        currentEleEdit.children[0].textContent = txt;
    }
    output.querySelector('pre').innerText = formatHTML(simplifyHtml(ground.innerHTML).trimStart());
}
function searchRules(e) {
    var classList = document.getElementById('classList')
    //classList.innerHTML = '';
    var headStyle = document.querySelector('head style');
    var computedStyles = getComputedStyle(currentEleEdit);
    Array.from(classList.children).forEach(ele => {
        if (ele.tagName == 'DIV') {
            return;
        }
        if (e.target.value && !ele.textContent.includes(e.target.value)) {
            if (ele.tagName != 'DIV') {
                ele.style.display = 'none';
            }
        } else {
            if (ele.tagName == 'LI') {
                ele.style.display = 'flex';
            }
        }
    });
    /*Array.from(sortedRules).forEach(attr => {
        if (headStyle && hasStyleRule(currentEleEdit.id, attr)) {
            var value = getStyleRuleValue(currentEleEdit.id, attr);
            classList.insertAdjacentHTML('beforeend', `<li data-changed="">${attr}<input type="text" value="${value}" oninput="this.parentElement.dataset.changed = '';" /></li>`);
        } else {
            var value = computedStyles.getPropertyValue(attr);
            classList.insertAdjacentHTML('beforeend', `<li>${attr}<input type="text" value="${value}" oninput="this.parentElement.dataset.changed = '';" /></li>`);
        }
    })*/
}
function setEvents(ele) {
    ele.ondragstart = drag;
    ele.onmousedown = function(event) {
        if (event.which == 3) {
            editMenu.innerHTML = '<details><summary>CSS Rules</summary></details>';
            var details = editMenu.getElementsByTagName('details')[0];
            var search = document.createElement('input');
            var classList = document.createElement('ul');
            var computedStyles = getComputedStyle(event.target);
            var headStyle = document.querySelector('head style');
            var edit = document.querySelector(`.${event.target.classList[0]}`).parentNode.children[1].cloneNode(true);

            if (currentEleEdit) {
                currentEleEdit.style.outline = '';
            }
            currentEleEdit = event.target;
            currentEleEdit.style.outline = 'solid red 2px';
            
            search.addEventListener('input', searchRules);
            search.style.margin = '1em 0 0 1em';
            classList.id = 'classList';
            classList.innerHTML = '<div></div>';
            Array.from(sortedRules).forEach(attr => {
                if (headStyle && hasStyleRule(event.target.id, attr)) {
                    var value = getStyleRuleValue(event.target.id, attr);
                    classList.children[0].insertAdjacentHTML('beforeend', `<li data-changed="">${attr}<input type="text" value="${value}" oninput="this.parentElement.dataset.changed = '';" /></li>`);
                } else {
                    var value = computedStyles.getPropertyValue(attr);
                    classList.insertAdjacentHTML('beforeend', `<li>${attr}<input type="text" value="${value}" oninput="this.parentElement.dataset.changed = '';" /></li>`);
                }
            })
            if (edit.getElementsByTagName('input').length != 0) {
                edit.getElementsByTagName('input')[0].value = currentEleEdit.textContent.trim();
            }

            var mousePos = [event.clientX, event.clientY];
            editMenu.style.left = `calc(${mousePos[0]}px - ${ground.offsetLeft}px)`;
            editMenu.style.top = `calc(${mousePos[1] + 5}px - ${ground.offsetTop}px)`;

            if (edit.getElementsByTagName('select').length != 0) {
                edit.getElementsByTagName('select')[0].value = currentEleEdit.tagName.toLowerCase();
            }

            editMenu.removeAttribute('hidden');
            editMenu.insertAdjacentElement('afterbegin', edit);
            edit.insertAdjacentHTML('afterend', '<hr>');
            details.insertAdjacentText('afterbegin', 'Search Rule');
            details.appendChild(search);
            details.appendChild(classList);
            edit.removeAttribute('hidden');
            event.stopPropagation();
        }
    }
    ele.oncontextmenu = function() {
        return false;
    }
}
function simplifyHtml() {
    // Create a temporary DOM element to manipulate the HTML
    const groundClone = ground.cloneNode(true);
    groundClone.children[0].remove();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = groundClone.innerHTML;

    // Recursively simplify the elements
    function simplifyElement(element) {
        if (element.children[0]) {
            const child = element.children[0];
            const className = element.className;
            const tagName = child.tagName.toLowerCase();
            
            // If the div class name matches the child's tag name, merge them
            if (className.split(' ')[0] === tagName) {
                for (const attr of element.attributes) {
                    child.setAttribute(attr.name, attr.value);
                }
                element.replaceWith(child);
                element = child;
            }
        }
        // Remove unnecessary attributes
        element.removeAttribute('class');
        element.removeAttribute('draggable');
        element.removeAttribute('style');
        element.removeAttribute('data-candrop');
        element.removeAttribute('data-id');

        // Recursively simplify child elements
        Array.from(element.children).forEach(simplifyElement);
    }

    // Simplify the root element
    simplifyElement(tempDiv);

    // Return the simplified HTML
    return tempDiv.innerHTML;
}
function formatHTML(html) {
    const formatted = [];
    const tab = '    ';
    let indentLevel = 0;
    const indentBlocks = ['div', 'p', 'form', 'button', 'ul', 'ol'];

    // Fix splitting issue by ensuring tags are correctly handled
    html = html.replace(/>\s*</g, '>|<');
    const lines = html.split('|')

    lines.forEach(line => {
        let startTag = line.match(/^<\w+/g);
        let endTag = line.match(/<\/\w*/g);
        console.log(endTag);
        if (endTag != null && indentBlocks.map(ele => `</${ele}`).includes(endTag[0])) {
            indentLevel--;
        }
        formatted.push(tab.repeat(indentLevel) + line);
        if (startTag != null && indentBlocks.map(ele => `<${ele}`).includes(startTag[0])) {
            indentLevel++;
        }
    });

    // Join the array into a single formatted string
    console.log(formatted.join('\n'));
    return formatted.join('\n');
}
function formatCSS(css) {
    let formattedCSS = '';
    let indentLevel = 0;
    const indentSize = 4; // Number of spaces per indentation level

    // Utility function to create indentation
    function getIndentation(level) {
        return ' '.repeat(level * indentSize);
    }

    // Remove existing newlines and extra spaces for clean parsing
    css = css.replace(/\s+/g, ' ').replace(/\s*{\s*/g, ' {').replace(/\s*}\s*/g, '}').trim();

    // Regular expression to match ID selectors followed by other elements
    const idSelectorRegex = /#\w+\s+[^\{]+/g;
    css = css.replace(idSelectorRegex, match => match.split(' ')[0]);

    // Iterate over each character in the CSS string
    for (let i = 0; i < css.length; i++) {
        const char = css[i];

        if (char === '{') {
            // Increase indentation and add newline
            formattedCSS += ' {\n';
            indentLevel++;
            formattedCSS += getIndentation(indentLevel);
        } else if (char === '}') {
            // Decrease indentation before closing brace
            indentLevel--;
            formattedCSS = formattedCSS.trimEnd(); // Remove trailing whitespace/newline before adding closing brace
            formattedCSS += '\n' + getIndentation(indentLevel) + '}';
            if (i + 1 < css.length && css[i + 1] !== '}') {
                // Add newline after closing brace unless followed by another brace
                formattedCSS += '\n' + getIndentation(indentLevel);
            }
        } else if (char === ';') {
            // Add semicolon and newline
            formattedCSS += ';\n' + getIndentation(indentLevel);
        } else {
            // Add the character as is
            formattedCSS += char;
        }
    }

    return formattedCSS.trim();
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
    output.querySelector('pre').innerText = formatHTML(simplifyHtml(ground.innerHTML).trimStart());
}