import React, { useEffect, useState, useContext } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import {
  Container,
  Segment,
  Form,
  Header,
  Statistic
} from 'semantic-ui-react';

import { DatavizCardSplit } from "../../DatavizCards";

const SurveyStats = (props) => {
  const [survey, setSurvey] = useState({});
  const [listSurveys, setListSurveys] = useState([]);
  const [selectSurvey, setSelectSurvey] = useState('');

  useEffect(() => {
    if(!props.loading) {
      let newListSurveys = [];

      Object.keys(props.surveyStats).map((surveyName, i) => {
        if(i === 0) {
          setSelectSurvey(surveyName);
        }

        newListSurveys.push({
          key: i,
          text: surveyName,
          value: surveyName
        })
      })

      setListSurveys(newListSurveys);
    }
  }, [props])

  const MyResponsiveBar = () => {
    if(selectSurvey !== '') {
      let keys = [];
      let colors = {};
      let participants = {};

      const statistics = props.surveyStats[selectSurvey];

      let data = Object.keys(statistics["answers"]).sort((t1, t2) => t1.toLowerCase() > t2.toLowerCase() ? 1 : -1).map((teamName, i) => {
        let entry = {"team": teamName};

        Object.keys(statistics["answers"][teamName]).sort((p1, p2) => statistics["answers"][teamName][p1] > statistics["answers"][teamName][p2] ? 1 : -1).map((participant, j) => {
          if(keys.indexOf(participant) === -1) {
            keys.push(participant);
          }

          participants[participant] = statistics["answers"][teamName][participant];

          if(statistics["answers"][teamName][participant] > 0) {
            entry[participant] = 1;
            colors[participant] = props.colors[i % props.colors.length];
          } else {
            entry[participant] = 1;
            colors[participant] = "#9c9b9a";
          }
        })

        return entry;
      })

      const getColor = bar => colors[bar.id];

      return (
        <ResponsiveBar
            data={data}
            keys={keys}
            indexBy="team"
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            padding={0.5}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={getColor}
            defs={[]}
            fill={[]}
            innerPadding={1}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 6,
                tickPadding: 5,
                tickRotation: 45,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Nb of participants',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            enableLabel={false}
            tooltip={( {id} ) => {
              return (
                <div style={{
                    background: 'white',
                    padding: '9px 12px',
                    border: '1px solid #ccc',
                }}>
                  <p>{id}</p>
                  <div>
                    <p>Nb answers: <strong>{participants[id]}</strong></p>
                  </div>
                </div>
              )
            }}
            legends={[
              {
                dataFrom: 'keys',
                data: ["Taken", "Not taken"].map((entry, i) => ({
                  color: entry === "Taken" ? "#61cdbb" : "#9c9b9a",
                  label: entry,
                })),
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 90,
                translateY: -45,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                        itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
        />
      )
    }
  }

  const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
      let total = 0
      let nb_part = 0;
      dataWithArc.forEach(datum => {
        if(datum.label !== "Missing participants") {
          nb_part += datum.value
        }

        total += datum.value;
      })

      return (
          <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                  fontSize: '52px',
                  fontWeight: 600
              }}
          >
            {Math.round(100*nb_part/total)}%
          </text>
      )
  }


  const MyResponsivePie = () => {
    if(selectSurvey !== '') {

      const statistics = props.surveyStats[selectSurvey];

      let data = Object.keys(statistics["teams"]).sort((t1, t2) => t1.toLowerCase() > t2.toLowerCase() ? 1 : -1).map((teamName, i) => {
        return {
          "id": teamName,
          "label": teamName,
          "value": statistics["teams"][teamName],
          "color": props.colors[i % props.colors.length]
        }
      })

      data.push({
        "id": "Missing participants",
        "label": "Missing participants",
        "value": statistics["participation"]["total"]-statistics["participation"]["participants"],
        "color": "#9c9b9a"
      })

      return (
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          colors={{ datum: "data.color" }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
              from: 'color',
              modifiers: [
                  [
                      'darker',
                      0.2
                  ]
              ]
          }}
          layers={['arcs', 'arcLabels', 'arcLinkLabels', CenteredMetric]}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
              from: 'color',
              modifiers: [
                  [
                      'darker',
                      20
                  ]
              ]
          }}
          defs={[]}
          fill={[]}
          legends={[]}
        />
      )
    }
  }

  return (
    <>
      <Segment inverted attached="top">
        <Header as="h4">Use the navigator below to select the survey you want to visualize:</Header>
      </Segment>
      <Segment attached>
        <Form>
          <Form.Dropdown fluid selection options={listSurveys} onChange={(e, {value}) => setSelectSurvey(value)} value={selectSurvey} />
        </Form>

        { selectSurvey === "" ?
            null
          :
            <>
            <DatavizCardSplit
              title="Survey statistics Chart"
              dataviz={<MyResponsiveBar />}
              unique_id="SurveyStats"
              loading={props.loading}
            >
              <Header as="h4" style={{textAlign: "justify", textJustify: "auto"}}>Survey statistics.</Header>
            </DatavizCardSplit>

            <DatavizCardSplit
              title="Survey statistics Pie"
              dataviz={<MyResponsivePie />}
              unique_id="SurveyStats"
              loading={props.loading}
            >
              <Header as="h4" style={{textAlign: "justify", textJustify: "auto"}}>Survey statistics.</Header>
            </DatavizCardSplit>
            </>
        }
      </Segment>
    </>
  )
}

export default SurveyStats;
