import React from 'react';
import {
  Segment,
  Container,
  Header,
  Item,
  Image,
  Icon
 } from 'semantic-ui-react';

import "../index.css";

const About = () => {
  return (
    <Container>
      <Segment basic textAlign="center" style={{padding: "2em"}}>
        <Header as='h1'>About the team</Header>
      </Segment>
      <Segment basic>
        <p className="text_home">CoSo has been developed at the <a href="https://interactiondatalab.com/" target="_blank" rel="noreferrer">Interaction Data Lab</a> at the Learning Planet Institute of Université Paris Cité in France.</p>
        <p className="text_home">We are a research group using network science approaches to study participatory programs in science and engineering.
        CoSo was developed to study research programs where teams compete in a collaborative context to develop prototypes. The following articles can be cited to refer to this platform:
        </p>
      </Segment>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Content>
              <Item.Header as='a'>Quantified Us: A group-in-the-loop approach to team network reconstruction</Item.Header>
              <Item.Meta>Tackx, R., Blondel, L., & Santolini, M. (2021).</Item.Meta>
              <Item.Description>Adjunct Proceedings of the 2021 ACM International Joint Conference on Pervasive and Ubiquitous Computing and Proceedings of the 2021 ACM International Symposium on Wearable Computers, 502–507.</Item.Description>
              <Item.Description>
              </Item.Description>
              <Item.Extra>https://doi.org/10.1145/3460418.3479363</Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Content>
              <Item.Header as='a'>Collaboration and Performance of Citizen Science Projects Addressing the SDGs</Item.Header>
              <Item.Meta>Masselot, C., Jeyaram, R., Tackx, R., Fernandez-Marquez, J. L., Grey, F., & Santolini, M. (2022).</Item.Meta>
              <Item.Description></Item.Description>
              <Item.Description>
              </Item.Description>
              <Item.Extra>https://hal.archives-ouvertes.fr/hal-03808080</Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    </Container>
  )
}

export default About;
