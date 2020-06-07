'use strict'

function cardCreate(object, parent) {

    /* create card container */

    const cardForm = appendElement(parent, 'div', 'card-form');

    /* create product image */

    const productImage = appendElement(cardForm, 'div', 'product-image');

    /* create product information */

    const productInformation = appendElement(cardForm, 'div', 'product-information');

    const arrayObjectKeys = Object.keys(object);
    for (const data of arrayObjectKeys) {
        if (data === 'image') {
            if (object[data] != "") productImage.style.backgroundImage = `url(${object[data]})`;
        } else {
            if (data === 'priceSegment') {
                switch (object[data]) {
                    case "cheap":
                        cardForm.classList.toggle('border-card_cheap');
                        break;
                    case "optimal":
                        cardForm.classList.toggle('border-card_optimal');
                        break;
                    case "premium":
                        cardForm.classList.toggle('border-card_premium');
                        break;
                };
                continue;
            };
            if (data === 'description') {
                if (object[data] === "") {
                    continue;
                };
                const labelData = appendElement(productInformation, 'div', 'data-label_description');
                const descriptionControl = appendElement(labelData, 'div', ['description-title', 'description_closed']);
                const descriptionText = appendElement(labelData, 'div', ['description-text', 'element_hidden'], object[data]);

                descriptionControl.addEventListener('click', () => {
                    labelData.classList.toggle('data-label_border-description')
                    descriptionControl.classList.toggle('description_closed');
                    descriptionControl.classList.toggle('description_open');
                    descriptionText.classList.toggle('element_hidden');
                });
                continue;
            };
            if (data === 'count') {
                if (object[data] === 1) {
                    const banner = appendElement(productImage, 'div', 'attention-banner', 'Last product');
                    productImage.classList.add('product-image_last-product');
                };
            };
            const labelData = appendElement(productInformation, 'div', 'data-label',
                `<div class="data-title">${textCapitalizer(data)} :</div><div class="data-value">${object[data]}</div>`);
            if (data === 'article') {
                labelData.lastChild.classList.add('article-anchor');
            };
        };
    };
    const settingsButton = appendElement(cardForm, 'div', 'settings-card',
        `<div class="text-wrap settings-control_closed"><span class="material-icons icon_styled">settings</span></div>
        <div class="text-wrap element_hidden"><span class="material-icons icon_styled">delete_forever</span>Delete</div>
        <div class="text-wrap element_hidden"><span class="material-icons icon_styled">create</span>Edit</div>`);

    settingsButton.children[0].addEventListener('click', () => {
        settingsButton.classList.toggle('settings-card_bordered');
        settingsButton.children[0].classList.toggle('settings-control_closed');
        settingsButton.children[0].classList.toggle('settings-control_open');
        settingsButton.children[1].classList.toggle('element_hidden');
        settingsButton.children[2].classList.toggle('element_hidden');
    });

    settingsButton.children[1].addEventListener('click', () => {
        lastDeletedProduct = model.splice(getElementIndex(model, productInformation.getElementsByClassName('article-anchor')[0].innerText), 1);
        showCards(searchFilter(filteredModel(model, getCheckedCheckboxes(filterContainer)), searchInputText.value).sort(sortCallback), goodsSection);
        showSearchInfo(searchCurrentInfoContainer, getCheckedCheckboxes(filterContainer), keyName, inputDirectionSorting.checked, searchInputText.value);
        restoreProduct(parent, model);
    });

    settingsButton.children[2].addEventListener('click', () => {
        if (onEdit === false) {
            onEdit = true;
            renderAddingForm(parent, model, onEdit, getElementIndex(model, productInformation.getElementsByClassName('article-anchor')[0].innerText));
        };
    });
};