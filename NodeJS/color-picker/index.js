const fs = require('fs');
const path = require('path');

module.exports = {
    getColorPickerHTML: () => {
        return fs.readFileSync(path.join(__dirname, 'color_picker.html'), 'utf8');
    },
    getColorPickerCSS: () => {
        return fs.readFileSync(path.join(__dirname, 'colorPicker.css'), 'utf8');
    },
    getColorPickerJS: () => {
        return fs.readFileSync(path.join(__dirname, 'colorPicker.js'), 'utf8');
    }
};
