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
  Label,
  Input,
  Checkbox,
  Dropdown
 } from 'semantic-ui-react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';

import "../index.css";
import { Api } from '../Api';
import {
  FormIntro,
  FormInputField,
  FormInputCheckbox,
  FormInputRadio,
  FormInputTextarea,
  FormInputNames,
  FormInputSlider,
  FormInputDate
} from "./SurveyForm";

const nameCategory = { "inputCheckbox": "Checkboxes", "inputField": "Short answer", "inputRadio": "Multiple choice", "inputTextarea": "Paragraph", "inputSlider": "Slider", "inputDate": "Date", "inputNames": "Interactions" };

const FormSelect = ({ addSurveyField }) => {
  const [category, setCategory] = useState('');

  const categories = [
    {
      key: 0,
      text: nameCategory['inputCheckbox'],
      value: 'inputCheckbox',
    },
    {
      key: 1,
      text: nameCategory['inputDate'],
      value: 'inputDate',
    },
    {
      key: 2,
      text: nameCategory['inputField'],
      value: 'inputField',
    },
    {
      key: 3,
      text: nameCategory['inputTextarea'],
      value: 'inputTextarea',
    },
    {
      key: 4,
      text: nameCategory['inputNames'],
      value: 'inputNames',
    },
    {
      key: 5,
      text: nameCategory['inputSlider'],
      value: 'inputSlider',
    },
    {
      key: 6,
      text: nameCategory['inputRadio'],
      value: 'inputRadio',
    }
  ]

  return (
    <Grid verticalAlign="top" stackable columns={2}>
      <Grid.Row>
        <Grid.Column width={8}>
          <Segment attached padded>
            <Form>
              <Form.Dropdown
                label="Add new question"
                placeholder='Select Field'
                selection
                fluid
                options={categories}
                onChange={(e, {value}) => {setCategory(value)}}
              />
              <Form.Button onClick={() => {addSurveyField(category)}}>Add</Form.Button>
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={8} />
      </Grid.Row>
    </Grid>
  )
}

const Frame = ({ index, category, delForm, moveUp, moveDown }) => {
  return (
    <Segment attached="top" inverted style={{padding: 0}}>
      <Grid>
        <Grid.Column width={2} textAlign="left">
          <Button size="tiny" icon="arrow up" color="black" onClick={() => {moveUp(index)}} />
          <Button size="tiny" icon="arrow down" color="black" onClick={() => {moveDown(index)}} />
        </Grid.Column>
        <Grid.Column width={6} textAlign="left" verticalAlign="middle">
          <p>Question {index+1} - {nameCategory[category]}</p>
        </Grid.Column>
        <Grid.Column width={8} textAlign="right">
          <Button size="tiny" icon="close" color="black" onClick={() => {delForm(index)}} />
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

const FormIntroControl = ({ program_id, refresh, survey, setContent }) => {
  const [name, setName] = useState(survey.name);
  const [description, setDescription] = useState(survey.description);
  const [teams, setTeams] = useState(survey.team_id);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if(loading) {
      Api.get('programs/' + program_id + '/teams')
      .then((res) => {
        let newOptions = [];
        let i=0;
        res.data.forEach(team => {
          newOptions.push({
            key: i,
            text: team.name,
            value: team.id
          });

          i++;
        })

        setOptions(newOptions);
      })
      .catch(error => {
        console.log(error);
      })

      setLoading(false);
    }
  }, [loading])

  useEffect(() => {
    setName(survey.name);
    setDescription(survey.description);
    setTeams(survey.team_id);
  }, [refresh])

  useEffect(() => {
    let newSurvey = {...survey};
    newSurvey.name = name;
    newSurvey.description = description
    newSurvey.team_id = teams;

    setContent(newSurvey);

  }, [name, description, teams]);

  return (
    <Grid verticalAlign="top" stackable columns={2}>
      <Grid.Row>
        <Grid.Column width={8}>
          <Segment attached padded>
            <Form>
              <Form.Dropdown label='Use the navigator below if you want to restrict the surveys to a subset of teams. If LEFT BLANK, the survey will be sent to all participants.' fluid multiple selection options={options} onChange={(e, {value}) => setTeams(value)} value={teams} />
              <Form.Input
                label='Survey title'
                value={name}
                placeholder='A great new title.'
                required
                onChange={(e, {value}) => {setName(value)}}
              />
              <Form.TextArea
                label='Survey description'
                value={description}
                required
                placeholder='Some interesting description.'
                onChange={(e, {value}) => setDescription(value)}
              />
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          <FormIntro survey={survey} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

const DependencyControl = ({surveyField, index, surveyFields, setNewDependency, refresh}) => {
  const [questions, setQuestions] = useState([]);
  const [surveyFieldIndex, setSurveyFieldIndex] = useState(surveyField.dependency.survey_field_id);
  const [dependencyValue, setDependencyValue] = useState(surveyField.dependency.value);
  const [typeDependency, setTypeDependency] = useState(surveyField.dependency.value === "" ? 1 : 2);

  useEffect(() => {
    setNewDependency({ "survey_field_id": surveyFieldIndex, "value": dependencyValue });
  }, [surveyFieldIndex, typeDependency, dependencyValue])

  useEffect(() => {
    setSurveyFieldIndex(surveyField.dependency.survey_field_id);
    setDependencyValue(surveyField.dependency.value);
    setTypeDependency(surveyField.dependency.value === "" ? 1 : 2);

    let surveyQuestions = [];
    for(let i=0; i<surveyFields.length; i++) {
      if(index > i && surveyFields[i].title && surveyFields[i].dependency.survey_field_id === "") {
        let text = "Question " + (i+1) +": " + surveyFields[i].title;
        surveyQuestions.push({
          key: i,
          text: text,
          value: i
        })
      }
    }
    setQuestions(surveyQuestions);

  }, [refresh])

  return (
    <>
    { questions.length > 0 ?
        <Form.Dropdown
          placeholder='Select a question'
          fluid
          clearable
          label='Dependency'
          selection
          closeOnBlur={false}
          options={questions}
          onChange={(e, {value}) => setSurveyFieldIndex(value)}
          value={surveyFieldIndex}
        />
      :
        null
    }
    { surveyFieldIndex === '' ?
        null
      :
          <Form.Field>
            <Checkbox radio label="Scan across answer(s) of the dependency question." checked={typeDependency === 1} onChange={() => {setDependencyValue(''); setTypeDependency(1)}} />
          <Form.Field>
          </Form.Field>
            <Checkbox radio label="If value of answer(s) equals to ..." checked={typeDependency === 2} onChange={() => setTypeDependency(2)} />
          </Form.Field>
    }
    { typeDependency === 2 ?
        <Form.Input placeholder="Enter a value of the dependency question that will trigger this question." value={dependencyValue} fluid onChange={(e, {name, value}) => setDependencyValue(value)}></Form.Input>
      :
        null
    }
    </>
  )
}

const FormInputFieldControl = ({ surveyField, setContent, refresh, index, delForm, moveUp, moveDown, surveyFields }) => {
  const [title, setTitle] = useState(surveyField.title);
  const [subtitle, setSubtitle] = useState(surveyField.subtitle);
  const [required, setRequired] = useState(surveyField.required);
  const [placeholder, setPlaceholder] = useState(surveyField.content.placeholder);
  const [dependency, setDependency] = useState(surveyField.dependency);

  useEffect(() => {
    setTitle(surveyField.title);
    setSubtitle(surveyField.subtitle);
    setRequired(surveyField.required);
    setDependency(surveyField.dependency);
    setPlaceholder(surveyField.content.placeholder);
  }, [refresh])

  const setNewDependency = (newDependency) => {
    setDependency(newDependency);
  }

  useEffect(() => {
    let newSurveyField = {...surveyField};
    newSurveyField.title = title;
    newSurveyField.subtitle = subtitle;
    newSurveyField.required = required;
    newSurveyField.dependency = dependency
    newSurveyField.content.placeholder = placeholder;

    setContent(newSurveyField);
  }, [title, subtitle, placeholder, required, dependency]);

  return (
    <Grid verticalAlign="top" stackable columns={2}>
      <Grid.Row>
        <Grid.Column width={8}>
          <Frame index={index} category={surveyField.category} delForm={delForm} moveUp={moveUp} moveDown={moveDown} />
          <Segment attached padded>
            <Form>
              <Form.Input
                label='Question title'
                value={title}
                required
                placeholder='A great question title.'
                onChange={(e, {value}) => setTitle(value)}
              />
              <Form.TextArea
                label='Description'
                value={subtitle}
                placeholder='A great question description.'
                onChange={(e, {value}) => setSubtitle(value)}
              />
              <Divider horizontal section>Content</Divider>
              <Form.Input
                label='Placeholder'
                value={placeholder}
                placeholder='A great placeholder.'
                onChange={(e, {value}) => setPlaceholder(value)}
              />
              <Divider horizontal section>Properties</Divider>
              <Form.Field>
                <Checkbox value={required} checked={required === 0 ? false : true} onClick={() => setRequired(required === 0 ? 1 : 0)} label="Required" />
              </Form.Field>
              <DependencyControl surveyField={surveyField} index={index} surveyFields={surveyFields} setNewDependency={setNewDependency} refresh={refresh} />
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          <FormInputField surveyField={surveyField} displayBorder={true} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

const FormInputTextareaControl = ({ surveyField, setContent, refresh, index, delForm, moveUp, moveDown, surveyFields }) => {
  const [title, setTitle] = useState(surveyField.title);
  const [subtitle, setSubtitle] = useState(surveyField.subtitle);
  const [required, setRequired] = useState(surveyField.required);
  const [placeholder, setPlaceholder] = useState(surveyField.content.placeholder);
  const [dependency, setDependency] = useState(surveyField.dependency);

  useEffect(() => {
    setTitle(surveyField.title);
    setSubtitle(surveyField.subtitle);
    setRequired(surveyField.required);
    setDependency(surveyField.dependency);
    setPlaceholder(surveyField.content.placeholder);
  }, [refresh])

  const setNewDependency = (newDependency) => {
    setDependency(newDependency);
  }

  useEffect(() => {
    let newSurveyField = {...surveyField};
    newSurveyField.title = title;
    newSurveyField.subtitle = subtitle;
    newSurveyField.required = required;
    newSurveyField.dependency = dependency
    newSurveyField.content.placeholder = placeholder;

    setContent(newSurveyField);
  }, [title, subtitle, placeholder, required, dependency]);

  return (
    <Grid verticalAlign="top" stackable columns={2}>
      <Grid.Row>
        <Grid.Column width={8}>
          <Frame index={index} category={surveyField.category} delForm={delForm} moveUp={moveUp} moveDown={moveDown} />
          <Segment attached padded>
            <Form>
              <Form.Input
                label='Question title'
                value={title}
                required
                placeholder='A great question title.'
                onChange={(e, {value}) => setTitle(value)}
              />
              <Form.TextArea
                label='Description'
                value={subtitle}
                placeholder='A great question description.'
                onChange={(e, {value}) => setSubtitle(value)}
              />
              <Divider horizontal section>Content</Divider>
              <Form.Input
                label='Placeholder'
                value={placeholder}
                placeholder='A great placeholder.'
                onChange={(e, {value}) => setPlaceholder(value)}
              />
              <Divider horizontal section>Properties</Divider>
              <Form.Field>
                <Checkbox value={required} checked={required === 0 ? false : true} onClick={() => setRequired(required === 0 ? 1 : 0)} label="Required" />
              </Form.Field>
              <DependencyControl surveyField={surveyField} index={index} surveyFields={surveyFields} setNewDependency={setNewDependency} refresh={refresh} />
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          <FormInputTextarea surveyField={surveyField} displayBorder={true} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

const FormInputNamesControl = ({ surveyField, setContent, refresh, index, delForm, moveUp, moveDown, surveyFields, program_id }) => {
  const [title, setTitle] = useState(surveyField.title);
  const [subtitle, setSubtitle] = useState(surveyField.subtitle);
  const [required, setRequired] = useState(surveyField.required);
  const [teams, setTeams] = useState(surveyField.content.teams);
  const [dependency, setDependency] = useState(surveyField.dependency);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if(loading) {
      Api.get('programs/' + program_id + '/teams')
      .then((res) => {
        let newOptions = [];
        let i=0;
        res.data.forEach(team => {
          newOptions.push({
            key: i,
            text: team.name,
            value: team.id
          });

          i++;
        })

        setOptions(newOptions);
      })
      .catch(error => {
        console.log(error);
      })

      setLoading(false);
    }
  }, [loading])

  useEffect(() => {
    setTitle(surveyField.title);
    setSubtitle(surveyField.subtitle);
    setRequired(surveyField.required);
    setDependency(surveyField.dependency);
    setTeams(surveyField.content.teams);
  }, [refresh])

  const setNewDependency = (newDependency) => {
    setDependency(newDependency);
  }

  useEffect(() => {
    let newSurveyField = {...surveyField};
    newSurveyField.title = title;
    newSurveyField.subtitle = subtitle;
    newSurveyField.required = required;
    newSurveyField.dependency = dependency
    newSurveyField.content.teams = teams;

    setContent(newSurveyField);
  }, [title, subtitle, teams, required, dependency]);

  return (
    <Grid verticalAlign="top" stackable columns={2}>
      <Grid.Row>
        <Grid.Column width={8}>
          <Frame index={index} category={surveyField.category} delForm={delForm} moveUp={moveUp} moveDown={moveDown} />
          <Segment attached padded loading={loading}>
            <Form>
              <Form.Input
                label='Question title'
                value={title}
                required
                placeholder='A great question title.'
                onChange={(e, {value}) => setTitle(value)}
              />
              <Form.TextArea
                label='Description'
                value={subtitle}
                placeholder='A great question description.'
                onChange={(e, {value}) => setSubtitle(value)}
              />
              <Divider horizontal section>Content</Divider>
              <Form.Dropdown label="Use the navigator below if you want to restrict the question to a subset of teams. If left blank, all the teams will be displayed." placeholder='' fluid multiple selection options={options} onChange={(e, {value}) => setTeams(value)} value={teams} />
              <Divider horizontal section>Properties</Divider>
              <Form.Field>
                <Checkbox value={required} checked={required === 0 ? false : true} onClick={() => setRequired(required === 0 ? 1 : 0)} label="Required" />
              </Form.Field>
              <DependencyControl surveyField={surveyField} index={index} surveyFields={surveyFields} setNewDependency={setNewDependency} refresh={refresh} />
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          <FormInputNames program_id={program_id} surveyField={surveyField} teams={teams} displayBorder={true} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

const FormInputCheckboxControl = ({ surveyField, setContent, refresh, index, delForm, moveUp, moveDown, surveyFields }) => {
  const [title, setTitle] = useState(surveyField.title);
  const [subtitle, setSubtitle] = useState(surveyField.subtitle);
  const [required, setRequired] = useState(surveyField.required);
  const [labels, setLabels] = useState(surveyField.content.labels);
  const [dependency, setDependency] = useState(surveyField.dependency);

  useEffect(() => {
    setTitle(surveyField.title);
    setSubtitle(surveyField.subtitle);
    setRequired(surveyField.required);
    setDependency(surveyField.dependency);
    setLabels(surveyField.content.labels);
  }, [refresh])

  const setNewDependency = (newDependency) => {
    setDependency(newDependency);
  }

  useEffect(() => {
    let newSurveyField = {...surveyField};
    newSurveyField.title = title;
    newSurveyField.subtitle = subtitle;
    newSurveyField.required = required;
    newSurveyField.dependency = dependency
    newSurveyField.content.labels = labels;

    setContent(newSurveyField);
  }, [title, subtitle, labels, required, dependency]);

  const handleLabel = (index, value) => {
    let newLabels = [...labels];
    newLabels[index] = value;
    setLabels(newLabels);
  }

  const addLabel = () => {
    let newLabels = [...labels];
    newLabels.push('');
    setLabels(newLabels);
  }

  const delLabel = (index) => {
    let newLabels = [...labels];
    newLabels.splice(index, 1);
    setLabels(newLabels);
  }

  return (
    <Grid verticalAlign="top" stackable columns={2}>
      <Grid.Row>
        <Grid.Column width={8}>
          <Frame index={index} category={surveyField.category} delForm={delForm} moveUp={moveUp} moveDown={moveDown} />
          <Segment attached padded>
            <Form>
              <Form.Input
                label='Question title'
                placeholder='A great question title.'
                value={title}
                required
                onChange={(e, {value}) => setTitle(value)}
              />
              <Form.TextArea
                label='Description'
                value={subtitle}
                placeholder='A great question description.'
                onChange={(e, {value}) => setSubtitle(value)}
              />
              <Divider horizontal section>Content</Divider>
              { labels.map((label, i) => {
                  return (
                    <Form.Group inline key={i}>
                      <Form.Input label="Label" value={label} placeholder="A label" onChange={(e, {value}) => {handleLabel(i, value)}} />
                      <Form.Button icon="trash" onClick={() => {delLabel(i)}} />
                    </Form.Group>
                  )
                })
              }
              <Form.Button icon="plus" onClick={addLabel} />
              <Divider horizontal section>Properties</Divider>
              <Form.Field>
                <Checkbox value={required} checked={required === 0 ? false : true} onClick={() => setRequired(required === 0 ? 1 : 0)} label="Required" />
              </Form.Field>
              <DependencyControl surveyField={surveyField} index={index} surveyFields={surveyFields} setNewDependency={setNewDependency} refresh={refresh} />
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          <FormInputCheckbox surveyField={surveyField} displayBorder={true} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

const FormInputRadioControl = ({ surveyField, setContent, refresh, index, delForm, moveUp, moveDown, surveyFields }) => {
  const [title, setTitle] = useState(surveyField.title);
  const [subtitle, setSubtitle] = useState(surveyField.subtitle);
  const [required, setRequired] = useState(surveyField.required);
  const [labels, setLabels] = useState(surveyField.content.labels);
  const [dependency, setDependency] = useState(surveyField.dependency);

  useEffect(() => {
    setTitle(surveyField.title);
    setSubtitle(surveyField.subtitle);
    setRequired(surveyField.required);
    setDependency(surveyField.dependency);
    setLabels(surveyField.content.labels);
  }, [refresh])

  const setNewDependency = (newDependency) => {
    setDependency(newDependency);
  }

  useEffect(() => {
    let newSurveyField = {...surveyField};
    newSurveyField.title = title;
    newSurveyField.subtitle = subtitle;
    newSurveyField.required = required;
    newSurveyField.dependency = dependency
    newSurveyField.content.labels = labels;

    setContent(newSurveyField);
  }, [title, subtitle, labels, required, dependency]);

  const handleLabel = (index, value) => {
    let newLabels = [...labels];
    newLabels[index] = value;
    setLabels(newLabels);
  }

  const addLabel = () => {
    let newLabels = [...labels];
    newLabels.push('');
    setLabels(newLabels);
  }

  const delLabel = (index) => {
    let newLabels = [...labels];
    newLabels.splice(index, 1);
    setLabels(newLabels);
  }

  return (
    <Grid verticalAlign="top" stackable columns={2}>
      <Grid.Row>
        <Grid.Column width={8}>
          <Frame index={index} category={surveyField.category} delForm={delForm} moveUp={moveUp} moveDown={moveDown} />
          <Segment attached padded>
            <Form>
              <Form.Input
                label='Question title'
                placeholder='A great question title.'
                value={title}
                required
                onChange={(e, {value}) => setTitle(value)}
              />
              <Form.TextArea
                label='Description'
                value={subtitle}
                placeholder='A great question description.'
                onChange={(e, {value}) => setSubtitle(value)}
              />
              <Divider horizontal section>Content</Divider>
              { labels.map((label, i) => {
                  return (
                    <Form.Group inline key={i}>
                      <Form.Input label="Label" value={label} placeholder="A label" onChange={(e, {value}) => {handleLabel(i, value)}} />
                      <Form.Button icon="trash" onClick={() => {delLabel(i)}} />
                    </Form.Group>
                  )
                })
              }
              <Form.Button icon="plus" onClick={addLabel} />
              <Divider horizontal fitted>Properties</Divider>
              <Form.Field>
                <Checkbox value={required} checked={required === 0 ? false : true} onClick={() => setRequired(required === 0 ? 1 : 0)} label="Required" />
              </Form.Field>
              <DependencyControl surveyField={surveyField} index={index} surveyFields={surveyFields} setNewDependency={setNewDependency} refresh={refresh} />
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          <FormInputRadio surveyField={surveyField} displayBorder={true} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

const FormInputSliderControl = ({ surveyField, setContent, refresh, index, delForm, moveUp, moveDown, surveyFields }) => {
  const [title, setTitle] = useState(surveyField.title);
  const [subtitle, setSubtitle] = useState(surveyField.subtitle);
  const [required, setRequired] = useState(surveyField.required);
  const [min, setMin] = useState(surveyField.content.min);
  const [textMin, setTextMin] = useState(surveyField.content.textMin);
  const [max, setMax] = useState(surveyField.content.max);
  const [textMax, setTextMax] = useState(surveyField.content.textMax);
  const [step, setStep] = useState(surveyField.content.step);
  const [dependency, setDependency] = useState(surveyField.dependency);

  useEffect(() => {
    setTitle(surveyField.title);
    setSubtitle(surveyField.subtitle);
    setRequired(surveyField.required);
    setDependency(surveyField.dependency);
    setMin(surveyField.content.min);
    setMax(surveyField.content.max);
    setStep(surveyField.content.step);
  }, [refresh])

  const setNewDependency = (newDependency) => {
    setDependency(newDependency);
  }

  useEffect(() => {
    let newSurveyField = {...surveyField};
    newSurveyField.title = title;
    newSurveyField.subtitle = subtitle;
    newSurveyField.required = required;
    newSurveyField.dependency = dependency;
    newSurveyField.content.min = min;
    newSurveyField.content.textMin = textMin;
    newSurveyField.content.max = max;
    newSurveyField.content.textMax = textMax;
    newSurveyField.content.step = step;

    setContent(newSurveyField);
  }, [title, subtitle, min, textMin, max, textMax, step, required, dependency]);

  const isInt = (value) => {
    const x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
  }

  const checkValue = (value) => {
    if(isInt(value)) {
      return parseInt(value);
    } else {
      return "";
    }
  }

  return (
    <Grid verticalAlign="top" stackable columns={2}>
      <Grid.Row>
        <Grid.Column width={8}>
          <Frame index={index} category={surveyField.category} delForm={delForm} moveUp={moveUp} moveDown={moveDown} />
          <Segment attached padded>
            <Form>
              <Form.Input
                label='Question title'
                placeholder='A great question title.'
                value={title}
                required
                onChange={(e, {value}) => setTitle(value)}
              />
              <Form.TextArea
                label='Description'
                value={subtitle}
                placeholder='A great question description.'
                onChange={(e, {value}) => setSubtitle(value)}
              />
              <Divider horizontal section>Content</Divider>
              <Form.Input
                label='Min'
                value={min}
                placeholder=''
                onChange={(e, {value}) => setMin(checkValue(value))}
              />
              <Form.Input
                label='Text min'
                value={textMin}
                placeholder=''
                onChange={(e, {value}) => setTextMin(value)}
              />
              <Form.Input
                label='Max'
                value={max}
                placeholder=''
                onChange={(e, {value}) => setMax(checkValue(value))}
              />
              <Form.Input
                label='Text max'
                value={textMax}
                placeholder=''
                onChange={(e, {value}) => setTextMax(value)}
              />
              <Form.Input
                label='Step'
                value={step}
                placeholder=''
                onChange={(e, {value}) => setStep(checkValue(value))}
              />
              <Divider horizontal fitted>Properties</Divider>
              <Form.Field>
                <Checkbox value={required} checked={required === 0 ? false : true} onClick={() => setRequired(required === 0 ? 1 : 0)} label="Required" />
              </Form.Field>
              <DependencyControl surveyField={surveyField} index={index} surveyFields={surveyFields} setNewDependency={setNewDependency} refresh={refresh} />
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          <FormInputSlider surveyField={surveyField} displayBorder={true} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

const FormInputDateControl = ({ surveyField, setContent, refresh, index, delForm, moveUp, moveDown, surveyFields }) => {
  const [title, setTitle] = useState(surveyField.title);
  const [subtitle, setSubtitle] = useState(surveyField.subtitle);
  const [required, setRequired] = useState(surveyField.required);
  const [dependency, setDependency] = useState(surveyField.dependency);
  const [maxDate, setMaxDate] = useState(surveyField.content.maxDate);
  const [minDate, setMinDate] = useState(surveyField.content.minDate);
  const [typeDate, setTypeDate] = useState(surveyField.content.typeDate);
  const [viewDate, setViewDate] = useState([]);
  const [formatDate, setFormatDate] = useState("yyyy-MM-DD");
  const [loading, setLoading] = useState(true);

  const options = [
    { key: 0, text: "Full date", value: 0 },
    { key: 1, text: "Months and days", value: 1 },
    { key: 2, text: "Only days", value: 2 },
    { key: 3, text: "Only months", value: 3 },
    { key: 4, text: "Only years", value: 4 }
  ];

  useEffect(() => {
    setTitle(surveyField.title);
    setSubtitle(surveyField.subtitle);
    setRequired(surveyField.required);
    setDependency(surveyField.dependency);
    setMaxDate(surveyField.content.maxDate);
    setMinDate(surveyField.content.minDate);
  }, [refresh])

  const setNewDependency = (newDependency) => {
    setDependency(newDependency);
  }

  const updateContent = () => {
    setLoading(false);
    let newSurveyField = {...surveyField};
    newSurveyField.title = title;
    newSurveyField.subtitle = subtitle;
    newSurveyField.required = required;
    newSurveyField.dependency = dependency;
    newSurveyField.content.maxDate = maxDate;
    newSurveyField.content.minDate = minDate;
    newSurveyField.content.typeDate = typeDate;

    setContent(newSurveyField);
  }

  useEffect(() => {
    switch(typeDate) {
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

    if(!loading) {
      setMaxDate(null);
      setMinDate(null);
    }

    updateContent();
  }, [typeDate])

  useEffect(() => {
    updateContent();
  }, [title, subtitle, maxDate, minDate, required, dependency]);

  return (
    <Grid verticalAlign="top" stackable columns={2}>
      <Grid.Row>
        <Grid.Column width={8}>
          <Frame index={index} category={surveyField.category} delForm={delForm} moveUp={moveUp} moveDown={moveDown} />
          <Segment attached padded>
            <Form>
              <Form.Input
                label='Question title'
                placeholder='A great question title.'
                value={title}
                required
                onChange={(e, {value}) => setTitle(value)}
              />
              <Form.TextArea
                label='Description'
                value={subtitle}
                placeholder='A great question description.'
                onChange={(e, {value}) => setSubtitle(value)}
              />
              <Divider horizontal section>Content</Divider>
              <Dropdown fluid selection options={options} value={typeDate} onChange={(e, {value}) => setTypeDate(value)} />
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Segment basic style={{paddingBottom: "0em"}}>
                  <MobileDatePicker
                    label="Start date"
                    views={viewDate}
                    value={minDate || null}
                    inputFormat={formatDate}
                    onChange={(value) => setMinDate(value)}
                    renderInput={(params) => <TextField {...params} />}
                    componentsProps={{
                      actionBar: {
                        actions: ['accept', 'clear'],
                      },
                    }}
                  />
                </Segment>
                <Segment basic>
                  <MobileDatePicker
                    label="End date"
                    views={viewDate}
                    value={maxDate || null}
                    inputFormat={formatDate}
                    minDate={minDate}
                    onChange={(value) => setMaxDate(value)}
                    renderInput={(params) => <TextField {...params} />}
                    componentsProps={{
                      actionBar: {
                        actions: ['accept', 'clear'],
                      },
                    }}
                  />
                </Segment>
              </LocalizationProvider>
              <Divider horizontal fitted style={{paddingBottom: "2em"}}>Properties</Divider>
              <Form.Field>
                <Checkbox value={required} checked={required === 0 ? false : true} onClick={() => setRequired(required === 0 ? 1 : 0)} label="Required" />
              </Form.Field>
              <DependencyControl surveyField={surveyField} index={index} surveyFields={surveyFields} setNewDependency={setNewDependency} refresh={refresh} />
            </Form>
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          <FormInputDate surveyField={surveyField} displayBorder={true} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export { FormSelect, FormIntroControl, FormInputFieldControl, FormInputCheckboxControl, FormInputRadioControl, FormInputTextareaControl, FormInputNamesControl, FormInputSliderControl, FormInputDateControl }
