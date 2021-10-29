const sql = require('mssql');

const { sqlConfig } = require('./config');
/*
//const conn=async function(query){
  //return new Promise(function(resolve,reject){
  sql.connect(sqlConfig,function (err) {
    
    if (err){ 

      console.log(err)
      reject(err)
    };

    // create Request object
    var request = new sql.Request();
       
    // query to the database and get the records
  request.query('select * from UserRoleMember', function (err, recordset) {
        
        if (err){
           console.log(err)
           reject(err);
          
        }
console.log(recordset)
       // resolve(recordset)

    });
});
//})
//}

//let result=conn('select * from UserRoleMember');

//console.log(result)

//});
//console.log(result);const sql = require('mssql');

const { sqlConfig } = require('./config');
/*
//const conn=async function(query){
  //return new Promise(function(resolve,reject){
  sql.connect(sqlConfig,function (err) {
    
    if (err){ 

      console.log(err)
      reject(err)
    };

    // create Request object
    var request = new sql.Request();
       
    // query to the database and get the records
  request.query('select * from UserRoleMember', function (err, recordset) {
        
        if (err){
           console.log(err)
           reject(err);
          
        }
console.log(recordset)
       // resolve(recordset)

    });
});
//})
//}

//let result=conn('select * from UserRoleMember');

//console.log(result)

//});
//console.log(result);
*/