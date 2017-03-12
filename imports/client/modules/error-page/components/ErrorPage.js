import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import {
  Well,
  Col,
  Image,
  PageHeader,
} from 'react-bootstrap';

// Component for 404 page
export default class ErrorPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // renders error message for the user
  render() {
    return(
      <Col>
        <PageHeader className='text-center'>Sorry! Looks like you've found a page that doesn't exist.</PageHeader>
				<Image src={'http://i.imgur.com/gbDypc4.png'} responsive />
      </Col>
    );
  }
}
