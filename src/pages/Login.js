import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input,
         Segment,
         Button,
         Message,
         Container,
         Grid,
         Divider,
         Header,
         Icon,
         Form,
         Image        } from 'semantic-ui-react';

import { Context, cleanContext } from '../utils/Context';
import { Api } from '../Api';

const Login = () => {
  const context = useContext(Context);
  const history = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleChange = (event, { name, value }) => {
    if(name === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  }

  const handleLogin = (event) => {
    const user = {
      'email': email,
      'password': password
    }

    Api.post('login', {user})
    .then((res) => {
      cleanContext(context);
      localStorage.setItem("Authorization", res.headers.authorization);
      localStorage.setItem("User", JSON.stringify(res.data));
      context.setUser(res.data);
      context.setCurrentProgram("");
      history("/");
    })
    .catch((error) => {
      setHasError(true);
    });

  }

  if(!context.user.email) {
    return (
      <Container>
        <Grid padded centered>
          <Grid.Row verticalAlign='middle'>
            <Segment padded color="black">
              <Form error={hasError}>
                <Grid textAlign='center'>
                  <Grid.Row>
                    <Header icon>
                      <Icon name="user circle" size="massive"/>
                      Sign in to CoSo
                    </Header>
                  </Grid.Row>
                  <Grid.Row>
                    <Form.Input focus placeholder='Email address' name="email" value={email} onChange={handleChange} />
                  </Grid.Row>
                  <Grid.Row>
                    <Form.Input focus type="password" placeholder='Password' name="password" value={password} onChange={handleChange} />
                  </Grid.Row>
                  <Grid.Row>
                    <Message error content="Invalid email or password."/>
                  </Grid.Row>
                  <Grid.Row>
                    <Button color='teal' size='large' onClick={handleLogin}>
                      Sign in
                    </Button>
                  </Grid.Row>
                </Grid>
              </Form>
            </Segment>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}

const Logout = () => {
  const context = useContext(Context);
  const history = useNavigate();

  useEffect(() => {
    Api.delete('logout');
    cleanContext(context);
    history("/");
  }, [])
}

export {Login, Logout};
