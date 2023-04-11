import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {
  Segment,
  Container,
  Header,
  Image,
  Grid,
  Menu,
  Label,
  Button,
  Icon,
  Input,
  Form,
  Card,
  Item,
  Divider
 } from 'semantic-ui-react';

import { Context, isModerator } from '../utils/Context';
import { Api } from '../Api';
import ParticipantItem from '../components/ParticipantItem';
import "../index.css";
import jenny from '../images/jenny.jpg';

const Participant = () => {
  const context = useContext(Context);
  const { program, team_id, participant_id } = useParams();
  const history = useNavigate();
  const [loading, setLoading] = useState(true);
  const [participant, setParticipant] = useState({});
  const [user, setUser] = useState(null);
  const [main, setMain] = useState("");

  useEffect(() => {
    if(!context.firstLoad) {
      if(program in context.programs) {
        loadParticipant();
      } else {
        history("/");
      }
    }
  }, [context.firstLoad]);

  useEffect(() => {
    if(!context.firstLoad) {
      if(isModerator(context, context.programs[program].id)) {
        setMain(
          <Segment basic loading={loading}>
            <Grid>
              <Grid.Column>
                <Card centered>
                  <Image src={jenny} />
                  { loading ?
                      null
                    :
                      <>
                      <Card.Content>
                        <Card.Header>{participant.name}</Card.Header>
                        { user ?
                            <>
                            <Card.Meta>User created at {participant.created_at.slice(0, 10)}</Card.Meta>
                            <Card.Description>
                              <Item.Group>
                                <Item>
                                  { user.invitation_accepted ?
                                      <p><strong>Joined at {user.confirmed_at.slice(0, 10)}</strong> (invitation accepted)</p>
                                    :
                                      <p><strong>Invitation pending</strong></p>
                                  }
                                </Item>
                              </Item.Group>
                            </Card.Description>
                            </>
                          :
                            null
                        }
                      </Card.Content>
                      <Card.Content extra>
                      </Card.Content>
                      </>
                  }
                </Card>
              </Grid.Column>
            </Grid>
          </Segment>
        )
      }
    }
  }, [participant, loading])

  const loadParticipant = async() => {
    setLoading(true);

    await Api.get('programs/' + context.programs[program].id + '/teams/' + team_id + "/participants/" + participant_id)
    .then(async(res) => {
      setParticipant(res.data);
      
      if(res.data.user_id !== null) {
        await Api.get('users/' + res.data.user_id  + "?program_id=" + context.programs[program].id)
        .then((res) => {
          setUser(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
      }

      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    });
  }

  return (
    <Container fluid className="container-page">
      {main}
    </Container>
  )
}

export default Participant;
