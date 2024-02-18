const discountModel = require("../../models/discount.model");
const { convertToMongoDBObjectId } = require("../../utils/index");

const getDiscountCodeByCode = async ({ code, shopId }) => {
  return await discountModel
    .findOne({
      discount_code: code,
      discount_shopId: convertToMongoDBObjectId(shopId),
    })
    .lean();
};

const getAllSelectedDiscountCodes = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean();

  return documents;
};

module.exports = { getDiscountCodeByCode, getAllSelectedDiscountCodes };
