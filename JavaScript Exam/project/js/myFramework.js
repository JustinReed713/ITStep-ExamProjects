'use strict';

function appendElement(parent, type, styleClass, innerHTML = '') {

    const node = document.createElement(type);
    if (Array.isArray(styleClass)) {
        node.classList.add(...styleClass);
    } else {
        node.classList.add(styleClass);
    };
    node.innerHTML = innerHTML;
    parent.append(node);

    return node;
};

function appendInput(parent, type, id, styleClass, additional = null, labeled = false, labelStyleClass, labelText = '', labelAfterInput = false) {
    let input = document.createElement('input');
    if (Array.isArray(styleClass)) {
        input.classList.add(...styleClass);
    } else {
        input.classList.add(styleClass);
    };
    input.setAttribute('type', type);
    input.setAttribute('id', id);
    if (additional != null) {
        input = Object.assign(input, additional);
    };
    if (labeled) {
        const label = appendElement(parent, 'label', labelStyleClass, labelText);
        label.setAttribute('for', id);
        (labelAfterInput) ? label.prepend(input) : label.append(input);
    } else {
        parent.append(input);
    };

    return input;
};

function textCapitalizer(str) {
    return str[0].toUpperCase() + str.slice(1, str.length);
};

function filteredModel(arrayToFilter, selectionArray) {
    return arrayToFilter.filter(item => selectionArray.includes(item.priceSegment));
};

function productCreate(form, array, searchClass, forEdit = false, indexOfElement) {
    const product = new Product();
    const keyMaker = (str) => str.slice(0, str.indexOf('Input'));
    const fieldEnter = (object, element) => {
        if (element.value === "") {
            object[keyMaker(element.name)] = "";
            return
        };
        object[keyMaker(element.name)] = (Number.isInteger(+element.value)) ? +element.value : element.value;
    };
    const arrayInputs = form.getElementsByClassName(searchClass);
    for (const input of arrayInputs) {
        if (input.type === 'submit') continue;
        if (input.type === 'radio') {
            if (input.checked === true) fieldEnter(product, input);
        } else {
            fieldEnter(product, input);
        };
        if (input.type === 'count') product[keyMaker(element.name)] = element.value
    };
    if (forEdit) {
        array[indexOfElement] = Object.assign(array[indexOfElement], product);
    } else {
        array.push(product);
    };
};

function searchFilter(arrayToFilter, searchString) {
    return arrayToFilter.filter(item => item.name.toLowerCase().startsWith(searchString.toLowerCase()));
}

function sortCallback(itemFirst, itemSecond) {
    if (itemFirst[keyName] > itemSecond[keyName]) { return 1; };
    if (itemFirst[keyName] < itemSecond[keyName]) { return -1; };
    if (itemFirst[keyName] === itemSecond[keyName]) { return 0; };
};

function getCheckedCheckboxes(parent) {
    const arrayOfPriceSegmentCheckedBox = [];
    for (const checkbox of parent.getElementsByTagName('input')) {
        if (checkbox.checked === true) arrayOfPriceSegmentCheckedBox.push(checkbox.value)
    }
    return arrayOfPriceSegmentCheckedBox;
};

function showCards(array, parent) {
    clearSection(parent);
    for (const product of array) {
        cardCreate(product, parent);
    };
};

function clearSection(section) {
    section.innerHTML = "";
};

function getArrayArticles(array) {
    const arrayOfElements = [];
    for (const object of array) {
        arrayOfElements.push(object.article);
    };
    return arrayOfElements
};

function getElementIndex(array, articleValue) {
    return getArrayArticles(array).indexOf(articleValue);
};