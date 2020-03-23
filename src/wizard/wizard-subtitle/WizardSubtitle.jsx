import React, { useContext } from 'react';
import classnames from 'classnames';
import WizardStateContext from 'src/wizard/WizardStateContext';
import useClassSet from 'src/wizard/lib/classSetHelpers';

const WizardSubtitle = () => {
  const customClass = useClassSet('wizardSubtitle');
  const { currentQuestion } = useContext(WizardStateContext);

  return <div className={classnames('wizard-subtitle', customClass)}>{currentQuestion.subtitle}</div>;
};

export default WizardSubtitle;
