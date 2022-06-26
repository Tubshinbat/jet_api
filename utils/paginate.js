module.exports = async function (page, limit, model, getTotal) {
  let total;
  if (model) {
    total = await model.countDocuments();
  }
  if (getTotal) {
    total = getTotal;
  }
  const pageCount = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  let end = start + limit - 1;
  if (end > total) end = total;

  const pagination = { total, pageCount, start, end, limit, page };

  if (page < pageCount) pagination.nextPage = page + 1;
  if (page > 1) pagination.prevPage = page - 1;

  return pagination;
};
