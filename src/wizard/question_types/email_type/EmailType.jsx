import React from 'react';
import QuestionType from 'src/wizard/question_types/QuestionType';
import classnames from 'classnames';
import memoize from 'memoizee';
import { withWizardStateContext } from 'src/wizard/WizardStateContext';
import { withClassSet } from 'src/wizard/lib/classSetHelpers';
import { isEmail } from 'validator/lib/isEmail';

class EmailType extends QuestionType {
  constructor(props) {
    super(props);

    this.input = React.createRef();

    this.isValidValue = memoize(this.isValidValue);
    this.onChangeValue = this.onChangeValue.bind(this);

    const defaultValue = props.defaultValue || props.question.default ? props.defaultValue || props.question.default : '';
    this.state = {
      value: defaultValue,
      isValid: this.isValidValue(defaultValue)
    };
  }

  componentDidMount() {
    // Focus on the input on component mount, if requested
    if(this.props.focusOnMount && this.input.current) { this.input.current.focus(); }
  }

  isValidValue(value) {
    return (!this.props.question.required && !value) || isEmail(value);
  }

  onChangeValue(event) {
    const value = event.target.value;
    this.setState({ value, isValid: this.isValidValue(value) }, () => {
      this.props.onChange(this.props.question.name, this.getValidatedValue(), false);
    });
  }

  render() {
    const question = this.props.question;

    return (
      <div className={classnames('wizard-text-type', this.props.customClass.emailType)}>
        <label htmlFor={question.name} className={classnames('wizard-input-label', this.props.customClass.inputLabel, { invalid: this.props.validate && !this.state.isValid })}>{question.title}</label>
        <input type="email" name={question.name} id={question.name} placeholder={question.placeholder ? question.placeholder : null} value={this.state.value} onChange={this.onChangeValue} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.input} />
      </div>
    );
  }
}

const classSet = ['emailType', 'input', 'inputLabel'];

export default withWizardStateContext(withClassSet(EmailType, classSet));
