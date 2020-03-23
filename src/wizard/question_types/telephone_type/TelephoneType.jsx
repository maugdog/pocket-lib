import React from 'react';
import QuestionType from 'src/wizard/question_types/QuestionType';
import classnames from 'classnames';
import memoize from 'memoizee';
import { withWizardStateContext } from 'src/wizard/WizardStateContext';
import { withClassSet } from 'src/wizard/lib/classSetHelpers';
import truncate from 'lodash.truncate';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

class TelephoneType extends QuestionType {
  constructor(props) {
    super(props);

    this.tel1 = React.createRef();
    this.tel2 = React.createRef();
    this.tel3 = React.createRef();

    this.validateValue = memoize(this.validateValue);
    this.getPhoneNumberFromString = memoize(this.getPhoneNumberFromString);

    let defaultValue = null;
    if(props.defaultValue) {
      defaultValue = props.defaultValue.replace(/\s/g, '-').replace(/[\(\)]/g, '').split('-');
    } else if(props.question.default) {
      defaultValue = props.question.default
    } else {
      defaultValue = ['','',''];
    };
    const joinedDefaultValue = defaultValue.join('-');
    const isValid = this.validateValue(joinedDefaultValue);
    this.state = {
      value: isValid ? this.getPhoneNumberFromString(joinedDefaultValue).format('NATIONAL') : null,
      telVal: defaultValue,
      isValid
    };
  }

  componentDidMount() {
    if(this.props.focusOnMount && this.tel1.current) { this.tel1.current.focus(); }
  }

  getPhoneNumberFromString(value) {
    return parsePhoneNumberFromString(value, 'US');
  }

  validateValue(value) {
    const phoneNumber = this.getPhoneNumberFromString(value);
    return (phoneNumber && phoneNumber.isValid() && value.length == 12) || (!this.props.question.required && value == '--');
  }

  onChangeTel(length, valIndex, goTo) {
    return event => {
      const value = truncate(event.target.value.replace(/\D/g,''), { length, omission: '' });
      const newTelVal = [...this.state.telVal];
      newTelVal[valIndex] = value;
      const joinedVal = newTelVal.join('-');
      const phoneNumber = this.getPhoneNumberFromString(joinedVal);
      const isValid = phoneNumber && phoneNumber.isValid() && joinedVal.length == 12;
      this.setState({ value: isValid ? phoneNumber.format('NATIONAL') : null, telVal: newTelVal, isValid }, () => {
        this.props.onChange(this.props.question.name, this.state.value, false);
        if(value.length == length && goTo && goTo.current) { goTo.current.focus(); }
      });
    };
  }

  render() {
    const question = this.props.question;

    return (
      <div className={classnames('wizard-telephone-type', this.props.customClass.telType)}>
        <label htmlFor={question.name} className={classnames('wizard-input-label', this.props.customClass.inputLabel, { invalid: this.props.validate && !this.state.isValid })}>{question.title}</label>
        <input name={question.name} id={question.name} pattern="[0-9]*" placeholder={question.placeholder ? question.placeholder[0] : null}
          value={this.state.telVal[0]} onChange={this.onChangeTel(3, 0, this.tel2)} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input tel-1', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.tel1} />
        <span className="tel-dash">•</span>
        <input name={question.name} pattern="[0-9]*" placeholder={question.placeholder ? question.placeholder[1] : null}
          value={this.state.telVal[1]} onChange={this.onChangeTel(3, 1, this.tel3)} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input tel-2', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.tel2} />
        <span className="tel-dash">•</span>
        <input name={question.name} pattern="[0-9]*" placeholder={question.placeholder ? question.placeholder[2] : null}
          value={this.state.telVal[2]} onChange={this.onChangeTel(4, 2)} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input tel-3', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.tel3} />
      </div>
    );
  }
}

const classSet = ['telType', 'input', 'inputLabel'];

export default withWizardStateContext(withClassSet(TelephoneType, classSet));
