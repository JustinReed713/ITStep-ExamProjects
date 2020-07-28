import "./Slider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";

import { ProductCardSlider } from "../../components";

export default class SimpleSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slidesToShow: 0
        }
    }

    componentDidMount() {
        this.setSlidesToShow(500)
    }

    /* additional methods */

    adaptiveSize = (childWidth) => Math.floor(window.innerWidth / childWidth);

    setSlidesToShow = (childWidth) => this.setState({ slidesToShow: this.adaptiveSize(childWidth) });

    /* render method */

    render() {
        const settings = {
            autoplay: true,
            arrows: false,
            centerMode: true,
            centerPadding: "120px",
            dots: true,
            infinite: true,
            speed: 500,
            slidesToScroll: 1,
            swipeToSlide: true
        };
        window.addEventListener("resize", () => this.setSlidesToShow(500));
        return (
            <div>
                <Slider {...settings} {...this.state}>
                    {this.props.array.map((item, index) => {
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
}
