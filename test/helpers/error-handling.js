module.exports = {
  isOfTypeRevert(error) {
    return error.message.search('revert') >= 1
  }
};
