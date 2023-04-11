import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  Grid,
  Menu,
  Segment,
  Header,
  Table,
  Button,
  Container,
  Icon,
  Accordion,
  List,
  Form
} from 'semantic-ui-react';

import { Context } from '../utils/Context';
import { Api } from '../Api';

const ExportData = ({program}) => {
  const context = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [valueExport, setValueExport] = useState(0);

  const options = [
    {
      id: 0,
      text: "Program information",
      value: 0
    },
    {
      id: 1,
      text: "Surveys responses",
      value: 1
    }
  ];

  const downloadData = () => {
    setLoading(true);

    if(valueExport === 0) {
      Api.get("/programs/" + context.programs[program].id + "/export_data")
      .then((res) => {
        const date = new Date().toISOString().slice(0, 10);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute("download", "program-" + program + "-" + date + ".csv");
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      })
    } else {
      Api.get("/programs/" + context.programs[program].id + "/export_data_survey")
      .then((res) => {
        const date = new Date().toISOString().slice(0, 10);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute("download", "surveys-" + program + "-" + date + ".csv");
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }

  return (
    <Segment basic loading={loading}>
      <Form>
        <Form.Dropdown label='Select the type of data you would like to export below.' fluid  selection options={options} onChange={(e, {value}) => setValueExport(value)} value={valueExport} />
        <Form.Button onClick={() => downloadData()}>Export</Form.Button>
      </Form>
    </Segment>
  )
}

export default ExportData;
