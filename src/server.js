const _ = require('underscore');
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const resizeImg = require('resize-img');
const download = require('image-downloader');
const jsonpatch = require('jsonpatch');
const morgan = require('morgan');
const middleware = require('./middlewares');
const config  = require('../config');

let data = [];
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}));

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

/**
 *  @example 
 * @description login route takes an argument of username and password
 */
app.get('/login', middleware.processRoute, (req, res) =>{

  const user = _.pick(req.query, 'username', 'password');
	const token = jwt.sign(user, config.secret);
  data.push(token);

  res.json({
    token
  });

});

/**
 * @description this route apply json patch to request body and returns the result
 */
app.get('/patch', middleware.verifyJwt(data), (req, res) => {
  const body = req.query;
  const thepatch = [
    { "op": "replace", "path": "/baz", "value": "boo" }
  ]
  const patchedObject = jsonpatch.apply_patch(body, thepatch);
  res.status(400).send(patchedObject);
});

/**
 * @description returns a 50 x 50 thumbnail from an image urls
 */
app.get('/thumbnail', middleware.verifyJwt(data), (req, res) => {
  const params = _.pick(req.query, 'url');

  if(params.url){
    const imageType = path.extname(params.url);
    const supportedExt = /png|bmp|jpeg|jpg/;

    if(supportedExt.test(imageType)){

      const options = {
        url: params.url,
        dest: './public'
      };
      
      download.image(options).then(({ filename, image }) => {
        sharp(image)
          .resize(50, 50)
          .toFile(filename)
          .then( data => {
            const response = {
              uri: 'localhost:3000/'+filename
            };
            res.status(200).json(response);
          })
          .catch( err => {
            console.log(err);
          });
      }).catch((err) => {
        res.status(400).send("Error");
      });

    } else {
      res.status(400).send('Image file format not supported - we support (png, bmp, jpg & jpeg)');
    }
  } else {
    res.status(400).send({error: 'you must provide an image url'});
  }
});

/**
 * @description 404 route
 */
app.get('*', (req, res) => {
  res.render('error 404');
});


app.listen(3009, ()=>{
	console.log("app running on port 3000");
});

module.exports = app;
