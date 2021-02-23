import { Jumbotron, Container, Button, Card, Row, Col } from "react-bootstrap";
import covid from "../images/covid.jpg";
import covidTesting from "../images/covidtesting.jpg";
import covidVaccine from "../images/covidvaccine.jpg";

const Home = () => {
  return (
    <div>
      <Jumbotron fluid style={{ background: "#408cb3", height: "400px" }}>
        <Container style={{ color: "white" }}>
          <h1>COVID-19 Health Tracker</h1>
          <h5>Track your symptoms.</h5>
          <p>
            As a central hub for COVID-19 data, keep up with important news and
            statistics about the virus and vaccine while tracking your symptoms.
          </p>
          <Button
            href="/signup"
            size="lg"
            style={{
              background: "#5340b3",
              color: "white",
              border: "#202C42",
            }}
          >
            Signup
          </Button>{" "}
          <Button
            href="/login"
            size="lg"
            style={{
              background: "white",
              color: "#408cb3",
              border: "#8096A8",
            }}
          >
            Login
          </Button>
        </Container>
      </Jumbotron>

      <Container fluid>
        <Row className="justify-content-md-center">
          <Col md={4} style={{ paddingLeft: 100 }}>
            <Card style={{ background: "#40B3A0" }}>
              <Card.Img variant="top" src={covid} style={{ maxHeight: 260 }} />
              <Card.Body style={{ color: "white" }}>
                <Card.Title>COVID-19 Data</Card.Title>
                <Card.Text>Learn more about important COVID-19 data.</Card.Text>
                <Button
                  style={{
                    background: "white",
                    color: "#408cb3",
                    border: "#408cb3",
                  }}
                >
                  Data tracker
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} style={{ paddingLeft: 50, paddingRight: 50 }}>
            <Card style={{ background: "#408db3" }}>
              <Card.Img
                variant="top"
                src={covidTesting}
                style={{ maxHeight: 260 }}
              />
              <Card.Body style={{ color: "white" }}>
                <Card.Title>Testing</Card.Title>
                <Card.Text>
                  Find out more about testing and locations near you.
                </Card.Text>
                <Button
                  style={{
                    background: "white",
                    color: "#408cb3",
                    border: "#408cb3",
                  }}
                >
                  Learn More
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} style={{ paddingRight: 100 }}>
            <Card style={{ background: "#40B3A0" }}>
              <Card.Img
                variant="top"
                src={covidVaccine}
                style={{ maxHeight: 260 }}
              />
              <Card.Body style={{ color: "white" }}>
                <Card.Title>COVID-19 Vaccine</Card.Title>
                <Card.Text>
                  Stay up-to-date with information and data on the vaccine.
                </Card.Text>
                <Button
                  style={{
                    background: "white",
                    color: "#408cb3",
                    border: "#408cb3",
                  }}
                >
                  Learn More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <br />

      <Jumbotron fluid style={{ background: "#408cb3", height: "350px" }}>
        <Container style={{ color: "white" }}>
          <h2>Track Your Symptoms</h2>
          <h5>Stay on top of your health.</h5>
          <p>
            If you believe you've come in contact with COVID-19 or have tested
            postive, quarantine and log your symptoms daily.
          </p>
          <Button
            href="/profile"
            size="lg"
            style={{
              background: "white",
              color: "#408cb3",
              border: "#202C42",
            }}
          >
            Log your symptoms
          </Button>{" "}
        </Container>
      </Jumbotron>
    </div>
  );
};

export default Home;
