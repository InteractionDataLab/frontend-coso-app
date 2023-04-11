import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {
  Segment,
  Container,
  Header,
  Grid,
  Menu,
  Label,
  Button,
  Icon,
  Input,
  Form,
  Divider
 } from 'semantic-ui-react';

import { Context, isModerator, isAdmin } from '../utils/Context';
import { Api } from '../Api';
import ParticipantItem from '../components/ParticipantItem';
import "../index.css";

const Team = () => {
  const context = useContext(Context);
  const { program, team_id } = useParams();
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [displayParticipantCreation, setDisplayParticipantCreation] = useState(false);
  const [sortColumn, setSortColumn] = useState("part-top");
  const [team, setTeam] = useState({});
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [main, setMain] = useState("");

  useEffect(() => {
    if(!context.firstLoad) {
      if(program in context.programs && isModerator(context, context.programs[program].id)) {
        loadTeam();
      } else {
        history("/");
      }
    }
  }, [context.firstLoad]);

  useEffect(() => {
    if(!context.firstLoad) {
      setMain(
        <>
        <Segment inverted attached="top" textAlign="center">
          <Header>{team.name}</Header>
        </Segment>

        <Segment loading={loading}>
          <Grid doubling columns={3}>
            <Grid.Row>
              <Grid.Column width={2} verticalAlign="middle">
                <Label.Group>
                  <Icon name='users' /> {filteredParticipants.length} participants
                </Label.Group>
              </Grid.Column>
              <Grid.Column width={2} verticalAlign="middle">
              </Grid.Column>
              <Grid.Column width={12} textAlign="right" verticalAlign="middle">
                <Input icon='search' onChange={(e, {value}) => {filterParticipants(value);}} placeholder='Search...' />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment basic loading={loading}>
          <Header block attached="top">
            <Grid columns={5} doubling verticalAlign="middle">
              <Grid.Column verticalAlign="middle">
                <Header as="h3"><a className="link-column" onClick={() => {selectSortColumn("part")}}>Participant</a></Header>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Header as="h3"><a className="link-column" onClick={() => {selectSortColumn("registered")}}>Status</a></Header>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Header as="h3">Email</Header>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Header as="h3">Action</Header>
              </Grid.Column>
              <Grid.Column>
                { isAdmin(context, context.programs[program].id) ?
                    <Label.Group>
                      <Button floated="right" size="small" secondary icon='add circle' content="Add a participant" onClick={showParticipantCreation} />
                    </Label.Group>
                  :
                    null
                }
              </Grid.Column>
            </Grid>
          </Header>
          { displayParticipantCreation ?
              <Segment attached>
                <Grid columns={1} doubling verticalAlign="middle" textAlign="center">
                  <Grid.Row>
                    <Grid.Column>
                      <Form>
                        <Form.Group inline style={{margin: 0}}>
                          { error ?
                              <Form.Input focus error required placeholder='New participant' name="name" value={name} onChange={(e, { name, value }) => setName(value)} />
                            :
                              <Form.Input focus required placeholder='New participant' name="name" value={name} onChange={(e, { name, value }) => setName(value)} />
                          }
                          <Button color="black" content='Save' labelPosition='right' size="tiny" icon='save' secondary onClick={handleCreateParticipant} />
                        </Form.Group>
                      </Form>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            :
              null
          }
          {(() => {
            switch (sortColumn) {
              case "part-top": return filteredParticipants.sort((p1, p2) => p1.name.toLowerCase() > p2.name.toLowerCase() ? 1 : -1).map((part, i) => { return <ParticipantItem loadTeam={loadTeam} program={program} team_id={team.id} participant={part} key={i} />; });
              case "part-bot": return filteredParticipants.sort((p1, p2) => p1.name.toLowerCase() < p2.name.toLowerCase() ? 1 : -1).map((part, i) => { return <ParticipantItem loadTeam={loadTeam} program={program} team_id={team.id} participant={part} key={i} />; });
              case "registered-top": return filteredParticipants.sort((p1, p2) => p1.user_id > p2.user_id ? 1 : -1).map((part, i) => { return <ParticipantItem loadTeam={loadTeam} program={program} team_id={team.id} participant={part} key={i} />; });
              case "registered-bot": return filteredParticipants.sort((p1, p2) => p1.user_id < p2.user_id ? 1 : -1).map((part, i) => { return <ParticipantItem loadTeam={loadTeam} program={program} team_id={team.id} participant={part} key={i} />; });
              case "": return filteredParticipants.map((part, i) => { return <ParticipantItem loadTeam={loadTeam} program={program} team_id={team.id} participant={part} key={i} />; });
            }
          })()}
        </Segment>
        </>
      )
    }
  }, [team, sortColumn, name, displayParticipantCreation])

  const loadTeam = () => {
    setLoading(true);

    Api.get('programs/' + context.programs[program].id + '/teams/' + team_id)
    .then((res) => {
      setTeam(res.data);
      setFilteredParticipants(res.data.participants);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    });
  }

  const selectSortColumn = (column) => {
    if(sortColumn.includes("top")) {
      setSortColumn(column + "-bot");
    } else {
      setSortColumn(column + "-top");
    }
  }

  const showParticipantCreation = () => {
    if(displayParticipantCreation) {
      setDisplayParticipantCreation(false);
    } else {
      setDisplayParticipantCreation(true);
      setName('');
      setError(false);
    }
  }

  const handleCreateParticipant = (event) => {
    if(name.length > 3) {
      const participant = {
        "name": name
      }

      Api.post("programs/" + context.programs[program].id + "/teams/" + team_id + "/participants", {participant})
      .then((res) => {
        setFilteredParticipants(old => ([res.data, ...old]));
        setSortColumn("");
        setError(false);
        setName("");
        setDisplayParticipantCreation(false);
      }).catch((error) => {
        setError(true);
      });
    } else {
      setError(true);
    }
  }

  const filterParticipants = (value) => {
    const result = team.participants.filter(par => {
      if(par.name.toLowerCase().includes(value.toLowerCase())) {
        return true;
      } else {
        return false
      }
    });

    setFilteredParticipants(result);
  };

  return (
    <Container fluid className="container-page" style={{marginLeft: "2em", marginRight: "2em"}}>
      {main}
    </Container>
  )
}

export default Team;
