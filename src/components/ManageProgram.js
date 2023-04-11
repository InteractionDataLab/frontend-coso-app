import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Menu,
  Segment,
  Header,
  Container,
  Button,
  Modal,
  Icon
} from 'semantic-ui-react';

import { Context, isAdmin } from '../utils/Context';
import ImportData from '../components/ImportData';
import ExportData from '../components/ExportData';
import ManageUsers from '../components/ManageUsers';
import { Api } from '../Api';

const ManageProgram = ({program}) => {
  const context = useContext(Context);
  const history = useNavigate();
  const [activeItem, setActiveItem] = useState("roles");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const deleteProgram = () => {
    Api.delete("/programs/" + context.programs[program].id)
    .then(() => {
      context.setCurrentProgram("");
      context.loadPrograms(context);
      history("/");
    });
  }

  const showConfirmation = () => {
    setOpenConfirmation(openConfirmation != true);
  }

  if(!context.firstLoad && isAdmin(context, context.programs[program].id)) {
    return (
      <Grid stackable>
        <Grid.Column width={4}>
          <Menu fluid vertical={!context.isMobile} tabular>
            <Menu.Item
              style={{fontSize: "0.95em"}}
              name='Administration team'
              active={activeItem === 'roles'}
              onClick={() => setActiveItem("roles")}
            />
            <Menu.Item
              style={{fontSize: "0.95em"}}
              name='Export data'
              active={activeItem === 'export'}
              onClick={() => setActiveItem("export")}
            />
            <Menu.Item
              style={{fontSize: "0.95em"}}
              name='Delete program'
              active={activeItem === 'delete'}
              onClick={() => setActiveItem("delete")}
            />
          </Menu>
        </Grid.Column>

        <Grid.Column stretched width={12}>
          <Segment>
            {(() => {
                switch(activeItem) {
                  case "roles": return <ManageUsers program={program} />
                  case "export": return <ExportData program={program} />
                  case "delete": return (
                    <>
                    <Modal basic size="small" open={openConfirmation} onClose={() => setOpenConfirmation(false)}>
                      <Header icon>
                        <Icon name='sitemap' />
                        Are you sure to delete <span style={{ fontWeight: 'bold' }}>{context.programs[program].name}</span> ?
                      </Header>
                      <Modal.Content>
                        <p>This action is irreversible.</p>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button basic inverted color="red" onClick={showConfirmation}>
                          <Icon name='remove' /> No
                        </Button>
                        <Button basic inverted color="green" onClick={deleteProgram}>
                          <Icon name='checkmark' /> Yes
                        </Button>
                      </Modal.Actions>
                    </Modal>
                    <Segment basic>
                      <Header color="red">Delete program</Header>
                      <Header as="h4">Once you delete the program, there is no going back. Please be certain.</Header>
                      <Button content='Delete the program' color="red" floated="right" onClick={() => setOpenConfirmation(true)} />
                    </Segment>
                    </>
                  )
                }
            })()}
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

export default ManageProgram;
