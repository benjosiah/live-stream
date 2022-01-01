const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs')
const video = require('./models/Videos');

const app = express();



const dburi = "mongodb+srv://josiah:12345@cluster0.ebpon.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() =>app.listen('3000'))
.catch(err => console.log(err))

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const storage = multer.diskStorage({

    destination: (req, file, cb)=>{
        cb(null, 'upload')
    },

    filename: (req, file, cb)=>{
        const {originalname}= file
        cb(null, originalname)
    }
})
const upload = multer(storage)


app.get('/',(req,res)=>{
   
    res.render('createstream')
})

app.get('/watch',(req,res)=>{
   
    res.render('watch')
})

app.post('/stream',(req,res)=>{
    console.log(req.body.title)
  const vid = new video({
        title: req.body.title,
  })
  vid.save()
  .then(()=>{
      res.redirect('/video/'+vid._id)
  })
  .catch(err=>console.log(err))
})



app.get('/video/:id', (req, res) => {
 video.findById(req.params.id)
    .then(video => {
    res.render('index', { video: video })
    })
})

app.post('/upload/:id', upload.single('file'), (req, res)=>{
    console.log(req.params.id)
    let id = req.params.id
    let buffer = req.file.buffer
    let path = "./upload/"+id+".mp4"
    if(!fs.existsSync(path)){
        console.log("update")
        video.findByIdAndUpdate(id, {
            url: path
        }).then(()=>{
            console.log("updated")
        })
    }

fs.open(path ,'a', function(err, fd) {
  
    
    if(err) {
        console.log('Cant open file');
    }else {
        fs.write(fd, buffer, 0, buffer.length, 
                null, function(err,writtenbytes) {
            if(err) {
                console.log('Cant write to file');
            }else {
                console.log(writtenbytes +
                    ' characters added to file');
            }
        })
    }
})
    return res.json(
        {status: "ok",
        upload: req.file.buffer

});
})