import { ResponsivePie } from '@nivo/pie'
import Api from "../../Api"
import {useContext, useState, useEffect} from 'react'
import {UserContext} from "../../utils/UserContext"
import {DatavizCardFull} from "../DatavizCards"
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const Pie = ({data, keys}) => {
  const [slices, setSlices] = useState([])
  // {
  //   "id": "go",
  //   "label": "go",
  //   "value": 95,
  //   "color": "hsl(307, 70%, 50%)"
  // }


  //
  function filterUser(user) {
    const tmp = []
    if (data[user]) {
      for (const [key, value] of Object.entries(data[user].emojis)) {
        tmp.push({
          "id": key,
          "label": key,
          "value": value,
          "color": "hsl(307, 70%, 50%)"
        })
        console.log(`${key}: ${value}`);
      }
    }
    setSlices(tmp)
    console.log(slices)
  }
  // console.log(data["marc"])
  useEffect(() => {
    filterUser("marc")
  })

  console.log(keys)
  if (data === []) {
    return (null)
  } else {
    return (
      <ResponsivePie
        data={[]}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextColor="#333333"
        radialLabelsLinkColor={{ from: 'color' }}
        sliceLabelsSkipAngle={10}
        sliceLabelsTextColor="#333333"
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'ruby'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'c'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'go'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'python'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'scala'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'lisp'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'elixir'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'javascript'
                },
                id: 'lines'
            }
        ]}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
    )
  }
}

const SlackReactionUsersPie = () => {
  const userContext = useContext(UserContext);
  const [data, setData] = useState({})
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (data.length === 0) {
      Api.get("slack/get_users_reaction_count")
      .then(res => {
        setData(res.data.reactions_users.data);
        setKeys(res.data.reactions_users.users);
        setLoading(false);
      })
      .catch(error => {
        console.log(error)
      })
    }
  }, [data])

  useEffect(() => {
    setData([])
  }, [refresh])

  return (
    <DatavizCardFull
      title="User reactions"
      dataviz={<Pie data={data} keys={keys}/>}
      unique_id="SlackUserMentionChords"
      loading={loading}
      height={500}
    >
      This graph shows you who mentions who in your slack workspace. Each user is connected to the other users in the workspace by a line. The line thickness represents the number of mentions from one person to the other.
    </DatavizCardFull>
  )
}

export default SlackReactionUsersPie;
