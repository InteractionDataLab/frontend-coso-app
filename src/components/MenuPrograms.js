import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Segment,
  Menu,
  Container,
  Dropdown,
  Divider,
  Grid
} from 'semantic-ui-react';

import { Context, cleanContext, isParticipant, isModerator, isGod } from '../utils/Context';
import { Api } from '../Api';

const MenuPrograms = () => {
  const context = useContext(Context);
  const location = useLocation();
  const [displayProgram, setdisplayProgram] = useState();
  const [programItems, setProgramItems] = useState("");

  useEffect(() => {
    if(!context.firstLoad) {
      context.loadPrograms(context);
    }
  }, [context.firstLoad]);

  const selectProgram = async(p) => {
    if(isParticipant(context, context.programs[p].id)) {
      await Api.get('programs/' + context.programs[p].id + '/participant')
      .then((res) => {
        context.setCurrentParticipant(res.data);
        localStorage.setItem("CurrentParticipant", JSON.stringify(res.data));
      })
      .catch((error) => {
        console.log(error);
      })
    }

    context.setCurrentProgram(p);
  }

  const MenuProgramItems = () => {
    let menuProgramItems = [];
    if(isGod(context)) {
      menuProgramItems.push(
        <>
          <Dropdown.Item as={Link} to={"/program/create"} key={0}>Create a program</Dropdown.Item>
          <Dropdown.Divider />
        </>
      )
    }

    Object.keys(context.programs).map((p, i) => {
      menuProgramItems.push(
        <Dropdown.Item onClick={() => { selectProgram(p) }} as={Link} to={"/program/" + p + "/dataviz"} key={i+1}>{context.programs[p].name}</Dropdown.Item>
      )
    })

    return menuProgramItems;
  }

  useEffect(() => {
    setProgramItems(
      <Grid.Column width={10}>
        <Dropdown text={context.currentProgram !== "" ? context.programs[context.currentProgram].name : "Select a program"} pointing className='link item'>
          <Dropdown.Menu>
            <MenuProgramItems />
          </Dropdown.Menu>
        </Dropdown>
      </Grid.Column>
    );
  }, [context.programs, context.currentProgram])

  if(!context.firstLoad) {
    return (
      <Segment
      inverted
      textAlign='center'
      style={{ padding: '1em 0em' }}
      vertical>
        <Menu
          inverted
          secondary
          size='large'
          attached='top'
          tabular
        >
          <Container>
            <Grid columns={2} stackable>
              {programItems}
              <Grid.Column width={6}>
                {
                  context.currentProgram !== "" ?
                    <Menu inverted pointing secondary>
                      { isModerator(context, context.programs[context.currentProgram].id) ?
                          <>
                          <Menu.Item active={location.pathname === "/program/" + context.currentProgram + "/dataviz"} as={Link} to={"/program/" + context.currentProgram + "/dataviz"}>Dashboard</Menu.Item>
                          <Menu.Item active={location.pathname === "/program/" + context.currentProgram + "/surveys"} as={Link} to={"/program/" + context.currentProgram + "/surveys"}>Surveys</Menu.Item>
                          <Menu.Item active={location.pathname === "/program/" + context.currentProgram} as={Link} to={"/program/" + context.currentProgram}>Settings</Menu.Item>
                          </>
                        :
                          <>
                          <Menu.Item></Menu.Item>
                          <Menu.Item active={location.pathname === "/program/" + context.currentProgram + "/surveys"} as={Link} to={"/program/" + context.currentProgram + "/surveys"}>Surveys</Menu.Item>
                          </>
                      }
                    </Menu>
                  :
                    null
                }
              </Grid.Column>
            </Grid>
          </Container>
        </Menu>
      </Segment>
    )
  }
}

export default MenuPrograms;
