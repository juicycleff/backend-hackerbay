const _ = require('underscore');
const path = require('path');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const resizeImg = require('resize-img');
const download = require('image-downloader');
const fs = require('fs');
const config  = require('../../config');

/**
 * @description verify and protect route middleware
 * @param {*} data 
 */
const verifyJwt = (data) => (req,res,next)=>{

  const params = _.pick(req.query, 'token');

  if(params.token){
    if(data.indexOf(params.token) === -1){
      res.status(401).send('unauthorized');
    } else {
      jwt.verify(params.token, config.secret, (err, decoded) => {
        if (err) {
          res.status(401).send('unauthorized');
        }
        else{
          next();
        }
      });
    }
  } else {
    res.status(401).send('unauthorized');
  }
	
};

/**
 * @desc user route middleware
 */
const processRoute = (req, res, next) => {
  console.log(req.query);
  const params = _.pick(req.query, 'username', 'password');
  if (!params.username || !params.password) {
    return res.status(400).send({error: 'you must provide username and password parameters'});
  }
  next();
};

module.exports = {
  processRoute,
  verifyJwt
}