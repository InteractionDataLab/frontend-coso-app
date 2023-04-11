import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Segment,
  Container,
  Header,
  Menu,
  Grid,
  Divider,
  Card,
  Image,
  Icon,
  Form,
  Modal,
  Button,
  Popup
 } from 'semantic-ui-react';
import jwt_encode from "jwt-encode";

import { Context, isModerator, isAdmin } from '../utils/Context';
import { Api } from '../Api';
import SurveyCreation from '../components/SurveyCreation';
import Survey from '../components/Survey';
import ShareSurvey from '../components/ShareSurvey';

var secretJWT = "secret-coso-based-jwt-whales";

const Surveys = () => {
  const context = useContext(Context);
  const { program } = useParams();
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [survey, setSurvey] = useState([]);
  const [surveyFields, setSurveyFields] = useState([]);
  const [activeItem, setActiveItem] = useState("list");
  const [openPreview, setOpenPreview] = useState(false);
  const [surveyShare, setSurveyShare] = useState(-1);
  const [surveyDelete, setSurveyDelete] = useState(-1);
  const [main, setMain] = useState("");

  useEffect(() => {
    if(!context.firstLoad) {
      if(program in context.programs) {
        loadSurveys();
      } else {
        history("/");
      }
    }
  }, [context.firstLoad]);

  useEffect(() => {
    if(!context.firstLoad) {
      if(isModerator(context, context.programs[program].id)) {
        setMain(
          <>
          <Segment basic>
            <Header as="h2">
              Program: {context.programs[program].name} ({context.programs[program].year})
            </Header>
            Create and diffuse your surveys.
          </Segment>
          <Menu pointing secondary>
            <Menu.Item
              name='List'
              active={activeItem === 'list'}
              onClick={() => {refreshSurveys()}}
            />
            <Menu.Item
              name='New survey'
              active={activeItem === 'new'}
              onClick={() => {setSurvey(null); setActiveItem("new")}}
            />
          </Menu>
          <Segment basic loading={loading} style={{margin: 0, padding: 0}}>
            {(() => {
              switch(activeItem) {
                case "list": return (
                  <SurveyItems />
                )
                case "new": return (
                  <SurveyCreation surveyData={survey} refreshSurveys={refreshSurveys} />
                )
              }
            })()}
          </Segment>
          </>
        )
      } else {
        setMain(
          <>
          <Segment basic>
            <Header as="h2">
              Surveys of {context.programs[program].name} ({context.programs[program].year})
            </Header>
            Participate in the surveys.
          </Segment>
          <Segment basic>
            <SurveyItems />
          </Segment>
          </>
        )
      }
    }
  }, [surveys, activeItem])

  const loadSurveys = async() => {
    setLoading(true);

    await Api.get('programs/' + context.programs[program].id + '/surveys')
    .then((res) => {
      for(let i=0; i<res.data.length; i++) {
        res.data[i].survey_fields.sort((s1, s2) => s1.order > s2.order ? 1 : -1);
      }

      setSurveys(res.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    });
  }

  const deleteSurvey = (index) => {
    Api.delete('programs/' + context.programs[program].id + '/surveys/' + surveys[index].id)
    .then((res) => {
      loadSurveys();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const editSurvey = (index) => {
    setSurvey(surveys[index]);
    setActiveItem("new");
  }

  const duplicateSurvey = async(index) => {
    const survey = {
      name: surveys[index].name + " bis",
      description: surveys[index].description,
      team_id: surveys[index].team_id
    }

    const surveyId = await Api.post('programs/' + context.programs[program].id + '/surveys', {survey})
    .then((res) => {
      return res.data.id;
    })
    .catch((error) => {
      console.log(error);
      return -1;
    })

    if(surveyId !== -1) {
      let old_id_mapping = {};

      await Promise.all(
        surveys[index].survey_fields.map(async(surveyField, i) => {
          const survey_field = {
            "title": surveyField.title,
            "subtitle": surveyField.subtitle,
            "category": surveyField.category,
            "required": surveyField.required,
            "order": surveyField.order,
            "content": surveyField.content
          }

          const survey_field_id = await Api.post('programs/' + context.programs[program].id + '/surveys/' + surveyId + "/survey_fields", {survey_field})
          .then((res) => {
            return res.data.id;
          })
          .catch((error) => {
            console.log(error);
            return -1;
          })

          if(survey_field_id !== -1) {
            old_id_mapping[surveyField.id] = survey_field_id;
          }
        })
      )

      await Promise.all(
        surveys[index].survey_fields.map(async(surveyField, i) => {
          const survey_field = {
            "dependency": { "survey_field_id": "", "value": "" }
          }

          if(surveyField.dependency.survey_field_id !== "") {
            survey_field.dependency.survey_field_id = old_id_mapping[surveyField.dependency.survey_field_id];
            survey_field.dependency.value = surveyField.dependency.value;
          }

          await Api.put('programs/' + context.programs[program].id + '/surveys/' + surveyId + "/survey_fields/" + old_id_mapping[surveyField.id], {survey_field})
          .then((res) => {
            return res.data.dependency;
          })
          .catch((error) => {
            console.log(error)
          })
        })
      )
    }

    refreshSurveys();
  }

  const previewSurvey = (index) => {
    setSurvey(surveys[index]);
    setSurveyFields(surveys[index]["survey_fields"]);
    setOpenPreview(true);
  }

  const refreshSurveys = () => {
    setActiveItem("list");
    loadSurveys();
  }

  const SurveyItems = () => {
    return (
      <>

      <Grid>
        <Grid.Column width={2} />
        <Grid.Column width={12}>
          <Segment basic loading={loading}>
          <Card.Group centered>
            { surveys.map((survey, i) => {
              return (
                <Card key={i}>
                  <Card.Content>
                    <Card.Header>{survey.name}</Card.Header>
                    <Card.Meta>
                      <span className='date'>{survey.time}</span>
                    </Card.Meta>
                    <Card.Description>
                      {survey.description}
                    </Card.Description>
                    <Divider />
                    <Card.Description>
                      <p>Number of questions: {survey.survey_fields.length}</p>
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    { isModerator(context, context.programs[program].id) ?
                        <>
                        <Popup className='computer only' content="Preview" inverted position='top center' trigger={
                          <Button basic icon="play" onClick={() => previewSurvey(i)} />
                        } />
                        { isAdmin(context, context.programs[program].id) ?
                            <>
                            <Popup className='computer only' content="Edit" inverted position='top center' trigger={
                              <Button basic icon="edit" onClick={() => editSurvey(i)} />
                            } />
                            <Popup className='computer only' content="Share" inverted position='top center' trigger={
                              <Button basic icon="external share" onClick={() => setSurveyShare(i)} />
                            } />
                            <Popup className='computer only' content="Duplicate" inverted position='top center' trigger={
                              <Button basic icon="copy" onClick={() => duplicateSurvey(i)} />
                            } />
                            <Popup className='computer only' content="Delete" inverted position='top center' trigger={
                              <Button basic icon="trash" onClick={() => setSurveyDelete(i)} />
                            } />
                            </>
                          :
                            null
                        }
                        </>
                      :
                        <Popup className='computer only' content="Take survey" inverted position='top center' trigger={
                          <Button as={Link} to={"/survey?part=" + jwt_encode({ "programId": context.programs[program].id, "surveyId": survey.id, "participantId": context.currentParticipant.id }, secretJWT)} icon="play" />
                        } />
                    }
                  </Card.Content>
                </Card>
              )
            })}
          </Card.Group>
          </Segment>
        </Grid.Column>
      <Grid.Column width={2} />
    </Grid>
    </>
    )
  }

  return (
    <Container fluid className="container-page">
      <Segment basic loading={loading}>
        { program in context.programs ?
            <>
            <Modal basic size="small" open={surveyDelete === -1 ? false : true}>
              {surveyDelete === -1 ?
                  null
                :
                  <Header icon>
                    <Icon name='clipboard list' />
                    Are you sure to delete <span style={{ fontWeight: 'bold' }}>{surveys[surveyDelete].name}</span> ?
                  </Header>
              }
              <Modal.Content>
                <p>This action is irreversible.</p>
              </Modal.Content>

              <Modal.Actions>
                <Button basic inverted color="red" onClick={() => setSurveyDelete(-1)}>
                  <Icon name='remove' /> No
                </Button>
                <Button basic inverted color="green" onClick={() => {deleteSurvey(surveyDelete); setSurveyDelete(-1);}}>
                  <Icon name='checkmark' /> Yes
                </Button>
              </Modal.Actions>
            </Modal>

            <Modal open={openPreview}
              onClose={() => setOpenPreview(false)}
              closeIcon
            >
              <Header icon='clipboard list' content='Preview of the survey' />
              <Modal.Content>
                <Survey survey={survey} surveyFields={surveyFields} sendSurvey={null} program_id={context.programs[program].id} />
              </Modal.Content>
              <Modal.Actions>
              </Modal.Actions>
            </Modal>
            </>
          :
            null
        }
        <Modal open={surveyShare === -1 ? false : true}
          onClose={() => setSurveyShare(-1)}
          closeIcon
        >
        { surveyShare === -1 ?
            null
          :
            <>
              <Header content={"Survey: " + surveys[surveyShare].name} />
              <Modal.Content>
                <ShareSurvey survey={surveys[surveyShare]} />
              </Modal.Content>
              <Modal.Actions>
              </Modal.Actions>
            </>
        }

        </Modal>
        {main}
      </Segment>
    </Container>
  )
}

export default Surveys;
