"use strict";
const _ = require("lodash");

const getDataByFields = ({ fields = [], object }) => {
  return _.pick(object, fields);
};

module.exports = { getDataByFields };
