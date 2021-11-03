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
  const {
    currentUser
  } = req.query;
  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`exec getUnallocatedStudents ${currentUser}`, function (err, recordset) {

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

  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    var request = new sql.Request();
    request.query(`dbo.getStudentsAllocated @allocatedToID = ${id}`, function (err, recordset) {

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

Router.get('/advisoryRequest/:id', (req, res) => {
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
  const {
    currentUser
  } = req.query;

  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(`exec getRecommendations '${currentUser}'`, function (err, recordset) {

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
    student,
    admin
  } = req.query;

    sql.connect(sqlConfig, function (err) {
      if (err) {
        console.log(err);
        return
      }
      var request = new sql.Request();
      request.query(`exec setAllocation @allocated = '${student}', @allocatedTo = '${admin}'`, function (err, recordset) {
        if (err) {
          console.log(err)
          res.json(false);
        }
          res.json(true);

      });
    })
})

Router.get('/Remove', (req, res) => {
  const {
    Id,
    admin
  } = req.query;

  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
    }
    var request = new sql.Request();
    request.query(`exec removeAllocation @allocatedID = '${Id}', @allocatedTo = '${admin}'`,
      function (err, recordset) {

        if (err) {
          console.log(err)
        }

        const check = recordset['rowsAffected'];
        if (check > 0) {

          var data = recordset['recordset'];
          res.json(true);
        } else {
          res.json(false);
        }


      });
  })

})

Router.get('/Profs', (req, res) => {
  const {
    Id
  } = req.query;

  var commandText = `exec dbo.getProfessors ${Id}`
  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      return
    }
    var request = new sql.Request();
    request.query(commandText, function (err, recordset) {

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

Router.get('/AdminRequest', (req, res) => {
  const {
    admin,
    student
  } = req.query;

  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      res.json(false);
    }
    var request = new sql.Request();
    request.query(`exec createRequest @requestor ='${admin}', @requested = '${student}'`, function (err, recordset) {

      if (err) {
        console.log(err)
      }

        res.json(true);


    });
  })
})

Router.get('/StudentRequest', (req, res) => {
  const {
    admin,
    student
  } = req.query;

  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log(err);
      res.json(false);
      return
    }
    var request = new sql.Request();
    request.query(`exec createRequest @requestor ='${student}', @requested = '${admin}'`, function (err, recordset) {

      if (err) {
        console.log(err)
      }
        res.json(true);
    });
  })
})



module.exports = Router;