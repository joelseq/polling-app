import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Grid, Button, Row, Col } from 'react-bootstrap';

export default function () {
  return (
    <div className="Main">
      <Grid>
        <Row>
          <Col md={8} mdOffset={2}>
            <h1 className="Main__landing-text">
              (finally) decide on where to eat with your squad
            </h1>
            <p className="Main__landing-subtext">
              and so much more.
            </p>
            <Row>
              <Col xs={6} xsOffset={3}>
                <LinkContainer to="/create">
                  <Button block className="Main__landing-button" bsStyle="primary">CREATE POLL</Button>
                </LinkContainer>
                <br/>
                <LinkContainer to="/createMoviePoll">
                  <Button block className="Main__landing-button" bsStyle="primary">CREATE MOVIE POLL</Button>
                </LinkContainer>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    </div>
  );
}
