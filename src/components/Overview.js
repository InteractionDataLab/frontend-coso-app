import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from "react-router-dom";
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
  Divider,
  Popup,
  Dropdown,
  Checkbox,
  Item,
  List,
  Modal,
  Table,
  Message
 } from 'semantic-ui-react';

import { Context, isModerator, isAdmin } from '../utils/Context';
import { Api } from '../Api';
import ImportData from '../components/ImportData';
import "../index.css";
import jenny from '../images/jenny.jpg';

const Overview = ({program}) => {
  const context = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState({});
  const [teams, setTeams] = useState({});
  const [listTeams, setListTeams] = useState([]);
  const [rowsId, setRowsId] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [sortColumn, setSortColumn] = useState('');
  const [elementRows, setElementRows] = useState('');
  const [rowData, setRowData] = useState([]);

  const [selectRows, setSelectRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState([]);

  const [openInvitation, setOpenInvitation] = useState(false);
  const [openConfirmInvitation, setOpenConfirmInvitation] = useState(false);

  const [openImportData, setOpenImportData] = useState(false);

  const [hoverRowTeam, setHoverRowTeam] = useState(-1);
  const [modifyTeam, setModifyTeam] = useState(-1);

  const [hoverRowParticipant, setHoverRowParticipant] = useState(-1);
  const [modifyParticipant, setModifyParticipant] = useState(-1);

  const [hoverRowEmail, setHoverRowEmail] = useState(-1);
  const [modifyEmail, setModifyEmail] = useState(-1);

  const [deleteRowId, setDeleteRowId] = useState(-1);
  const [openDeleteParticipant, setOpenDeleteParticipant] = useState(false);

  const [openAddParticipants, setOpenAddParticipants] = useState(false);
  const [listEntry, setListEntry] = useState([]);
  const [newTeam, setNewTeam] = useState('');
  const [newParticipant, setNewParticipant] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    if(!context.firstLoad) {
      loadTeams();
    }
  }, [context.firstLoad, program]);

  useEffect(() => {
    let newFilteredRows = [...rowsId];

    switch(sortColumn) {
      case "team-top": newFilteredRows.sort((t1, t2) => participants[t1].team_name.toLowerCase() > participants[t2].team_name.toLowerCase() ? 1 : -1); break;
      case "team-bot": newFilteredRows.sort((t1, t2) => participants[t1].team_name.toLowerCase() < participants[t2].team_name.toLowerCase() ? 1 : -1); break;
      case "participant-top": newFilteredRows.sort((t1, t2) => participants[t1].participant_name.toLowerCase() > participants[t2].participant_name.toLowerCase() ? 1 : -1); break;
      case "participant-bot": newFilteredRows.sort((t1, t2) => participants[t1].participant_name.toLowerCase() < participants[t2].participant_name.toLowerCase() ? 1 : -1); break;
      case "registered-top": newFilteredRows.sort((t1, t2) => (participants[t1].is_registered && participants[t1].has_accepted) > (participants[t2].is_registered && participants[t2].has_accepted) ? 1 : -1); break;
      case "registered-bot": newFilteredRows.sort((t1, t2) => (participants[t1].is_registered && participants[t1].has_accepted) < (participants[t2].is_registered && participants[t2].has_accepted) ? 1 : -1); break;
      case "email-top": newFilteredRows.sort((t1, t2) => participants[t1].email.toLowerCase() > participants[t2].email.toLowerCase() ? 1 : -1); break;
      case "email-bot": newFilteredRows.sort((t1, t2) => participants[t1].email.toLowerCase() < participants[t2].email.toLowerCase() ? 1 : -1); break;
    }

    setFilteredRows(newFilteredRows);

  }, [sortColumn, rowsId])

  useEffect(() => {
    let newRowData = [];

    filteredRows.map((id, i) => {
      newRowData.push({
        team: participants[id].team_name,
        participant: participants[id].participant_name,
        email: participants[id].email
      });
    })

    setRowData(newRowData);
  }, [filteredRows])

  const refresh = () => {
    setSelectRows([]);
    setSelectAll(false);
    setModifyTeam(-1);
    setModifyParticipant(-1);
    setModifyEmail(-1);
    setDeleteRowId(-1);
    setOpenAddParticipants(false);
    setOpenDeleteParticipant(false);
    setOpenConfirmInvitation(false);
    setOpenInvitation(false);

    setTimeout(async() => {
      setSortColumn("");
      await loadTeams();
    }, 500);
  }

  const handleRowData = (index, type, value) => {
    let newRowData = [...rowData];
    newRowData[index][type] = value;
    setRowData(newRowData);
  }

  const saveRowData = async(index) => {
    setLoading(true);

    let update_team_id = -1;
    if(rowData[index].team in teams) {
      update_team_id = teams[rowData[index].team];
    } else {
      update_team_id = await createTeam(rowData[index].team);
    }

    if(update_team_id !== -1) {
      const is_updated = await updateParticipant(filteredRows[index], rowData[index].participant, participants[filteredRows[index]].team_id, update_team_id, rowData[index].email);
    }

    refresh();
  }

  const updateParticipant = async(participant_id, participant_name, team_id, update_team_id, email) => {
    const participant = {
      "name": participant_name,
      "team_id": update_team_id
    }

    if(email !== "") {
      participant.email = email;
    }

    const is_updated = await Api.put("programs/" + context.programs[program].id + "/teams/" + team_id + "/participants/" + participant_id, {participant})
    .then((res) => {
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    })

    return is_updated;
  }

  const createParticipant = async(team_id, participant_name, participant_email) => {
    const participant = {
      "name": participant_name
    }

    if(participant_email !== "") {
      participant.email = participant_email;
    }

    const is_created = await Api.post("programs/" + context.programs[program].id + "/teams/" + team_id + "/participants", {participant})
    .then((res) => {
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    })

    return is_created;
  }

  const deleteParticipant = async(team_id, participant_id, user_id) => {
    const is_deleted = await Api.delete("programs/" + context.programs[program].id + "/teams/" + team_id + "/participants/" + participant_id)
    .then(async(res) => {
      if(user_id !== null) {
        let permission = {
          user_id: user_id,
          program_id: context.programs[program].id,
          permission: "participant"
        }

        await Api.post("/permissions/revoke", {permission})
        .catch((error) => {
          console.log(error);
        })
      }

      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    })

    return is_deleted;
  }

  const createTeam = async(team_name) => {
    const team = {
      "name": team_name
    }

    const new_team_id = await Api.post("programs/" + context.programs[program].id + "/teams", {team})
    .then((res) => {
      return res.data.id;
    })
    .catch((error) => {
      console.log(error);
      return -1;
    })

    return new_team_id;
  }

  const deleteTeam = async(team_id) => {
    const is_deleted = await Api.delete("programs/" + context.programs[program].id + "/teams/" + team_id)
    .then((res) => {
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    })

    return is_deleted;
  }

  useEffect(() => {
    let newElementRows = [];

    filteredRows.map((id, i) => {
      newElementRows.push(
        <div key={i}>
        <Segment attached>
          <Grid doubling columns={6} verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                <Header as="h4" onMouseEnter={() => setHoverRowTeam(i)} onMouseLeave={() => setHoverRowTeam(-1)}>
                  <Grid verticalAlign="middle">
                  { modifyTeam === i ?
                      <>
                      <Grid.Column width={10}>
                        <Input fluid value={rowData[i].team} onChange={(e, {value}) => handleRowData(i, "team", value)} />
                      </Grid.Column>
                      <Grid.Column width={2}>
                        <Icon onClick={() => saveRowData(i)} name="save" />
                      </Grid.Column>
                      <Grid.Column width={2}>
                        <Icon onClick={() => setModifyTeam(-1)} name="close" />
                      </Grid.Column>
                      </>
                    :
                      <>
                      <Grid.Column width={12}>
                        {participants[id].team_name}
                      </Grid.Column>
                      <Grid.Column width={2}>
                        {hoverRowTeam === i ? <Icon onClick={() => setModifyTeam(i)} name="pencil alternate" /> : null }
                      </Grid.Column>
                      </>
                    }
                  </Grid>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as="h4" onMouseEnter={() => setHoverRowParticipant(i)} onMouseLeave={() => setHoverRowParticipant(-1)}>
                  <Grid verticalAlign="middle">
                  { modifyParticipant === i ?
                      <>
                      <Grid.Column width={10}>
                        <Input fluid value={rowData[i].participant} onChange={(e, {value}) => handleRowData(i, "participant", value)} />
                      </Grid.Column>
                      <Grid.Column width={2}>
                        <Icon onClick={() => saveRowData(i)} name="save" />
                      </Grid.Column>
                      <Grid.Column width={2}>
                        <Icon onClick={() => setModifyParticipant(-1)} name="close" />
                      </Grid.Column>
                      </>
                    :
                      <>
                      <Grid.Column width={10}>
                        {participants[id].participant_name}
                      </Grid.Column>
                      <Grid.Column width={2}>
                        {hoverRowParticipant === i ? <Icon onClick={() => setModifyParticipant(i)} name="pencil alternate" /> : null }
                      </Grid.Column>
                      <Grid.Column width={2}>
                        {hoverRowParticipant === i ? <Icon onClick={() => setDeleteRowId(i)} name="trash" /> : null }
                      </Grid.Column>
                      </>
                    }
                  </Grid>
                </Header>
              </Grid.Column>
              <Grid.Column style={{wordBreak: "break-all"}}>
                <p as="h4" onMouseEnter={() => setHoverRowEmail(i)} onMouseLeave={() => setHoverRowEmail(-1)}>
                  <Grid verticalAlign="middle">
                  { modifyEmail === i ?
                      <>
                      <Grid.Column width={10}>
                        <Input fluid value={rowData[i].email} onChange={(e, {value}) => handleRowData(i, "email", value)} />
                      </Grid.Column>
                      <Grid.Column width={2}>
                        <Icon onClick={() => saveRowData(i)} name="save" />
                      </Grid.Column>
                      <Grid.Column width={2}>
                        <Icon onClick={() => setModifyEmail(-1)} name="close" />
                      </Grid.Column>
                      </>
                    :
                      <>
                      <Grid.Column width={12}>
                        { participants[id].email ?
                            <a href={"mailto:" + participants[id].email}>{participants[id].email}</a>
                          :
                            null
                        }
                      </Grid.Column>
                      <Grid.Column width={2}>
                        {hoverRowEmail === i ? <Icon onClick={() => setModifyEmail(i)} name="pencil alternate" /> : null }
                      </Grid.Column>
                      </>
                    }
                  </Grid>
                </p>
              </Grid.Column>
              <Grid.Column>
                { participants[id].is_registered ?
                    <>
                    { participants[id].has_accepted ?
                        <Popup className='computer only' content="Invitation accepted" inverted position='top center' trigger={
                          <Icon name="user" size="large"/>
                        } />
                      :
                        <Popup className='computer only' content="Invitation pending" inverted position='top center' trigger={
                          <Icon name="hourglass start" size="large"/>
                        } />
                    }
                    </>
                  :
                    <Popup className='computer only' content="User not registered" inverted position='top center' trigger={
                      <Icon name="user outline" size="large"/>
                    } />
                }
              </Grid.Column>
              <Grid.Column>
                <Checkbox checked={selectRows.includes(id)} value={id} onChange={(e, {value, checked}) => handleSelect(value, checked)} />
              </Grid.Column>
              <Grid.Column textAlign="right">
                <Item name='inspect' onClick={() => handleToggle(i)}>
                  <Icon name={showUserInfo.includes(i) ? 'chevron up' : 'chevron down'} />
                </Item>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        { showUserInfo.includes(i) ?
            <Segment attached>
              <Grid>
                <Grid.Column>
                  <Item.Group>
                    <Item>
                      <Item.Image size='tiny' src={jenny} />
                      <Item.Content>
                        <Item.Header>Details of {participants[id].participant_name}</Item.Header>
                        <Item.Meta></Item.Meta>
                        <Item.Description>
                          <List bulleted>
                            { participants[id].user_email ?
                                  <>
                                  <List.Item>
                                    Created at: {participants[id].created_at.slice(0, 10)}
                                  </List.Item>
                                  <List.Item>
                                  { participants[id].last_sign_in_at ?
                                      <p>Last connexion: {participants[id].last_sign_in_at.slice(0, 10)}</p>
                                    :
                                      <p>Last connexion: never</p>
                                  }
                                  </List.Item>
                                  </>
                                :
                                  <List.Item>
                                    <p>Not registered on CoSo</p>
                                  </List.Item>
                            }
                          </List>
                        </Item.Description>
                        <Item.Extra>

                        </Item.Extra>
                      </Item.Content>
                    </Item>
                  </Item.Group>
                </Grid.Column>
              </Grid>
            </Segment>
          :
            null
        }
        </div>
      )
    })

    setElementRows(newElementRows);
  }, [rowData, selectRows, showUserInfo, hoverRowTeam, hoverRowParticipant, hoverRowEmail, modifyTeam, modifyParticipant, modifyEmail])

  const loadTeams = async() => {
    setLoading(true);

    await Api.get('programs/' + context.programs[program].id + '/teams')
    .then(async(res) => {
      let newRowsId = [];
      let newTeams = {};
      let newParticipants = {};

      for(let i=0; i<res.data.length; i++) {
        const team = res.data[i];

        if(team.participants.length === 0) {
          await deleteTeam(team.id);
        } else {
          newTeams[team.name] = team.id;

          for(let y=0; y<team.participants.length; y++) {
            const participant = team.participants[y];

            let date_invitation_accepted = null;
            let date_invitation_created = null;
            let data
            let user_id = null;
            let user_email = "";
            let created_at = "";
            let last_sign_in_at = "";

            if(participant.user_id) {
              [date_invitation_accepted, date_invitation_created, user_id, user_email, created_at, last_sign_in_at] = await Api.get("users/" + participant.user_id + "?program_id=" + context.programs[program].id)
              .then((res) => {
                return [res.data.invitation_accepted_at, res.data.invitation_created_at, res.data.id, res.data.email, res.data.created_at, res.data.last_sign_in_at];
              })
            }

            newParticipants[participant.id] = {
              team_id: team.id,
              team_name: team.name,
              email: participant.email === null ? "" : participant.email,
              participant_name: participant.name,
              is_registered: participant.user_id ? true : false,
              user_id: user_id,
              user_email: user_email,
              invitation_sent: date_invitation_created === null ? false : true,
              has_accepted: date_invitation_accepted === null ? false : true,
              created_at: created_at,
              last_sign_in_at: last_sign_in_at
            }
            newRowsId.push(participant.id);
          }
        }
      }

      setTeams(newTeams);
      setParticipants(newParticipants);
      setRowsId(newRowsId);

      setSortColumn("team-top");
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

  const search = (value) => {
    const result = rowsId.filter(id => {
      if(participants[id].team_name.toLowerCase().includes(value.toLowerCase()) ||
          participants[id].participant_name.toLowerCase().includes(value.toLowerCase())) {
        return true;
      } else {
        return false
      }
    });

    setSelectAll(false);
    setSelectRows([]);
    setFilteredRows(result);
  };

  const handleToggle = (index) => {
    if(showUserInfo.includes(index)) {
      let newShowUserInfo = [...showUserInfo];
      newShowUserInfo.splice(newShowUserInfo.indexOf(index), 1);
      setShowUserInfo(newShowUserInfo);
    } else {
      setShowUserInfo(old => [...old, index]);
    }
  }

  const handleSelect = (value, checked) => {
    if(!checked) {
      let newSelectRows = [...selectRows];
      newSelectRows.splice(newSelectRows.indexOf(value), 1);
      setSelectRows(newSelectRows);
    } else {
      setSelectRows(old => [...old, value]);
    }
  }

  const handleSelectAll = () => {
    if(selectAll) {
      setSelectRows([]);
      setSelectAll(false);
    } else {
      let newSelectRows = [];
      filteredRows.map((id, i) => {
        newSelectRows.push(id);
      });
      setSelectRows(newSelectRows);
      setSelectAll(true);
    }
  }

  const sendInvitations = async() => {
    setLoading(true);

    await Promise.all(
      selectRows.map(async(id, i) => {
        const email = participants[id].email;
        if(email !== "") {
          if(participants[id].user_id !== null && email !== participants[id].user_email) {
            const user = {
              email: email
            }

            await Api.put("users/" + participants[id].user_id + "?program_id=" + context.programs[program].id, {user})
            .catch((error) => {
              console.log(error);
            })
          }

          const user = {
            "email": email,
            "participant_id": id
          }

          await Api.post("invitation?program_id=" + context.programs[program].id, {user})
          .then(async(res) => {
            let permission = {
              user_id: res.data.id,
              program_id: context.programs[program].id,
              permission: "participant"
            }

            await Api.post("/permissions", {permission})
            .then(async() => {

              const user = {
                id: res.data.id
              }

              await Api.post("programs/" + context.programs[program].id + "/teams/" + participants[id].team_id + "/participants/" + id + "/link", {user})
              .catch((error) => {
                console.log(error);
              })
            })
            .catch((error) => {
              console.log(error);
            })
          })
          .catch((error) => {
            console.log(error);
          });
        }
    }))

    refresh();
  }

  const handleDeleteRow = async() => {
    setLoading(true);

    const is_deleted = deleteParticipant(participants[filteredRows[deleteRowId]].team_id, filteredRows[deleteRowId], participants[filteredRows[deleteRowId]].user_id);

    refresh();
  }

  const handleOpenAddParticipants = () => {
    let newListTeams = [];
    Object.keys(teams).map((team_name, i) => {
      newListTeams.push({
        key: i,
        text: team_name,
        value: team_name
      })
    })

    setListTeams(newListTeams);

    setListEntry([]);
    setNewTeam("");
    setNewParticipant("");
    setNewEmail("");
    setOpenAddParticipants(true);
  }

  const addEntry = () => {
    if(newTeam !== "" && newParticipant !== "") {
      let newListEntry = [...listEntry];
      newListEntry.push({ "team": newTeam, "participant": newParticipant, "email": newEmail });
      setListEntry(newListEntry);
      setNewTeam("");
      setNewParticipant("");
      setNewEmail("");
    }
  }

  const modifyEntry = (index, type, value) => {
    let newListEntry = [...listEntry];
    newListEntry[index][type] = value;
    setListEntry(newListEntry);
  }

  const removeEntry = (index) => {
    let newListEntry = [...listEntry];
    newListEntry.splice(index, 1);
    setListEntry(newListEntry);
  }

  const saveListEntry = async() => {
    setLoading(true);

    await Promise.all(
      listEntry.map(async(entry, i) => {
        const team_id = await Api.get("/programs/" + context.programs[program].id + "/teams/exists/" + entry["team"])
        .then((res) => {
          return res.data.id;
        })
        .catch(async(error) => {
          return await createTeam(entry["team"]);
        })

        if(team_id !== -1) {
          await createParticipant(team_id, entry["participant"], entry["email"]);
        }
      })
    )

    refresh();
  }

  const handleDeleteParticipant = async() => {
    setLoading(true);

    await Promise.all(
      selectRows.map(async(id, i) => {
        await deleteParticipant(participants[id].team_id, id, participants[id].user_id);
      })
    )

    refresh();
  }

  if(!context.firstLoad && isModerator(context, context.programs[program].id)) {
    return (
      <>
      <Modal basic size="small" open={openDeleteParticipant}>
        <Header icon>
          <Icon name='remove user' />
            <span>Are you sure to delete <strong>{selectRows.length}</strong> participant(s) ?</span>
        </Header>
        <Modal.Content>
          This action is irreversible.
        </Modal.Content>
        <Modal.Actions>
          <Button basic inverted color="red" onClick={() => setOpenDeleteParticipant(false)}>
            <Icon name='remove' /> No
          </Button>
          <Button basic inverted color="green" onClick={() => handleDeleteParticipant()}>
            <Icon name='checkmark' /> Yes
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal basic size="small" open={deleteRowId !== -1}>
        <Header icon>
          <Icon name='remove user' />
          { deleteRowId === -1 ?
              null
            :
              <span>Are you sure to delete <strong>{participants[filteredRows[deleteRowId]].participant_name}</strong> ?</span>
          }
        </Header>
        <Modal.Content>
          This action is irreversible.
        </Modal.Content>
        <Modal.Actions>
          <Button basic inverted color="red" onClick={() => setDeleteRowId(-1)}>
            <Icon name='remove' /> No
          </Button>
          <Button basic inverted color="green" onClick={() => handleDeleteRow()}>
            <Icon name='checkmark' /> Yes
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal basic size="small" open={openConfirmInvitation}>
        <Header icon>
          <Icon name='clipboard list' />
          Are you sure to send invitations ?
        </Header>

        <Modal.Actions>
          <Button basic inverted color="red" onClick={() => setOpenConfirmInvitation(false)}>
            <Icon name='remove' /> No
          </Button>
          <Button basic inverted color="green" onClick={async() => await sendInvitations()}>
            <Icon name='checkmark' /> Yes
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal size="large" open={openAddParticipants} onClose={() => setOpenAddParticipants(false)}>
        <Header icon>
          <Icon name='user plus' />
          Add participants
        </Header>
        <Modal.Content scrolling>
          <Segment basic loading={loading}>
            <Segment>
              <Form>
                <Form.Dropdown label="Team" fluid allowAdditions={true} onAddItem={(e, { value }) => setListTeams(old => [...old, { key: listTeams.length, text: value, value: value }])} selection search options={listTeams} onChange={(e, {name, value}) => setNewTeam(value)} value={newTeam} />
                <Form.Input label="Name" value={newParticipant} fluid onChange={(e, {name, value}) => setNewParticipant(value)} />
                <Form.Input label="Email" value={newEmail} fluid onChange={(e, {name, value}) => setNewEmail(value)} />
                <Form.Button icon color="green" onClick={() => addEntry()}>
                  Add
                </Form.Button>
              </Form>
            </Segment>
            <Segment basic>
              <Label>List of new participants</Label>
              <Table celled fixed>
                <Table.Header>
                  <Table.Row disabled>
                    <Table.HeaderCell>Team</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell width={1}></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  { listEntry.map((entry, i) => {
                      return (
                        <Table.Row key={i}>
                          <Table.Cell>
                            <Input value={listEntry[i]["team"]} fluid icon="tag" onChange={(e, {name, value}) => modifyEntry(i, "team", value)} />
                          </Table.Cell>
                          <Table.Cell>
                            <Input value={listEntry[i]["participant"]} fluid icon="user" onChange={(e, {name, value}) => modifyEntry(i, "participant", value)} />
                          </Table.Cell>
                          <Table.Cell>
                            <Input value={listEntry[i]["email"]} fluid icon="mail" onChange={(e, {name, value}) => modifyEntry(i, "email", value)} />
                          </Table.Cell>
                          <Table.Cell textAlign="center">
                            <Button icon color="red" onClick={() => removeEntry(i)}>
                              <Icon name='trash' />
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      )
                    })
                  }
                </Table.Body>
              </Table>
            </Segment>
          </Segment>
        </Modal.Content>

        <Modal.Actions>
          <Button basic color="red" onClick={() => setOpenAddParticipants(false)}>
            <Icon name='remove' /> Close
          </Button>
          <Button basic color="green" onClick={() => saveListEntry()}>
            <Icon name='save' /> Save
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal size="large" open={openInvitation} onClose={() => setOpenInvitation(false)}>
        <Header icon>
          <Icon name='send' />
          Invite participants to this program
        </Header>
        <Modal.Content scrolling>
          <Segment basic loading={loading}>
            <Table celled fixed>
              <Table.Header>
                <Table.Row disabled>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Registered</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { selectRows.map((id, i) => {
                    return (
                      <Table.Row key={i}>
                        <Table.Cell>
                          {participants[id].participant_name}
                        </Table.Cell>
                        <Table.Cell>
                          {participants[id].email}
                        </Table.Cell>
                        <Table.Cell width={2}>
                          { participants[id].is_registered ?
                              "Yes"
                            :
                              "No"
                          }

                        </Table.Cell>
                      </Table.Row>
                    )
                  })
                }
              </Table.Body>
            </Table>
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" onClick={() => setOpenInvitation(false)}>
            <Icon name='remove' /> Close
          </Button>
          <Button basic color="green" onClick={() => setOpenConfirmInvitation(true)}>
            <Icon name='checkmark' /> Send
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal size="large" open={openImportData} onClose={() => setOpenImportData(false)}>
        <Header icon>
          <Icon name='file' />
          Import Data from CSV
        </Header>
        <Modal.Content>
          <ImportData program={program} refresh={refresh} />
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" onClick={() => setOpenImportData(false)}>
            <Icon name='remove' /> Close
          </Button>
        </Modal.Actions>
      </Modal>

      <Segment>
        <Grid stackable columns={7} width="equals">
          <Grid.Row>
            <Grid.Column verticalAlign="middle">
              <Label.Group>
                <Icon name='tag' /> {Object.keys(teams).length} teams
              </Label.Group>
            </Grid.Column>
            <Grid.Column verticalAlign="middle">
              <Label.Group>
                <Icon name='users' /> {rowsId.length} participants
              </Label.Group>
            </Grid.Column>
            <Grid.Column verticalAlign="middle">
              <Button basic color='black' content="Add participant" icon='plus' onClick={() => handleOpenAddParticipants()} />
            </Grid.Column>
            <Grid.Column verticalAlign="middle">
              <Button basic color='black' content="Delete participant" icon='trash' disabled={selectRows.length === 0} onClick={() => setOpenDeleteParticipant(true)} />
            </Grid.Column>
            <Grid.Column verticalAlign="middle">
              <Button basic color='black' content="Invite to program" icon='send' disabled={selectRows.length === 0} onClick={() => setOpenInvitation(true)} />
            </Grid.Column>
            <Grid.Column verticalAlign="middle">
              <Button basic color='black' content="Import" icon='file' onClick={() => setOpenImportData(true)} />
            </Grid.Column>
            <Grid.Column textAlign="right" verticalAlign="middle">
              <Input icon='search' fluid onChange={(e, {value}) => {search(value)}} placeholder='Search...' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Segment basic loading={loading}>
        <Header block attached="top">
          <Grid doubling stackable columns={6} verticalAlign="middle">
            <Grid.Row>
              <Grid.Column verticalAlign="middle">
                <Header as="h3"><a className="link-column" onClick={() => {selectSortColumn("team")}}>Team</a></Header>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Header as="h3"><a className="link-column" onClick={() => {selectSortColumn("participant")}}>Participant</a></Header>
              </Grid.Column>
              <Grid.Column>
                <Header as="h3"><a className="link-column" onClick={() => {selectSortColumn("email")}}>Email</a></Header>
              </Grid.Column>
              <Grid.Column>
                <Header as="h3"><a className="link-column" onClick={() => {selectSortColumn("registered")}}>Status</a></Header>
              </Grid.Column>
              <Grid.Column>
                <Checkbox label="Select all" checked={selectAll} onChange={() => handleSelectAll()} />
              </Grid.Column>
              <Grid.Column>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Header>
        {elementRows}
      </Segment>
      </>
    )
  }
}

export default Overview;
