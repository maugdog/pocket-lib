import React, { useContext } from 'react';
import classnames from 'classnames';
import WizardStateContext from 'src/wizard/WizardStateContext';
import useClassSet from 'src/wizard/lib/classSetHelpers';

const WizardTitle = () => {
  const customClass = useClassSet('wizardTitle');
  const { currentQuestion } = useContext(WizardStateContext);

  return <div className={classnames('wizard-title', customClass)}>{currentQuestion.title}</div>;
};

export default WizardTitle;
