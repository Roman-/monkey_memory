// constrain x between min and max. Return value is in the interval [min, max]
export const clamp = (x, min, max) => {
    return Math.min(max, Math.max(x, min))
}

// download file with plain text in it
export const downloadPlainText = (text, fileName) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// shuffles array in place
export const shuffle = (a) => {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export const randomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

// @returns current date in format DDMMYYYY
function getCurrentDateString() {
    let t = (new Date());
    return '' + t.getDate() + '-' + t.getMonth() + '-' + t.getFullYear();
}