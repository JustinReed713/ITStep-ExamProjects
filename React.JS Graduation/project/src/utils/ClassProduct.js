
export default class Product {
    constructor(name = "", article = "", count = 0, price = 0, creationDate = "", priceSegment = "", onSale = false, discount = 0, saleEndDate = "", reviews = [], imageURL = "", description = "", lastUpdateTime = "") {
        this.name = name;
        this.article = article;
        this.count = count;
        this.price = price;
        this.creationDate = creationDate;
        this.priceSegment = priceSegment;
        this.sale = {
            onSale: onSale,
            discount: discount,
            saleEndDate: saleEndDate
        };
        this.reviews = [...reviews]
        this.imageURL = imageURL;
        this.description = description;
        this.lastUpdateTime = lastUpdateTime;
    };
};
