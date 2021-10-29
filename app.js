const express = require('express');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
//const myssql = require('mssql');
//const con = require('./components/config/db');
const Router = require('./components/router');
const {origins} = require('./components/config/config');

const cors = require('cors');

const Server = http.createServer(app);

app.use(express.static(__dirname +"/public"));

var corOptions ={
    origin:function (origin,callback) {
        if(origins.indexOf(origin) !== -1){
                    callback(null,true);
    }
    else{
        callback(null,false);
    }
},
methods:['GET','PUT','POST','DELETE','OPTIONS'],
optionsSuccessStatus:200,
credentials:true,
allowHeaders:['content-Type','Authorization','X-Requested-With','device-remeber-token','Access-Control-Allow-Origin','Origin','Accept']
}

app.use(cors(corOptions));
app.use(Router)
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({extended:false}));

Server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

