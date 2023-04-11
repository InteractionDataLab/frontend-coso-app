import React, { useEffect, useState, useContext } from 'react';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import {
  Container,
  Segment,
  Form,
  Header
} from 'semantic-ui-react';

import { DatavizCardSplit } from "../../DatavizCards";

const ProgramOverview = (props) => {
  const [zoomedId, setZoomedId] = useState(null);

  const MyResponsiveCirclePacking = () => {
    let data = {
      "name": props.programName,
      "color": "#001f24",
      "children": []
    };

    props.teams.sort((t1, t2) => t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1).map((team, i) => {
      data.children.push({
        "name": team.name,
        "color": props.colors[i % props.colors.length],
        "children": [],
      });

      team.participants.map((participant, j) => {
        data.children[i].children.push({
          "name": participant.name,
          loc: 1
        });
      })
    })

    return (
      <ResponsiveCirclePacking
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        id="name"
        value="loc"
        colors={node => { return node.data.color; }}
        padding={10}
        enableLabels={false}
        borderWidth={3}
        inheritColorFromParent={true}
        childColor={{
            from: 'color',
            modifiers: [
                [
                    'brighter',
                    0.6
                ]
            ]
        }}
        defs={[
            {
                id: 'lines',
                type: 'patternLines',
                background: 'none',
                color: 'inherit',
                rotation: -45,
                lineWidth: 5,
                spacing: 7
            }
        ]}
        fill={[
            {
                match: {
                    depth: 1
                },
                id: 'lines'
            }
        ]}
        zoomedId={zoomedId}
        motionConfig="slow"
        onClick={node => { setZoomedId(zoomedId === node.id ? null : node.id); }}
    />
  )
  }

  return (
    <>
      <DatavizCardSplit
        title="Program overview"
        dataviz={<MyResponsiveCirclePacking />}
        unique_id="Overview"
      >
        <Header as="h4" style={{textAlign: "justify", textJustify: "auto"}}>Hierarchical view of the program based on the teams and participants.</Header>
      </DatavizCardSplit>
    </>
  )
}

export default ProgramOverview;
