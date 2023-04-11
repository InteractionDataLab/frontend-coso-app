import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
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
  Tab,
  Divider
 } from 'semantic-ui-react';

import { Context, isModerator } from '../utils/Context';
import { Api } from '../Api';
import "../index.css";
import NetworkInteractions from "../components/dataviz/examples/NetworkInteractions";
import ProgramOverview from "../components/dataviz/examples/ProgramOverview";
import SurveyStats from "../components/dataviz/examples/SurveyStats";
import CustomDataviz from "../components/dataviz/examples/CustomDataviz";

const colors = ["#ea5545", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6", "#e60049", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"];

const Dataviz = () => {
  const context = useContext(Context);
  const { program } = useParams();
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [teams, setTeams] = useState([]);
  const [surveyStats, setSurveyStats] = useState({});
  const [programName, setProgramName] = useState('');
  const [mapPartTeam, setMapPartTeam] = useState({});
  const [main, setMain] = useState("");
  const [panes, setPanes] = useState([]);

  useEffect(() => {
    if(!context.firstLoad) {
      if(program in context.programs) {
        if(isModerator(context, context.programs[program].id)) {
          setProgramName(context.programs[program].name);
          setMain(
            <>
            <Segment basic>
              <Header as="h2">
                Program: {context.programs[program].name} ({context.programs[program].year})
              </Header>
              Explore and download data visualizations based on survey responses from your program participants.
            </Segment>
            </>
          )
          setPanes([]);
        } else {
          history("/program/" + program + "/surveys");
        }
      } else {
        history("/");
      }
    }
  }, [context.currentProgram, context.firstLoad]);

  useEffect(() => {
    if(panes.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [panes])

  useEffect(() => {
    if(loading) {
      loadAnswers();
    }
  }, [teams])

  useEffect(() => {
    if(loading) {
      loadParticipants();
    }
  }, [loading])

  useEffect(() => {
    if(loading) {
      const dataviz = {
        "Program": [
          <ProgramOverview key={1} programName={programName} teams={teams} colors={colors} />
        ],
        "Surveys": [
          <SurveyStats key={2} surveyStats={surveyStats} colors={colors} />,
        ],
        "Interactions": [
          <NetworkInteractions key={1} answers={answers} mapPartTeam={mapPartTeam} colors={colors} />
        ],
        "Custom": [
          <CustomDataviz key={1} answers={answers} mapPartTeam={mapPartTeam} colors={colors} />
        ]
      }

      let newPanes = [];
      for(const [key, value] of Object.entries(dataviz)) {
        newPanes.push({
          menuItem: key,
          render: () => (
            <Tab.Pane attached={false}>
            {value}
            </Tab.Pane>
          )
        })
      }

      setPanes(newPanes);
    }
  }, [surveyStats])

  const searchParticipant = (value) => {
    let participant = null;
    let team_name = null;
    let team_index = null;
    let i = 0
    while(!participant) {
      for(let j=0; j<teams[i].participants.length; j++) {
        if(teams[i].participants[j].id === value || teams[i].participants[j].name === value) {
          participant = teams[i].participants[j];
          team_name = teams[i].name;
          team_index = i;
          break;
        }
      }

      i++;
    }

    return [participant, team_name, team_index];
  }

  const loadParticipants = async() => {
    await Api.get('programs/' + context.programs[program].id + '/teams')
    .then(async(res) => {
      setTeams(res.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const loadAnswers = async() => {
    let newAnswers = {};
    let newSurveyStats = {};
    let newMapPartTeam = {};

    let baseSurveyStats = {"participation": {"total": 0, "participants": 0}, "teams": {}, "answers": {}};
    teams.sort((t1, t2) => t1.name.localeCompare(t2.name)).map((team, i) => {
      baseSurveyStats.answers[team.name] = {};

      team.participants.map((participant) => {
        baseSurveyStats.answers[team.name][participant.name] = 0;
        baseSurveyStats.participation.total += 1;
        newMapPartTeam[participant.name] = i;
      })
    })

    setMapPartTeam(newMapPartTeam);

    await Api.get('programs/' + context.programs[program].id + '/surveys')
    .then(async(res) => {
      await Promise.all(
        res.data.map(async(survey, i) => {
          let teamParticipants = {};
          newAnswers[survey.name] = {};
          newSurveyStats[survey.name] = JSON.parse(JSON.stringify(baseSurveyStats));

          await Promise.all(
            survey.survey_fields.map(async(survey_field, j) => {
              newAnswers[survey.name][survey_field.title] = {"title": survey_field.title, "category": survey_field.category, "answers": []};

              await Api.get('programs/' + context.programs[program].id + '/surveys/' + survey.id + "/survey_fields/" + survey_field.id + "/answers")
              .then((res_answers) => {
                res_answers.data.map((answer, k) => {
                  const [participant, team_name, team_index] = searchParticipant(answer.participant_id);
                  newAnswers[survey.name][survey_field.title]["answers"].push({"team": team_name, "team_index": team_index, "participantName": participant.name, "answer": answer.content.answer});
                  newSurveyStats[survey.name].answers[team_name][participant.name] += 1;

                  if(!(team_name in teamParticipants)) {
                    teamParticipants[team_name] = [];
                  }

                  if(!(teamParticipants[team_name].includes(participant.name))) {
                    teamParticipants[team_name].push(participant.name);
                  }

                })
              })
              .catch((error) => {
                console.log(error);
              })
            })
          )

          let statTeams = [];
          let nb_participants = 0;
          Object.keys(teamParticipants).map((team) => {
            nb_participants += teamParticipants[team].length;
            statTeams[team] = teamParticipants[team].length;
          })

          newSurveyStats[survey.name].participation.participants = nb_participants;
          newSurveyStats[survey.name].teams = statTeams;
        })
      )

      setAnswers(newAnswers);
      setSurveyStats(newSurveyStats);
    })
    .catch((error) => {
      console.log(error);
    })
  }

  return (
    <Container fluid className="container-page">
      <Segment basic loading={loading}>
        {main}
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Segment>
    </Container>
  )
}

export default Dataviz;
