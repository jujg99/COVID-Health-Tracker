import { Component } from "react";
import {
  Image,
  Row,
  Col,
  Container,
  Modal,
  Button,
  Jumbotron,
} from "react-bootstrap";
import Fade from "react-reveal/Fade";
import USAMap from "react-usa-map";
import axios from "axios";
import "../css/map.css";

//images
import northAmerica from "../images/northAmerica.png";
import southAmerica from "../images/southAmerica.png";
import europe from "../images/europe.png";
import asia from "../images/asia.png";
import africa from "../images/africa.png";
import australia from "../images/australia.png";

export default class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
      continents: [],
      images: new Map(),
      states: [],
      clickedState: {},
      stateModal: false,
    };
    this.state.images.set("North America", northAmerica);
    this.state.images.set("South America", southAmerica);
    this.state.images.set("Europe", europe);
    this.state.images.set("Asia", asia);
    this.state.images.set("Africa", africa);
    this.state.images.set("Australia/Oceania", australia);
  }

  componentDidMount() {
    Promise.all([
      axios.get("http://localhost:8080/data/continents"),
      axios.get("http://localhost:8080/data/states"),
    ])
      .then(([result1, result2]) => {
        this.setState({
          continents: result1.data,
          states: result2.data,
        });
        console.log(this.state.states);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  mapHandler = (event) => {
    const stateList = {
      AZ: "Arizona",
      AL: "Alabama",
      AK: "Alaska",
      AR: "Arkansas",
      CA: "California",
      CO: "Colorado",
      CT: "Connecticut",
      DC: "District of Columbia",
      DE: "Delaware",
      FL: "Florida",
      GA: "Georgia",
      HI: "Hawaii",
      ID: "Idaho",
      IL: "Illinois",
      IN: "Indiana",
      IA: "Iowa",
      KS: "Kansas",
      KY: "Kentucky",
      LA: "Louisiana",
      ME: "Maine",
      MD: "Maryland",
      MA: "Massachusetts",
      MI: "Michigan",
      MN: "Minnesota",
      MS: "Mississippi",
      MO: "Missouri",
      MT: "Montana",
      NE: "Nebraska",
      NV: "Nevada",
      NH: "New Hampshire",
      NJ: "New Jersey",
      NM: "New Mexico",
      NY: "New York",
      NC: "North Carolina",
      ND: "North Dakota",
      OH: "Ohio",
      OK: "Oklahoma",
      OR: "Oregon",
      PA: "Pennsylvania",
      RI: "Rhode Island",
      SC: "South Carolina",
      SD: "South Dakota",
      TN: "Tennessee",
      TX: "Texas",
      UT: "Utah",
      VT: "Vermont",
      VA: "Virginia",
      WA: "Washington",
      WV: "West Virginia",
      WI: "Wisconsin",
      WY: "Wyoming",
      AS: "American Samoa",
      GU: "Guam",
      MP: "Northern Mariana Islands",
      PR: "Puerto Rico",
      VI: "U.S. Virgin Islands",
      UM: "U.S. Minor Outlying Islands",
      DC: "District Of Columbia",
    };
    var abbr = event.target.dataset.name;
    console.log(abbr);
    var stateName = stateList[abbr];
    var stateData = {};
    this.state.states.forEach(function (item, index) {
      if (item.state === stateName) {
        stateData = item;
      }
    });
    this.setState({ clickedState: stateData, stateModal: true });
  };

  render() {
    const dataTitleStyle = {
      fontFamily: "Helvitica",
      fontSize: "2vw",
      color: "white",
    };
    const dataValueStyle = {
      fontFamily: "Helvitica",
      fontSize: "2vw",
      color: "white",
    };
    const dataItemStyle = {
      marginBottom: "50px",
      color: "white",
    };
    const continentStyle = {
      fontSize: "5vw",
      fontFamily: "Helvitica",
      marginBottom: "100px",
      color: "white",
    };
    return (
      <>
        <Jumbotron
          fluid
          style={{
            background: "#408cb3",
          }}
        >
          <Container style={{ color: "white", marginBottom: "200px", marginTop: "100px"}}>
            <Row className="justify-content-center">
              <USAMap onClick={this.mapHandler} />
            </Row>
          </Container>
          {this.state.continents.map((continent) => (
            <Container
              style={{ position: "relative", textAlign: "center", marginBottom: "100px"}}
              fluid
            >
              <Image
                src={this.state.images.get(continent.continent)}
                fluid
                style={{ width: "auto", height: "650px" }}
              />
              <Row
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Col>
                  <Fade bottom>
                    <Row className="justify-content-center">
                      <h1 style={continentStyle}>{continent.continent}</h1>
                    </Row>
                  </Fade>
                  <Fade bottom>
                    <Row style={dataItemStyle}>
                      <Col>
                        <Row className="justify-content-center">
                          <h2 style={dataTitleStyle}>Total Cases:</h2>
                        </Row>
                        <Row className="justify-content-center">
                          <h3 style={dataValueStyle}>{continent.cases}</h3>
                        </Row>
                      </Col>
                      <Col>
                        <Row className="justify-content-center">
                          <h2 style={dataTitleStyle}>Total Deaths:</h2>
                        </Row>
                        <Row className="justify-content-center">
                          <h3 style={dataValueStyle}>{continent.deaths}</h3>
                        </Row>
                      </Col>
                    </Row>
                  </Fade>
                  <Fade bottom>
                    <Row style={dataItemStyle}>
                      <Col>
                        <Row className="justify-content-center">
                          <h2 style={dataTitleStyle}>Total Recovered:</h2>
                        </Row>
                        <Row className="justify-content-center">
                          <h3 style={dataValueStyle}>{continent.recovered}</h3>
                        </Row>
                      </Col>
                    </Row>
                  </Fade>
                  <Fade bottom>
                    <Row style={{ width: "120%" }}>
                      <Col>
                        <Row className="justify-content-center">
                          <h2 style={dataTitleStyle}>Today's Cases:</h2>
                        </Row>
                        <Row className="justify-content-center">
                          <h3 style={dataValueStyle}>{continent.todayCases}</h3>
                        </Row>
                      </Col>
                      <Col>
                        <Row className="justify-content-center">
                          <h2 style={dataTitleStyle}>Today's Deaths:</h2>
                        </Row>
                        <Row className="justify-content-center">
                          <h3 style={dataValueStyle}>
                            {continent.todayDeaths}
                          </h3>
                        </Row>
                      </Col>
                    </Row>
                  </Fade>
                </Col>
              </Row>
            </Container>
          ))}
        </Jumbotron>
        <Modal
          show={this.state.stateModal}
          onHide={() => this.setState({ stateModal: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>{this.state.clickedState.state}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <Row className="justify-content-center">
                  <h5>Total Cases:</h5>
                </Row>
                <Row className="justify-content-center">
                  <h5>{this.state.clickedState.cases}</h5>
                </Row>
              </Col>
              <Col>
                <Row className="justify-content-center">
                  <h5>Total Deaths:</h5>
                </Row>
                <Row className="justify-content-center">
                  <h5>{this.state.clickedState.deaths}</h5>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row className="justify-content-center">
                  <h5>Total Recovered:</h5>
                </Row>
                <Row className="justify-content-center">
                  <h5>{this.state.clickedState.recovered}</h5>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row className="justify-content-center">
                  <h5>Today's Cases:</h5>
                </Row>
                <Row className="justify-content-center">
                  <h5>{this.state.clickedState.todayCases}</h5>
                </Row>
              </Col>
              <Col>
                <Row className="justify-content-center">
                  <h5>Today's Deaths:</h5>
                </Row>
                <Row className="justify-content-center">
                  <h5>{this.state.clickedState.todayDeaths}</h5>
                </Row>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              style={{ background: "gray", border: "gray" }}
              onClick={() => this.setState({ stateModal: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
