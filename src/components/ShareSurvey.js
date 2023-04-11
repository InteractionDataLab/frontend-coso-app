import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from "react-router-dom";
import {
  Segment,
  Container,
  Header,
  Modal,
  Menu,
  Grid,
  Divider,
  Card,
  Image,
  Icon,
  Form,
  Label,
  Button,
  Message
 } from 'semantic-ui-react';
import jwt_encode from "jwt-encode";
import QRCode from "react-qr-code";

import { Context } from '../utils/Context';
import { Api } from '../Api';

var baseURL = "";
if("REACT_APP_BASE_URL" in process.env) {
  baseURL = process.env.REACT_APP_BASE_URL;
} else {
  baseURL = "http://localhost:3001";
}

var secretJWT = "";
if("REACT_APP_NO_SECRET" in process.env) {
  secretJWT = process.env.REACT_APP_NO_SECRET;
} else {
  secretJWT = "secret-coso-based-jwt-whales";
}

const ShareSurvey = ({ survey }) => {
  const context = useContext(Context);
  const { program } = useParams();
  const [loading, setLoading] = useState(false);

  const [dataParticipants, setDataParticipants] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectParticipant, setSelectParticipant] = useState(null);
  const [elementParticipant, setElementParticipant] = useState("");

  const [dataTeams, setDataTeams] = useState({});
  const [teams, setTeams] = useState([]);
  const [selectTeam, setSelectTeam] = useState(null);
  const [elementTeam, setElementTeam] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    if(!loading) {
      Api.get('programs/' + context.programs[program].id + '/surveys/' + survey.id + "/participants")
      .then((res) => {
        setDataTeams(res.data);

        let newParticipants = [];
        let newDataParticipants = [];
        let newTeams = [{ key: 0, text: "All teams", value: -1 }];
        let i = 0;

        Object.entries(res.data).map(([key, value], j) => {
          newTeams.push({
            key: j+1,
            text: key,
            value: key
          })

          res.data[key].map((participant) => {
            newDataParticipants.push(participant);

            newParticipants.push({
              key: i,
              text: key + ": " + participant.name,
              value: i
            })

            i++;
          })
        })

        setTeams(newTeams);
        setDataParticipants(newDataParticipants);
        setParticipants(newParticipants);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      })
    }
  }, [survey])

  useEffect(() => {
    if(selectParticipant !== null) {
      const link = baseURL + "/survey?part=" + jwt_encode({ "programId": context.programs[program].id, "surveyId": survey.id, "participantId": dataParticipants[selectParticipant].id }, secretJWT);
      const newElement = (
        <>
        <Form.Input
          label='Link'
          action={{
            labelPosition: 'right',
            icon: 'copy',
            content: 'Copy',
            onClick: () => {navigator.clipboard.writeText(link)}
          }}
          fluid
          value={link}
        />
        <div align="center">
          <div align="center" style={{verticalAlign: "middle", display: "table-cell", backgroundColor: "white", height: "18em", maxWidth: "18em", width: "18em" }}>
            <QRCode
              value={link}
              style={{ height: "16em", maxWidth: "16em", width: "16em" }}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>

        <div style={{ marginTop: "1em" }}>
          <Button content="Send by email" icon='send' disabled={dataParticipants[selectParticipant].email === null} onClick={() => sendSurveyParticipant(dataParticipants[selectParticipant].id)} />
        </div>
        </>
      )

      setElementParticipant(newElement);
    }
  }, [selectParticipant])

  useEffect(() => {
    if(selectTeam !== null) {
      let newElement;
      if(selectTeam === -1) {
        newElement = (
          <>
          <Button label="Send the survey to all members of all teams" labelPosition="left" content="Send by email" icon='send' onClick={async() => await sendSurveyAllTeams()} />
          </>
        )
      } else {
        newElement = (
          <>
          <Button label="Send the survey to each member of this team" labelPosition="left" content="Send by email" icon='send' onClick={async() => await sendSurveyTeam(selectTeam)} />
          </>
        )
      }

      setElementTeam(newElement);
    }
  }, [selectTeam])

  const sendSurveyAllTeams = async() => {
    setLoading(true);
    let nbEmailSent = 0;

    await Promise.all(
      teams.map(async(team) => {
        if(team.value !== -1) {
          await Promise.all(
            dataTeams[team.value].map(async(participant) => {
              if(participant.email !== null) {
                await sendSurveyParticipant(participant.id);
                nbEmailSent += 1;
              }
            })
          )
        }
      })
    )

    setMessage(nbEmailSent + " email(s) sent successfully.")
    setLoading(false);
  }

  const sendSurveyParticipant = async(participantId) => {
    const participant = {
      "id": participantId
    }

    await Api.post('programs/' + context.programs[program].id + '/surveys/' + survey.id + "/send", {participant})
    .then((res) => {
      setMessage("Email sent successfully.")
    })
    .catch((error) => {
      console.log(error);
      setMessage("Error while sending email.")
    })
  }

  const sendSurveyTeam = async(teamName) => {
    setLoading(true);

    let nbEmailSent = 0;

    await Promise.all(
      dataTeams[teamName].map(async(participant) => {
        if(participant.email !== null) {
          await sendSurveyParticipant(participant.id);
          nbEmailSent += 1;
        }
      })
    )

    setMessage(nbEmailSent + " email(s) sent successfully.")
    setLoading(false);
  }

  const handleSelectTeam = (value) => {
    setSelectParticipant(null);
    setSelectTeam(value)
    setMessage("");
  }

  const handleSelectParticipant = (value) => {
    setSelectTeam(null);
    setSelectParticipant(value)
    setMessage("");
  }

  return (
    <Segment attached loading={loading}>
      <Form>
        <Form.Dropdown options={teams} label="Select a team" fluid search selection value={selectTeam} onChange={(e, {value}) => handleSelectTeam(value)} />
        <Divider horizontal>OR</Divider>
        <Form.Dropdown options={participants} label="Select a participant" fluid search selection value={selectParticipant} onChange={(e, {value}) => handleSelectParticipant(value)} />
        { selectTeam === null ?
            null
          :
            <Segment inverted>
              {elementTeam}
            </Segment>
        }
        { selectParticipant === null ?
            null
          :
            <Segment inverted>
              {elementParticipant}
            </Segment>
        }
      </Form>

      { message === "" ?
          null
        :
          <Message>{message}</Message>
      }
    </Segment>
  )
}

export default ShareSurvey;
