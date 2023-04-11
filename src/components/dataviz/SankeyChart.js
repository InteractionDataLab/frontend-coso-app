import { ResponsiveSankey } from '@nivo/sankey'

const SankeyChart = ({ data, colors }) => {
  const getColor = bar => colors[bar.id];

  return (
    <ResponsiveSankey
      data={data}
      margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
      align="justify"
      colors={getColor}
      nodeOpacity={1}
      sort="descending"
      nodeHoverOthersOpacity={0.35}
      nodeThickness={18}
      nodeSpacing={12}
      nodeBorderWidth={0}
      nodeBorderColor={{
          from: 'color',
          modifiers: [
              [
                  'darker',
                  0.8
              ]
          ]
      }}
      nodeBorderRadius={3}
      linkOpacity={0.5}
      linkHoverOthersOpacity={0.1}
      linkContract={1}
      enableLinkGradient={false}
      labelPosition="outside"
      labelOrientation="horizontal"
      labelPadding={6}
      labelTextColor={{
          from: 'color',
          modifiers: [
              [
                  'darker',
                  1
              ]
          ]
      }}
    />
  )
}

export default SankeyChart;
