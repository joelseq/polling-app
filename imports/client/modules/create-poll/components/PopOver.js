import React, { Component } from 'react';
import {
  Row,
  Col,
  Panel,
  Grid,
  Button,
  Jumbotron,
	Popover,
  OverlayTrigger,
} from 'react-bootstrap';

import '../../../../ui/react-datetime.css'

const popoverHoverFocus = (
		<Popover id="popover-trigger-hover-focus" title="Vote Types">
				<strong>Weighted:</strong> Votes for options can have 
								weights ranging from 1 to 10 (both inclusive) <br />
				<strong>Unweighted:</strong> Votes for options are weighted equally
		</Popover>
);

export default class PopOver extends Component {
  render() {
    return (
      <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={popoverHoverFocus}>
        <Button
          className={"btn primary btn-circle"}
        >?</Button>
      </OverlayTrigger>
		);
	}
}

