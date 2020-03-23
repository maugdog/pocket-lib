import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import useClassSet from 'src/wizard/lib/classSetHelpers';
import Image from 'src/wizard/lib/components/Image';

const customClassNames = [
  'selectOption', 'selectOptionCard', 'selectOptionBody', 'selectOptionFooter', 'selectOptionTitle', 'selectOptionSubtitle', 'selectOptionImg'
];

const SelectOption = ({ option, onSelect }) => {
  const customClass = useClassSet(customClassNames);

  const onClick = event => {
    onSelect(option.value);
  };

  return (
    <div className={classnames('wizard-select-option', customClass.selectOption)} onClick={onClick}>
      <div className={classnames('wizard-select-option-card', customClass.selectOptionCard)}>
        <div className={classnames('wizard-select-option-body', { hidden: !option.img && !option.color }, customClass.selectOptionBody)} style={option.color ? { backgroundColor: option.color } : null}>
          {option.img &&
            <Image src={option.img.src} srcSet={option.img.srcSet} alt={option.img.alt} className={classnames('wizard-select-option-img', customClass.selectOptionImg)} />}
        </div>
        <div className={classnames('wizard-select-option-footer', customClass.selectOptionFooter)}>
          <div className={classnames('wizard-select-option-title', customClass.selectOptionTitle)}>{option.title}</div>
          <div className={classnames('wizard-select-option-subtitle', customClass.selectOptionSubtitle)}>{option.subtitle}</div>
        </div>
      </div>
    </div>
  );
};

SelectOption.propTypes = {
  option: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default SelectOption;
