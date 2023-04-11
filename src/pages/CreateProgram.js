import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import {
  Segment,
  Container,
  Header,
  Menu,
  Grid,
  Divider,
  Form,
  Message,
  Button,
  Label
 } from 'semantic-ui-react';

import { Context, isGod } from '../utils/Context';
import "../index.css";
import { Api } from '../Api';

const CreateProgram = () => {
  const context = useContext(Context);
  const history = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if(!context.firstLoad) {
      if(!isGod(context)) {
        history("/");
      }
    }
  }, [context.firstLoad])

  const handleChange = (event, { name, value }) => {
    if(name == "name") {
      setName(value);
    } else {
      setDescription(value);
    }
  }

  const handleCreateProgram = (event) => {
    const today = new Date();
    const program = {
      'name': name,
      'year': parseInt(today.getFullYear()),
      'description': description
    }

    Api.post("programs", {program})
    .then((res) =>{
      setSuccess(true);
      setMessage("The program has been created.")
      context.setCurrentProgram("");
      context.loadPrograms(context);
      setName('');
      setDescription('');
    }).catch((error) => {
      setError(true);
      setMessage("This program already exists.");
    });
  }

  if(!context.firstLoad && isGod(context)) {
    return (
      <Segment basic>
        <Grid padded>
          <Grid.Column width={2}></Grid.Column>
          <Grid.Column width={12}>
            <Segment inverted attached="top" textAlign="center">
              <Header>Create a program</Header>
            </Segment>
            <Segment attached>
              <Form error={error} success={success}>
                <Grid columns={2} padded divided stretched stackable>
                  <Grid.Row>
                    <Grid.Column width={3} verticalAlign="middle">
                      <Container>Program name</Container>
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Container>
                        <Form.Input focus required placeholder='Enter a name' name="name" value={name} onChange={handleChange} />
                      </Container>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={3} verticalAlign="middle">
                      <Container>Description</Container>
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Container>
                        <Form.TextArea placeholder='Type some description about the program' name="description" value={description} onChange={handleChange} />
                      </Container>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Grid columns={3}>
                  <Grid.Row>
                    <Grid.Column width={2}></Grid.Column>
                    <Grid.Column width={12} textAlign="center">
                    { message ?
                        <Message error={error} success={success} content={message}/>
                      :
                        null
                    }
                    </Grid.Column>
                    <Grid.Column width={2}></Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={2}></Grid.Column>
                    <Grid.Column width={12} textAlign="center">
                      <Button content='Save' labelPosition='right' icon='save' secondary onClick={handleCreateProgram} />
                    </Grid.Column>
                    <Grid.Column width={2}></Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            </Segment>
          </Grid.Column>
          <Grid.Column width={2}></Grid.Column>
        </Grid>
      </Segment>
    )
  }
}

export default CreateProgram;
