import React from 'react';
import QuestionType from 'src/wizard/question_types/QuestionType';
import classnames from 'classnames';
import { withWizardStateContext } from 'src/wizard/WizardStateContext';
import { withClassSet } from 'src/wizard/lib/classSetHelpers';
import { questionIsQualified } from 'src/wizard/lib/wizardHelpers';
import builtinQuestionTypes from 'src/wizard/question_types/WizardQuestionTypes';

class GroupType extends QuestionType {
  constructor(props) {
    super(props);

    this.state = {
      value: {},
      isValid: false,
      validate: false
    };

    this.questionRefs = {};

    this.onChangeSubQuestion = this.onChangeSubQuestion.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  // Overload
  isValid() {
    let isValid = true;
    for(const questionName in this.questionRefs) {
      if(this.questionRefs[questionName]) {
        isValid = isValid && this.questionRefs[questionName].isValid();
      }
    }

    return isValid;
  }

  // Overload
  getValidatedValue() {
    const values = {};
    for(const questionName in this.questionRefs) {
      if(this.questionRefs[questionName]) {
        values[questionName] = this.questionRefs[questionName].getValidatedValue();
      }
    }

    return values;
  }

  onChangeSubQuestion(changedValues) {
    this.props.onChange(this.props.question.name, this.getValidatedValue(), false); // Force a false value for `shouldProceed` param
  }

  onNext() {
    const isValid = this.isValid();

    if(isValid) {
      this.props.onChange(this.props.question.name, this.getValidatedValue(), true);
    } else {
      this.setState({ validate: true, isValid });
    }
  }

  renderQuestions() {
    const questions = [];
    const wizardState = this.props.wizardStateContext.state;

    const defaults = {
      values: wizardState.values && wizardState.values[this.props.question.name] ? wizardState.values[this.props.question.name] : null,
      potential: wizardState.potential && wizardState.potential.values && wizardState.potential.values[this.props.question.name] ? wizardState.potential.values[this.props.question.name] : null
    };

    const accumulated = {
      values: { ...wizardState.values, ...(wizardState.potential ? wizardState.potential.values : {}) },
      calculations: { ...wizardState.calculations, ...(wizardState.potential ? wizardState.potential.calculations : {}) }
    }

    let isFirst = true;
    for(const subquestion of this.props.question.questions) {
      if(questionIsQualified(subquestion, this.props.wizardStateContext.context, accumulated.values, accumulated.calculations, this.props.wizardStateContext.debug)) {
        const Question = builtinQuestionTypes.getComponentForTypeName(subquestion.type);
        const defaultValue = defaults.values || defaults.potential ? (defaults.values || defaults.potential)[subquestion.name] : null;
        questions.push(
          <div className={classnames('wizard-grouped-question', this.props.customClass.groupedQuestion)} key={subquestion.name}>
            <Question question={subquestion} onChange={this.onChangeSubQuestion} onEnterKey={this.onNext} defaultValue={defaultValue}
              isGrouped={true} focusOnMount={isFirst} validate={this.state.validate} ref={c => this.questionRefs[subquestion.name] = c} />
          </div>
        );
      }
      isFirst = false;
    }

    return questions;
  }

  render() {
    return (
      <div className={classnames('wizard-group-type', this.props.customClass.groupType)}>
        {this.renderQuestions()}
        <div className={classnames('wizard-group-cta-wrapper', this.props.customClass.groupCTAWrapper)}>
          <div className={classnames('wizard-next-button', this.props.customClass.nextButton)} onClick={this.onNext}>{this.props.question.next_button || 'Next'}</div>
        </div>
      </div>
    );
  }
}

const classSet = ['groupType', 'groupCTAWrapper', 'groupedQuestion', 'nextButton'];

export default withWizardStateContext(withClassSet(GroupType, classSet));
