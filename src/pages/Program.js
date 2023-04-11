import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {
  Segment,
  Container,
  Header,
  Menu,
  Grid,
  Divider
 } from 'semantic-ui-react';

import { Context, isModerator, isAdmin } from '../utils/Context';
import Teams from '../components/Teams';
import Overview from '../components/Overview';
import ManageProgram from '../components/ManageProgram';
import "../index.css";

const Program = () => {
  const context = useContext(Context);
  const { program } = useParams();
  const history = useNavigate();
  const [activeItem, setActiveItem] = useState("overview");
  const [main, setMain] = useState("");

  useEffect(() => {
    if(!context.firstLoad) {
      if(program in context.programs && isModerator(context, context.programs[program].id)) {
        setMain(
          <>
          <Segment basic>
            <Header as="h2">
              Program: {context.programs[program].name} ({context.programs[program].year})
            </Header>
            Navigate and manage your program.
          </Segment>
          <Menu pointing secondary>
            <Menu.Item
              name='Program'
              active={activeItem === 'overview'}
              onClick={() => {setActiveItem("overview")}}
            />
            { isAdmin(context, context.programs[program].id) ?
                <Menu.Item
                  name='Manage'
                  active={activeItem === 'manage'}
                  onClick={() => {setActiveItem("manage")}}
                />
              :
                null
            }
          </Menu>
          {(() => {
            switch(activeItem) {
              case "manage": return <ManageProgram program={program} />
              case "overview": return <Overview program={program} />
            }
          })()}
          </>
        )
      } else {
        history("/");
      }
    }
  }, [context.firstLoad, activeItem, context.currentProgram])

  return (
    <Container fluid className="container-page">
      <Segment basic>
        {main}
      </Segment>
    </Container>
  )
}

export default Program;
