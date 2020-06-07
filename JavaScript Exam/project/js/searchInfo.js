'use strict'

function showSearchInfo(parent, arrayFilter, valueSorter, directionSort, searchString) {
    clearSection(parent);
    parent.innerText = 'Active filters :'
    for (const filter of arrayFilter) {
        appendElement(parent, 'div', 'search-info-pallet', textCapitalizer(filter));
    };
    let innerText = (valueSorter, directionSort) => {
        let text = "";
        if (valueSorter === "name") {
            text = (directionSort) ? "Z - A" : "A - Z";
        } else {
            text = (directionSort) ? "9 - 0" : "0 - 9";
        };
        return `${textCapitalizer(valueSorter)} (${text})`;
    };
    appendElement(parent, 'div', 'search-info-pallet', innerText(valueSorter, directionSort));
    if (searchString != "") {
        appendElement(parent, 'div', 'search-info-pallet', searchString);
    };
};