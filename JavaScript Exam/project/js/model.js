'use strict';

//   ---------------  declaration model variable  ---------------   //

//   ---------------  declaration class of goods  ---------------   //

class Product {
    constructor(name = "", article = "", count = 0, price = 0, date = "", priceSegment = "", image = "", description = "" ){
        this.name = name;
        this.article = article;
        this.count = count;
        this.price = price;
        this.date = date;
        this.priceSegment = priceSegment;
        this.image = image;
        this.description = description;
    };
};

var model = [];

model.push(new Product('Fireblast', 'F23', 6, 156, '2020-05-15', 'optimal', "", 'It could blow up your ass, motherfucka'));
model.push(new Product('Mireblast', 'A24', 1, 25, '2019-06-10', 'cheap', "", ''));
model.push(new Product('Neitherblast', 'B23', 2, 96, '2020-05-11', 'premium', "", 'It could blow up your ass, motherfucka'));
model.push(new Product('Airevlast', 'B19', 25, 3, '2018-04-25', 'premium', "https://html5book.ru/wp-content/uploads/2014/10/backgrounds.png", 'It could blow up your ass, motherfucka'));


