import React, { Component } from 'react';
import QuestionType from 'src/wizard/question_types/QuestionType';
import classnames from 'classnames';
import memoize from 'memoizee';
import { withWizardStateContext } from 'src/wizard/WizardStateContext';
import { withClassSet } from 'src/wizard/lib/classSetHelpers';

class NumericType extends QuestionType {
  constructor(props) {
    super(props);

    this.floatPattern = /^[+-]?\d+(\.\d+)?$/;
    this.partFloatPattern = /^[+-]?\d*\.?\d*$/;

    this.input = React.createRef();

    this.validateValue = memoize(this.validateValue);
    this.getValues = memoize(this.getValues);
    this.onChangeValue = this.onChangeValue.bind(this);

    const defaultValue = props.defaultValue != null ? props.defaultValue : (props.question.default != null ? props.question.default : '');
    const isValid = this.validateValue(defaultValue);
    this.state = {
      inputValue: defaultValue,
      value: isValid ? this.parsedValue(defaultValue) : null,
      isValid
    };
  }

  componentDidMount() {
    // Focus on the input on component mount, if requested
    if(this.props.focusOnMount && this.input.current) { this.input.current.focus(); }
  }

  parsedValue(value) {
    return this.props.question.float ? parseFloat(value) : parseInt(value, 10);
  }

  validateValue(value) {
    if(value) {
      const parsed = this.parsedValue(value);
      return !isNaN(parsed) && (!this.props.question.min || parsed >= this.props.question.min) && (!this.props.question.max || parsed <= this.props.question.max);
    }

    return !this.props.question.required;
  }

  getValues(rawValue) {
    let value = null;
    let parsed = null;
    if(this.props.question.float) {
      parsed = parseFloat(rawValue);
      if(this.floatPattern.test(rawValue)) {
        value = rawValue;
      } else if(this.partFloatPattern.test(rawValue)) {
        value = rawValue;
        parsed = isNaN(parsed) ? null : parsed;
      }
    } else {
      parsed = parseInt(rawValue, 10);
      if(!isNaN(parsed)) {
        value = parsed;
      } else if(!rawValue || rawValue == '-') {
        value = rawValue;
        parsed = null;
      }
    }

    return [value, parsed];
  }

  onChangeValue(event) {
    const [inputValue, value] = this.getValues(event.target.value);

    this.setState({ value, inputValue: inputValue == null ? this.state.inputValue : inputValue, isValid: this.validateValue(value) }, () => {
      this.props.onChange(this.props.question.name, this.state.value, false);
    });
  }

  render() {
    const question = this.props.question;

    return (
      <div className={classnames('wizard-text-type', this.props.customClass.numericType)}>
        <label htmlFor={question.name} className={classnames('wizard-input-label', this.props.customClass.inputLabel, { invalid: this.props.validate && !this.state.isValid })}>{question.title}</label>
        <input name={question.name} id={question.name} placeholder={question.placeholder ? question.placeholder : null} value={this.state.inputValue}
          onChange={this.onChangeValue} onKeyDown={this.onKeyDown} className={classnames('wizard-input', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.input} />
      </div>
    );
  }
}

const classSet = ['numericType', 'input', 'inputLabel'];

export default withWizardStateContext(withClassSet(NumericType, classSet));
