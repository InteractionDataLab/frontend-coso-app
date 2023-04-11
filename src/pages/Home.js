import React, { useEffect, useState, useContext } from 'react';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
  Visibility
} from 'semantic-ui-react';

import { Context, isModerator } from '../utils/Context';
import "../index.css";

const Home = () => {
  const context = useContext(Context);

  if(!context.firstLoad && context.user.email) {
    return (
      <Segment style={{ margin: '0em' }} basic>
        <Container>
          <Segment basic style={{padding: "2em"}}>
            <p className="text_home" style={{textIndent: "2em"}}>Welcome to CoSo, the Collaborative Sonar platform! Our platform is designed specifically for program coordinators who want to monitor and evaluate engagement and interactions between participants in collaborative programs or citizen science projects. With CoSo, you'll be able to register participants in a database, design and send surveys, collect information about interactions, and visualize data in a dashboard.</p>

            <p className="text_home" style={{textIndent: "2em"}}>Now you are logged in, you can select the program you were invited to, it will take you to the main dashboard where you can manage the participants database. Here, you can add new participants, view and edit existing ones, and even import a list of participants from a CSV file.</p>

            <p className="text_home" style={{textIndent: "2em"}}>Next, you can design and send surveys to participants. CoSo makes it easy to create custom surveys with a variety of question types and options. You can also target specific subsets of participants.</p>

            <p className="text_home" style={{textIndent: "2em"}}>Finally, you can view the data collected from the surveys and interactions in the dashboard. The visualizations provided make it easy to understand the results and identify any areas where participants may need extra help. With this information, you can take informed actions to improve the overall engagement and participation in your program.</p>

            <p className="text_home" style={{textIndent: "2em"}}>Thank you for choosing CoSo and we're excited to see you make the most out of your program with our platform. If you have any questions don't hesitate to reach out for support.</p>

          </Segment>
        </Container>
      </Segment>
    )
  } else {
    return (

      <Segment style={{ margin: '0em' }} basic>
        <Container>
          <Segment basic style={{padding: "2em"}}>
            <Header as='h1' textAlign="center">What is CoSo ?</Header>
            <p className="text_home" style={{textIndent: "2em"}}>CoSo (for Collaborative Sonar) is a platform dedicated to the monitoring and contextualization of team interactions through self-reports and surveys. It is particularly designed for program coordinators who wish to monitor and evaluate the engagement and interactions between participants. Examples include participatory / collaborative innovation programs where participants can form teams and interact with other teams or with the coordinators in order to advance their projects, or citizen science projects who need to monitor the participation of their target community. As communities get large (few hundreds of participants), it can become intractable to know whether participants are well integrated into the ecosystem, or whether they are siloed and would need to get help to connect to other relevant participants. As such, having access to the architecture of participation is important, i.e. an overall picture of the interaction network.</p>

            <p className="text_home">To answer these needs, CoSo allows program coordinators to register participants in a database, design and send surveys to participants, collect information about their interactions, and visualize both the results of the surveys as well as the analytics on engagement in a visualization dashboard. In the interface, coordinators can:</p>

            <List bulleted>
              <List.Item className="text_home">Manage the participants database</List.Item>
              <List.Item className="text_home">Design and send surveys</List.Item>
              <List.Item className="text_home">Visualize data in a dashboard</List.Item>
            </List>
            <p className="text_home">Using CoSo, coordinators can therefore monitor their program more effectively, and take informed actions  based on the provided visualizations.</p>
          </Segment>
          <Segment vertical textAlign="left">
          </Segment>
          <Segment vertical textAlign="center">
          </Segment>
        </Container>
      </Segment>
    )
  }
}

// <Segment basic textAlign="center">
//   <Header  as='h1'>Project details</Header>
// </Segment>
// <Segment basic textAlign="left">
//   <Grid columns={3} stackable textAlign='center'>
//     <Grid.Row verticalAlign='middle'>
//       <Grid.Column>
//         <Header icon>
//           <Icon name="question circle outline" size="massive"/>
//           Questionnaires
//         </Header>
//         <br/>
//       </Grid.Column>
//
//       <Grid.Column>
//         <Header icon>
//           <Icon name="expand arrows alternate" size="massive"/>
//           Communication metadata
//         </Header>
//         <br/>
//       </Grid.Column>
//
//       <Grid.Column>
//         <Header icon>
//           <Icon name="users" size="massive"/>
//           Social experiment
//         </Header>
//         <br/>
//       </Grid.Column>
//     </Grid.Row>
//   </Grid>
// </Segment>

export default Home;
