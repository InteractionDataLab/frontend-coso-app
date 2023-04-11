import React from 'react';

const Context = React.createContext({});

const cleanContext = (context) => {
  localStorage.removeItem("Authorization");
  localStorage.removeItem("User");
  localStorage.removeItem("CurrentProgram");
  localStorage.removeItem("CurrentParticipant");
  localStorage.removeItem("Programs");
  if(context !== undefined) {
    context.setUser({});
    context.setCurrentParticipant({});
    context.setCurrentProgram("");
  }
}

const getUserPermission = (context, program_id) => {
  let userPermission = 0;

  if(context.user.email) {
    if(isGod(context)) {
      userPermission = 3;
    } else {
      if(isAdmin(context, program_id)) {
        userPermission = 2;
      } else {
        if(isModerator(context, program_id)) {
          userPermission = 1;
        } else {
          userPermission = 0;
        }
      }
    }
  }

  return userPermission;
}

const isParticipant = (context, program_id) => {
  let is_participant = false;

  if(context.user.email) {
    for(let i=0; i<context.user.roles.length; i++) {
      const role = context.user.roles[i];
      if(role.name === "participant" && role.resource_type === "Program" && role.resource_id === program_id) {
        is_participant = true;
        break;
      }
    }
  }

  return is_participant;
}


const isModerator = (context, program_id) => {
  let is_moderator = false;

  if(context.user.email) {
    for(let i=0; i<context.user.roles.length; i++) {
      const role = context.user.roles[i];
      if(isAdmin(context, program_id) || (role.name === "moderator" && role.resource_type === "Program" && role.resource_id === program_id)) {
        is_moderator = true;
        break;
      }
    }
  }

  return is_moderator;
}

const isAdmin = (context, program_id) => {
  let is_admin = false;

  if(context.user.email) {
    for(let i=0; i<context.user.roles.length; i++) {
      const role = context.user.roles[i];
      if(isGod(context) || (role.name === "admin" && role.resource_type === "Program" && role.resource_id === program_id)) {
        is_admin = true;
        break;
      }
    }
  }

  return is_admin;
}

const isGod = (context) => {
  let is_god = false;

  if(context.user.email) {
    for(let i=0; i<context.user.roles.length; i++) {
      const role = context.user.roles[i];
      if(role.name === "god") {
        is_god = true;
        break;
      }
    }
  }

  return is_god;
}

export { Context, cleanContext, getUserPermission, isParticipant, isModerator, isAdmin, isGod };
