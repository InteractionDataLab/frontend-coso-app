import React, {useState} from 'react';
import { Container,
  Icon,
  Grid,
  Header,
  Segment,
  Button,
  Modal
} from 'semantic-ui-react';

function DownloadDataviz(svgId) {
    //get svg element.
    var svg = document.getElementById(svgId).getElementsByTagName('svg');

    if (svg.length > 0) {
      //get svg source.
      var serializer = new XMLSerializer();
      var source = serializer.serializeToString(svg[0]);

      //add name spaces.
      if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
          source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
          source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }

      //add xml declaration
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

      //convert svg source to URI data scheme.
      // var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

      const blob = new Blob([source]);
      const element = document.createElement("a");
      element.download = svgId + ".svg";
      element.href = window.URL.createObjectURL(blob);
      element.click();
      element.remove();
    }
}

const DatavizCardSplit = ({height, loading = false, title, dataviz, text, children, unique_id}) => {
  const [open, setOpen] = useState(false);

  if(dataviz) {
    const datavizFullScreen = React.cloneElement(dataviz, { id: unique_id });

    if (!height) {
      height = 700;
    }

    const Content = () => {
      if(children === undefined) {
        return (
          <Grid stackable>
            <Grid.Column style={{height: height + "px"}}>
              {dataviz}
            </Grid.Column>
          </Grid>
        )
      } else {
        return (
          <Grid stackable columns={2}>
            <Grid.Column width={11} style={{height: height + "px"}}>
              {dataviz}
            </Grid.Column>
            <Grid.Column width={4} verticalAlign="middle" >
              {children}
            </Grid.Column>
            <Grid.Column width={1} />
          </Grid>
        )
      }
    }

    return (
      <Segment basic>
        <Segment attached="top">
          <Grid columns={2}>
            <Grid.Column verticalAlign="middle" width={12}>
              <Header>
                {title}
              </Header>
            </Grid.Column>
            <Grid.Column width={4} textAlign="right">
              <Icon size="large" color='blue' name="download" onClick={()=>{ setOpen(true); setTimeout(function() {DownloadDataviz(unique_id)}, 100);}}/>
              <Icon size="large" onClick={() => {setOpen(true)}} color='blue' name="expand"/>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment loading={loading} attached>
          <Content />
        </Segment>

        <Modal
          size="large"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        >
          <Modal.Header>
            <Grid columns={2}>
              <Grid.Column verticalAlign="middle" width={12}>
                <Header>
                  {title}
                </Header>
              </Grid.Column>
              <Grid.Column width={4} textAlign="right">
                <Button as="a" onClick={()=>{ DownloadDataviz(unique_id) }} icon color="blue">
                  <Icon size="large" name="download"/>
                </Button>
                <Button icon negative onClick={() => {setOpen(false)}}>
                  <Icon size="large" name="close"/>
                </Button>
              </Grid.Column>
            </Grid>
          </Modal.Header>
          <Modal.Content>
            <Container id={unique_id} style={{height:"600px"}}>
            {datavizFullScreen}
            </Container>
          </Modal.Content>
        </Modal>
      </Segment>
    )
  }
}

const DatavizCardFull = ({height, loading = false, title, dataviz, text, children, unique_id}) => {
  const [open, setOpen] = useState(false);

  if(dataviz) {
    const datavizFullScreen = React.cloneElement(dataviz, { id: unique_id });

    if (!height) {
      height = 500
    }

    return (
      <Segment basic>
        <Segment attached="top">
          <Grid columns={2}>
            <Grid.Column verticalAlign="middle" width={12}>
              <Header>
                {title}
              </Header>
            </Grid.Column>
            <Grid.Column width={4} textAlign="right">
              <Icon size="large" color='blue' name="download" onClick={()=>{ setOpen(true); setTimeout(function() {DownloadDataviz(unique_id)}, 100);}}/>
              <Icon size="large" onClick={() => {setOpen(true)}} color='blue' name="expand"/>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          {children}
        </Segment>
        <Segment loading={loading} attached style={{height: height + "px"}}>
          {dataviz}
        </Segment>
        <Modal
          size="large"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        >
          <Modal.Header>
            <Grid columns={2}>
              <Grid.Column verticalAlign="middle" width={12}>
                <Header>
                  {title}
                </Header>
              </Grid.Column>
              <Grid.Column width={4} textAlign="right">
                <Button as="a" onClick={()=>{ DownloadDataviz(unique_id) }} icon color="blue">
                  <Icon size="large" color='white' name="download"/>
                </Button>
                <Button icon negative onClick={() => {setOpen(false)}}>
                  <Icon size="large" color='white' name="close"/>
                </Button>
              </Grid.Column>
            </Grid>
          </Modal.Header>
          <Modal.Content>
            <Container id={unique_id} style={{height:"600px"}}>
              {datavizFullScreen}
            </Container>
          </Modal.Content>
        </Modal>
      </Segment>
    )
  }
}

export { DatavizCardSplit, DatavizCardFull };
