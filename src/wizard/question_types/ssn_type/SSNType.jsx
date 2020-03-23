import React from 'react';
import QuestionType from 'src/wizard/question_types/QuestionType';
import classnames from 'classnames';
import memoize from 'memoizee';
import { withWizardStateContext } from 'src/wizard/WizardStateContext';
import { withClassSet } from 'src/wizard/lib/classSetHelpers';
import truncate from 'lodash.truncate';

class SSNType extends QuestionType {
  constructor(props) {
    super(props);

    this.ssnPattern = /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/;

    this.ssn1 = React.createRef();
    this.ssn2 = React.createRef();
    this.ssn3 = React.createRef();

    this.validateValue = memoize(this.validateValue);

    let defaultValue = null;
    if(props.defaultValue) {
      defaultValue = props.defaultValue.split('-');
    } else if(props.question.default) {
      defaultValue = props.question.default
    } else {
      defaultValue = ['','',''];
    };
    const isValid = this.validateValue(defaultValue.join('-'));
    this.state = {
      value: isValid ? defaultValue.join('-') : null,
      ssnVal: defaultValue,
      isValid
    };
  }

  componentDidMount() {
    // Focus on the input on component mount, if requested
    if(this.props.focusOnMount && this.ssn1.current) { this.ssn1.current.focus(); }
  }

  validateValue(value) {
    return this.ssnPattern.test(value) || (!this.props.question.required && value == '--');
  }

  onChangeSSN(length, valIndex, goTo) {
    return event => {
      const value = truncate(event.target.value.replace(/\D/g,''), { length, omission: '' });
      const newSSNVal = [...this.state.ssnVal];
      newSSNVal[valIndex] = value;
      const joinedVal = newSSNVal.join('-');
      const validatedVal = this.validateValue(joinedVal) ? joinedVal : null;
      this.setState({ value: validatedVal, ssnVal: newSSNVal, isValid: Boolean(validatedVal) }, () => {
        this.props.onChange(this.props.question.name, this.state.value, false);
        if(value.length == length && goTo && goTo.current) { goTo.current.focus(); }
      });
    };
  }

  render() {
    const question = this.props.question;
    return (
      <div className={classnames('wizard-ssn-type', this.props.customClass.ssnType)}>
        <label htmlFor={question.name} className={classnames('wizard-input-label', this.props.customClass.inputLabel, { invalid: this.props.validate && !this.state.isValid })}>{question.title}</label>
        <input name={question.name} id={question.name} pattern="[0-9]*" placeholder={question.placeholder ? question.placeholder[0] : null}
          value={this.state.ssnVal[0]} onChange={this.onChangeSSN(3, 0, this.ssn2)} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input ssn-1', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.ssn1} />
        <span className="ssn-dash">•</span>
        <input name={question.name} pattern="[0-9]*" placeholder={question.placeholder ? question.placeholder[1] : null}
          value={this.state.ssnVal[1]} onChange={this.onChangeSSN(2, 1, this.ssn3)} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input ssn-2', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.ssn2} />
        <span className="ssn-dash">•</span>
        <input name={question.name} pattern="[0-9]*" placeholder={question.placeholder ? question.placeholder[2] : null}
          value={this.state.ssnVal[2]} onChange={this.onChangeSSN(4, 2)} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input ssn-3', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.ssn3} />
      </div>
    );
  }
}

const classSet = ['ssnType', 'input', 'inputLabel'];

export default withWizardStateContext(withClassSet(SSNType, classSet));
