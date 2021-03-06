const express = require('express');
const Router = express.Router();
const fs = require('fs');
const multer  = require('multer');
const model = require('../model');
const User = model.getModel('user');
const Goods = model.getModel('goods');

// 定义全局时间戳
let tStamp = Date.now();
// 储存商品图片名称
let goodsName = [];

// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storageAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
      // 接收到文件后输出的保存路径（若不存在则需要创建）
      cb(null, 'upload/avatar/');
  },
  filename: function (req, file, cb) {
      // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
      tStamp = Date.now();
      cb(null, tStamp + '-' + file.originalname);
  }
});
var storageGoods = multer.diskStorage({
  destination: function (req, file, cb) {
      // 接收到文件后输出的保存路径（若不存在则需要创建）
      cb(null, 'upload/goods/');
  },
  filename: function (req, file, cb) {
      // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
      let stamp = Date.now();
      let fName = stamp + '-' + file.originalname;
      goodsName.push(fName);
      cb(null, fName);
  }
});

// 创建文件夹
var createFolder = function(folder){
  try{
      // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
      // 如果文件路径不存在将会抛出错误"no such file or directory"
      fs.accessSync(folder); 
  }catch(e){
      // 文件夹不存在，以同步的方式创建文件目录。
      fs.mkdirSync(folder);
  }  
};

const uploadAvatarFolder = './upload/avatar/';
const uploadGoodsFolder = './upload/goods/';
createFolder(uploadAvatarFolder);
createFolder(uploadGoodsFolder);

// 创建 multer 对象
let uploadAvatar = multer({ storage: storageAvatar});
let uploadGoods = multer({ storage: storageGoods});

/* POST upload listing. */
Router.post('/avatar', uploadAvatar.single('file'), function(req, res, next) {
  // store avatar path into database
  const avatar = tStamp + '-' + req.file.originalname;
  const mail = req.body.mail;
  /* console.log('文件类型：%s', file.mimetype);
  console.log('原始文件名：%s', file.originalname);
  console.log('文件大小：%s', file.size);
  console.log('文件保存路径：%s', file.path); */
  // 储存到数据库
  const data = {avatar: avatar};
  User.findOneAndUpdate({mail: mail}, {"$set": data}, function(err, doc){
    if(!doc)
      return res.json({isUpload: 1, msg: '修改失败'});
    return res.json({isUpload: 0, data: {avatar: avatar}});
  });
});

Router.post('/goods', uploadGoods.array('files', 5), function(req, res, next) {
  // console.log(req.files.length);
  // console.info(req.body);
  // console.log(goodsName);
  // 储存到数据库
  let {price, mail, ...tmp} = req.body;
  const data = {owner: mail, images: goodsName, price: Number(price), ...tmp};
  const goodsModel = new Goods(data);
  goodsModel.save(function(err, doc) {
    if(err) {
      return res.json({code: 1, msg: '后端出现了问题'});
    }
    // 清空商品名称
    goodsName = [];
    Goods.find({owner: data.owner}, function(err, doc) {
      if(doc)
        return res.json({isUpload: 0, data: doc});
    });
  });
  /* User.findOneAndUpdate({mail: mail}, {"$set": data}, function(err, doc){
    if(!doc)
      return res.json({isUpload: 1, msg: '修改失败'});
    return res.json({isUpload: 0, data: {avatar: avatar}});
  }); */
});

// 导出模块（在 app.js 中引入）
module.exports = Router;