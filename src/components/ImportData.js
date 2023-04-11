import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  Grid,
  Menu,
  Segment,
  Header,
  Table,
  Button,
  Container,
  Icon,
  Accordion,
  List
} from 'semantic-ui-react';
import Papa from "papaparse";

import { Context } from '../utils/Context';
import { Api } from '../Api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ImportData = ({program, refresh}) => {
  const context = useContext(Context);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState(false);
  const [isImported, setIsImported] = useState(false);
  const [showExample, setShowExample] = useState(true);
  const [listTeamsCreated, setListTeamsCreated] = useState([]);
  const [listParticipantsCreated, setListParticipantsCreated] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if(data.length > 0) {
      setShowData(true);
      setShowExample(false);
    }
  }, [data])

  const loadFile = (e) => {
    cancelData();
    const file = e.target.files[0];
    if(file.name && file.name.toLowerCase().includes(".csv")) {
      setLoading(true);
      readFile(file)
      .then((res) => {
        let cleanData = [];
        res.data.map((row, i) => {
          let newRow = { "Team": "", "Participant": "", "Email": "" };

          if("Team" in row) {
            newRow.Team = row.Team;
          }

          if("Participant" in row) {
            newRow.Participant = row.Participant;
          }

          if("Email" in row) {
            newRow.Email = row.Email;
          }

          cleanData.push(newRow);
        })

        setLoading(false);
        setData(cleanData);
      });
    }
  }

  const DataItems = () => {
    let dataItems = [];
    let i = 0;
    while(i < data.length && i < 10) {
      dataItems.push(
        <Table.Row key={i}>
          <Table.Cell>
            { data[i].Team }
          </Table.Cell>
          <Table.Cell>
            { data[i].Participant }
          </Table.Cell>
          <Table.Cell>
            { data[i].Email }
          </Table.Cell>
        </Table.Row>
      )

      i++;
    }

    return dataItems;
  }

  const readFile = (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async ({target}) => {
        const csv = Papa.parse(target.result, {
          header: true,
          skipEmptyLines: true,
          complete: (results: ParseResult) => {
            return resolve(results);
          }
        });
      }

      reader.readAsText(file);
    });
  }

  const validateData = async() => {
    setLoading(true);

    let teams = {};
    for(let i=0; i<data.length; i++) {
      const team_name = data[i].Team;
      const participant_name = data[i].Participant;
      const email = data[i].Email;

      if(!(team_name in teams)) {
        teams[team_name] = [];
      }

      teams[team_name].push([participant_name, email]);
    }

    await importData(teams);

    setIsImported(true);
    setShowData(false);
    setLoading(false);
    refresh();
  }

  const importData = async(teams) => {
    let teams_created = [];
    let participants_created = [];

    await Promise.all(
      Object.keys(teams).map(async(team_name, i) => {
        const team_id = await Api.get("/programs/" + context.programs[program].id + "/teams/exists/" + team_name)
        .then((res) => {
          return res.data.id;
        })
        .catch(async(error) => {
          const team = {
            name: team_name
          }

          return await Api.post("programs/" + context.programs[program].id + "/teams", {team})
          .then((res_creation) => {
            teams_created.push(team_name);
            return res_creation.data.id;
          })
          .catch((error) => {
            return -1;
          })
        })

        if(team_id !== -1) {
          await Promise.all(
            teams[team_name].map(async(infos_participant, j) => {
              const participant = {
                "name": infos_participant[0]
              }

              if(infos_participant[1] !== "") {
                participant.email = infos_participant[1];
              }

              const is_created = await Api.post("programs/" + context.programs[program].id + "/teams/" + team_id + "/participants", {participant})
              .then((res) => {
                return true;
              })
              .catch((error) => {
                return false;
              })

              if(is_created) {
                participants_created.push(infos_participant[0]);
              }
            })
          )
        }
      })
    )

    setListTeamsCreated(teams_created);
    setListParticipantsCreated(participants_created);
  }

  const cancelData = () => {
    setIsImported(false);
    setShowData(false);
    setShowExample(true);
    setData([]);
    setListTeamsCreated([]);
    setListParticipantsCreated([]);
    setActiveIndex(-1);
  }

  const handlePanel = (e, activePanel) => {
    const newIndex = activeIndex === activePanel.index ? -1 : activePanel.index

    setActiveIndex(newIndex);
  }

  const ImportInfo = () => {
    return (
      <Segment>
        <Header>Information: {listTeamsCreated.length} teams and {listParticipantsCreated.length} participants have been added.</Header>
        <List>
          <List.Item>
            <Accordion>
              <Accordion.Title
                active={activeIndex === 0}
                index={0}
                onClick={handlePanel}
              >
                <Icon name='dropdown' />
                 List of teams created
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <List bulleted>
                  { listTeamsCreated.map((team_name, i) => {
                    return <List.Item key={i}>{team_name}</List.Item>
                  }) }
                </List>
              </Accordion.Content>
              <Accordion.Title
                active={activeIndex === 1}
                index={1}
                onClick={handlePanel}
              >
                <Icon name='dropdown' />
                 List of participants created
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 1}>
                <List bulleted>
                  { listParticipantsCreated.map((participant_name, i) => {
                    return <List.Item key={i}>{participant_name}</List.Item>
                  }) }
                </List>
              </Accordion.Content>
            </Accordion>
          </List.Item>
        </List>
      </Segment>
    )
  }

  return (
    <>
    { showExample ?
        <Segment basic>
          <p style={{textAlign: "justify", textJustify: "auto"}}>Create your own teams and participants at once. Please provide a <strong>CSV file</strong> (.csv extension) containing a header with the name of columns being exactly as show below (case sensitive).</p>
          <p style={{textAlign: "justify", textJustify: "auto"}}>Importing new data will concatenate with existing data. If any entry already exists, it will never be taken into account.</p>
          <Container>
            <Table celled fixed selectable>
              <Table.Header>
                <Table.Row disabled>
                  <Table.HeaderCell>Team</Table.HeaderCell>
                  <Table.HeaderCell>Participant</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    Team 1
                  </Table.Cell>
                  <Table.Cell>
                    Alice
                  </Table.Cell>
                  <Table.Cell>
                    alice@wonderland.cn
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Team 1
                  </Table.Cell>
                  <Table.Cell>
                    Bob
                  </Table.Cell>
                  <Table.Cell>
                    bob@bluesea.com
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    Team 2
                  </Table.Cell>
                  <Table.Cell>
                    Sponge
                  </Table.Cell>
                  <Table.Cell>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Container>
        </Segment>
      :
        null
    }
    <Segment loading={loading}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={12} verticalAlign="middle">
            <Header as="h4">Import Data</Header>
          </Grid.Column>
          <Grid.Column width={4} verticalAlign="middle">
            <Button floated="right" content="Choose File" labelPosition="left" icon="file" onClick={() => fileInputRef.current.click()} />
            <input ref={fileInputRef} type="file" hidden onChange={loadFile} />
          </Grid.Column>
        </Grid.Row>
        { showData ?
            <>
            <Grid.Row>
              <Grid.Column verticalAlign="middle">
                <Container fluid>
                  <Table celled fixed selectable>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Team</Table.HeaderCell>
                        <Table.HeaderCell>Participant</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <DataItems />
                    </Table.Body>
                    <Table.Footer>
                      <Table.Row>
                        <Table.HeaderCell colSpan='3' textAlign="center">
                          First 10 rows of your CSV
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Footer>
                  </Table>
                </Container>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={2} />
              <Grid.Column width={3} verticalAlign="middle">
                <Button floated="right" content="Cancel" onClick={cancelData} />
              </Grid.Column>
              <Grid.Column width={6} />
              <Grid.Column width={3} verticalAlign="middle">
                <Button content="Import" primary onClick={validateData} />
              </Grid.Column>
              <Grid.Column width={2} />
            </Grid.Row>
            </>
          :
            null
        }
      </Grid>
      { isImported ?
          <ImportInfo />
        :
          null
      }
    </Segment>
    </>
  );
}

export default ImportData;
