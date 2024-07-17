const getParamId = (url) => {
  return parseInt(url.split('/')[3]);
}

module.exports = getParamId;