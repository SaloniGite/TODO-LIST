const express = require("express")
const app = express()
const fs = require('fs')
app.set('view engine' , 'ejs')

app.get('/' , function(req,res){
    fs.readdir('./uploads','utf-8',function(err,files){
        if (err) throw err
        res.render('home',{files:files})
    })
}
)
app.get('/add', function(req,res){
    res.render('add')
})

app.get('/addTask',function(req,res){
    const title = req.query.title
    const description = req.query.description
    const statuss = req.query.statuss
    const data = {description,statuss}
    fs.writeFile(`./uploads/${title}`,JSON.stringify(data,null,2),function(err){
        if (err) throw err
        res.redirect('/')
    })
})

app.get('/viewTask/:title',function(req,res){
    fs.readFile(`./uploads/${req.params.title}`,'utf-8',function(err,data){
        if (err) throw err
        const task = JSON.parse(data) 
        res.send(`description:${task.description} <br> statuss:${task.statuss}`)
    })
})

app.get('/deleteTask/:title',function(req,res){
    fs.unlink(`./uploads/${req.params.title}`,function(err){
        if (err) throw err 
        res.redirect('/')
    })
})

app.get('/edit/:title',function(req,res){
    fs.readFile(`./uploads/${req.params.title}`,'utf-8',function(err,data){
        if (err) throw err
        const task = JSON.parse(data)
        res.render('edit',{title:req.params.title,
            description:task.description,
            statuss: task.statuss
        })
    })
})
app.get('/editsval/:oldtitle',function(req,res){
    const oldtitle = req.params.oldtitle
    const title = req.query.title
    const description = req.query.description
    const statuss = req.query.statuss
    const data = {description,statuss}
    fs.rename(`./uploads/${oldtitle}`,`./uploads/${title}`,function(err){
        if (err) throw err
        
        fs.writeFile(`./uploads/${title}`, JSON.stringify(data), function (err) {
            if (err) throw err;
            res.redirect("/");
        });
    })
})
app.listen(3000)