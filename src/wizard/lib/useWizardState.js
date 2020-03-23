import { useEffect, useState } from 'react';
import { nextIndices } from 'src/wizard/lib/wizardHelpers';
import satisfies from 'semver/functions/satisfies';

const baseState = {
  version: null,
  sectionIndex: 0,
  questionIndex: 0,
  values: {},
  calculations: {},
  potential: {}
};

export const useWizardState = (state, questionSet, context, debug) => {
  let defaultState = state;
  let compatible = !defaultState || satisfies(defaultState.version, questionSet.compatible);

  if(!defaultState || !compatible) {
    if(!compatible) {
      console.warn('Warning: Wizard state is not compatible with question set. State will be reset to the default.', defaultState.version, questionSet.compatible);
    }
    const [sectionIndex, questionIndex] = nextIndices(questionSet.questions, context, 0, null, {}, {}, debug);
    defaultState = { ...baseState, version: questionSet.version, sectionIndex, questionIndex };
  }

  const [activeState, setActiveState] = useState(defaultState);

  useEffect(() => {
    setActiveState(state && compatible ? state : defaultState);
  }, [state]);

  return activeState;
};

export default useWizardState;
