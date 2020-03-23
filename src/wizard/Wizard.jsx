import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import WizardStateContext from 'src/wizard/WizardStateContext';
import WizardTitle from 'src/wizard/wizard-title/WizardTitle';
import WizardSubtitle from 'src/wizard/wizard-subtitle/WizardSubtitle';
import builtinQuestionTypes from 'src/wizard/question_types/WizardQuestionTypes';
import { calculationsForValues, nextIndices } from 'src/wizard/lib/wizardHelpers';
import useWizardState from 'src/wizard/lib/useWizardState';

const Wizard = ({ questionSet, calculationSet, context, state, onReady, onChange, onComplete, classSet, debug }) => {
  const activeState = useWizardState(state, questionSet, context, debug);

  const questions = questionSet.questions;
  const currentSection = questions[activeState.sectionIndex];
  const currentQuestion = currentSection ? currentSection.questions[activeState.questionIndex] : null;

  useEffect(() => {
    if(onReady) { onReady(activeState); }
  }, []);

  const onQuestionChange = (questionName, newValue, shouldProceed) => {
    const values = { ...activeState.values, [questionName]: newValue };
    const calculations = calculationsForValues(calculationSet, values);

    if(shouldProceed) {
      const [sectionIndex, questionIndex] = nextIndices(questions, context, activeState.sectionIndex, activeState.questionIndex, values, calculations, debug);
      const newState = { ...activeState, sectionIndex, questionIndex, values, calculations, potential: {} };
      if(sectionIndex == null) {
        onComplete(newState.values, newState.calculations);
      } else {
        onChange(newState, true);
      }
    } else {
      onChange({
        ...activeState,
        potential: {
          values: {
            ...(activeState.potential.values ? activeState.potential.values : {}),
            [questionName]: newValue
          },
          calculations
        }
      }, false);
    }
  };

  const renderContent = () => {
    if(currentQuestion) {
      const Question = builtinQuestionTypes.getComponentForTypeName(currentQuestion.type);

      return (
        <div className={classnames('wizard-question', classSet && classSet.wizardQuestion)}>
          {currentQuestion.title ? <WizardTitle /> : null}
          {currentQuestion.subtitle ? <WizardSubtitle /> : null}
          <Question question={currentQuestion} onChange={onQuestionChange} />
        </div>
      );
    }

    return null;
  };

  return (
    <WizardStateContext.Provider value={{ questionSet, context, state: activeState, currentSection, currentQuestion, classSet, debug }}>
      <div className={classnames('wizard', classSet && classSet.wizard)}>
        {renderContent()}
      </div>
    </WizardStateContext.Provider>
  );
};

Wizard.propTypes = {
  questionSet: PropTypes.object.isRequired,
  calculationSet: PropTypes.array,
  context: PropTypes.number.isRequired,
  state: PropTypes.object,
  onReady: PropTypes.func,
  onChange: PropTypes.func,
  onComplete: PropTypes.func,
  classSet: PropTypes.object,
  debug: PropTypes.bool
};

export default Wizard;
