import React, { Component, useContext } from 'react';
import { isArray } from 'src/wizard/lib/utilities';
import WizardStateContext from 'src/wizard/WizardStateContext';
import hoistNonReactStatics from 'hoist-non-react-statics';

const getClassForKey = (context, key) => {
  if(typeof context.classSet[key] === 'function') {
    return context.classSet[key](context);
  }

  return key ? context.classSet[key] : null;
};

export const getClasses = (context, requestedKeys) => {
  if(isArray(requestedKeys)) {
    return requestedKeys.reduce((result, key) => {
      result[key] = getClassForKey(context, key);
      return result;
    }, {});
  } else {
    return getClassForKey(context, requestedKeys);
  }
};

export const withClassSet = (WrappedComponent, requestedKeys) => {
  class WithClassSet extends Component {
    render() {
      const { forwardedRef, ...rest } = this.props;
      return (
        <WizardStateContext.Consumer>
          {wizardStateContext => {
            const customClass = getClasses(wizardStateContext, requestedKeys);
            return <WrappedComponent customClass={customClass} {...rest} ref={forwardedRef} />;
          }}
        </WizardStateContext.Consumer>
      );
    }
  }
  hoistNonReactStatics(WithClassSet, WrappedComponent);
  return React.forwardRef((props, ref) => <WithClassSet {...props} forwardedRef={ref} />);
};

export const useClassSet = requestedKeys => {
  const context = useContext(WizardStateContext);

  return getClasses(context, requestedKeys);
};

export default useClassSet;
