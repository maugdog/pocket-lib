import React, { Component } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export const WizardStateContext = React.createContext(null);

export const withWizardStateContext = WrappedComponent => {
  class WithWizardStateContext extends Component {
    render() {
      const { forwardedRef, ...rest } = this.props;
      return (
        <WizardStateContext.Consumer>
          {wizardStateContext => <WrappedComponent wizardStateContext={wizardStateContext} {...rest} ref={forwardedRef} />}
        </WizardStateContext.Consumer>
      );
    }
  }
  hoistNonReactStatics(WithWizardStateContext, WrappedComponent);
  return React.forwardRef((props, ref) => <WithWizardStateContext {...props} forwardedRef={ref} />);
};

export default WizardStateContext;
