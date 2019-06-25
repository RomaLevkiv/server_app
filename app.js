const express = require('express');
const app = express();
const jsonParser = express.json();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    
    author_id: String,
    title: String,
    avatar_path: String,
    pages_num: Number,
    short_desc: String,
    publisher: String,
    publish_year: Number
});

const authorSchema = new Schema({
   full_name: String,
   nationality: String,
   avatar_path_author: String,
   short_bio: String
});

const Book = mongoose.model("Book", bookSchema);
const Author = mongoose.model("Author", authorSchema);



mongoose.connect("mongodb://localhost:27017/bookAuthorDb",{useNewUrlParser:true, useFindAndModify: false},(err)=>{
    if(err)return console.log(err);
    app.listen(3000,()=>console.log("server has started"));
});

//CRUD for Book
app.get("/books", (req, res)=>{
    var pageNo = parseInt(req.query.pageNo)
    var size = parseInt(req.query.size)
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = size
    Book.find({}, {}, query, function (err, data) {
        if (err) {
            response = { "error": true, "message": "Error fetching data" };
        } else {
            response = { "List of books": data };
        }
        res.json(response);
    });
});

app.get("/books/:id", (req,res)=>{
    Book.findOne({_id: req.params.id}, (err ,doc)=>{
        if(err) return console.log(err);
        res.send(doc);
    }
    )
});

app.post("/books", jsonParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);
    Book.create({
    author_id: req.body.author_id,
    title: req.body.title,
    avatar_path: req.body.avatar_path,
    pages_num: req.body.pages_num,
    short_desc: req.body.short_desc,
    publisher: req.body.publisher,
    publish_year: req.body.publish_year
    },
    (err, docs)=>{
        if(err) return console.log(err);
        res.send(docs);
    });
});

app.put("/books", jsonParser,(req,res)=>{
    if(!req.body) return res.sendStatus(400);
    Book.findOneAndUpdate({_id: req.body._id}, {
        author_id: req.body.author_id,
        title: req.body.title,
        avatar_path: req.body.avatar_path,
        pages_num: req.body.pages_num,
        short_desc: req.body.short_desc,
        publisher: req.body.publisher,
        publish_year: req.body.publish_year 
    }, 
    {new:true},
    (err, doc)=>{
        if(err) return console.log(err);
        res.send(doc);
    });
});

app.delete("/books/:id", (req, res)=>{
    Book.findOneAndDelete({_id: req.params.id}, (err, doc)=>{
        if(err) return console.log(err);
        res.send(doc);
    });
});

//CRUD for Author
app.get("/authors", (req, res)=>{
    var pageNo = parseInt(req.query.pageNo)
    var size = parseInt(req.query.size)
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = size
   
    Author.find({}, {}, query, function (err, data) {
        
        if (err) {
            response = { "error": true, "message": "Error fetching data" };
        } else {
            response = { "List of authors": data };
        }
        res.json(response);
    });
});
app.get("/authors/:id", (req,res)=>{
    Author.findOne({_id: req.params.id}, (err ,doc)=>{
        if(err) return console.log(err);
        res.send(doc);
    }
    )
});

app.post("/authors", jsonParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);
    Author.create({
        full_name: req.body.full_name,
        nationality: req.body.nationality,
        avatar_path_author: req.body.avatar_path_author,
        short_bio: req.body.short_bio
    },
    (err, docs)=>{
        if(err) return console.log(err);
        res.send(docs);
    });
});

app.put("/author", jsonParser,(req,res)=>{
    if(!req.body) return res.sendStatus(400);
    Author.findOneAndUpdate({_id: req.body.id}, {
        full_name: req.body.full_name,
        nationality: req.body.nationality,
        avatar_path_author: req.body.avatar_path_author,
        short_bio: req.body.short_bio 
    }, 
    {new:true},
    (err, doc)=>{
        if(err) return console.log(err);
        res.send(doc);
    });
});

app.delete("/authors/:id", (req, res)=>{
    Author.findOneAndDelete({_id: req.params.id}, (err, doc)=>{
        if(err) return console.log(err);
        res.send(doc);
    });
});

//////////////////////////////////////////////////////////////////////

app.get("/books/author/:author_name", (req,res)=>{
    Author.findOne({full_name: req.params.author_name}, (err, doc)=>{
        if(err) return console.log(err);
        if(doc){                          
                Book.find({ author_id: doc._id }, (err, docs) => {
                if (err) return console.log(err);
                    res.send(docs);
                });            
            
        }  
        else {res.send("This author is not find in our DB")};
    });

});

app.get("/books/titles/:book_title", (req,res)=>{
    if(req.query.author){
        Author.findOne({full_name:req.query.author}, (err, doc)=>{
            if(err) console.log(err);
            Book.findOne({author_id: doc._id, title: req.params.book_title}, (err, data)=>{
                if(err) console.log(err);
                res.send(data);
            })
        })
    } else{
        Book.find({title: req.params.book_title}, (err, doc)=>{
            if(err) console.log(err);
            res.send(doc);
        })
    }

    
});