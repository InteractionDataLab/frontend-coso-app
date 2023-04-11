import { ResponsiveChord } from '@nivo/chord'
import Api from "../../Api"
import { useState, useEffect} from 'react'
import {DatavizCardSplit} from "../DatavizCards"
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const Chords = ({keys, matrix}) => (
  <ResponsiveChord
      matrix={matrix}
      keys={keys}
      margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
      valueFormat=".2f"
      padAngle={0.02}
      innerRadiusRatio={0.96}
      innerRadiusOffset={0.02}
      arcOpacity={1}
      arcBorderWidth={1}
      arcBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
      ribbonOpacity={0.5}
      ribbonBorderWidth={1}
      ribbonBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
      enableLabel={false}
      label="id"
      labelOffset={12}
      labelRotation={-90}
      labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1 ] ] }}
      colors={{ scheme: 'nivo' }}
      isInteractive={true}
      arcHoverOpacity={1}
      arcHoverOthersOpacity={0.25}
      ribbonHoverOpacity={0.75}
      ribbonHoverOthersOpacity={0.25}
      animate={true}
      motionStiffness={90}
      motionDamping={7}
  />
)

const SlackUserMentionsChords = () => {
  const [matrix, setMatrix] = useState([])
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (matrix.length === 0) {
      Api.get("slack/user_mentions")
      .then(res => {
        setKeys(res.data.mentions.keys)
        setMatrix(res.data.mentions.matrix)
        setLoading(false);
      })
    }
  }, [matrix])

  useEffect(() => {
    setMatrix([])
  }, [refresh])

  return (
    <DatavizCardSplit
      title="Slack Mentions"
      dataviz={<Chords keys={keys} matrix={matrix}/>}
      unique_id="SlackUserMentionChords"
      loading={loading}
      height={500}
    >
      This graph shows you who mentions who in your slack workspace. Each user is connected to the other users in the workspace by a line. The line thickness represents the number of mentions from one person to the other.
    </DatavizCardSplit>
  )
}

export default SlackUserMentionsChords;
