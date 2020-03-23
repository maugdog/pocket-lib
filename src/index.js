import Wizard2 from 'src/wizard/Wizard';
import tracker2 from 'src/tracker';
import Evaluator2 from 'src/Evaluator';
import base642 from 'src/base64';
import useTracker2 from 'hooks/useTracker';
import useScrollToTopOnNewLocation2 from 'hooks/useScrollToTopOnNewLocation';
import useQueryString2 from 'hooks/useQueryString';

export const Wizard = Wizard2;
export const tracker = tracker2;
export const Evaluator = Evaluator2;
export const base64 = base642;
export const useTracker = useTracker2;
export const useScrollToTopOnNewLocation = useScrollToTopOnNewLocation2;
export const useQueryString = useQueryString2;

export default {
  Wizard: Wizard,
  tracker: tracker,
  Evaluator: Evaluator,
  base64: base64,
  useTracker: useTracker,
  useScrollToTopOnNewLocation: useScrollToTopOnNewLocation,
  useQueryString: useQueryString
};
