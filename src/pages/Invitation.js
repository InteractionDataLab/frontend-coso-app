import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Input,
  Segment,
  Button,
  Message,
  Container,
  Grid,
  Divider,
  Header,
  Icon,
  Form,
  Image,
  Checkbox
} from 'semantic-ui-react';

import { Context, cleanContext } from '../utils/Context';
import { Api } from '../Api';

const Invitation = () => {
  const context = useContext(Context);
  const history = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (event, { name, value }) => {
    if(name === "password") {
      setPassword(value);
    }
    else if(name === "passwordConfirmation") {
      setPasswordConfirmation(value);
    }
    else {
      setConsent(!consent);
    }
  }

  const handleInvitation = (event) => {
    if(consent && password === passwordConfirmation && password.length > 5) {
      const user = {
        'invitation_token': searchParams.get("invitation_token"),
        'password': password
      }
      // history
      Api.put("/invitation", {user})
      .then(() => {
        history("/login");
      })
      .catch((error) => {
        history("/");
      })

      setError(false);
    } else {
      setError(true);
    }
  }

  return (
    <Container>
      <Grid padded centered>
        <Grid.Row verticalAlign='middle'>
          <Grid.Column>
            <Segment inverted attached="top" textAlign="center">
              <Header icon style={{margin: "0em"}}>
                <Icon name="user circle" size="massive"/>
                Registration
              </Header>
            </Segment>
            <Segment attached padded>
              <Form error={error}>
                <Form.Field>
                  <Form.Input focus error={error} label="Password" type="password" placeholder='Tape your password' name="password" value={password} onChange={handleChange} />
                </Form.Field>
                <Form.Field>
                  <Form.Input focus error={error} label="Password confirmation" type="password" placeholder='Retape your password' name="passwordConfirmation" value={passwordConfirmation} onChange={handleChange} />
                </Form.Field>
                <Form.Checkbox error={error} name="consent" onChange={handleChange} label='I agree to the Terms and Conditions' />
                <Button type='submit' onClick={handleInvitation}>Submit</Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default Invitation;
