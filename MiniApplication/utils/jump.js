const jump = url => {
  // console.log(url);
  wx.navigateTo({
    url: url,
  })
}

module.exports.jumpTo = jump
