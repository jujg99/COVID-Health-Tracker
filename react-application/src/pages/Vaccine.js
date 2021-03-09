import React, { Component } from "react";
import {
  Button,
  Jumbotron,
  Container,
  Form,
  Col,
  Card,
  Row,
  Alert,
} from "react-bootstrap";
import axios from "axios";

//https://www.vaccinespotter.org/api/
//https://github.com/GUI/covid-vaccine-spotter

export default class Vaccine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zip: "",
      distance: Number.MAX_SAFE_INTEGER, // any distance
      locations: [],
      noZipAlert: false,
      noMatchAlert: false,
    };
  }

  findVaccine = () => {
    console.log(/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(this.state.zip));
    if (!/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(this.state.zip)) {
      this.setState({
        noZipAlert: true,
      });
      return;
    }
    this.setState({
      noZipAlert: false,
      noMatchAlert: false,
    });

    const data = { zip: this.state.zip, distance: this.state.distance };
    axios
      .post("http://localhost:8080/location/vaccine", data)
      .then((response) => {
        if (response.data == "No match") {
          this.setState({
            noMatchAlert: true,
            locations: [],
          });
        } else {
          this.setState({
            locations: response.data,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    return (
      <>
        <Jumbotron fluid style={{ background: "#20475A" }}>
          <Container style={{ color: "white" }}>
            <h1>Search for vaccines.</h1>
            Always be sure to first check
            <li>your states guidelines on eligibility</li>
            <li>the availability of a vaccine at each location</li>
            <li>and to schedule your appointment</li>
            <br />
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridZip">
                  <Form.Label>Zip</Form.Label>
                  <Form.Control
                    value={this.state.zip}
                    onChange={(e) => this.setState({ zip: e.target.value })}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>Within</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue="Any Distance"
                    onChange={(e) =>
                      this.setState({ distance: e.target.value })
                    }
                  >
                    <option value={Number.MAX_SAFE_INTEGER}>
                      Any Distance
                    </option>
                    <option value={5}>5 miles</option>
                    <option value={10}>10 miles</option>
                    <option value={25}>25 miles</option>
                    <option value={50}>50 miles</option>
                    <option value={100}>100 miles</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
            </Form>
            <Button
              style={{
                background: "white",
                color: "#20475A",
                border: "white",
              }}
              onClick={this.findVaccine}
            >
              Find Vaccines
            </Button>
          </Container>
        </Jumbotron>

        <Container fluid className="justify-content-center">
          <Row className="justify-content-md-center mb-5">
            <Alert
              show={this.state.noZipAlert}
              variant="danger"
              style={{ width: "80%" }}
            >
              Please enter a zip.
            </Alert>
            <Alert
              show={this.state.noMatchAlert}
              variant="danger"
              style={{ width: "80%" }}
            >
              There are no matches for this area.
            </Alert>
          </Row>
        </Container>

        <Container fluid className="justify-content-center">
          {this.state.locations.map((place) => (
            <Row className="justify-content-md-center mb-5">
              <Card
                style={{ width: "50%", background: "#408cb3", color: "white" }}
              >
                <Card.Header>
                  <h4>{place.provider_brand_name}</h4>
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    {place.address}, {place.city}, {place.state}
                  </Card.Title>
                  <Card.Text>
                    Appointments available:{" "}
                    {place.appointments_available ? <p>Yes</p> : <p>No</p>}
                  </Card.Text>
                  <Button
                    style={{
                      background: "#5340b3",
                      border: "#5340b3",
                    }}
                  >
                    <a style={{ color: "white" }} href={place.url}>
                      Visit {place.provider_brand_name}'s site
                    </a>
                  </Button>
                </Card.Body>
              </Card>
            </Row>
          ))}
        </Container>
      </>
    );
  }
}
