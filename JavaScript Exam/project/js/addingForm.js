'use strict'

function renderAddingForm(parent, modelArray, forEdit = false, modelArrayIndex) {

    /* create background stub */

    const backgroundColor = appendElement(parent, 'div', 'background-styled');

    /* sizing of background stub */

    backgroundColor.style.height = window.innerHeight + 'px';
    backgroundColor.style.width = window.innerWidth + 'px';

    /* create adding form */

    const addingForm = appendElement(parent, 'form', 'adding-form', `<span class="adding-form__title">${(forEdit) ? 'Edit' : 'Create new'} product</span>`);
    addingForm.setAttribute('id', 'addingForm');

    /* create sections of inputs containers */

    const arraySectionsAddingForm = ['Main information', 'Price segment', 'Secondary information'];
    for (const section of arraySectionsAddingForm) {
        appendElement(addingForm, 'fieldset', ['adding-form__section', 'form-section'], `<legend class="form-section__legend">${section}</legend>`);
    };

    const [mainSection, priceSegmentSection, additionalSection] = addingForm.getElementsByTagName('fieldset');

    /* create required main information inputs section */

    const arrayInputsMainInformationSectionAddingForm = ['name', 'article', 'price'];
    for (const input of arrayInputsMainInformationSectionAddingForm) {
        appendInput(mainSection, 'text', `${input}Input`, ['input_styled', 'adding-form__text-input'], { name: `${input}Input`, required: true, value: (forEdit) ? modelArray[modelArrayIndex][input] : "" },
            true, 'adding-form__label', textCapitalizer(input));
    };
    const [nameInput, articleInput, priceInput] = mainSection.getElementsByClassName('adding-form__text-input');
    appendInput(mainSection, 'number', 'countInput', ['input_styled', 'adding-form__number-input'], { name: 'countInput', min: '1', value: (forEdit) ? modelArray[modelArrayIndex].count : "1", required: true },
        true, 'adding-form__label', 'Count');
    mainSection.children[mainSection.childElementCount - 2].before(mainSection.lastElementChild);
    const dateInput = appendInput(mainSection, 'date', 'dateInput', ['input_styled', 'adding-form__date-input'], { name: 'dateInput', required: true, },
        true, 'adding-form__label', 'Date');
    dateInput.valueAsDate = new Date();

    /* create price segment inputs section */

    const arrayInputsPriceSegmentSectionAddingForm = ['cheap', 'optimal', 'premium'];
    for (const input of arrayInputsPriceSegmentSectionAddingForm) {
        const radio = appendInput(priceSegmentSection, `radio`, `${input}Price`, ['input_styled', 'adding-form__radio-input', 'element_hidden'], { name: `priceSegmentInput`, value: input },
            true, ['adding-form__label', 'adding-form__label_radio', `adding-form__label_radio-${input}`], textCapitalizer(input), true);
        const fakeIcon = appendElement(radio.parentNode, 'div', 'fake-icon_wrapper', '<span class="material-icons fake-icon_styled">radio_button_unchecked</span>');
        radio.before(fakeIcon);
        radio.addEventListener('change', () => {
            const arrayInputs = priceSegmentSection.getElementsByTagName('input');
            const arrayIcons = priceSegmentSection.getElementsByClassName('fake-icon_styled');
            for (let index = 0; index < arrayInputs.length; index++) {
                arrayIcons[index].innerText = (arrayInputs[index].checked === true) ? 'radio_button_checked' : 'radio_button_unchecked';
            };
        });
    };

    /* create additional inputs section */

    const imagePath = appendInput(additionalSection, 'text', 'imageInput', ['input_styled', 'adding-form__text-input'], { name: 'imageInput', value: (forEdit) ? modelArray[modelArrayIndex].image : "" },
        true, 'adding-form__label', 'Image');
    imagePath.addEventListener('change', () => {
        const imagePreview = appendElement(imagePath.parentNode, 'div', 'image-preview');
        const imageContainer = appendElement(imagePreview, 'img', 'image-preview__container');
        imageContainer.src = imagePath.value;
        imageContainer.addEventListener('error', () => imageContainer.src = "src/img/stub.gif");
    });
    const descriptionInput = appendElement(additionalSection, 'textarea', ['input_styled', 'adding-form__description-input']);
    descriptionInput.setAttribute('name', 'descriptionInput');
    descriptionInput.setAttribute('form', 'addingForm');

    /* create buttons container */

    const controlContainer = appendElement(addingForm, 'div', 'control-container');
    const confirmButton = appendInput(controlContainer, 'submit', 'submitButton', ['adding-form__submit-button', 'adding-form__button']);
    const cancelButton = appendInput(controlContainer, 'reset', 'cancelButton', ['adding-form__cancel-button', 'adding-form__button']);
    cancelButton.setAttribute('value', 'Close');

    /* positioning of adding form on screen */

    addingForm.style.top = ((window.innerHeight - Number.parseInt(window.getComputedStyle(addingForm).getPropertyValue('height'))) / 2) + 'px';
    addingForm.style.left = ((window.innerWidth - Number.parseInt(window.getComputedStyle(addingForm).getPropertyValue('width'))) / 2) + 'px';

    /* some magic if used as editing */

    if (forEdit) {
        dateInput.setAttribute('disabled', true);
        const checkedRadio = document.getElementById(`${modelArray[modelArrayIndex].priceSegment}Price`);
        checkedRadio.setAttribute('checked', true);
        checkedRadio.parentNode.firstChild.firstChild.innerText = 'radio_button_checked';
        descriptionInput.value = modelArray[modelArrayIndex].description;
        confirmButton.setAttribute('value', 'Change product');
    } else {
        priceSegmentSection.getElementsByTagName('input')[0].setAttribute('checked', true);
        confirmButton.setAttribute('value', 'Create product');
        document.getElementById('cheapPrice').defaultChecked = true;
        document.getElementById('cheapPrice').parentNode.firstChild.firstChild.innerText = 'radio_button_checked';
    };

    /* create events for elements */

    nameInput.addEventListener('input', () => {
        if (/^\D{5}/.test(nameInput.value)) {
            nameInput.classList.remove('input_invalid');
            nameInput.classList.add('input_valid');
            confirmButton.removeAttribute('disabled');
            nameInput.removeAttribute('data-tooltip');
        } else {
            nameInput.classList.remove('input_valid');
            nameInput.classList.add('input_invalid');
            confirmButton.setAttribute('disabled', 'true');
            nameInput.setAttribute('data-tooltip', 'Entering text must be more then five letters');
        };
    });

    articleInput.addEventListener('input', () => {
        if (/^[A-Z]\d{2}/.test(articleInput.value) === true) {
            if ((getArrayArticles(modelArray).includes(articleInput.value) === false) || ((forEdit) ? (articleInput.value === modelArray[modelArrayIndex].article) : (true))) {
                articleInput.classList.remove('input_invalid');
                articleInput.classList.add('input_valid');
                confirmButton.removeAttribute('disabled');
                articleInput.removeAttribute('data-tooltip');
            } else {
                articleInput.classList.remove('input_valid');
                articleInput.classList.add('input_invalid');
                confirmButton.setAttribute('disabled', 'true');
                articleInput.setAttribute('data-tooltip', 'Product with this article already exist');
            };
        } else {
            articleInput.classList.remove('input_valid');
            articleInput.classList.add('input_invalid');
            confirmButton.setAttribute('disabled', 'true');
            articleInput.setAttribute('data-tooltip', 'Entering text must start with upper case letter and include two or more numbers');
        };
    });

    priceInput.addEventListener('input', () => {
        if (Number.isInteger(+priceInput.value)) {
            priceInput.classList.remove('input_invalid');
            priceInput.classList.add('input_valid');
            confirmButton.removeAttribute('disabled');
            priceInput.removeAttribute('data-tooltip');
        } else {
            priceInput.classList.remove('input_valid');
            priceInput.classList.add('input_invalid');
            confirmButton.setAttribute('disabled', 'true');
            priceInput.setAttribute('data-tooltip', 'Entering value must be an integer');
        };
    });

    addingForm.addEventListener('submit', () => {
        event.preventDefault();
        productCreate(addingForm, modelArray, 'input_styled', forEdit, modelArrayIndex);
        backgroundColor.remove();
        addingForm.remove();
        showCards(searchFilter(filteredModel(model, getCheckedCheckboxes(filterContainer)), searchInputText.value).sort(sortCallback), goodsSection);
        showSearchInfo(searchCurrentInfoContainer, getCheckedCheckboxes(filterContainer), keyName, inputDirectionSorting.checked, searchInputText.value);
        onEdit = false;
    });

    cancelButton.addEventListener('click', (event) => {
        event.preventDefault();
        backgroundColor.remove();
        addingForm.remove();
        showCards(searchFilter(filteredModel(model, getCheckedCheckboxes(filterContainer)), searchInputText.value).sort(sortCallback), goodsSection);
        showSearchInfo(searchCurrentInfoContainer, getCheckedCheckboxes(filterContainer), keyName, inputDirectionSorting.checked, searchInputText.value);
        onEdit = false;
    });
};
