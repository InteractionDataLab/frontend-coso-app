import React, { useEffect, useState, useContext } from 'react';
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
  List,
  Form,
  Message
} from 'semantic-ui-react';

import { Context } from '../utils/Context';
import { Api } from '../Api';

const ManageUsers = ({program}) => {
  const context = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [users, setUsers] = useState({});
  const [email, setEmail] = useState('');
  const [valueRole, setValueRole] = useState(0);
  const [valueRoleNewUser, setValueRoleNewUser] = useState(1);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      id: 0,
      text: "All",
      value: 0
    },
    {
      id: 1,
      text: "Moderators",
      value: 1
    },
    {
      id: 2,
      text: "Admins",
      value: 2
    }
  ];

  const rolesNewUser = [
    {
      id: 1,
      text: "Moderator (read-only)",
      value: 1
    },
    {
      id: 2,
      text: "Admin (full control)",
      value: 2
    }
  ];

  useEffect(() => {
    if(refresh) {
      setLoading(true);

      Api.get("/programs/" + context.programs[program].id + "/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      })

      setRefresh(false);
    }
  }, [refresh])

  useEffect(() => {
    if(error === '') {
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, [error])

  const TableContent = () => {
    let tableContent = [];
    let i = 0;

    if(Object.keys(users).length > 0) {
      if(valueRole === 0) {
        users.god.map((user) => {
          tableContent.push(
            <Table.Row key={i}>
              <Table.Cell collapsing>
                <Icon name="user circle outline" color="yellow" /> {user.email}
              </Table.Cell>
              <Table.Cell collapsing>God</Table.Cell>
              <Table.Cell collapsing textAlign='right'>
              </Table.Cell>
            </Table.Row>
          );
          i++;
        })
      }

      if(valueRole === 0 || valueRole === 1) {
        users.moderator.map((user) => {
          tableContent.push(
            <Table.Row key={i}>
              <Table.Cell collapsing>
                <Icon name="user circle outline" color="blue" /> {user.email}
              </Table.Cell>
              <Table.Cell collapsing>Moderator</Table.Cell>
              <Table.Cell collapsing textAlign='right'>
                <Form.Button size="tiny" color="red" onClick={() => deleteUser(user.id, 1)}>Delete</Form.Button>
              </Table.Cell>
            </Table.Row>
          );
          i++;
        })
      }

      if(valueRole === 0 || valueRole === 2) {
        users.admin.map((user) => {
          tableContent.push(
            <Table.Row key={i}>
              <Table.Cell collapsing>
                <Icon name="user circle outline" color="green" /> {user.email}
              </Table.Cell>
              <Table.Cell collapsing>Admin</Table.Cell>
              <Table.Cell collapsing textAlign='right'>
                <Form.Button size="tiny" color="red" onClick={() => deleteUser(user.id, 2)}>Delete</Form.Button>
              </Table.Cell>
            </Table.Row>
          );
          i++;
        })
      }
    }

    return tableContent;
  }

  const sendInvitation = async() => {
    setLoading(true);

    const user = {
      email: email
    };

    await Api.post("invitation?program_id=" + context.programs[program].id, {user})
    .then(async(res) => {
      const newUser = res.data;

      let permission = {
        user_id: newUser.id,
        program_id: context.programs[program].id
      }

      if(valueRoleNewUser === 1) {
        permission.permission = "moderator";
      } else {
        permission.permission = "admin";
      }

      await Api.post("/permissions", {permission})

      setShowError(false);
      setError('');
    })
    .catch((error) => {
      setError(error.response.data.error);
    })

    setRefresh(true);
  }

  const deleteUser = async(userId, valueRole) => {
    setLoading(true);

    let permission = {
      user_id: userId,
      program_id: context.programs[program].id
    }

    if(valueRole === 1) {
      permission.permission = "moderator";
    } else {
      permission.permission = "admin";
    }

    await Api.post("/permissions/revoke", {permission})
    .then((res) => {
      setRefresh(true);
    })
  }

  return (
    <Segment basic loading={loading}>
      <Form error={showError}>
        <Segment>
          <Grid columns='equal' stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                <Form.Input focus required placeholder='Enter email' value={email} onChange={(e, {value}) => setEmail(value)} />
              </Grid.Column>
              <Grid.Column>
                <Form.Dropdown fluid selection options={rolesNewUser} onChange={(e, {value}) => setValueRoleNewUser(value)} value={valueRoleNewUser} />
              </Grid.Column>
              <Grid.Column>
                <Button content='Invite' labelPosition='right' size="tiny" icon='send' secondary onClick={async() => await sendInvitation()} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Message
                   error
                   header='Error'
                   content={error}
                 />
               </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <p>Moderators have read-only access and can only view system content, while administrators can edit and have full control.</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment basic>
          <Form.Dropdown label='Type of users' fluid selection options={roles} onChange={(e, {value}) => setValueRole(value)} value={valueRole} />
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan='3'>Users of the program</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <TableContent />
            </Table.Body>
          </Table>
        </Segment>
      </Form>
    </Segment>
  )
}

export default ManageUsers;
