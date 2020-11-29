'use strict';

const _     = require('lodash');
const Axios = require('axios');

const Logger = require('./logger');

const TAG_REGEX = /<[^>]*>/g;
const AND_REGEX = /\s+(&nbsp;|&)\s+/i;

const QUESTION_SUBSTRING_BLACKLIST = ['seen here', '[audio clue]'];

const instance = Axios.create({
  baseURL: 'http://jservice.io/api/',
});

const _questionValid = (data) => {
  if (data.question === null || _.trim(data.question) === '') {
    Logger.info('JService._questionValid - empty question');
    return false;
  }

  if (QUESTION_SUBSTRING_BLACKLIST.some((s) => data.question.includes(s))) {
    Logger.info('JService._questionValid - blacklisted question substring');
    return false;
  }

  if (data.value === null) {
    Logger.info('JService._questionValid - empty value');
    return false;
  }

  return true;
};

const _correct = (data) => {
  // Sometimes answers will have <i> tags for titles
  data.answer = data.answer.replace(TAG_REGEX, '');

  data.answer = data.answer.replace(AND_REGEX, ' and ');
  return data;
};

const random = async () => {

  let valid = false;
  let returnData;

  while (!valid) {
    const response = await instance.get('/random');
    returnData =  response.data[0];

    valid = _questionValid(returnData);
  }

  return _correct(returnData);
};

module.exports = {
  random,
};
