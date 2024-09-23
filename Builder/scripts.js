const remove = document.getElementById('remove');
const editMenu = document.getElementById('editMenu');
const ground = document.getElementById('ground');
const output = document.getElementById('output');
const overlay = document.getElementById('overlay');
const stdEle = document.getElementById('standard');
const templates = document.getElementsByTagName('template');

const singleElements = ['container', 'heading', 'hr', 'list', 'pre', 'text', undefined];
const indentBlocks = ['button', 'div', 'form', 'ol', 'p', 'ul'];
const inputFields = ['select', 'input', 'textarea'];

var currentEleEdit = null;
var objCount = 0;

editMenu.addEventListener('click', function (e) {
    if (e.target === editMenu && e.offsetX < 0) {
        editMenu.hidden = 'true';
        editMenu.style.display = 'none';
        editMenu.innerHTML = '';
        currentEleEdit.setAttribute('draggable', 'true');
        currentEleEdit.style.outline = '';
        currentEleEdit.style.outlineOffset = '';
        currentEleEdit.style.position = '';
        remove.style.display = 'none';
        ground.insertAdjacentElement('afterbegin', remove);
        Array.from(editMenu.querySelectorAll('#editMenu .classList li[data-changed]')).forEach(ele => {
            ele.removeAttribute('data-changed')
        })
    } else if (e.target === editMenu && e.offsetX > editMenu.offsetWidth - 10) {
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
                var edit = temp.content.children[1].cloneNode(true);

                if (currentEleEdit) {
                    currentEleEdit.style.outline = '';
                    currentEleEdit.style.outlineOffset = '';
                }
                currentEleEdit = event.target;
                currentEleEdit.setAttribute('draggable', 'false');
                currentEleEdit.style.outline = 'solid red 2px';
                currentEleEdit.style.outlineOffset = '-2px';
                currentEleEdit.insertAdjacentElement('beforeend', remove);
                currentEleEdit.style.position = 'relative';
                remove.style.display = 'block';
                const eleType = currentEleEdit.classList[0]

                search.addEventListener('input', searchRules);
                search.style.margin = '1em 0 0 1em';
                classList.classList.add('classList');
                updateClassList(classList);
                if (event.target.tagName == 'LI') {
                    Array.from(edit.getElementsByTagName('select')).forEach(obj => {obj.parentElement.remove();})
                }
                if (['UL', 'OL'].includes(event.target.tagName)) {
                    Array.from(edit.getElementsByTagName('input')).forEach(obj => {obj.parentElement.remove();})
                }
                inputFields.forEach(tagName => {
                    Array.from(edit.getElementsByTagName(tagName)).forEach((obj, i) => {
                        var attr = obj.name
                        //console.log(`${tagName} ${i + 1}, ${eleType}: ${attr}, ${obj.name}`);
                        var value, txt, tag;
                        if (singleElements.includes(eleType)) {
                            value = currentEleEdit.getAttribute(attr);
                            txt = currentEleEdit.textContent.trim();
                            tag = currentEleEdit.tagName.toLowerCase();
                        } else {
                            value = currentEleEdit.children[0].getAttribute(attr);
                            txt = currentEleEdit.children[0].textContent.trim();
                            tag = currentEleEdit.children[0].tagName.toLowerCase();
                        }
                        if (['select', 'input'].includes(tagName)) {
                            if (tag && !obj.hasAttribute('name')) {
                                obj.value = tag;
                                //console.log(tag, currentEleEdit);
                            }
                            if (attr && value) {
                                obj.value = value;
                                //console.log(value);
                            }
                        }
                        if (['input', 'textarea'].includes(tagName)) {
                            if (txt && !obj.hasAttribute('name')) {
                                obj.value = txt;
                                //console.log(txt);
                            }
                        }
                    })
                })
                /*if (edit.getElementsByTagName('input').length != 0) {
                    edit.getElementsByTagName('input')[0].value = currentEleEdit.textContent.trim();
                }
                if (edit.getElementsByTagName('select').length != 0) {
                    attributes.forEach(attr => {
                        if (singleElements.includes(eleType)) {
                            if (currentEleEdit.hasAttribute(attr)) {
                                var value = currentEleEdit.getAttribute(attr);
                                edit.getElementsByTagName('select')[0].value = value;
                            }
                        } else {
                            if (currentEleEdit.children[0].hasAttribute(attr)) {
                                var value = currentEleEdit.children[0].getAttribute(attr);
                                edit.getElementsByTagName('select')[0].value = value;
                            }
                        }
                    })
                }*/

                var mousePos = [event.clientX, event.clientY];
                editMenu.style.left = `calc(${mousePos[0]}px - ${ground.offsetLeft}px)`;
                editMenu.style.top = `calc(${mousePos[1] + 5}px - ${ground.offsetTop}px)`;

                editMenu.removeAttribute('hidden');
                editMenu.style.display = 'flex';
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
        }
        ground.appendChild(obj);
        output.querySelector('pre').innerText = formatHTML(simplifyHtml(ground.innerHTML).trimStart());
    });
    div.appendChild(tempClone);
    stdEle.appendChild(div);
})

var lastClassList = null;
function updateClassList(classList) {
    var computedStyles = getComputedStyle(currentEleEdit);
    var headStyle = document.querySelector('head style');
    if (!classList) {
        classList = lastClassList
    } else {
        lastClassList = classList
    }

    classList.innerHTML = '<div></div><div></div><div></div>';
    Array.from(sortedRules).forEach(rule => {
        var value = getStyleRuleValue([`${currentEleEdit.id}`, currentEleEdit.tagName.toLowerCase()], rule);
        if (headStyle && hasStyleRule([`${currentEleEdit.id}`, currentEleEdit.tagName.toLowerCase()], rule) && value) {
            //console.log([`#${currentEleEdit.id}`, currentEleEdit.tagName.toLowerCase()], rule , '->', value);
            classList.children[0].insertAdjacentHTML('beforeend', `<li data-changed="">${rule}<input type="text" value="${value}" oninput="this.parentElement.dataset.changed = '';" /></li>`);
        } else {
            value = computedStyles.getPropertyValue(rule);
            classList.insertAdjacentHTML('beforeend', `<li>${rule}<input type="text" value="${value}" oninput="this.parentElement.dataset.changed = '';document.querySelector('#editMenu .classList > div:nth-child(1)').append(this.parentElement); this.focus();" /></li>`);
        }
    })
}

function hasStyleRule(identifier, ruleName) {
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
    const selectors = identifier;

    var back = '';
    selectors.forEach(selector => {
        // Iterate through all the rules in the stylesheet
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
    
            // Check if the rule's selectorText matches the id
            if (rule.selectorText.includes(selector)) {
                // Check if the specific rule exists in the style declaration
                if (rule.style[ruleName]) {
                    //console.log(selector, ruleName,rule.style[ruleName]);
                    back = 'ja';
                }
            }
        }
    })
    if (back == 'ja') {
        return true;
    } else {
        return false;
    }
}
function getStyleRuleValue(selectors, property) {
    // Find the <style> element in the head
    let styleSheet = document.querySelector('head style');
    
    if (!styleSheet) {
        console.warn('No <style> element found in the <head>.');
        return null;
    }

    // Get the stylesheet's content
    let cssRules = styleSheet.textContent || '';

    // Create a RegExp to find the rule for the specific selector
    //const eleType = document.getElementById(selector).classList[0] || ''
    var value;
    selectors.forEach(selector => {
        const regex = new RegExp(`${selector}.*{[^}]*}`, 'gm');
        const match = cssRules.match(regex);
    
        //console.log(regex, match);
        if (match) {
            // Extract the rule content between the curly braces
            var ruleContent = match[0].replace(/.*{|}/g, '');
            //console.log(ruleContent);
            //if (!singleElements.includes(eleType)) {
                //ruleContent = match[0].replace(`${selector} ${eleType} {`, '').replace('}', '').trim();
            //} else {
            //ruleContent = match[0].replace(`${selector} {`, '').replace('}', '').trim();
            //}
            // Convert rule content into an object with property-value pairs
            const ruleObject = ruleContent.split(';').reduce((acc, curr) => {
                if (curr.trim()) {
                    let [prop, val] = curr.split(':');
                    acc[prop.trim()] = val.trim();
                }
                return acc;
            }, {});
            value = ruleObject[property]
            //console.log(ruleObject, property, '->', value);
    
            // Return the value of the specified property
            
        } else {
            //console.warn(`No rule found for selector: ${selector}`);
            
        }
    })
    if (value) {
        return value;
    } else {
        return null;
    }
}
function addOrUpdateStyle(identifier, content, type) {
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
    var eleType = undefined;
    try {
        eleType = document.getElementById(identifier).classList[0];
    } catch (error) {
        
    }
    const regex = new RegExp(`[#.]${identifier}.*{[^}]*}`, 'm');

    var char = '';
    switch (type) {
        case 'id':
            char = '#';
            break;
        case 'class':
            char = '#ground .';
            break;
    }
    if (regex.test(cssRules)) {
        // If it exists, replace the existing rule with the new content
        if (!singleElements.includes(eleType) ) {
            cssRules = cssRules.replace(regex, `${char}${identifier} ${eleType} { ${content} }`);
        } else {
            cssRules = cssRules.replace(regex, `${char}${identifier} { ${content} }`);
        }
    } else {
        // If not, append the new rule
        if (!singleElements.includes(eleType)) {
            cssRules += `\n${char}${identifier} ${eleType} { ${content} }`;
        } else {
            cssRules += `\n${char}${identifier} { ${content} }`;
        }
    }

    // Update the styleSheet's content
    styleSheet.textContent = cssRules;
}
function applyCSS(id) {
    console.log(id);
    var styleSheetContent = '';
    const eleType = document.getElementById(id).classList[0]
    Array.from(editMenu.querySelectorAll('.classList li[data-changed]')).forEach(ele => {
        if (singleElements.includes(eleType)) {
            currentEleEdit.style[`${ele.textContent}`] = '';
        } else {
            currentEleEdit.children[0].style[`${ele.textContent}`] = '';
        }
        styleSheetContent += `${ele.textContent}:${ele.children[0].value};`;
        ele.style.display = 'flex';
        //classList.children[0].insertAdjacentElement('beforeend', ele);
    })
    //console.log(id);
    if (styleSheetContent) {
        addOrUpdateStyle(id, styleSheetContent, 'id');
        output.querySelector('pre:last-of-type').innerText = formatCSS(document.querySelector('head style').textContent || '');
    }
}
function addClass(self) {
    var identifier = overlay.getElementsByTagName('input')[0].value;
    var styleSheetContent = '';
    Array.from(overlay.querySelectorAll('.classList li[data-changed]')).forEach(ele => {
        styleSheetContent += `${ele.textContent}:${ele.children[0].value};`;
    })

    if (identifier && styleSheetContent) {
        addOrUpdateStyle(identifier, styleSheetContent, 'class');
        self.parentElement.style.display = 'none';
    }
}

function changeTag(self) {
    var cloned = document.createElement(self.value);
    Array.from(currentEleEdit.attributes).forEach(ele => {
        cloned.setAttribute(ele.name, ele.value);
    })
    setEvents(cloned);
    //console.log(currentEleEdit.innerHTML);
    cloned.insertAdjacentHTML('afterbegin', currentEleEdit.innerHTML);
    Array.from(cloned.children).forEach(child => {
        if (child.hasAttribute('draggable')) {
            setEvents(child);
        }
    })
    currentEleEdit.insertAdjacentElement('afterend', cloned);
    currentEleEdit.remove();
    currentEleEdit = cloned;
    updateClassList(null)
    output.querySelector('pre').innerText = formatHTML(simplifyHtml(ground.innerHTML).trimStart());
}
function changeText(self) {
    const eleType = currentEleEdit.classList[0]
    const txt = self.value;
    if (singleElements.includes(eleType)) {
        currentEleEdit.textContent = txt;
    } else {
        currentEleEdit.children[0].textContent = txt;
    }
    output.querySelector('pre').innerText = formatHTML(simplifyHtml(ground.innerHTML).trimStart());
}
function changeAttribute(self, attr) {
    const eleType = currentEleEdit.classList[0]
    const value = self.value
    if (singleElements.includes(eleType)) {
        currentEleEdit.setAttribute(attr, value);
    } else {
        currentEleEdit.children[0].setAttribute(attr, value);
    }
    output.querySelector('pre').innerText = formatHTML(simplifyHtml(ground.innerHTML).trimStart());
}

function searchRules(e) {
    var classList = document.getElementsByClassName('classList');
    /*classList.innerHTML = '';
    var headStyle = document.querySelector('head style');
    var computedStyles = getComputedStyle(currentEleEdit);*/
    Array.from(classList).forEach(cl => {
        Array.from(cl.children).forEach(ele => {
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
    })
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
            var selector = document.querySelector(`.${event.target.classList[0]}`) || document.querySelector(`.${event.target.parentElement.classList[0]}`);
            var edit = selector.parentNode.children[1].cloneNode(true);

            if (currentEleEdit) {
                currentEleEdit.style.outline = '';
                currentEleEdit.style.outlineOffset = '';
            }
            currentEleEdit = event.target;
            currentEleEdit.style.outline = 'solid red 2px';
            currentEleEdit.style.outlineOffset = '-2px';
            const eleType = currentEleEdit.classList[0]
            
            search.addEventListener('input', searchRules);
            search.style.margin = '1em 0 0 1em';
            classList.classList.add('classList');
            classList.innerHTML = '<div></div>';
            updateClassList(classList);
            if (event.target.tagName == 'LI') {
                Array.from(edit.getElementsByTagName('select')).forEach(obj => {obj.parentElement.remove();})
            }
            if (['UL', 'OL'].includes(event.target.tagName)) {
                Array.from(edit.getElementsByTagName('input')).forEach(obj => {obj.parentElement.remove();})
            }
            inputFields.forEach(tagName => {
                Array.from(edit.getElementsByTagName(tagName)).forEach((obj, i) => {
                    var attr = obj.name
                    //console.log(`${tagName} ${i + 1}, ${eleType}: ${attr}, ${obj.name}`);
                    var value, txt, tag;
                    if (singleElements.includes(eleType)) {
                        value = currentEleEdit.getAttribute(attr);
                        txt = currentEleEdit.textContent.trim();
                        tag = currentEleEdit.tagName.toLowerCase();
                    } else {
                        value = currentEleEdit.children[0].getAttribute(attr);
                        txt = currentEleEdit.children[0].textContent.trim();
                        tag = currentEleEdit.children[0].tagName.toLowerCase();
                    }
                    if (['select', 'input'].includes(tagName)) {
                        if (tag && !obj.hasAttribute('name')) {
                            obj.value = tag;
                            //console.log(tag, currentEleEdit);
                        }
                        if (attr && value) {
                            obj.value = value;
                            //console.log(value);
                        }
                    }
                    if (['input', 'textarea'].includes(tagName)) {
                        if (txt && !obj.hasAttribute('name')) {
                            obj.value = txt;
                            //console.log(txt);
                        }
                    }
                })
            })

            var mousePos = [event.clientX, event.clientY];
            editMenu.style.left = `calc(${mousePos[0]}px - ${ground.offsetLeft}px)`;
            editMenu.style.top = `calc(${mousePos[1] + 5}px - ${ground.offsetTop}px)`;

            editMenu.removeAttribute('hidden');
            editMenu.style.display = 'flex';
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
    Array.from(groundClone.children).forEach(child => {
        if (['editMenu', 'remove'].includes(child.id)) {
            groundClone.children[0].remove();
        }
    })
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = groundClone.innerHTML;

    // Recursively simplify the elements
    function simplifyElement(element) {
        if (element.children[0]) {
            const child = element.children[0];
            const className = element.className;
            const tagName = child.tagName.toLowerCase();
            
            // If the div class name matches the child's tag name, merge them
            if (className != '') {
                if (className.split(' ')[0] === tagName) {
                    for (const attr of element.attributes) {
                        child.setAttribute(attr.name, attr.value);
                    }
                    element.replaceWith(child);
                    element = child;
                }
            }
        }
        // Remove unnecessary attributes
        var classes = element.getAttribute('class');
        if (classes) {
            classes = classes.replace(/(^\w*|pointer-events-all|cursor-pointer)\s?/g, '');
        }
        if (['', null].includes(classes)) {
            element.removeAttribute('class');
        } else {
            element.setAttribute('class', classes);
        }
        element.removeAttribute('data-candrop');
        element.removeAttribute('data-id');
        element.removeAttribute('draggable');
        element.removeAttribute('disabled');
        element.removeAttribute('style');

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

    // Fix splitting issue by ensuring tags are correctly handled
    html = html.replace(/>\s*</g, '>|<');
    const lines = html.split('|')

    lines.forEach(line => {
        let startTag = line.match(/^<\w+/g);
        let endTag = line.match(/<\/\w*/g);
        //console.log(endTag);
        if (endTag != null && indentBlocks.map(ele => `</${ele}`).includes(endTag[0]) && indentLevel > 0) {
            indentLevel--;
        }
        formatted.push(tab.repeat(indentLevel) + line);
        if (startTag != null && indentBlocks.map(ele => `<${ele}`).includes(startTag[0])) {
            indentLevel++;
        }
    });

    // Join the array into a single formatted string
    //console.log(formatted.join('\n'));
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
    const idSelectorRegex = /#\w+\s+[^\.\{]+/g;
    css = css.replace(idSelectorRegex, match => match.split(' ')[0]);
    console.log(css);

    // Iterate over each character in the CSS string
    for (let i = 0; i < css.length; i++) {
        const char = css[i];

        if (char === '{') {
            // Increase indentation and add newline
            formattedCSS += '{\n';
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
    //console.log(event);
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

function toggleBorders(self) {
    const containers = ground.querySelectorAll('#ground *.container');
    if (self.checked) {
        containers.forEach(ele => {
            console.log(ele);
            ele.classList.remove('noborder');
        })
    } else {
        containers.forEach(ele => {
            console.log(ele);
            ele.classList.add('noborder');
        })
    }
}
function showOverlay(type) {
    var content = '';
    switch (type) {
        case 'class':
            content = '<div>Class Name<input type="text"></div>'
            var search = document.createElement('input');
            var classList = document.createElement('ul');
            search.addEventListener('input', searchRules);
            search.style.margin = '1em 0 0 1em';
            classList.classList.add('classList');
            classList.innerHTML = '<div></div>';
            Array.from(sortedRules).forEach(rule => {
                classList.insertAdjacentHTML('beforeend', `<li>${rule}<input type="text" value="null" oninput="this.parentElement.dataset.changed = '';document.querySelector('#overlay .classList > div:nth-child(1)').append(this.parentElement); this.focus();" /></li>`);
            })
            var element = document.createElement('div');
            element.insertAdjacentText('afterbegin', 'Search Rule');
            element.appendChild(search);
            element.appendChild(classList);
            break;
    }
    Array.from(overlay.getElementsByTagName('div')).forEach(ele => {
        ele.remove();
    });
    overlay.insertAdjacentHTML('beforeend', content);
    if (element) {
        overlay.append(element);
    }
}