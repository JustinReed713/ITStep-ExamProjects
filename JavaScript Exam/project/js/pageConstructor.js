'use strict';

//   -------------------------------------    global variables    ------------------------------------   //

var onEdit = false;

var keyName = 'name';

var lastDeletedProduct = null;

const body = document.body;

//  ----------------------------------  create main container  -------------------------------    //

const mainContainer = appendElement(body, 'div', 'main-container');

//  ----------------------------------  create header section of page -------------------------------    //

const header = appendElement(mainContainer, 'div', 'header', 'Welcome to our shop');

//  ----------------------------------  create navigation section with sorting elements ----------------------------    //

const navigation = appendElement(mainContainer, 'div', 'navigation');
const searchPanel = appendElement(navigation, 'div', 'search-panel');

/* search container */

const searchInputContainer = appendElement(searchPanel, 'div', 'search-input-container');
const searchInputLogo = appendElement(searchInputContainer, 'div', ['search-input-logo', 'logo-container'], '<span class="material-icons logo-block logo-size_search-container">search</span>');
const searchInputText = appendInput(searchInputContainer, 'text', 'searchInput', 'search-input-style', { name: 'searchInput', placeholder: "Start type to search" });
const searchInputClear = appendElement(searchInputContainer, 'div', ['search-input-clear', 'logo-container', 'logo_right-position', 'element_hidden'], '<span class="material-icons logo-block logo-size_search-container">clear</span >');

/* events for search input elements */

searchInputText.addEventListener('input', () => {
    showCards(searchFilter(filteredModel(model, getCheckedCheckboxes(filterContainer)), searchInputText.value).sort(sortCallback), goodsSection);
    showSearchInfo(searchCurrentInfoContainer, getCheckedCheckboxes(filterContainer), keyName, inputDirectionSorting.checked, searchInputText.value);
});
searchInputText.addEventListener('focus', () => {
    searchInputContainer.classList.add('search-input-container_focused');
    searchInputClear.classList.remove('element_hidden');
});
searchInputText.addEventListener('blur', () => {
    searchInputContainer.classList.remove('search-input-container_focused');
    if (searchInputText.value === "") searchInputClear.classList.add('element_hidden');
});
searchInputClear.addEventListener('click', () => {
    searchInputText.focus();
    searchInputText.value = "";
    showCards(searchFilter(filteredModel(model, getCheckedCheckboxes(filterContainer)), searchInputText.value).sort(sortCallback), goodsSection);
    showSearchInfo(searchCurrentInfoContainer, getCheckedCheckboxes(filterContainer), keyName, inputDirectionSorting.checked, searchInputText.value);
});

/* sorting settings container */
let timerClose;

const sortSettingsContainer = appendElement(searchPanel, 'div', 'sort-settings-container');
sortSettingsContainer.addEventListener('mouseover', () => clearInterval(timerClose));
sortSettingsContainer.addEventListener('mouseout', () => timerClose = setInterval(() => {
    sortSettingsContainer.classList.remove('sort-settings-container_bordered');
    filterContainer.classList.add('element_hidden');
    sorterContainer.classList.add('element_hidden');
    inputDirectionSorting.parentNode.classList.add('element_hidden');
}, 2000));
const sorterSettingsButton = appendElement(sortSettingsContainer, 'div', ['sorter-settings-logo', 'logo-container'], '<span class="material-icons logo-block logo-size_sort-settings-container">tune</span>')
sorterSettingsButton.addEventListener('click', () => {
    sortSettingsContainer.classList.toggle('sort-settings-container_bordered');
    filterContainer.classList.toggle('element_hidden');
    sorterContainer.classList.toggle('element_hidden');
    inputDirectionSorting.parentNode.classList.toggle('element_hidden');
});

/* filter container */

const filterContainer = appendElement(sortSettingsContainer, 'div', ['settings-container', 'element_hidden']);
const arrayInputsFilterPriceSegment = ['cheap', 'optimal', 'premium'];
for (const input of arrayInputsFilterPriceSegment) {
    const checkbox = appendInput(filterContainer, `checkbox`, `${input}Segment`, ['input-sort_styled', 'element_hidden'], { name: `priceSegmentInput`, value: input, checked: true },
        true, ['label-input-sort_styled', 'label-input-sort_right-border'], textCapitalizer(input), true);
    const fakeIcon = appendElement(checkbox.parentNode, 'div', 'fake-icon_wrapper', '<span class="material-icons fake-icon_styled"></span>');
    checkbox.before(fakeIcon);
    fakeIcon.firstChild.innerText = (checkbox.checked) ? 'check_box' : 'check_box_outline_blank';
    checkbox.addEventListener('change', () => {
        fakeIcon.firstChild.innerText = (checkbox.checked) ? 'check_box' : 'check_box_outline_blank';
        showCards(searchFilter(filteredModel(model, getCheckedCheckboxes(filterContainer)), searchInputText.value).sort(sortCallback), goodsSection);
        showSearchInfo(searchCurrentInfoContainer, getCheckedCheckboxes(filterContainer), keyName, inputDirectionSorting.checked, searchInputText.value);
    });
};
filterContainer.lastChild.classList.remove('label-input-sort_right-border');

/* sorter container */

const sorterContainer = appendElement(sortSettingsContainer, 'div', ['settings-container', 'element_hidden']);
const arrayInputsSorterCategory = ['name', 'count', 'price', 'date'];
for (const input of arrayInputsSorterCategory) {
    const radio = appendInput(sorterContainer, `radio`, `${input}Category`, ['input-sort_styled', 'element_hidden'], { name: `sort`, value: input },
        true, ['label-input-sort_styled', 'label-input-sort_right-border'], textCapitalizer(input), true);
    const fakeIcon = appendElement(radio.parentNode, 'div', 'fake-icon_wrapper', '<span class="material-icons fake-icon_styled">radio_button_unchecked</span>');
    radio.before(fakeIcon);
    radio.addEventListener('change', () => {
        const arrayInputs = sorterContainer.getElementsByTagName('input');
        const arrayIcons = sorterContainer.getElementsByClassName('fake-icon_styled');
        for (let index = 0; index < arrayInputs.length; index++) {
            arrayIcons[index].innerText = (arrayInputs[index].checked === true) ? 'radio_button_checked' : 'radio_button_unchecked';
        };
        keyName = radio.value;
        showCards(searchFilter(filteredModel(model, getCheckedCheckboxes(filterContainer)), searchInputText.value).sort(sortCallback), goodsSection);
        showSearchInfo(searchCurrentInfoContainer, getCheckedCheckboxes(filterContainer), keyName, inputDirectionSorting.checked, searchInputText.value);
    });
};
document.getElementById('nameCategory').checked = true;
sorterContainer.getElementsByClassName('fake-icon_wrapper')[0].firstChild.innerText = 'radio_button_checked';
sorterContainer.lastChild.classList.remove('label-input-sort_right-border');

/* direction sorting */

const inputDirectionSorting = appendInput(sortSettingsContainer, `checkbox`, `directionSorting`, ['input-sort_styled', 'element_hidden'], { name: `directionSorting` },
    true, ['label-input-sort_styled', 'element_hidden'], '', true);
const directionSortingFakeIcon = appendElement(inputDirectionSorting.parentNode, 'div', 'fake-icon_wrapper', '<span class="material-icons fake-icon_styled fake-icon_styled-direction">expand_less</span>');
inputDirectionSorting.before(directionSortingFakeIcon);
const directionSortingTitle = appendElement(inputDirectionSorting.parentNode, 'div', 'direction-sorting-title', 'Sorting ascending')
inputDirectionSorting.addEventListener('change', () => {
    directionSortingFakeIcon.firstChild.innerText = (inputDirectionSorting.checked) ? 'expand_more' : 'expand_less';
    directionSortingTitle.innerText = (inputDirectionSorting.checked) ? 'Sorting descending' : 'Sorting ascending';
    if (inputDirectionSorting.checked) {
        goodsSection.classList.add('sorted-descending');
    }
    else {
        goodsSection.classList.remove('sorted-descending');
    };
    showSearchInfo(searchCurrentInfoContainer, getCheckedCheckboxes(filterContainer), keyName, inputDirectionSorting.checked, searchInputText.value);
});

/* call adding form button */

const addButton = appendElement(navigation, 'div', 'add-button', '<span class="material-icons logo-block logo-size_add-button">note_add</span >');
addButton.addEventListener('click', () => renderAddingForm(goodsSection, model));

//  ----------------------------------  create search info panel  ----------------------------    //

const searchCurrentInfo = appendElement(mainContainer, 'div', 'search-current-information');
const searchCurrentInfoContainer = appendElement(searchCurrentInfo, 'div', 'search-current-information__container');
const restoreFilterSettingsButton = appendElement(searchCurrentInfo, 'div', 'search-current-information__button', '<span class="material-icons restore-settings-button">youtube_searched_for</span >')
restoreFilterSettingsButton.addEventListener('click', () => {
    /* restore filter */
    for (const checkbox of filterContainer.getElementsByTagName('input')) {
        checkbox.checked = true;
        checkbox.parentNode.firstChild.firstChild.innerText = 'check_box';
    };
    /* restore sorter */
    document.getElementById('nameCategory').checked = true;
    const arrayInputs = sorterContainer.getElementsByTagName('input');
    const arrayIcons = sorterContainer.getElementsByClassName('fake-icon_styled');
    for (let index = 0; index < arrayInputs.length; index++) {
        arrayIcons[index].innerText = (arrayInputs[index].checked === true) ? 'radio_button_checked' : 'radio_button_unchecked';
    };
    /* restore direction */
    inputDirectionSorting.checked = false;
    directionSortingFakeIcon.firstChild.innerText = (inputDirectionSorting.checked) ? 'expand_more' : 'expand_less';
    directionSortingTitle.innerText = (inputDirectionSorting.checked) ? 'Sorting descending' : 'Sorting ascending';
    if (inputDirectionSorting.checked) {
        goodsSection.classList.add('sorted-descending');
    }
    else {
        goodsSection.classList.remove('sorted-descending');
    };
    /* restore search field */
    searchInputText.value = "";
    /* refresh view */
    showCards(searchFilter(filteredModel(model, getCheckedCheckboxes(filterContainer)), searchInputText.value).sort(sortCallback), goodsSection);
    showSearchInfo(searchCurrentInfoContainer, getCheckedCheckboxes(filterContainer), keyName, inputDirectionSorting.checked, searchInputText.value);
});
//  ----------------------------------  create goods section  ----------------------------    //

const goodsSection = appendElement(mainContainer, 'div', 'goods-section');
if (model.length === 0) {
    appendElement(goodsSection, 'div', 'stub-no-products', 'No products')
} else {
    showCards(searchFilter(filteredModel(model, getCheckedCheckboxes(filterContainer)), searchInputText.value).sort(sortCallback), goodsSection);
    showSearchInfo(searchCurrentInfoContainer, getCheckedCheckboxes(filterContainer), keyName, inputDirectionSorting.checked, searchInputText.value);
};