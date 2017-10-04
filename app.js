var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _=require('underscore');
var bodyParser=require('body-parser');
var Movie = require('./models/movie');
var port = process.env.PORT||3000;
var app=express();

mongoose.connect('mongodb://localhost/moviedb');

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment=require('moment');
app.listen(port);

app.get('/',function(req,res){
   Movie.fetch(function(err,movies){
      if(err){
      	console.log(err);
      }

   res.render('index',{
   	title: '电影首页',
   	movies: movies
   });
  });  
});

app.get('/movie/:id',function(req,res){
   var id=req.params.id;
   Movie.findById(id,function(err,movie){
   	res.render('detail',{
   	title: '电影详情页',
   	movie: movie
   });
  });
});

app.get('/admin/update/:id',function(req,res){
  var id=req.params.id;
  if(id){
  	Movie.findById(id,function(err,movie){
   	res.render('admin',{
   	title: '后台更新页',
   	movie: movie
   });
  });
  }
});

app.post('/admin/movie/new',function(req,res){
   var id=req.body.movie._id;
   var movieObj=req.body.movie;
   var _movie;

   if(id!=='undefined'){
   	Movie.findById(id,function(err,movie){
      if(err){
      	console.log(err);
      }
    _movie=_.extend(movie,movieObj);
    _movie.save(function(err,movie){
       if(err){
      	console.log(err);
      }
      res.redirect('/movie/'+_movie._id);
    });
   	});
   }else{
   	_movie=new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			language: movieObj.language,
			country: movieObj.country,
			summary: movieObj.summary,
			flash: movieObj.flash,
			poster: movieObj.poster,
			year: movieObj.year
   	});

   	_movie.save(function(err,movie){
       if(err){
      	console.log(err);
      }
      res.redirect('/movie/'+_movie._id);
    });
   }
});

app.get('/admin/movie',function(req,res){
   res.render('admin',{
   	title: '电影后台录入页',
    movie: {
        title: '',
        doctor: '', 
        country: '',
        year: '',
        poster: '',
        flash: '',
        summary: '',
        language: ''
    }
   });
});

app.get('/admin/list',function(req,res){
   Movie.fetch(function(err,movies){
      if(err){
      	console.log(err);
      }

   res.render('list',{
   	title: '电影列表页',
   	movies: movies
   });
  });   
});

app.delete('/admin/list',function(req,res){
    var id=req.query.id;
    if(id){
        Movie.remove({_id:id},function(err,movie){
         if(err){
            console.log(err);
           }else{
            res.json({success:1});
           }
        });
    }
});