import React, { Component, useEffect, useState, useContext} from 'react';
import { createMedia } from '@artsy/fresnel';
import { useLocation, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
  Visibility,
  Dropdown,
  Popup
} from 'semantic-ui-react';

import { Context, cleanContext, getUserPermission } from '../utils/Context';
import MenuPrograms from './MenuPrograms';
import { Api } from '../Api';

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

function LoginArea({fixed}) {
  return (
    <>
    <Button as={Link} to="/login" inverted={!fixed}>
      Sign in
    </Button>
    </>
  )
}

const UserMenu = ({fixed, context}) => {
  const [userPermission, setUserPermission] = useState(0);

  useEffect(() => {
    if(!context.firstLoad) {
      if(context.currentProgram === "") {
        setUserPermission(0);
      } else {
        setUserPermission(getUserPermission(context, context.programs[context.currentProgram].id));
      }
    }
  }, [context]);

  const IconUser = () => {
    let iconUser;

    switch(userPermission) {
      case 0:
        iconUser = (
          <Icon name="user circle outline" size="large" />
        )
        break;
      case 1:
        iconUser = (
          <Popup content="Logged as Moderator" position='left center' trigger={
            <Icon name="user circle outline" color="blue" size="large" />
          } />
        )
        break;
      case 2:
        iconUser = (
          <Popup content="Logged as Admin" position='left center' trigger={
            <Icon name="user circle outline" color="green" size="large" />
          } />
        )
        break;
      case 3:
        iconUser = (
          <Popup content="Logged as God" position='left center' trigger={
            <Icon name="user circle outline" color="yellow" size="large" />
          } />
        )
        break;
    }

    return iconUser;
  }

  return (
    <>
      <IconUser />
      <Dropdown text={context.user.email} pointing className='link item'>
        <Dropdown.Menu>
          <Dropdown.Header>Options</Dropdown.Header>
          <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as="a" href="mailto:contact@co-so.app">Contact us</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Authentication</Dropdown.Header>
          <Dropdown.Item><Button as={Link} to="/logout">LogOut</Button></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

const UserArea = ({fixed, context}) => {
  return (
    <Menu.Item position='right'>
    {context.user.email ?
      <UserMenu fixed={fixed} context={context} />
      :
      <LoginArea fixed={fixed} />
    }
    </Menu.Item>
  )
}

const MenuDesktop = ({fixed, context}) => {
  const location = useLocation();
  context.setIsMobile(false);

  if(location.pathname === "/survey") {
    return ( null );
  } else {
    return (
      <Container fluid>
        <Segment
          inverted
          textAlign='center'
          style={{ padding: '0.5em 4em', marginBottom: '0.05em' }}
          vertical
        >
          <Menu
            fixed={fixed ? 'top' : null}
            inverted={!fixed}
            pointing={!fixed}
            secondary={!fixed}
            size='huge'
          >
            <Menu.Item active={location.pathname === "/"} as={Link} to="/">Home</Menu.Item>
            <Menu.Item active={location.pathname === "/about"} as={Link} to="/about">About the team</Menu.Item>
            <UserArea fixed={fixed} context={context} />
          </Menu>
        </Segment>
        { context.user.email ? <MenuPrograms /> : null }
      </Container>
    )
  }
}

class DesktopContainer extends Component {
  render() {
    const { children } = this.props;

    return (
      <Media greaterThan='mobile'>
        <MenuDesktop fixed={false} context={this.context} />
        {children}
      </Media>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

const MenuMobile = ({context, children}) => {
  const location = useLocation();
  context.setIsMobile(true);
  const [sidebarOpened, setSidebaropened] = useState(false);

  const handleSidebarHide = () => setSidebaropened(false);
  const handleToggle = () => setSidebaropened(true);

  if(location.pathname === "/survey") {
    return ( <Container>{children}</Container> );
  } else {
    return (
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation='overlay'
          inverted
          onHide={handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item active={location.pathname === "/"} as={Link} to="/">
            Home
          </Menu.Item>
          <Menu.Item active={location.pathname === "/about"} as={Link} to="/about">
            About
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            inverted
            textAlign='center'
            style={{ padding: '1em 0em', marginBottom: '0.05em' }}
            vertical
          >
            <Container>
              <Menu inverted pointing secondary size='huge'>
                <Menu.Item onClick={handleToggle}>
                  <Icon name='sidebar' />
                </Menu.Item>
                <UserArea fixed={false} context={context} />
              </Menu>
            </Container>
            { context.user.email ? <MenuPrograms /> : null }
          </Segment>
          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

class MobileContainer extends Component {
  render() {
    const { children } = this.props;

    return (
      <Media as={Sidebar.Pushable} at='mobile'>
        <MenuMobile context={this.context} children={children} />
      </Media>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
  /* Heads up!
   * For large applications it may not be best option to put all page into these containers at
   * they will be rendered twice for SSR.
   */

   <MediaContextProvider>
     <DesktopContainer>{children}</DesktopContainer>
     <MobileContainer>{children}</MobileContainer>
   </MediaContextProvider>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

DesktopContainer.contextType = Context;
MobileContainer.contextType = Context;

export default ResponsiveContainer;
