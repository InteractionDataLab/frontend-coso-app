import React, { useEffect, useState, useContext } from 'react';
import { useParams } from "react-router-dom";
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
  Message
 } from 'semantic-ui-react';

import { Context, isModerator, isAdmin } from '../utils/Context';
import { Api } from '../Api';
import TeamItem from './TeamItem';
import "../index.css";

const Teams = ({program}) => {
  const context = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [sortColumn, setSortColumn] = useState("team-top");
  const [displayTeamCreation, setDisplayTeamCreation] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if(!context.firstLoad) {
      loadTeams();
    }
  }, [context.firstLoad]);

  const loadTeams = () => {
    setLoading(true);

    Api.get('programs/' + context.programs[program].id + '/teams')
    .then((res) => {
      setTeams(res.data);
      setFilteredTeams(res.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    });
  }

  const handleCreateTeam = (event) => {
    if(name.length > 3) {
      const team = {
        "name": name
      }

      Api.post("programs/" + context.programs[program].id + "/teams", {team})
      .then((res) =>{
        setFilteredTeams(old => ([res.data, ...old]));
        setSortColumn("");
        setError(false);
        setDisplayTeamCreation(false);
      }).catch((error) => {
        setError(true);
      });
    } else {
      setError(true);
    }
  }

  const showTeamCreation = () => {
    if(displayTeamCreation) {
      setDisplayTeamCreation(false);
    } else {
      setDisplayTeamCreation(true);
      setName('');
      setError(false);
    }
  }

  const selectSortColumn = (column) => {
    if(sortColumn.includes("top")) {
      setSortColumn(column + "-bot");
    } else {
      setSortColumn(column + "-top");
    }
  }

  const filterTeams = (value) => {
    const result = teams.filter(team => {
      if(team.name.toLowerCase().includes(value.toLowerCase())) {
        return true;
      } else {
        return false
      }
    });

    setFilteredTeams(result);
  };

  if(!context.firstLoad && isModerator(context, context.programs[program].id)) {
    return (
      <>
      <Segment>
        <Grid doubling columns={3}>
          <Grid.Row>
            <Grid.Column width={2} verticalAlign="middle">
              <Label.Group>
                <Icon name='tag' /> {filteredTeams.length} teams
              </Label.Group>
            </Grid.Column>
            <Grid.Column width={2} verticalAlign="middle">
              <Label.Group>
                <Icon name='users' /> {filteredTeams.reduce((a,v) =>  a = a + v.participants.length , 0 )} participants
              </Label.Group>
            </Grid.Column>
            <Grid.Column width={12} textAlign="right" verticalAlign="middle">
              <Input icon='search' onChange={(e, {value}) => {filterTeams(value);}} placeholder='Search...' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Segment basic loading={loading}>
        <Header block attached="top">
          <Grid doubling columns={4} verticalAlign="middle">
              <Grid.Column verticalAlign="middle">
                <Header as="h3"><a className="link-column" onClick={() => {selectSortColumn("team")}}>Team</a></Header>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Header as="h3"><a className="link-column" onClick={() => {selectSortColumn("participant")}}>Number of participants</a></Header>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Header as="h3">Action</Header>
              </Grid.Column>
              <Grid.Column>
                { isAdmin(context, context.programs[program].id) ?
                    <Label.Group>
                      <Button floated="right" size="small" secondary icon='add circle' content="Add a team" onClick={showTeamCreation} />
                    </Label.Group>
                  :
                    null
                }
              </Grid.Column>
          </Grid>
        </Header>
        { displayTeamCreation ?
            <Segment attached>
              <Grid doubling columns={1} verticalAlign="middle" textAlign="center">
                <Grid.Row>
                  <Grid.Column>
                    <Form>
                      <Form.Group inline style={{margin: 0}}>
                        { error ?
                            <Form.Input focus error required placeholder='New team' name="name" value={name} onChange={(event, { name, value }) => { setName(value) }} />
                          :
                            <Form.Input focus required placeholder='New team' name="name" value={name} onChange={(event, { name, value }) => { setName(value) }} />
                        }
                        <Button content='Save' labelPosition='right' size="tiny" icon='save' secondary onClick={handleCreateTeam} />
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
          switch(sortColumn) {
            case "team-top": return filteredTeams.sort((t1, t2) => t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1).map((team, i) => { return <TeamItem program={program} team={team} loadTeams={loadTeams} key={i} />; });
            case "team-bot": return filteredTeams.sort((t1, t2) => t1.name.toLowerCase() < t2.name.toLowerCase() ? 1 : -1).map((team, i) => { return <TeamItem program={program} team={team} loadTeams={loadTeams} key={i} />; });
            case "participant-top": return filteredTeams.sort((t1, t2) => t1.participants.length > t2.participants.length ? 1 : -1).map((team, i) => { return <TeamItem program={program} team={team} loadTeams={loadTeams} key={i} />; });
            case "participant-bot": return filteredTeams.sort((t1, t2) => t1.participants.length < t2.participants.length ? 1 : -1).map((team, i) => { return <TeamItem program={program} team={team} loadTeams={loadTeams} key={i} />; });
            case "": return filteredTeams.map((team, i) => { return <TeamItem program={program} team={team} loadTeams={loadTeams} key={i} />; });
          }
        })()}

      </Segment>
      </>
    )
  }
}

export default Teams;
