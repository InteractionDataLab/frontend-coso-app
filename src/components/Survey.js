import React, { useEffect, useState, useContext } from 'react';
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
  Message
 } from 'semantic-ui-react';

import {
  FormIntro,
  FormWrapDependency,
  FormInputField,
  FormInputCheckbox,
  FormInputRadio,
  FormInputTextarea,
  FormInputNames,
  FormInputSlider,
  FormInputDate
} from "./SurveyForm";

const Survey = ({ survey, surveyFields, sendSurvey, program_id }) => {
  const [main, setMain] = useState('');
  const [page, setPage] = useState(-1);
  const [finished, setFinished] = useState(false);
  const [responses, setResponses] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    let newResponses = {};

    surveyFields.map((surveyField, i) => {
      switch(surveyField.category) {
        case "inputField": newResponses[surveyField.id] = ''; break;
        case "inputCheckbox": newResponses[surveyField.id] = {}; break;
        case "inputRadio": newResponses[surveyField.id] = ''; break;
        case "inputTextarea": newResponses[surveyField.id] = ''; break;
        case "inputNames": newResponses[surveyField.id] = []; break;
        case "inputSlider": newResponses[surveyField.id] = ''; break;
        case "inputDate": newResponses[surveyField.id] = ''; break;
      }
    })

    setResponses(newResponses);

  }, [surveyFields])

  const writeResponse = (index, response) => {
    console.log(responses)
    setResponses((oldState) => ({...oldState, [index]: response }));
  }

  useEffect(() => {
    let newMain;

    if(page < surveyFields.length) {
      if(page == -1) {
        newMain = <FormIntro survey={survey} />
      } else {
        if(surveyFields[page].dependency.survey_field_id === "") {
          switch(surveyFields[page].category) {
            case "inputField": newMain = <FormInputField displayBorder={true} surveyField={surveyFields[page]} writeResponse={writeResponse} response={responses[surveyFields[page].id]} />; break;
            case "inputCheckbox": newMain = <FormInputCheckbox displayBorder={true} surveyField={surveyFields[page]} writeResponse={writeResponse} response={responses[surveyFields[page].id]} />; break;
            case "inputRadio": newMain = <FormInputRadio displayBorder={true} surveyField={surveyFields[page]} writeResponse={writeResponse} response={responses[surveyFields[page].id]} />; break;
            case "inputTextarea": newMain = <FormInputTextarea displayBorder={true} surveyField={surveyFields[page]} writeResponse={writeResponse} response={responses[surveyFields[page].id]} />; break;
            case "inputNames": newMain = <FormInputNames displayBorder={true} program_id={program_id} surveyField={surveyFields[page]} teams={surveyFields[page].content.teams} writeResponse={writeResponse} response={responses[surveyFields[page].id]} />; break;
            case "inputSlider": newMain = <FormInputSlider displayBorder={true} surveyField={surveyFields[page]} writeResponse={writeResponse} response={responses[surveyFields[page].id]} />; break;
            case "inputDate": newMain = <FormInputDate displayBorder={true} surveyField={surveyFields[page]} writeResponse={writeResponse} response={responses[surveyFields[page].id]} />; break;
          }
        } else {
          let responseClean = cleanResponse(responses[surveyFields[page].dependency.survey_field_id]);

          if(surveyFields[page].dependency.value !== "" && checkDependencyValue(responseClean, surveyFields[page].dependency.value)) {
            newMain = <FormWrapDependency program_id={program_id} surveyField={surveyFields[page]} writeResponse={writeResponse} responseDependency={surveyFields[page].dependency.value} response={responses[surveyFields[page].id]} />
          } else {
            newMain = <FormWrapDependency program_id={program_id} surveyField={surveyFields[page]} writeResponse={writeResponse} responseDependency={responseClean} response={responses[surveyFields[page].id]} />
          }

        }
      }
    } else {
      setFinished(true);

      newMain = (
        <Segment>
          <Message icon>
            <Icon name='inbox' />
            <Message.Content>
              <Message.Header>Ready to collect your answers.</Message.Header>
              <strong>Click on Send</strong> to finish the survey and send your answers.
            </Message.Content>
          </Message>
        </Segment>
      )
    }

    setMain(newMain);
    window.scrollTo(0, 0);
  }, [page])

  const Buttons = () => {
    let buttons;
    if(finished) {
      return (
        <>
          <Button label="Back" icon="long arrow alternate left" onClick={() => previousPage()} />
          <Button floated="right" color="green" size="big" inverted onClick={() => validateSurvey()}>
            Send
          </Button>
        </>
      )
    } else {
      if(page == -1) {
        return (
          <Button floated="right" label="Next" labelPosition="left" icon="long arrow alternate right" onClick={() => nextPage()} />
        )
      } else {
        return (
          <>
            <Button label="Back" icon="long arrow alternate left" onClick={() => previousPage()} />
            <Button floated="right" label="Next" labelPosition="left" icon="long arrow alternate right" onClick={() => nextPage()} />
          </>
        )
      }
    }

    return buttons;
  }

  const validateSurvey = () => {
    if(sendSurvey) {
      sendSurvey(responses);
    }
  }

  const cleanResponse = (response) => {
    if(Array.isArray(response)) {
      if(response.length === 0) {
        return "";
      } else {
        return response
      }
    } else {
      if(typeof response === 'object') {
        if(typeof response[Object.keys(response)[0]] === 'object') { // Dependency object
          return response[Object.keys(response)[0]];
        } else {
          let newResponse = [];
          Object.entries(response).map(([key, value], i) => { // Checkbox
            if(value === true) {
              newResponse.push(key);
            }
          })

          if(newResponse.length > 0) {
            return newResponse;
          } else {
            return "";
          }
        }
      } else {
        return response;
      }
    }
  }

  const checkDependencyValue = (response, valueDependency) => {
    let found = false;

    if(typeof response === 'string') {
      if(response === valueDependency) {
        found = true;
      }
    } else if(Array.isArray(response)) {
      response.forEach(value => {
        if(value === valueDependency) {
          found = true;
        }
      })
    } else if(typeof response === 'object') {
      Object.entries(response).map(([key, value], i) => {
        if(key === valueDependency && (value == true || value == 1)) {
          found = true;
        }
      })
    }

    return found;
  }

  const previousPage = () => {
    setMessage("");
    if(finished) {
      setFinished(false);
    }

    let previousPage = page-1;

    while(previousPage > -1) {
      if(cleanResponse(responses[surveyFields[previousPage].id]) !== "") {
        break;
      }

      previousPage--;
    }

    setPage(previousPage);
  }

  const nextPage = () => {
    if(page > -1 && surveyFields[page].required && responses[surveyFields[page].id] == '') {
      setMessage("Action required");
    } else {
      setMessage("");

      let nextPage = page+1;

      while(nextPage < surveyFields.length) {
        if(surveyFields[nextPage].dependency.survey_field_id === "") {
          break;
        } else {
          const responseClean = cleanResponse(responses[surveyFields[nextPage].dependency.survey_field_id]);

          if(responseClean !== "") {
            if(surveyFields[nextPage].dependency.value !== "") {
              if(checkDependencyValue(responseClean, surveyFields[nextPage].dependency.value)) {
                break;
              }
            } else {
              break;
            }
          }
        }

        writeResponse(surveyFields[nextPage].id, '');
        nextPage++;
      }

      setPage(nextPage);
    }
  }

  return (
    <>
    {main}
    <Segment basic>
      <Grid>
        { message ?
            <Grid.Row>
              <Grid.Column>
               <Message error header={message} content="You must provide an answer to this question" />
              </Grid.Column>
            </Grid.Row>
          :
            null
        }
        <Grid.Row>
          <Grid.Column>
            <Buttons />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    </>
  )
}

export default Survey;
