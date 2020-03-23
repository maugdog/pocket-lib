import React from 'react';
import QuestionType from 'src/wizard/question_types/QuestionType';
import classnames from 'classnames';
import memoize from 'memoizee';
import { withWizardStateContext } from 'src/wizard/WizardStateContext';
import { withClassSet } from 'src/wizard/lib/classSetHelpers';
import truncate from 'lodash.truncate';

class TextType extends QuestionType {
  constructor(props) {
    super(props);

    this.input = React.createRef();
    this.validateValue = memoize(this.validateValue);
    this.onChangeValue = this.onChangeValue.bind(this);

    const defaultVal = props.defaultValue || props.question.default ? props.defaultValue || props.question.default : '';
    this.state = {
      value: defaultVal,
      isValid: this.validateValue(defaultVal)
    };
  }

  componentDidMount() {
    // Focus on the input on component mount, if requested
    if(this.props.focusOnMount && this.input.current) { this.input.current.focus(); }
  }

  validateValue(value) {
    if(this.props.question.required) {
      if(this.props.question.minLength) {
        return value && value.length >= this.props.question.minLength;
      }
      return Boolean(value);
    } else {
      if(this.props.question.minLength) {
        return value && value.length >= this.props.question.minLength;
      }
      return true;
    }
  }

  onChangeValue(event) {
    const value = this.props.question.maxLength ? truncate(event.target.value, { length: this.props.question.maxLength, omission: '' }) : event.target.value;
    this.setState({ value, isValid: this.validateValue(value) }, () => {
      this.props.onChange(this.props.question.name, this.state.value, false);
    });
  }

  render() {
    const question = this.props.question;
    return (
      <div className={classnames('wizard-text-type', this.props.customClass.textType)}>
        <label htmlFor={question.name} className={classnames('wizard-input-label', this.props.customClass.inputLabel, { invalid: this.props.validate && !this.state.isValid })}>{question.title}</label>
        <input name={question.name} id={question.name} placeholder={question.placeholder ? question.placeholder : null} value={this.state.value} onChange={this.onChangeValue} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.input} />
      </div>
    );
  }
}

const classSet = ['textType', 'input', 'inputLabel'];

export default withWizardStateContext(withClassSet(TextType, classSet));
