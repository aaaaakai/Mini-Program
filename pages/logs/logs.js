//logs.js
const util = require('../../utils/util.js')
const MD5 = require('../../utils/MD5.js')


Page({
  data: {
    logs: [],
    msg: '',
    flag: true,
    source: ''
  },
  onLaunch: function() {
  },
  tapFun: function() {
    let bool = !this.data.flag;
    this.setData({ "flag": bool });
  },
  chooseFun: function() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          "source": res.tempFilePaths[0]
        });
      }
    })
  },
  uploadFun: function() {
    let that = this;
    wx.uploadFile({
      url: 'https://api-cn.faceplusplus.com/imagepp/beta/detectsceneandobject',
      filePath: that.data.source,
      name: 'image_file',
      formData: {
        'api_key': 'uyh6Ycphk1hDtZIUvJGIxWe7QsL7EhX7',
        'api_secret': '_7iHftvPS-9_QO8TF5cQSUqQFS0xju39'
      },
      success: function (res) {
        var result = JSON.parse(res.data);
        if (result.objects.length) {
          that.setData({ msg: result.objects[0].value });
        }
        if (result.scenes.length) {
          that.setData({ msg: result.scenes[0].value });
        }
        that.translateFun();
      }
    })
  },
  translateFun: function() {
    let that = this;
    wx.request({
      url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
      data: {
        q: that.data.msg,
        from: 'auto',
        to: 'zh',
        appid: '20180408000143929',
        salt: '1435660288',
        sign: that.MD5Fun('20180408000143929', that.data.msg, '1435660288', 'QmbEdKoW3pT4wUOeC6wA')
      },
      success: function (res) {
        if (res.data && res.data.trans_result.length) {
          that.setData({ "msg": res.data.trans_result[0].dst })
        }
      }
    })
  },
  MD5Fun(appid, q, random, keys) {
    let Ciphertext = appid + q + random + keys;
    return MD5.MD5(Ciphertext);
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
