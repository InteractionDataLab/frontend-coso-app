import { useEffect, useState, useContext } from 'react';
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
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
  Button
 } from 'semantic-ui-react';
import jwt_decode from "jwt-decode";

import { Api } from '../Api';
import Survey from '../components/Survey';

const TakeSurvey = () => {
  const history = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [survey, setSurvey] = useState({});
  const [surveyFields, setSurveyFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState(null);

  useEffect(() => {
    if(loading) {
      try {
        const object = jwt_decode(searchParams.get("part"));
        setParams(object);
      } catch(error) {
        console.log("Bad token");
      }
    }
  }, [loading])

  useEffect(() => {
    if(params) {
      Api.get('programs/' + params.programId + '/surveys/' + params.surveyId)
     .then((res) => {
       res.data.survey_fields.sort((s1, s2) => s1.order > s2.order ? 1 : -1);
       setSurvey(res.data);
       setSurveyFields(res.data.survey_fields);
       setLoading(false);
     })
     .catch((error) => {
       console.log(error);
       setLoading(false);
     })
    }
  }, [params])

  const sendSurvey = async(responses) => {
    await Promise.all(
      Object.entries(responses).map(([key, value], i) => {
        const survey_datum = {
          "participant_id": params.participantId,
          "content": { "answer": value }
        }

        Api.post('programs/' + params.programId + '/surveys/' + params.surveyId + '/survey_fields/' + key + "/survey_data", {survey_datum})
        .catch((error) => {
          console.log(error);
        })
      })
    )

    history("/");
  }

  if(!loading) {
    return (
      <Grid stackable>
        <Grid.Column width={2} />
        <Grid.Column width={12}>
          <Segment basic loading={loading}>
            <Survey survey={survey} surveyFields={surveyFields} sendSurvey={sendSurvey} program_id={params.programId} />
          </Segment>
        </Grid.Column>
        <Grid.Column width={2} />
      </Grid>
    )
  }
}

export default TakeSurvey;
