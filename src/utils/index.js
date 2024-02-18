"use strict";
const _ = require("lodash");
const { Types } = require("mongoose");

const convertToMongoDBObjectId = (id) => new Types.ObjectId(id);

const getDataByFields = ({ fields = [], object }) => {
  return _.pick(object, fields);
};

const removeUndefinedProperty = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null || obj[k] === undefined) delete obj[k];
  });

  return obj;
};

const updateNestedObject = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObject(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });

  return final;
};

module.exports = {
  getDataByFields,
  removeUndefinedProperty,
  updateNestedObject,
  convertToMongoDBObjectId,
};
