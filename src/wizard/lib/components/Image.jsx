import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'src/wizard/lib/utilities';
import reduce from 'lodash.reduce';

const generateSrcSetString = srcSet => {
  if(isArray(srcSet)) {
    const lastIndex = srcSet.length - 1;
    return srcSet.reduce((accumulator, path, i) => `${accumulator ? `${accumulator}, ` : ''}${path}`, '');
  } else if(typeof srcSet === 'object') {
    return reduce(srcSet, (accumulator, curVal, curKey) => `${curVal} ${curKey}${accumulator && `, ${accumulator}`}`, '');
  }

  return srcSet;
};

const Image = ({ wrapperClassName, src, srcSet, ...rest }) =>
  <img src={src} srcSet={useMemo(() => generateSrcSetString(srcSet), [srcSet])} {...rest} />;

Image.propTypes = {
  wrapperClassName: PropTypes.string,
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  sizes: PropTypes.string,
  alt: PropTypes.string.isRequired
};

export default Image;
