import React from 'react';
import QuestionType from 'src/wizard/question_types/QuestionType';
import classnames from 'classnames';
import memoize from 'memoizee';
import { withWizardStateContext } from 'src/wizard/WizardStateContext';
import { withClassSet } from 'src/wizard/lib/classSetHelpers';
import truncate from 'lodash.truncate';

class ZipCodeType extends QuestionType {
  constructor(props) {
    super(props);

    this.zipPattern = /^[0-9]{5}$/;

    this.zip1 = React.createRef();
    this.zip2 = React.createRef();
    this.zip3 = React.createRef();
    this.zip4 = React.createRef();
    this.zip5 = React.createRef();

    this.validateValue = memoize(this.validateValue);

    let defaultValue = null;
    if(props.defaultValue) {
      defaultValue = props.defaultValue.split('');
    } else if(props.question.default) {
      defaultValue = props.question.default
    } else {
      defaultValue = ['','','','',''];
    };
    const isValid = this.validateValue(defaultValue.join(''));
    this.state = {
      value: isValid ? defaultValue.join('') : null,
      zipVal: defaultValue,
      isValid
    };
  }

  componentDidMount() {
    // Focus on the input on component mount, if requested
    if(this.props.focusOnMount && this.zip1.current) { this.zip1.current.focus(); }
  }

  validateValue(value) {
    return this.zipPattern.test(value) || (!this.props.question.required && value == '');
  }

  onChangeZip(valIndex, goTo) {
    return event => {
      const value = truncate(event.target.value.replace(/\D/g,''), { length: 1, omission: '' });
      const newSSNVal = [...this.state.zipVal];
      newSSNVal[valIndex] = value;
      const joinedVal = newSSNVal.join('');
      const validatedVal = this.validateValue(joinedVal) ? joinedVal : null;
      this.setState({ value: validatedVal, zipVal: newSSNVal, isValid: Boolean(validatedVal) }, () => {
        this.props.onChange(this.props.question.name, this.state.value, false);
        if(value.length == 1 && goTo && goTo.current) { goTo.current.focus(); }
      });
    };
  }

  render() {
    const question = this.props.question;
    return (
      <div className={classnames('wizard-zip-code-type', this.props.customClass.zipCodeType)}>
        <label htmlFor={question.name} className={classnames('wizard-input-label', this.props.customClass.inputLabel, { invalid: this.props.validate && !this.state.isValid })}>{question.title}</label>
        <input name={question.name} id={question.name} pattern="[0-9]*" placeholder={question.placeholder ? question.placeholder[0] : null}
          value={this.state.zipVal[0]} onChange={this.onChangeZip(0, this.zip2)} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input zip-code-1', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.zip1} />
        <input name={question.name} pattern="[0-9]*" placeholder={question.placeholder ? question.placeholder[1] : null}
          value={this.state.zipVal[1]} onChange={this.onChangeZip(1, this.zip3)} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input zip-code-2', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.zip2} />
        <input name={question.name} pattern="[0-9]*" placeholder={question.placeholder ? question.placeholder[2] : null}
          value={this.state.zipVal[2]} onChange={this.onChangeZip(2, this.zip4)} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input zip-code-3', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.zip3} />
        <input name={question.name} pattern="[0-9]*" placeholder={question.placeholder ? question.placeholder[3] : null}
          value={this.state.zipVal[3]} onChange={this.onChangeZip(3, this.zip5)} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input zip-code-3', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.zip4} />
        <input name={question.name} pattern="[0-9]*" placeholder={question.placeholder ? question.placeholder[4] : null}
          value={this.state.zipVal[4]} onChange={this.onChangeZip(4)} onKeyDown={this.onKeyDown}
          className={classnames('wizard-input zip-code-3', this.props.customClass.input, { invalid: this.props.validate && !this.state.isValid })} ref={this.zip5} />
      </div>
    );
  }
}

const classSet = ['zipCodeType', 'input', 'inputLabel'];

export default withWizardStateContext(withClassSet(ZipCodeType, classSet));
