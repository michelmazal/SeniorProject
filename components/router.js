const express = require('express');
const path = require('path');

const sql = require('mssql');

const {
  sqlConfig
} = require('./config/config');

const Router = express.Router();
const Paths = "frontEnd";

var currentRole = '';

Router.get('/', (req, res) => {
  currentRole = '';
  res.redirect('/Login');
});

Router.get('/Login', (req, res) => {
  res.sendFile(path.join(__dirname, `${Paths}/Login/index.html`));
});

Router.get('/adminLogin', (req, res) => {
  const {
    email,
    password
  } = req.query;

  sql.connect(sqlConfig, function (err) {

    if (err) {

      console.log(err)
      reject(err)
    };
 
    // create Request object
    var request = new sql.Request()


    request.query(`SELECT * FROM UserRoleMember INNER JOIN [User] ON [User].RoleID=UserRoleMember.RoleID WHERE Email='${email}' AND FirstName='${password}'`, function (err, recordset) {

      if (err) {
        console.log(err)
      }
      const check = recordset['rowsAffected'];
      if (check > 0) {
        currentRole = recordset['recordset'][0]['UserRole'];
        res.json({
          res: true,
          role: recordset['recordset'][0]['UserRole'],
          data: recordset['recordset'][0]
        })
      } else {
        res.json({
          res: 'user not found'
        });
      }


    });
  })

})

Router.get('/admin', (req, res) => {
  if (currentRole !== 'Admin') {
    res.json({
      res: 'user does not have access'
    });
  } else {
    res.sendFile(path.join(__dirname, `${Paths}/Admin/index.html`))
  }

})

Router.get('/student', (req, res) => {
  if (currentRole !== 'Student') {
    res.json({
      res: 'user does not have access'
    });
  } else {
    res.sendFile(path.join(__dirname, `${Paths}/student/index.html`));
  }

})

Router.get('/student/withoutAdvisor', (req, res) => {
  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`exec getUnallocatedStudents`, function (err, recordset) {

      if (err) {
        console.log(err)
      }

      const check = recordset['rowsAffected'];
      if (check > 0) {

        var data = recordset['recordset'];

        res.json(data);
      } else {
        res.json([]);
      }
    })
  });
});

Router.get('/student/list/:id', (req, res) => {
  const {
    id
  } = req.params;
  var Id = parseInt(id);

  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    var request = new sql.Request();
    request.query(`dbo.getStudentsAllocated @allocatedToID = ${Id}`, function (err, recordset) {

      if (err) {
        console.log(err)
      }

      const check = recordset['rowsAffected'];
      if (check > 0) {
        res.json(recordset['recordset'])
      } else {
        res.json([]);
      }


    });
  })

})

Router.get('/student/advisoryRequest/:id', (req, res) => {
  const {
    id
  } = req.params;
  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`exec getAdvisoryRequest @requestedID=${id}`, function (err, recordset) {

      if (err) {
        console.log(err)
        //reject(err);


      }

      const check = recordset['rowsAffected'];
      if (check > 0) {
        // recordset['recordset'][0]['UserRole'])

        var data = recordset['recordset'];
        res.json(data);
        //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      } else {
        res.json([]);
      }


    });
  })
})

Router.get('/recommendation', (req, res) => {
  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`exec getRecommendations`, function (err, recordset) {

      if (err) {
        console.log(err)
        //reject(err);


      }

      const check = recordset['rowsAffected'];
      if (check > 0) {
        // recordset['recordset'][0]['UserRole'])

        var data = recordset['recordset'];
        res.json(data);
        //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      } else {
        res.json([]);
      }


    });
  })
})

Router.get('/students', (req, res) => {
  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`exec getStudents`, function (err, recordset) {

      if (err) {
        console.log(err)
      }

      const check = recordset['rowsAffected'];
      if (check > 0) {
        var data = recordset['recordset'];
        res.json(data);
      } else {
        res.json([]);
      }


    });
  })
})

Router.get('/recommend', (req, res) => {
  const {
    Id,
    text,
    User
  } = req.query;
  console.log(text);
        sql.connect(sqlConfig, function (err) {
          if (err) {
            console.log(err);
            return
          }
          var request = new sql.Request();
          request.query(`exec giveRecommendation @requestor = '${Id}', @requested = '${User}',
          @text = '${text}'`, function (err, recordset) {

            if (err) {
              console.log(err)
              res.json(err.message);
              return
            }

            const check = recordset['rowsAffected'];
            if (check > 0) {
              var data = recordset['recordset'];
              res.json(data);
            } else {
              res.json([]);
            }


          });
        })
})

Router.get('/accept', (req, res) => {
  const {
    sId,
    admin
  } = req.query;

  var date = new Date().getFullYear();

  if (sId !== "" && admin !== "") {
    sql.connect(sqlConfig, function (err) {
      if (err) {
        console.log(err);
        return
      }
      var request = new sql.Request();
      var date = new Date().getFullYear();
      request.query(`exec setAllocation @allocated = '${sId}', @allocatedTo = '${admin}'`, function (err, recordset) {
        if (err) {
          console.log(err)
        }

        const check = recordset['rowsAffected'];
        if (check > 0) {
          res.json(true);
        } else {
          res.json([]);
        }


      });
    })
  } else res.json(false);
})

Router.get('/Remove', (req, res) => {
  const {
    Id
  } = req.query;

  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`exec removeAllocation @allocationID = '${Id}'`, function (err, recordset) {

      if (err) {
        console.log(err)
        //reject(err);


      }

      const check = recordset['rowsAffected'];
      if (check > 0) {
        // recordset['recordset'][0]['UserRole'])

        var data = recordset['recordset'];
        res.json(true);
        //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      } else {
        res.json(false);
      }


    });
  })

})

Router.get('/Profs', async (req, res) => {
  // var data = await getData("exec dbo.getProfessors");
  // await wait(5000);
  // console.log(data);
  // res.json(data);
  var commandText = 'exec dbo.getProfessors'
  await sql.connect(sqlConfig, async function (err) {
    if (err) {
      console.log(err);
      return
    }
    var request = new sql.Request();
    await request.query(commandText, async function (err, recordset) {

      if (err) {
        console.log(err)
      }

      const check = recordset['rowsAffected'];
      if (check > 0) {
        var data = recordset['recordset'];

        res.json(data)
      } else {
        res.json([]);
      }
    });
  })
});

Router.get('/Request', (req, res) => {
  const {
    Id,
    id
  } = req.query;
  var date = new Date().getFullYear();
  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`exec createRequest @requestor ='${Id}', @requested = '${id}'`, function (err, recordset) {

      if (err) {
        console.log(err)
        //reject(err);


      }

      const check = recordset['rowsAffected'];
      if (check > 0) {
        // recordset['recordset'][0]['UserRole'])

        var data = recordset['recordset'];
        res.json(true);
        //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      } else {
        res.json([]);
      }


    });
  })
})

Router.get('/Accepts', (req, res) => {
  const {
    Id
  } = req.query;

  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`exec setApproved @requestID = '${Id}''`, function (err, recordset) {

      if (err) {
        console.log(err)
        //reject(err);


      }

      const check = recordset['rowsAffected'];
      if (check > 0) {
        // recordset['recordset'][0]['UserRole'])

        // var data = recordset['recordset'];
        res.json(true);
        //res.json({res:true,role:recordset['recordset'][0]['UserRole']})
      } else {
        res.json(false);
      }


    });
  })

})

// async function getData(commandText){
//   await sql.connect(sqlConfig,async function(err){
//     if(err){
//       console.log(err);
//       return
//     }
//     var request = new sql.Request();
//     await request.query(commandText,async function (err, recordset) {

//       if (err){
//          console.log(err)
//       }

//       const check = recordset['rowsAffected'];
//       if(check > 0){
//      var data = recordset['recordset'];
//      console.log(data);
//     return data
//       }else{
//         return [];
//       }
//   });
//   })
// }

// async function wait (ms) {
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve, ms)
//   });
// }


module.exports = Router;