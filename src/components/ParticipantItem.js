import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
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
  Item,
  List,
  Modal,
  Message,
  Popup
 } from 'semantic-ui-react';

import { Context, isAdmin } from '../utils/Context';
import { Api } from '../Api';
import jenny from '../images/jenny.jpg';

const ParticipantItem = (props) => {
  const context = useContext(Context);
  const [activeItem, setActiveItem] = useState('');
  const [name, setName] = useState('');
  const [partUser, setPartUser] = useState({});
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(props.participant.user_id !== null) {
      Api.get("users/" + props.participant.user_id + "?program_id=" + context.programs[props.program].id)
      .then((res) => {
        setPartUser(res.data);
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }, [props])

  const handleUpdateParticipant = (event) => {
    if(name.length > 3) {
      const participant = {
        "name": name
      }

      Api.put("programs/" + context.programs[props.program].id + "/teams/" + props.team_id + "/participants/" + props.participant.id, {participant})
      .then((res) =>{
        props.loadTeam();
        setError(false);
        setActiveItem("");
        setName("");
        setActiveItem("");
      })
      .catch((error) => {
        setError(true);
      });
    } else {
      setError(true);
    }
  }

  const deleteParticipant = () => {
    Api.delete("programs/" + context.programs[props.program].id + "/teams/" + props.team_id + "/participants/" + props.participant.id)
    .then(() => {
      props.loadTeam();
    });
    setOpenConfirmation(false);
  }

  const modifyParticipant = () => {
    if(activeItem == "rename") {
      setActiveItem("");
    } else {
      setName("");
      setActiveItem("rename");
      setError(false);
    }
  }

  const showConfirmation = () => {
    setOpenConfirmation(openConfirmation != true);
  }

  return (

    <>
    <Modal basic size="small" open={openConfirmation}>
      <Header icon>
        <Icon name='user' />
        Are you sure to delete <span style={{ fontWeight: 'bold' }}>{props.participant.name}</span> ?
      </Header>
      <Modal.Content>
        <p>This action is irreversible.</p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic inverted color="red" onClick={showConfirmation}>
          <Icon name='remove' /> No
        </Button>
        <Button basic inverted color="green" onClick={deleteParticipant}>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
    <Segment attached>
      <Grid columns={5} doubling verticalAlign="middle">
        <Grid.Row>
          <Grid.Column>
            { activeItem === "rename" ?
                <Form>
                  <Form.Group inline style={{ margin: 0 }}>
                    <Form.Input style={{maxWidth: "50%"}} focus error={error} required placeholder='Participant name' name="name" value={name} onChange={(event, { name, value }) => setName(value)} />
                    <Button size="tiny" icon='cancel' secondary onClick={() => setActiveItem('')} />
                    <Button content='Save' labelPosition='right' size="tiny" icon='save' secondary onClick={handleUpdateParticipant} />
                  </Form.Group>
                </Form>
              :
                <Header as="h4" style={{
                  display: 'flex',
                  justifyContent: 'left'}}>
                  <Link className="link-column" to={"/program/" + props.program + "/team/" + props.team_id + "/participant/" + props.participant.id}>{props.participant.name}</Link>
                </Header>
            }
          </Grid.Column>
          <Grid.Column>
            { partUser.email ?
                <>
                  { partUser.invitation_accepted ?
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
            <a href={"mailto:" + partUser.email}>{partUser.email}</a>
          </Grid.Column>
          <Grid.Column>
            <Menu compact style={{boxShadow: "none"}}>
              { isAdmin(context, context.programs[props.program].id) ?
                  <>
                  <Popup className='computer only' content="Rename" inverted position='top center' trigger={
                    <Menu.Item active={activeItem === 'rename'} name='rename' onClick={modifyParticipant}>
                      <Icon name='edit' />
                    </Menu.Item>
                  } />
                  <Popup className='computer only' content="Delete" inverted position='top center' trigger={
                    <Menu.Item active={activeItem === 'delete'} name='delete' onClick={showConfirmation}>
                      <Icon name='trash' />
                    </Menu.Item>
                  } />
                  </>
                :
                  null
              }
            </Menu>
          </Grid.Column>
          <Grid.Column>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    </>
  )
}

export default ParticipantItem;
