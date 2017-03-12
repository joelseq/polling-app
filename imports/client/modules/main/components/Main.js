import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Grid, Button } from 'react-bootstrap';

export default function () {
  return (
    <Grid>
      <div>
        <h1>Welcome to People Order Our Products Polling App!</h1>
        <p>
          Our app helps groups to come to a consensus
          on those tough choices in life like Panda or
          Lemongrass
        </p>
        <LinkContainer to="/create">
          <Button bsStyle="primary">Create Poll</Button>
        </LinkContainer>
      </div>
    </Grid>
  );
}
