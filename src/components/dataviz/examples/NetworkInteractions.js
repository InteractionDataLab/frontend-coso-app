import React, { useEffect, useState, useContext } from 'react';
import { ResponsiveNetwork } from '@nivo/network';
import {
  Container,
  Segment,
  Form,
  Header
} from 'semantic-ui-react';

import { DatavizCardSplit } from "../../DatavizCards";

const NetworkInteractions = (props) => {
  const [listQuestions, setListQuestions] = useState([]);
  const [listAnswers, setListAnswers] = useState([]);
  const [selectAnswers, setSelectAnswers] = useState([]);

  useEffect(() => {
    let newListQuestions = [];
    let newListAnswers = [];
    let partTeams = {};
    let i = 0;

    Object.entries(props.answers).map(([surveyName, titles]) => {
      Object.entries(titles).map(([title, info_answers]) => {
        if(info_answers["category"] === "inputNames") {
          newListQuestions.push({
            key: i+1,
            text: surveyName + ": " + title,
            value: i
          });
          i++;

          let nodes = [];
          let links = [];

          info_answers["answers"].map((answer) => {
            let participantSrc = answer.participantName;
            if(participantSrc) {
              nodes.push(participantSrc);
            }

            answer.answer.map((participantName) => {
              let participantDst = participantName;
              if(participantDst) {
                nodes.push(participantDst);
              }

              links.push({"1": participantSrc, "2": participantDst});
            })
          })

          newListAnswers.push({"nodes": nodes, "links": links});
        }
      })
    })

    setListQuestions(newListQuestions);
    setListAnswers(newListAnswers);

    let newSelectAnswers = [];
    for(i=0; i<newListQuestions.length; i++) {
      newSelectAnswers.push(i);
    }
    setSelectAnswers(newSelectAnswers);
  }, [props])

  const MyResponsiveNetwork = () => {

    let data = {"nodes": [], "links": []};

    let nodes = [];
    let links = [];

    selectAnswers.map((answer) => {
      nodes = nodes.concat(listAnswers[answer].nodes);
      links = links.concat(listAnswers[answer].links);
    })


    let degree = {};

    links = [...new Set(links.map(JSON.stringify))].map(JSON.parse);
    links.map((link, i) => {
      if(!(link["1"] in degree)) {
        degree[link["1"]] = 3;
      }

      if(!(link["2"] in degree)) {
        degree[link["2"]] = 3;
      }
      degree[link["2"]] += 1;

      data.links.push({
        "source": link["1"],
        "target": link["2"],
        "distance": 50
      })
    })

    nodes = [...new Set(nodes.map(JSON.stringify))].map(JSON.parse);
    nodes.map((participant, i) => {
      data.nodes.push({
        "id": participant,
        "height": 0,
        "size": 20,
        "color": props.colors[props.mapPartTeam[participant] % props.colors.length]
      })
    })

    return (
      <ResponsiveNetwork
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={function(e){return e.distance}}
        colors={{ scheme: 'nivo' }}
        centeringStrength={0.2}
        linkDistance={30}
        repulsivity={20}
        distanceMin={2.8}
        distanceMax={150}
        nodeSize={function(n){return degree[n.id] * 2.5}}
        activeNodeSize={function(n){return 1.5*n.size}}
        nodeColor={function(e){return e.color}}
        nodeBorderWidth={1}
        nodeBorderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.8
                ]
            ]
        }}
        linkThickness={function(n){return 2+2*n.target.data.height}}
        linkBlendMode="multiply"
        motionConfig="wobbly"
      />
    )
  }

  return (
    <>
    <Segment inverted attached="top">
      <Header as="h4">Use the navigator below to select the question(s) you want to visualize:</Header>
    </Segment>
    <Segment attached>
      <Form>
        <Form.Dropdown fluid multiple selection options={listQuestions} onChange={(e, {value}) => setSelectAnswers(value)} value={selectAnswers} />
      </Form>
      { selectAnswers.length === 0 ?
          null
        :
          <DatavizCardSplit
            title="Network of interactions between participants"
            dataviz={<MyResponsiveNetwork />}
            unique_id="Network"
          >
            <Header as="h4" style={{textAlign: "justify", textJustify: "auto"}}>The network is reconstructed using the interaction data from the surveys, including questions about who participants worked with, sought advice from, and knew before.</Header>
          </DatavizCardSplit>
      }
    </Segment>
    </>
  )
}

export default NetworkInteractions;
