import { ResponsiveCalendar } from '@nivo/calendar'
import Api from "../../Api"
import {useState, useEffect} from 'react'
import {DatavizCardFull} from "../DatavizCards"
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const Calendar = ({data}) => {
  if (data === []) {
    return (null)
  } else {
    return (
      <ResponsiveCalendar
            data={data}
            from="2018-03-01"
            to="2020-07-12"
            emptyColor="#eeeeee"
            colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            yearSpacing={40}
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'row',
                    translateY: 36,
                    itemCount: 4,
                    itemWidth: 42,
                    itemHeight: 36,
                    itemsSpacing: 14,
                    itemDirection: 'right-to-left'
                }
            ]}
        />
    )
  }
}

const SlackMessagesCalendar = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (data.length === 0) {
      Api.get("slack/get_daily_message")
      .then(res => {
        setData(res.data.reactions);
        setLoading(false);
      })
    }
  }, [data])

  useEffect(() => {
    setData([])
  }, [refresh])

  return (
    <DatavizCardFull
      title="Slack Activity: Messages"
      dataviz={<Calendar data={data}/>}
      unique_id="SlackUserMentionChords"
      loading={loading}
      height={500}
    >
      This graph shows you who mentions who in your slack workspace. Each user is connected to the other users in the workspace by a line. The line thickness represents the number of mentions from one person to the other.
    </DatavizCardFull>
  )
}

export default SlackMessagesCalendar;
