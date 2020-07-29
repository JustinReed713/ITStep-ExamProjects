import "./Slider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";

import { ProductCardSlider } from "../../components";

export default function SimpleSlider(props) {
    const [centerPadding, setCenterPadding] = React.useState(adaptiveSize())

    function adaptiveSize() { return `${Math.round((window.screen.width / 100) * 9)}px`; }

    const settings = {
        autoplay: true,
        arrows: false,
        centerMode: true,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToScroll: 1,
        swipeToSlide: true,
        slidesToShow: 3,
        centerPadding: centerPadding
    };
    window.addEventListener("resize", () => setCenterPadding(adaptiveSize()));
    return (
        <div>
            <Slider {...settings}>
                {props.array.map((item) => {
                    return (
                        <div key={item.article + "-sliderElement"}>
                            <ProductCardSlider object={item} />
                        </div>
                    )
                })}
            </Slider>
        </div>
    );
}
