import React from 'react';
import {
  Button,
  Container,
  Segment,
} from 'semantic-ui-react';

const Header = () => {
  return (
    <Segment basic textAlign='center' inverted style={{ margin: '0em' }}>
      <Segment vertical inverted>
        <h1>Welcome to <b>CoSo</b></h1>
      </Segment>
      <Segment vertical inverted>
        <h3>A platform to monitor team interactions and evaluate participatory programs</h3>
      </Segment>
      <Segment vertical inverted>
      </Segment>
    </Segment>
  )
}
// <Button inverted>Learn More</Button>
export default Header;
