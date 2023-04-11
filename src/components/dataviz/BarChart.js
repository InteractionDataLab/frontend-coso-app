import { ResponsiveBar } from '@nivo/bar';

const BarChart = ({ data, keys, colors }) => {
  const getColor = bar => colors[bar.id];

  return (
    <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="answer"
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
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: 32
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    '10.0'
                ]
            ]
        }}
        enableLabel={true}
        legends={[
        ]}
    />
  )
}

export default BarChart;
