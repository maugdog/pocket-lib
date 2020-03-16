import React from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { fromBase64 } from 'src/base64';

/**
  * A convenient hook for getting the query string for the current route.
  *
  * @param {string} key - An optional key in the query string to be extracted.
  * @param {string} base64Decode - If a specific key is requested, pass `true` for this param if it should be base64 decoded.
  * @param {string} parseJSON - If a specific key is requested, pass `true` for this param if it should be parsed as a JSON object.
  * @return {mixed} If no `key` parameter is provided, then the entire parsed query string is returned. Otherwise the value associated with the requested key is returned
  */
export const useQueryString = (key, base64Decode, parseJSON) => {
  const { search } = useLocation();

  if(search) {
    const parsed = queryString.parse(search);

    if(key) {
      const decoded = base64Decode && parsed[key] ? fromBase64(parsed[key]) : parsed[key];
      return parseJSON && decoded ? JSON.parse(decoded) : decoded;
    }

    return parsed;
  }

  return null;
};

export default useQueryString;
