import React, { useEffect, useState, useContext, useRef } from 'react';
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
  Button,
  Label,
  Checkbox,
  TextArea
 } from 'semantic-ui-react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { TextField, Slider } from '@mui/material';

import "../index.css";
import { Api } from '../Api';

const FormIntro = (props) => {
  return (
    <Segment attached padded >
      <Header className="display-linebreak">
        { props.survey.name }
      </Header>
      <p className="display-linebreak">{ props.survey.description }</p>
    </Segment>
  )
}

const FormWrapDependency = (props) => {
  const [responses, setResponses] = useState({});
  const [r, setR] = useState([]);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    let newResponses = {};

    if(typeof props.responseDependency === 'string') {
      newResponses[props.responseDependency] = "";
    } else if(Array.isArray(props.responseDependency)) {
      props.responseDependency.forEach(value => {
        newResponses[value] = "";
      })
    } else if(typeof props.responseDependency === 'object') {
      Object.entries(props.responseDependency).map(([key, value], i) => {
        if(value === true || value === 1) {
          newResponses[key] = "";
        }
      })
    }

    const newForms = Object.entries(newResponses).map(([key, value], i) => {
      let newSurveyField = {...props.surveyField};
      newSurveyField.id = key;
      newSurveyField.title = key;
      newSurveyField.subtitle = "";

      let response = '';
      if(props.response !== '' && key in props.response) {
        response = props.response[key];
      }

      switch(props.surveyField.category) {
        case "inputField": return <FormInputField key={i} displayBorder={false} surveyField={newSurveyField} writeResponse={writeResponse} response={response} />;
        case "inputCheckbox": return <FormInputCheckbox key={i} displayBorder={false} surveyField={newSurveyField} writeResponse={writeResponse} response={response} />;
        case "inputRadio": return <FormInputRadio key={i} displayBorder={false} surveyField={newSurveyField} writeResponse={writeResponse} response={response} />;
        case "inputTextarea": return <FormInputTextarea key={i} displayBorder={false} surveyField={newSurveyField} writeResponse={writeResponse} response={response} />;
        case "inputNames": return <FormInputNames key={i} displayBorder={false} program_id={props.program_id} surveyField={newSurveyField} writeResponse={writeResponse} response={response} teams={newSurveyField.content.teams} />;
        case "inputSlider": return <FormInputSlider key={i} displayBorder={false} surveyField={newSurveyField} writeResponse={writeResponse} response={response} />;
        case "inputDate": return <FormInputDate key={i} displayBorder={false} surveyField={newSurveyField} writeResponse={writeResponse} response={response} />;
      }
    })

    setForms(newForms);
  }, [props])

  useEffect(() => {
    if(props.writeResponse !== undefined) {
      props.writeResponse(props.surveyField.id, responses);
    }
  }, [responses])

  const writeResponse = (index, response) => {
    setResponses((oldState) => ({...oldState, [index]: response }));
  }

  return (
    <Segment attached padded>
      <Header className="display-linebreak">
        { props.surveyField.title }
      </Header>
      <p className="display-linebreak">{ props.surveyField.subtitle }</p>
      {forms}
    </Segment>
  )
}

const FormInputField = (props) => {
  const [response, setResponse] = useState('');

  useEffect(() => {
    if(props.response !== undefined) {
      setResponse(props.response);
    }
  }, [props])

  useEffect(() => {
    if(props.writeResponse !== undefined) {
      props.writeResponse(props.surveyField.id, response);
    }
  }, [response])

  return (
    <Segment basic={!props.displayBorder} attached={props.displayBorder} padded>
      <Header className="display-linebreak">
        { props.surveyField.title }
      </Header>
      <p className="display-linebreak">{ props.surveyField.subtitle }</p>
      <Segment basic>
        <Form>
          <Form.Input placeholder={props.surveyField.content.placeholder} value={response} fluid onChange={(e, {name, value}) => setResponse(value)} />
        </Form>
      </Segment>
    </Segment>
  )
}

const FormInputCheckbox = (props) => {
  const [response, setResponse] = useState({});

  useEffect(() => {
    if(props.response !== undefined) {
      setResponse(props.response);
    } else {
      let newResponse = {};

      props.surveyField.content.labels.map((label, i) => {
        newResponse[label] = false;
      })

      setResponse(newResponse);
    }
  }, [props])

  useEffect(() => {
    if(props.writeResponse !== undefined) {
      let empty = true;
      Object.values(response).slice().map((value, i) => {
        if(value) {
          empty = false;
        }
      })

      if(!empty) {
        props.writeResponse(props.surveyField.id, response);
      } else {
        props.writeResponse(props.surveyField.id, '');
      }

    }
  }, [response])

  const handleResponse = (label, checked) => {
    let newResponse = { ...response };
    newResponse[label] = checked;
    setResponse(newResponse);
  }

  return (
    <Segment basic={!props.displayBorder} attached={props.displayBorder} padded>
      <Header className="display-linebreak">
        { props.surveyField.title }
      </Header>
      <p className="display-linebreak">{ props.surveyField.subtitle }</p>
      <Segment basic>
        <Form>
          { props.surveyField.content.labels.map((label, i) => {
              return (
                <Form.Field key={i}>
                  <Checkbox checked={response[label]} label={label} onChange={(e, {label, checked}) => handleResponse(label, checked)} />
                </Form.Field>
              )
            })
          }
        </Form>
      </Segment>
    </Segment>
  )
}

const FormInputTextarea = (props) => {
  const [response, setResponse] = useState(props.response);

  useEffect(() => {
    if(props.response !== undefined) {
      setResponse(props.response);
    }
  }, [props])

  useEffect(() => {
    if(props.writeResponse !== undefined) {
      props.writeResponse(props.surveyField.id, response);
    }
  }, [response])

  return (
    <Segment basic={!props.displayBorder} attached={props.displayBorder} padded>
      <Header className="display-linebreak">
        { props.surveyField.title }
      </Header>
      <p className="display-linebreak">{ props.surveyField.subtitle }</p>
      <Segment basic>
        <Form>
          <Form.TextArea placeholder={props.surveyField.content.placeholder} value={response} onChange={(e, {name, value}) => setResponse(value)} />
        </Form>
      </Segment>
    </Segment>
  )
}

const FormInputNames = (props) => {
  const [response, setResponse] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    Api.get('programs/' + props.program_id + '/teams')
    .then((res) => {
      let newTeams = res.data;
      if(props.surveyField.content.teams.length > 0) {
        newTeams = newTeams.filter(team => props.surveyField.content.teams.includes(team.id));
      }

      setTeams(newTeams);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    })
  }, [props.teams])

  useEffect(() => {
    if(props.response !== undefined) {
      setResponse(props.response);
    }
  }, [props])

  useEffect(() => {
    if(props.writeResponse !== undefined) {
      props.writeResponse(props.surveyField.id, response);
    }
  }, [response])

  const activeParticipant = (value) => {
    const index = response.findIndex((element) => element === value);
    let newResponse = [...response];

    if(index === -1) {
      newResponse.push(value);
    } else {
      newResponse.splice(index, 1);
    }

    setResponse(newResponse);
  }

  return (
    <Segment basic={!props.displayBorder} attached={props.displayBorder} padded loading={loading}>
      <Header className="display-linebreak">
        { props.surveyField.title }
      </Header>
      <p className="display-linebreak">{ props.surveyField.subtitle }</p>
      <Segment basic style={{overflowY: "auto", maxHeight: "250px", padding: 0}}>
      { teams.map((team, i) => {
        return <Segment key={i} basic>
          <Header as="h4">{team.name}</Header>
          <Segment basic>
            <Grid stackable verticalAlign="middle">

          { team.participants.map((particpant, j) => {
            return <Grid.Column width={4} key={j}><Button basic={!response.includes(particpant.name)} color='black' content={particpant.name} circular onClick={() => activeParticipant(particpant.name)} /></Grid.Column>
          })}
            </Grid>
          </Segment>
        </Segment>
      })}
      </Segment>
    </Segment>
  )
}

const FormInputRadio = (props) => {
  const [response, setResponse] = useState('');

  useEffect(() => {
    if(props.response !== undefined) {
      setResponse(props.response);
    }
  }, [props])

  useEffect(() => {
    if(props.writeResponse !== undefined) {
      props.writeResponse(props.surveyField.id, response);
    }
  }, [response])

  return (
    <Segment basic={!props.displayBorder} attached={props.displayBorder} padded>
      <Header className="display-linebreak">
        { props.surveyField.title }
      </Header>
      <p className="display-linebreak">{ props.surveyField.subtitle }</p>
      <Segment basic>
        <Form>
          { props.surveyField.content.labels.map((label, i) => {
            return (
              <Form.Field key={i}>
                <Checkbox radio label={label} checked={response === label} onChange={() => setResponse(label)} />
              </Form.Field>
            )
          })
          }
        </Form>
      </Segment>
    </Segment>
  )
}

const FormInputSlider = (props) => {
  const [response, setResponse] = useState('');
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    if(props.surveyField.content.min !== "" && props.surveyField.content.max !== "") {
      let newMarks = [];
      for(let i = props.surveyField.content.min; i<=props.surveyField.content.max; i += props.surveyField.content.step) {
        newMarks.push({
          value: i,
          label: i
        });
      }
      setMarks(newMarks);
    }

    if(props.response !== undefined) {
      setResponse(props.response);
    }
  }, [props])

  useEffect(() => {
    if(props.writeResponse !== undefined) {
      props.writeResponse(props.surveyField.id, ''+response);
    }
  }, [response])

  return (
    <Segment basic={!props.displayBorder} attached={props.displayBorder} padded>
      <Header className="display-linebreak">
        { props.surveyField.title }
      </Header>
      <p className="display-linebreak">{ props.surveyField.subtitle }</p>
      <Segment basic>
        <Grid columns={3} stackable>
          <Grid.Column width={3} textAlign="center">
            <Header as="h4" style={{fontSize: "1em"}}>{props.surveyField.content.textMin}</Header>
          </Grid.Column>
          <Grid.Column width={10}>
            <Slider
              marks={marks}
              min={props.surveyField.content.min}
              max={props.surveyField.content.max}
              step={props.surveyField.content.step}
              valueLabelDisplay="auto"
              onChangeCommitted={(e, value) => setResponse(value)}
            />
          </Grid.Column>
          <Grid.Column width={3} textAlign="center">
            <Header as="h4" style={{fontSize: "1em"}}>{props.surveyField.content.textMax}</Header>
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment>
  )
}

const FormInputDate = (props) => {
  const [response, setResponse] = useState('');
  const [open, setOpen] = useState(false);
  const [maxDate, setMaxDate] = useState(props.surveyField.content.maxDate);
  const [minDate, setMinDate] = useState(props.surveyField.content.minDate);
  const [viewDate, setViewDate] = useState([]);
  const [formatDate, setFormatDate] = useState("yyyy-MM-DD");

  useEffect(() => {
    if(props.response !== undefined) {
      setResponse(props.response);
    }
  }, [props])

  useEffect(() => {
    if(props.writeResponse !== undefined) {
      let newResponse;

      if(typeof response === "object" && "_isValid" in response && response._isValid) { // is a correct date (object)
        newResponse = response.format('yyyy-MM-DD');
        props.writeResponse(props.surveyField.id, newResponse);
      }
    }
  }, [response])

  useEffect(() => {
    switch(props.surveyField.content.typeDate) {
      case 0:
        setViewDate(["year", "month", "day"]);
        setFormatDate("yyyy-MM-DD");
        break;
      case 1:
        setViewDate(["month", "day"]);
        setFormatDate("MM-DD");
        break;
      case 2:
        setViewDate(["day"]);
        setFormatDate("DD");
        break;
      case 3:
        setViewDate(["month"]);
        setFormatDate("MM");
        break;
      case 4:
        setViewDate(["year"]);
        setFormatDate("yyyy");
        break;
    }
  }, [props.surveyField.content.typeDate])

  useEffect(() => {
    if(props.surveyField.content.maxDate !== null) {
      setMaxDate(new Date(props.surveyField.content.maxDate));
    }
  }, [props.surveyField.content.maxDate])

  useEffect(() => {
    if(props.surveyField.content.minDate !== null) {
      setMinDate(new Date(props.surveyField.content.minDate));
    }
  }, [props.surveyField.content.minDate])

  return (
    <Segment basic={!props.displayBorder} attached={props.displayBorder} padded>
      <Header className="display-linebreak">
        { props.surveyField.title }
      </Header>
      <p className="display-linebreak">{ props.surveyField.subtitle }</p>
      <Segment basic>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <MobileDatePicker
            label="Enter date"
            showToolbar={false}
            views={viewDate}
            onClose={() => setOpen(false)}
            value={response || null}
            inputFormat={formatDate}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(value) => setResponse(value)}
            renderInput={(params) => <TextField {...params} />}
            componentsProps={{
              actionBar: {
                actions: ['accept', 'clear'],
              },
            }}
           />
        </LocalizationProvider>
      </Segment>
    </Segment>
  )
}

export { FormIntro, FormWrapDependency, FormInputField, FormInputCheckbox, FormInputRadio, FormInputTextarea, FormInputNames, FormInputSlider, FormInputDate }
