import React, { useEffect, useState, useContext } from 'react';
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
  Button
 } from 'semantic-ui-react';

import { Context } from '../utils/Context';
import { Api } from '../Api';
import { useParams } from "react-router-dom";
import Survey from './Survey';
import {
  FormSelect,
  FormIntroControl,
  FormInputCheckboxControl,
  FormInputFieldControl,
  FormInputRadioControl,
  FormInputTextareaControl,
  FormInputNamesControl,
  FormInputSliderControl,
  FormInputDateControl
} from './SurveyFormControl'

const SurveyCreation = (props) => {
  const context = useContext(Context);
  const { program } = useParams();
  const [loading, setLoading] = useState(false);
  const [surveyData, setSurveyData] = useState(props.surveyData);
  const [survey, setSurvey] = useState({"name": "", "description": "", "team_id": []});
  const [surveyForms, setSurveyForms] = useState('');
  const [listFormControl, setListFormControl] = useState([]);
  const [surveyFieldDeleted, setSurveyFieldsDeleted] = useState([]);
  const [surveyFields, setSurveyFields] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [openExit, setOpenExit] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if(surveyData) {
      setLoading(true);

      let newSurveyFields = [];
      let newListFormControl = [];

      let id_index_mapping = {}
      for(let i=0; i<surveyData.survey_fields.length; i++) {
        id_index_mapping[surveyData.survey_fields[i].id] = i;
      }

      for(let i=0; i<surveyData.survey_fields.length; i++) {
        if(surveyData.survey_fields[i].dependency.survey_field_id !== "") {
          surveyData.survey_fields[i].dependency.survey_field_id = id_index_mapping[surveyData.survey_fields[i].dependency.survey_field_id];
        }

        const [newSurveyField, newFormControl] = createSurveyField(surveyData.survey_fields[i].category, surveyData.survey_fields[i]);
        newSurveyFields.push(newSurveyField);
        newListFormControl.push(newFormControl);
      }

      let newSurvey = {...survey};
      newSurvey.id = surveyData.id;
      newSurvey.name = surveyData.name;
      newSurvey.description = surveyData.description;
      newSurvey.team_id = surveyData.team_id;

      setSurvey(newSurvey)
      setSurveyFields(newSurveyFields);
      setListFormControl(newListFormControl);
      setIsSaved(true);
      setLoading(false);
    }
  }, [surveyData])

  useEffect(() => {
    const newForm = listFormControl.map((FormControl, i) => {
      return (
        <FormControl key={i} index={i}
        refresh={refresh}
        surveyField={surveyFields[i]}
        setContent={(content) => {setContent(i, content)}}
        delForm={delForm}
        moveUp={moveUp}
        moveDown={moveDown}
        surveyFields={surveyFields}
        program_id={context.programs[program].id}
        />
      )
    })

    setSurveyForms(newForm);
  }, [surveyFields]);

  const setContent = (i, newContent) => {
    if(i == -1) {
      setSurvey(newContent);
    } else {
      let newSurveyFields = [ ...surveyFields ];
      newSurveyFields.splice(i, 1, newContent);
      setSurveyFields(newSurveyFields);
    }

    setTimeout(() => {
      setRefresh(!refresh);
    }, 5);
  }

  const createSurveyField = (category, surveyField = null) => {
    let newSurveyField = {
      "category": category,
      "title": "",
      "subtitle": "",
      "required": 0,
      "dependency": {"survey_field_id": "", "value": ""},
      "content": {}
    };

    if(surveyField) {
      newSurveyField.id = surveyField.id;
      newSurveyField.title = surveyField.title;
      newSurveyField.subtitle = surveyField.subtitle;
      newSurveyField.required = surveyField.required ? 1 : 0;
      newSurveyField.dependency.survey_field_id = surveyField.dependency.survey_field_id;
      newSurveyField.dependency.value = surveyField.dependency.value;
      newSurveyField.content = surveyField.content;

      if(category === "inputDate") {
        if(newSurveyField.content.maxDate) {
          newSurveyField.content.maxDate = new Date(newSurveyField.content.maxDate);
        }
        if(newSurveyField.content.minDate) {
          newSurveyField.content.minDate = new Date(newSurveyField.content.minDate);
        }
      }
    } else {
      switch(category) {
        case "inputField":
          newSurveyField["content"]["placeholder"] = "";
          break;
        case "inputCheckbox":
          newSurveyField["content"]["labels"] = [];
          break;
        case "inputRadio":
          newSurveyField["content"]["labels"] = [];
          break;
        case "inputTextarea":
          newSurveyField["content"]["placeholder"] = "";
          break;
        case "inputNames":
          newSurveyField["content"]["teams"] = [];
          break;
        case "inputSlider":
          newSurveyField["content"]["min"] = 1;
          newSurveyField["content"]["textMin"] = "";
          newSurveyField["content"]["max"] = 5;
          newSurveyField["content"]["textMax"] = "";
          newSurveyField["content"]["step"] = 1;
          break;
        case "inputDate":
          newSurveyField["content"]["maxDate"] = null;
          newSurveyField["content"]["minDate"] = null;
          newSurveyField["content"]["typeDate"] = 0;
          break;
      }
    }

    let newFormControl;
    switch(category) {
      case "inputField":
        newFormControl = FormInputFieldControl;
        break;
      case "inputCheckbox":
        newFormControl = FormInputCheckboxControl;
        break;
      case "inputRadio":
        newFormControl = FormInputRadioControl;
        break;
      case "inputTextarea":
        newFormControl = FormInputTextareaControl;
        break;
      case "inputNames":
        newFormControl = FormInputNamesControl;
        break;
      case "inputSlider":
        newFormControl = FormInputSliderControl;
        break;
      case "inputDate":
        newFormControl = FormInputDateControl;
        break;
    }

    return [newSurveyField, newFormControl];
  }

  const addSurveyField = (category) => {
    let newListFormControl = [...listFormControl];
    let newSurveyFields = [...surveyFields];

    const [newSurveyField, newFormControl] = createSurveyField(category);
    newSurveyFields.push(newSurveyField);
    newListFormControl.push(newFormControl);

    setListFormControl(newListFormControl);
    setSurveyFields(newSurveyFields);
  }

  const reorganizeIDs = (index, operation) => {
    if(operation === 0) { // Delete
      for(let i=index+1; i<surveyFields.length; i++) {
        if(surveyFields[i]["dependency"]["survey_field_id"] === index) {
          surveyFields[i]["dependency"]["survey_field_id"] = "";
          surveyFields[i]["dependency"]["value"] = "";
        }
      }
    }
    else if(operation === -1) { // Move up
      for(let i=index+1; i<surveyFields.length; i++) {
        if(surveyFields[i]["dependency"]["survey_field_id"] === index) {
          surveyFields[i]["dependency"]["survey_field_id"] = index - 1;
        }
        else if(surveyFields[i]["dependency"]["survey_field_id"] === (index-1)) {
          surveyFields[i]["dependency"]["survey_field_id"] = index;
        }
      }

      if(surveyFields[index]["dependency"]["survey_field_id"] === index - 1) {
        surveyFields[index]["dependency"]["survey_field_id"] = "";
        surveyFields[index]["dependency"]["value"] = "";
      }
    }
    else if(operation === 1) { // Move down
      for(let i=index+2; i<surveyFields.length; i++) {
        if(surveyFields[i]["dependency"]["survey_field_id"] === index) {
          surveyFields[i]["dependency"]["survey_field_id"] = index + 1;
        }
        else if(surveyFields[i]["dependency"]["survey_field_id"] === (index+1)) {
          surveyFields[i]["dependency"]["survey_field_id"] = index;
        }
      }

      if(surveyFields[index+1]["dependency"]["survey_field_id"] === index) {
        surveyFields[index+1]["dependency"]["survey_field_id"] = "";
        surveyFields[index+1]["dependency"]["value"] = "";
      }
    }
  }

  const delForm = (index) => {
    reorganizeIDs(index, 0);

    if("id" in surveyFields[index]) {
      let newSurveyFieldDeleted = [...surveyFieldDeleted];
      newSurveyFieldDeleted.push(surveyFields[index].id);
      setSurveyFieldsDeleted(newSurveyFieldDeleted);
    }

    let newSurveyFields = [...surveyFields];
    newSurveyFields.splice(index, 1);

    let newListFormControl = [...listFormControl];
    newListFormControl.splice(index, 1);

    setListFormControl(newListFormControl);
    setSurveyFields(newSurveyFields);
    setRefresh(!refresh);
  }

  const moveUp = (index) => {
    if(index > 0) {
      reorganizeIDs(index, -1);

      let newSurveyFields = [...surveyFields];
      let newListFormControl = [...listFormControl];

      let surveyField = newSurveyFields[index];
      newSurveyFields[index] = newSurveyFields[index-1];
      newSurveyFields[index-1] = surveyField;
      let formControl = newListFormControl[index];
      newListFormControl[index] = newListFormControl[index-1];
      newListFormControl[index-1] = formControl;

      setListFormControl(newListFormControl);
      setSurveyFields(newSurveyFields);
      setRefresh(!refresh);
    }
  }

  const moveDown = (index) => {
    if(index < surveyFields.length-1) {
      reorganizeIDs(index, 1);

      let newSurveyFields = [...surveyFields];
      let newListFormControl = [...listFormControl];

      let surveyField = newSurveyFields[index];
      newSurveyFields[index] = newSurveyFields[index+1];
      newSurveyFields[index+1] = surveyField;
      let formControl = newListFormControl[index];
      newListFormControl[index] = newListFormControl[index+1];
      newListFormControl[index+1] = formControl;

      setListFormControl(newListFormControl);
      setSurveyFields(newSurveyFields);
      setRefresh(!refresh);
    }
  }

  const saveSurvey = async() => {
    setLoading(true);

    let newSurveyData = {
      "name": survey.name,
      "description": survey.description,
      "team_id": survey.team_id,
      "survey_fields": []
    };

    if("id" in survey) {
      newSurveyData.id = await Api.put('programs/' + context.programs[program].id + '/surveys/' + survey.id, {survey})
      .then((res) => {
        return res.data.id;
      })
      .catch((error) => {
        console.log(error);
      })
    } else {
      newSurveyData.id = await Api.post('programs/' + context.programs[program].id + '/surveys', {survey})
      .then((res) => {
        return res.data.id;
      })
      .catch((error) => {
        console.log(error);
        return -1;
      });
    }

    if(newSurveyData.id !== -1) {
      surveyFieldDeleted.map(async(survey_field_id, i) => {
        await Api.delete('programs/' + context.programs[program].id + '/surveys/' + newSurveyData.id + "/survey_fields/" + survey_field_id)
      })

      let index_id_mapping = {};

      for(let i=0; i<surveyFields.length; i++) {
        const survey_field = {
          "title": surveyFields[i].title,
          "subtitle": surveyFields[i].subtitle,
          "category": surveyFields[i].category,
          "required": surveyFields[i].required,
          "order": i+1,
          "content": surveyFields[i].content
        }


        if("id" in surveyFields[i]) {
          survey_field.id = await Api.put('programs/' + context.programs[program].id + '/surveys/' + newSurveyData.id + "/survey_fields/" + surveyFields[i].id, {survey_field})
          .then((res) => {
            return res.data.id;
          })
          .catch((error) => {
            console.log(error);
          })
        } else {
          survey_field.id = await Api.post('programs/' + context.programs[program].id + '/surveys/' + newSurveyData.id + "/survey_fields", {survey_field})
          .then((res) => {
            return res.data.id;
          })
          .catch((error) => {
            console.log(error);
            return -1;
          })
        }

        if(survey_field.id !== -1) {
          index_id_mapping[i] = survey_field.id;
          newSurveyData.survey_fields.push(survey_field);
        }
      }

      await Promise.all(
        Object.entries(index_id_mapping).map(async([key, value], i) => {
          const survey_field = {
            "dependency": { "survey_field_id": "", "value": "" }
          }

          if(surveyFields[key].dependency.survey_field_id !== "") {
            survey_field.dependency.survey_field_id = index_id_mapping[surveyFields[key].dependency.survey_field_id];
            survey_field.dependency.value = surveyFields[key].dependency.value;
          }

          newSurveyData.survey_fields[key].dependency = await Api.put('programs/' + context.programs[program].id + '/surveys/' + newSurveyData.id + "/survey_fields/" + index_id_mapping[key], {survey_field})
          .then((res) => {
            return res.data.dependency;
          })
          .catch((error) => {
            console.log(error)
          })
        })
      )

      setSurveyData(newSurveyData);
      props.refreshSurveys();
    }
  }

  return (
    <Segment basic loading={loading}>
      <Modal basic size="small" open={openExit}>
        <Header icon>
          <Icon name='clipboard list' />
          Do you want to exit without saving ?
        </Header>

        <Modal.Actions>
          <Button basic inverted color="red" onClick={() => setOpenExit(false)}>
            <Icon name='remove' /> No
          </Button>
          <Button basic inverted color="green" onClick={() => props.refreshSurveys()}>
            <Icon name='checkmark' /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
      <Segment basic>
        <FormIntroControl refresh={refresh}
          program_id={context.programs[program].id}
          survey={survey}
          setContent={(content) => {setContent(-1, content)}}
        />
        {surveyForms}
        <FormSelect addSurveyField={addSurveyField} />
        <Segment basic>
          <Button size="big" as='div' labelPosition='left' onClick={() => saveSurvey()}>
            <Label basic>
              Save
            </Label>
          </Button>
        </Segment>
      </Segment>
    </Segment>
  )
}

export default SurveyCreation;
