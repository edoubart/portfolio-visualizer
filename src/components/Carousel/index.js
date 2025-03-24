// NPM Packages
import {
  CarouselProvider,
  Slide,
  Slider
} from 'pure-react-carousel';
import React from 'react';
import { Divider } from 'semantic-ui-react';

// Custom Modules
import DotGroup from './../DotGroup';

// Styles
import 'pure-react-carousel/dist/react-carousel.es.css';

// Constants
const CAROUSEL_PROVIDER_NATURAL_SLIDE_HEIGHT = 1;
const CAROUSEL_PROVIDER_NATURAL_SLIDE_WIDTH = 1;

function Carousel(props) {
  // Renderers
  function renderSlide(visualization, index) {
    return (
      <Slide
        key={visualization.id}
        index={index}
      >
        { visualization.component }
      </Slide>
    );
  }

  function renderSlides(visualizations) {
    return Object.keys(visualizations)
      .map((id, index) => {
        return renderSlide(visualizations[id], index);
      });
  }

  const slidesCount = Object.keys(props.data.visualizations).length;

  return (
    <CarouselProvider
      className='Carousel'
      naturalSlideWidth={CAROUSEL_PROVIDER_NATURAL_SLIDE_WIDTH}
      naturalSlideHeight={CAROUSEL_PROVIDER_NATURAL_SLIDE_HEIGHT}
      totalSlides={slidesCount}
    >
      <DotGroup
        data={{
          visualizations: props.data.visualizations,
        }}
      />
      <Divider />
      <Slider>
        { renderSlides(props.data.visualizations) }
      </Slider>
    </CarouselProvider>
  );
}

export default Carousel;
