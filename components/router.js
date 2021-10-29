const express = require('express');
const path = require('path');

const sql = require('mssql');

const { sqlConfig } = require('./config/config');//require('./config');
const { REFUSED } = require('dns');
const { request } = require('express');

const Router = express.Router();
const Paths="frontEnd";
Router.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,`${Paths}/index.html`));
})

Router.get('/adminLogin',(req,res)=>{
   const {email,password} = req.query;

   sql.connect(sqlConfig,function (err) {
    
    if (err){ 

      console.log(err)
      reject(err)
    };

    // create Request object
    var request = new sql.Request()
        
  
  request.query(`SELECT * FROM UserRoleMember INNER JOIN [User] ON [User].RoleID=UserRoleMember.RoleID WHERE Email='${email}' AND FirstName='${password}'`,function (err, recordset) {
        
        if (err){
           console.log(err)
           //reject(err);
           
          
        }

        const check = recordset['rowsAffected'];
        if(check > 0){
       // recordset['recordset'][0]['UserRole'])
            res.json({res:true,role:recordset['recordset'][0]['UserRole'],data:recordset['recordset'][0]})
        }else{
          res.json({res:'user not found'});
        }


    });
  })

})

Router.get('/admin',(req,res)=>{
   res.sendFile(path.join(__dirname,`${Paths}/Admin/index.html`))
})

Router.get('/student',(req,res)=>{
  res.sendFile(path.join(__dirname,`${Paths}/student/index.html`));
})

Router.get('/student/withoutAdvisor',(req,res)=>{
  sql.connect(sqlConfig,function(err){
    if(err){
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`SELECT * FROM [User] WHERE [User].RoleID =2`,function (err, recordset) {
        
      if (err){
         console.log(err)
         //reject(err);
         
        
      }

      const check = recordset['rowsAffected'];
      if(check > 0){
     // recordset['recordset'][0]['UserRole'])

     var data = recordset['recordset'];
      var newData =[];
      var datLength = '';
     //res.json(recordset['recordset'])

     request.query(`SELECT * FROM Allocation`,function (err, records) {
         if(err){
           console.log(err);
           return;
         }
         else{
           var data2 = records['recordset'];

           data.forEach((element,index) => {
              const {NetID} =element;
              
              datLength=data2.length;

              data2.forEach(elemen => {
                const {AllocatedID}=elemen;
                
                if(AllocatedID !==NetID){
                // console.log(newData.includes(data[index]))
                 if(newData.includes(data[index]) ==false){
                   console.log("b"+AllocatedID+"k"+NetID)
                  newData.push(data[index])
                 }
                }else console.log('nn')
              });
               // const {AllocatedID}=element;
               //data= data.filter((item)=>item.NetID !=AllocatedID);
           });
         }


         if(datLength == 0){
           console.log(datLength)
           res.json(data)
         }else{
           //console.log(newData)
         res.json(newData);
        }

     })
          //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      }else{
        res.json({res:'user not found'});
      }


  });
  })
})

Router.get('/student/list/:id',(req,res)=>{
  const {id} = req.params;
  var Id = parseInt(id)
  
  sql.connect(sqlConfig,function(err){
    if(err){
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`SELECT * FROM Allocation INNER JOIN [User] ON [User].[NetID]=Allocation.AllocatedID WHERE AllocatedToID=${Id};`,function (err, recordset) {
        
      if (err){
         console.log(err)
         //reject(err);
         
        
      }

      const check = recordset['rowsAffected'];
      if(check > 0){
        res.json(recordset['recordset'])
          //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      }else{
        res.json([]);
      }


  });
  })
    
})

Router.get('/student/advisoryRequest/:id',(req,res)=>{
  const {id}= req.params;
  sql.connect(sqlConfig,function(err){
    if(err){
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`SELECT * FROM Request INNER JOIN [User] ON [User].NetID=Request.RequestorID WHERE RequestedID=${id} AND Approved ='0'`,function (err, recordset) {
        
      if (err){
         console.log(err)
         //reject(err);
         
        
      }

      const check = recordset['rowsAffected'];
      if(check > 0){
     // recordset['recordset'][0]['UserRole'])

     var data = recordset['recordset'];
    res.json(data);
          //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      }else{
        res.json([]);
      }


  });
  })
})

Router.get('/recomendation',(req,res)=>{
  sql.connect(sqlConfig,function(err){
    if(err){
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`SELECT * FROM Recommendation INNER JOIN [User] ON [User].NetID=Recommendation.RecommendedID`,function (err, recordset) {
        
      if (err){
         console.log(err)
         //reject(err);
         
        
      }

      const check = recordset['rowsAffected'];
      if(check > 0){
     // recordset['recordset'][0]['UserRole'])

     var data = recordset['recordset'];
    res.json(data);
          //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      }else{
        res.json([]);
      }


  });
  })
})

Router.get('/students',(req,res)=>{
  sql.connect(sqlConfig,function(err){
    if(err){
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`SELECT * FROM [User] WHERE [User].RoleID=2`,function (err, recordset) {
        
      if (err){
         console.log(err)
         //reject(err);
         
        
      }

      const check = recordset['rowsAffected'];
      if(check > 0){
     // recordset['recordset'][0]['UserRole'])

     var data = recordset['recordset'];
     console.log(data)
    res.json(data);
          //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      }else{
        res.json([]);
      }


  });
  })
})

Router.get('/recomend',(req,res)=>{
   const { Id,text,User}= req.query;

   if(text !==""){
     if(User !==""){
       if(Id !==""){
        sql.connect(sqlConfig,function(err){
          if(err){
            console.log(err);
            return
          }
          var request = new sql.Request();
          var date = new Date().getFullYear();
          request.query(`INSERT INTO Recommendation VALUES (${Id},${User},'${text}',${date});`,function (err, recordset) {
              
            if (err){
               console.log(err)
               //reject(err);
               
              
            }
      
            const check = recordset['rowsAffected'];
            if(check > 0){
           // recordset['recordset'][0]['UserRole'])
      
           var data = recordset['recordset'];
          res.json(data);
                //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
            }else{
              res.json([]);
            }
      
      
        });
        })
           
       }else{res.json(false)}
     }else{res.json(false)}
   }else{res.json(false)}
   
})

Router.get('/accept',(req,res)=>{
  const {sId,admin} = req.query;

  var date = new Date().getFullYear();

  if(sId !=="" && admin !==""){
    sql.connect(sqlConfig,function(err){
      if(err){
        console.log(err);
        return
      }
      var request = new sql.Request();
      var date = new Date().getFullYear();
      request.query(`INSERT INTO Allocation VALUES (${sId},${admin},${date});`,function (err, recordset) {
          
        if (err){
           console.log(err)
           //reject(err);
           
          
        }
  
        const check = recordset['rowsAffected'];
        if(check > 0){
       // recordset['recordset'][0]['UserRole'])
  
       var data = recordset['recordset'];
      res.json(true);
            //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
        }else{
          res.json([]);
        }
  
  
    });
    })
  }else res.json(false);
})

Router.get('/Remove',(req,res)=>{
  const {Id}= req.query;

  sql.connect(sqlConfig,function(err){
    if(err){
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`DELETE FROM Allocation WHERE AllocationID=${Id}`,function (err, recordset) {
        
      if (err){
         console.log(err)
         //reject(err);
         
        
      }

      const check = recordset['rowsAffected'];
      if(check > 0){
     // recordset['recordset'][0]['UserRole'])

     var data = recordset['recordset'];
    res.json(true);
          //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      }else{
        res.json(false);
      }


  });
  })

})

Router.get('/Profs',(req,res)=>{
  sql.connect(sqlConfig,function(err){
    if(err){
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`SELECT * FROM [User] WHERE RoleID=1`,function (err, recordset) {
        
      if (err){
         console.log(err)
         //reject(err);
         
        
      }

      const check = recordset['rowsAffected'];
      if(check > 0){
     // recordset['recordset'][0]['UserRole'])

     var data = recordset['recordset'];
    res.json(data);
          //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      }else{
        res.json([]);
      }


  });
  })
})

Router.get('/Request',(req,res)=>{
  const {Id,id} = req.query;
  var date = new Date().getFullYear();
  sql.connect(sqlConfig,function(err){
    if(err){
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`INSERT INTO Request VALUES (${Id},${id},${date},${date},'0',${date})`,function (err, recordset) {
        
      if (err){
         console.log(err)
         //reject(err);
         
        
      }

      const check = recordset['rowsAffected'];
      if(check > 0){
     // recordset['recordset'][0]['UserRole'])

     var data = recordset['recordset'];
    res.json(true);
          //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      }else{
        res.json([]);
      }


  });
  })
})

Router.get('/Accepts',(req,res)=>{
  const {Id} = req.query;
   
  sql.connect(sqlConfig,function(err){
    if(err){
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`UPDATE Request SET Approved =1 WHERE RequestID=${Id}`,function (err, recordset) {
        
      if (err){
         console.log(err)
         //reject(err);
         
        
      }

      const check = recordset['rowsAffected'];
      if(check > 0){
     // recordset['recordset'][0]['UserRole'])

    // var data = recordset['recordset'];
    res.json(true);
          //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      }else{
        res.json(false);
      }


  });
  })

})

module.exports=Router;