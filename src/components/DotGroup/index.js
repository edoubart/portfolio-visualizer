// NPM Packages
import { Dot } from 'pure-react-carousel';
import React from 'react';
import { Button, Container } from 'semantic-ui-react';

// Constants
const CONTAINER_TEXT_ALIGN = 'center';
const BUTTON_GROUP_SIZE = 'mini';
const BUTTON_ICON = 'circle';

function DotGroup(props) {
  // Renderers
  function renderButton(visualization, index) {
    return (
      <Button
        as={Dot}
        icon={BUTTON_ICON}
        key={visualization.id}
        slide={index}
        title={visualization.label}
      />
    );
  }

  function renderButtons(visualizations) {
    return Object.keys(visualizations)
      .map((id, index) => {
        return renderButton(visualizations[id], index);
      });
  }

  return (
    <Container className='DotGroup' textAlign={CONTAINER_TEXT_ALIGN}>
      <Button.Group size={BUTTON_GROUP_SIZE}>
        { renderButtons(props.data.visualizations) }
      </Button.Group>
    </Container>
  );
}

export default DotGroup;
