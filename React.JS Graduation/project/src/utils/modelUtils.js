export const maxMinPrice = (array) => {
    let maxPrice = array[0].price, minPrice = maxPrice;
    for (let item of array) {
        if (item.price > maxPrice) maxPrice = item.price;
        if (item.price < minPrice) minPrice = item.price;
    }
    return [minPrice, maxPrice];
}