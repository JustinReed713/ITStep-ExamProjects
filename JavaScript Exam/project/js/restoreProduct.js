'use strict';

function restoreProduct(parent, array) {
    let elementWasChoose = false;
    let timerRestore;

    if (lastDeletedProduct === null) {
        console.warn('Error in algorithm. Try to restore null was cancelled.');
    } else {

        /* create restore button */

        const restoreButton = appendElement(parent, 'div', ['restore-button', 'restore-button_transition'], 'Restore deleted product');

        /* positioning button */

        restoreButton.style.left = ((window.innerWidth - Number.parseInt(window.getComputedStyle(restoreButton).getPropertyValue('width'))) / 2) + 'px';

        /* starting transition */

        setTimeout(() => restoreButton.style.opacity = "0", 300);

        /* create events */

        restoreButton.addEventListener('transitionend', () => {
            console.log('end')
            lastDeletedProduct = null;
            restoreButton.remove();
        });
        restoreButton.addEventListener('click', () => {
            array.push(...lastDeletedProduct);
            console.log(array)
            showCards(searchFilter(filteredModel(array, getCheckedCheckboxes(filterContainer)), searchInputText.value).sort(sortCallback), goodsSection);
            restoreButton.remove();
        });
        restoreButton.addEventListener('mouseover', () => {
            elementWasChoose = true;
            clearTimeout(timerRestore);
            restoreButton.classList.remove('restore-button_transition');
            restoreButton.style.opacity = "1";
        });
        restoreButton.addEventListener('mouseout', () => {
            if (elementWasChoose) {
                timerRestore = setTimeout(() => {
                    elementWasChoose = false;
                    lastDeletedProduct = null;
                    restoreButton.remove();
                }, 1000);
            };
        });
    };
};

