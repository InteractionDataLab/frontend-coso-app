import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
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
  Modal,
  Dropdown,
  Popup
 } from 'semantic-ui-react';

import { Context, isAdmin } from '../utils/Context';
import { Api } from '../Api';

const TeamItem = (props) => {
  const context = useContext(Context);
  const [activeItem, setActiveItem] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleUpdateTeam = (event) => {
    if(name.length > 3) {
      const team = {
        "name": name
      }

      Api.put("programs/" + context.programs[props.program].id + "/teams/" + props.team.id, {team})
      .then((res) =>{
        props.loadTeams();
        setError(false);
        setActiveItem("");
        setName("");
      }).catch((error) => {
        setError(true);
      });
    } else {
      setError(true);
    }
  }

  const deleteTeam = () => {
    Api.delete("programs/" + context.programs[props.program].id + "/teams/" + props.team.id)
    .then((res) => {
      props.loadTeams();
    });
    setOpenConfirmation(false);
  }

  const modifyTeam = () => {
    if(activeItem === "rename") {
      setActiveItem("");
    } else {
      setName("");
      setActiveItem("rename");
      setError(false);
    }
  }

  const showConfirmation = () => {
    setOpenConfirmation(openConfirmation !== true);
  }

  return (
    <>
    <Modal basic size="small" open={openConfirmation}>
      <Header icon>
        <Icon name='tag' />
        Are you sure to delete <span style={{ fontWeight: 'bold' }}>{props.team.name}</span> ?
      </Header>
      <Modal.Content>
        <p>This action is irreversible.</p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic inverted color="red" onClick={showConfirmation}>
          <Icon name='remove' /> No
        </Button>
        <Button basic inverted color="green" onClick={deleteTeam}>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
    <Segment attached>
      <Grid columns={4} doubling verticalAlign="middle">
        <Grid.Row>
          <Grid.Column>
            { activeItem === "rename" ?
                <Form>
                  <Form.Group inline style={{margin: 0}}>
                    <Form.Input style={{maxWidth: "50%"}} focus error={error} required placeholder='Team name' name="name" value={name} onChange={(event, { name, value }) => setName(value)} />
                    <Button size="tiny" icon='cancel' secondary onClick={() => {setName(""); setActiveItem('')}} />
                    <Button content='Save' labelPosition='right' size="tiny" icon='save' secondary onClick={handleUpdateTeam} />
                  </Form.Group>
                </Form>
              :
                <Header as="h4" style={{
                  display: 'flex',
                  justifyContent: 'left'}}>
                  <Link className="link-column" to={"/program/" + props.program + "/team/" + props.team.id}>{props.team.name}</Link>
                </Header>
            }
          </Grid.Column>
          <Grid.Column>
            {props.team.participants.length}
          </Grid.Column>
          <Grid.Column>
            <Menu compact style={{boxShadow: "none"}}>
              { isAdmin(context, context.programs[props.program].id) ?
                  <>
                  <Popup content="Rename" className='computer only' inverted position='top center' trigger={
                    <Menu.Item active={activeItem === 'rename'} name='rename' onClick={modifyTeam}>
                      <Icon name='edit' />
                      </Menu.Item>
                  } />
                  <Popup content="Delete" className='computer only' inverted position='top center' trigger={
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
          <Grid.Column />
        </Grid.Row>
      </Grid>
    </Segment>
    </>
  )
}



export default TeamItem;
