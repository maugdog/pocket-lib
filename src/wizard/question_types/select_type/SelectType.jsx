import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withWizardStateContext } from 'src/wizard/WizardStateContext';
import { withClassSet } from 'src/wizard/lib/classSetHelpers';
import SelectOption from 'src/wizard/question_types/select_type/SelectOption';

class SelectType extends Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(value) {
    this.props.onChange(this.props.question.name, value, true);
  }

  render() {
    return (
      <div className={classnames('wizard-select-type', this.props.customClass)}>
        {this.props.question.options.map(option => <SelectOption option={option} onSelect={this.onSelect} key={option.name || option.value} />)}
      </div>
    );
  }
}

SelectType.propTypes = {
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withWizardStateContext(withClassSet(SelectType, 'selectType'));
