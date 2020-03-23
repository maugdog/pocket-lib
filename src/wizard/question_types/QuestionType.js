import React, { Component } from 'react';
import PropTypes from 'prop-types';

class QuestionType extends Component {
  constructor(props) {
    super(props);

    // State should be overridden by subclass
    this.state = {
      value: null,
      isValid: true
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  isValid() {
    return this.state.isValid;
  }

  getValidatedValue() {
    return this.state.isValid ? this.state.value : null;
  }

  onKeyDown(event) {
    if(event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      if(this.props.onEnterKey) {
        this.props.onEnterKey(this);
      }
    }
  }
}

QuestionType.propTypes = {
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onEnterKey: PropTypes.func,
  defaultValue: PropTypes.any,
  isGrouped: PropTypes.bool,
  focusOnMount: PropTypes.bool,
  validate: PropTypes.bool
};

export default QuestionType;
