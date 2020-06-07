'use strict'

let tooltipElem;

document.onmouseover = function (event) {
    let target = event.target;

    // if element have tooltip attribute 
    let tooltipHtml = target.dataset.tooltip;
    if (!tooltipHtml) return;

    // create tool for a hint

    tooltipElem = document.createElement('div');
    tooltipElem.className = 'tooltip';
    tooltipElem.innerHTML = tooltipHtml;
    document.body.append(tooltipElem);

    // positioning on top

    let coords = target.getBoundingClientRect();

    let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;

    // left window edge

    if (left < 0) left = 0;

    let top = coords.top - tooltipElem.offsetHeight - 5;

    // if hint too big for a place above element

    if (top < 0) {
        top = coords.top + target.offsetHeight + 5;
    }
    tooltipElem.style.left = left + 'px';
    tooltipElem.style.top = top + 'px';
};

// delete hint after

document.onmouseout = function (e) {
    if (tooltipElem) {
        tooltipElem.remove();
        tooltipElem = null;
    }
};
