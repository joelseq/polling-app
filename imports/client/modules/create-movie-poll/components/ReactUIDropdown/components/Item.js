import React, { Component, PropTypes } from "react";
import {
  Grid,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  Radio,
  HelpBlock,
  Row,
  Col,
  Popover,
  OverlayTrigger,
	Media,
} from 'react-bootstrap';

export default class Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false
    }
  }

  getId() {
    return this.props.idPrefix + "item-" + this.props.id;
  }

  getClassName() {
    return `dropdown-item${this.state.focused ? " selected" : ""}`
  }

  hasImages() {
    return this.props.showImages && !!this.props.image;
  }

  hasSubtitle() {
    return !!this.props.subtitle;
  }

  setFocused(value) {
    this.setState({
      focused: !!value
    });
  }

  render() {
    return (
      <div
        className={this.getClassName()}
        id={this.getId()}
        hidden={this.props.selected}
        style={this.props.selected ? { display: "none"} : {}}
        role="option"
        tabIndex="-1"
        onMouseDown={this.props.onClick}
        onMouseMove={this.props.onHover}>
				<Media>
					<Media.Left align="middle">
            {this.hasImages()
            && <img
              className="dropdown-item-image"
              src={this.props.image}
              height={100}
              width={66}
              alt=""/>}
					</Media.Left>
					<Media.Body>
						<Media.Heading>
            {this.props.title}
            {this.hasSubtitle() && <p>{this.props.subTitle}</p>}
						</Media.Heading>
					</Media.Body>
				</Media>
        <Row className="itemRow">
          <Col md={2}>
          </Col>
          <Col md={4} className="dropdown-item-title">
          </Col>
        </Row>
      </div>
    )
  }
}

Item.propTypes = {
  idPrefix: PropTypes.string.isRequired,
  id: PropTypes.number,
  selected: PropTypes.bool,
  image: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  showImages: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired
};
Item.defaultProps = {
  selected: false,
  showImages: true
};
