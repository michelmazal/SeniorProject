const origins=[
    'http://localhost:1433'
]

const sqlConfig={
    user:'sa',
    password:'Donotshare123',
    server:"localhost",
    database:"PHDTracking",
    synchronize: true,
    trustServerCertificate: true,
}

module.exports={
    origins,
    sqlConfig
}