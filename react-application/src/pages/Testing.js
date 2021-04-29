import { Button, Row, Col, Container, Jumbotron, Alert } from "react-bootstrap";
import React, { Component } from "react";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import axios from "axios";

const mapStyles = {
  width: "90%",
  height: "90%",
};

export class Testing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPosition: {
        lat: 32.779167,
        lng: -96.808891,
      },
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      places: [],
      showAlert: false,
    };
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState((prevState) => ({
          currentPosition: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }));
      });
    }
  }

  findNearby = () => {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "denied") { // show alert if location permissions is off
        this.setState({
          showAlert: true,
        });
        return;
      } else {
        const pos = this.state.currentPosition;
        return axios
          .post("http://localhost:8080/location/testing", pos) // get testing locations
          .then((response) => {
            this.setState({ places: response.data.results });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  };

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  onClose = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  render() {
    return (
      <>
        <Jumbotron fluid style={{ background: "#20475A" }}>
          <Container style={{ color: "white" }}>
            <h1>Search for nearby testing locations.</h1>
            (Be sure to turn location permissions on.)
            <br />
            <Button
              style={{
                background: "white",
                color: "#20475A",
                border: "white",
              }}
              onClick={this.findNearby}
            >
              Find Testing Locations
            </Button>
          </Container>
        </Jumbotron>
        <Container fluid>
          <Row className="mt-5">
            <Col md={4}>
              <strong>Who should get tested?</strong>
              <li>People who have symptoms of COVID-19.</li>
              <li>
                People who have had close contact (within 6 feet for a total of
                15 minutes or more) with someone with confirmed COVID-19.
              </li>
              <li>
                People who have taken part in activities that put them at higher
                risk for COVID-19 because they cannot socially distance as
                needed, such as travel, attending large social or mass
                gatherings, or being in crowded indoor settings.
              </li>
              <li>
                People who have been asked or referred to get testing by their
                healthcare provider, or state ​health department.
              </li>
              <br />
              <strong>There are two types of tests,</strong>
              <li>A viral test tells you if you have a current infection.</li>
              <li>
                An antibody test may tell you if you've had a past infection.
              </li>
              <br />
              Learn more{" "}
              <a href=" https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/testing.html">
                here.
              </a>
            </Col>
            <Col md={8} style={{ height: "800px" }}>
              <Alert
                show={this.state.showAlert}
                variant="danger"
                style={{ width: "80%" }}
              >
                Please turn on location permissions.
              </Alert>
              <Map
                google={this.props.google}
                zoom={12}
                style={mapStyles}
                initialCenter={this.state.currentPosition}
                center={this.state.currentPosition}
              >
                {this.state.places.map((item) => (
                  <Marker
                    onClick={this.onMarkerClick}
                    position={item.geometry.location}
                    name={item.name}
                    address={item.formatted_address}
                  />
                ))}

                <InfoWindow
                  marker={this.state.activeMarker}
                  visible={this.state.showingInfoWindow}
                  onClose={this.onClose}
                >
                  <div>
                    <strong>{this.state.selectedPlace.name}</strong>
                    <p>{this.state.selectedPlace.address}</p>
                  </div>
                </InfoWindow>
              </Map>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API,
})(Testing);
