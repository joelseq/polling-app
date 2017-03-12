import React, { Component, PropTypes } from "react";
import {
  Row,
  Col,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';

export default class SearchInput extends Component {
  constructor(props){
    super(props);
  }
  getId() {
    return this.props.idPrefix + "search-input";
  }

  getItemsId() {
    return this.props.idPrefix + "items";
  }

  render() {
    return (
      <form >
        <div className="CreatePoll__add-option">
          <input
            ref="input"
            className="dropdown-search-input"
            id={this.getId()}
            value={this.props.value}
            placeholder={this.props.placeholder}
            role="combobox"
            aria-autocomplete="list"
            aria-owns={this.getItemsId()}
            onChange={this.props.onChange}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            onKeyDown={this.props.onKeyDown}/>

          <Button
            className="CreatePoll__add-button"
            onClick={this.props.addOption}
            bsStyle="success"
            type="submit"
          >
            Add Option
          </Button>
        </div>
      </form>
    )
  }
}

SearchInput.propTypes = {
  idPrefix: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  addOption: PropTypes.func
};
SearchInput.defaultProps = {
  value: "",
  placeholder: ""
};
