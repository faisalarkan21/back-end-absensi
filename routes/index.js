const express = require('express');
var mysql = require('mysql');
var _ = require('lodash');

const router = express.Router();
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'arkan14811',
  database: 'absensi_gundar'
});


router.get('/', async (req, res) => {
  res.json({
    response: "Halloo"
  })
});


function onlyUnique(value, index, self) {
  console.log(index)
  return self.indexOf(value.npm) === value.npm;
}

router.get('/users', async (req, res) => {
  connection.query('SELECT * from mahasiswa', function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results);
    res.json(results);
  });
});

router.get('/main-users', async (req, res) => {
  connection.query('SELECT * from dosen', function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results);
    res.json(results);
  });
});

router.get('/jadwal-mhs', async (req, res) => {
  console.log(req.query)
  connection.query('SELECT * from jadwal_kelas where kelas = ?', req.query.kelas, function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results);
    res.json({
      data: results
    });
  });
});

router.get('/jadwal-dosen', async (req, res) => {
  connection.query('SELECT jadwal_kelas.id as id_jadwal, dosen.id as id_dosen, jadwal_kelas.*, dosen.* from jadwal_kelas INNER JOIN dosen ON jadwal_kelas.dosen = dosen.id where dosen = ?', req.query.id, function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results);
    res.json({
      data: results
    });
  });
});


router.get('/get-all-mhs', async (req, res) => {

  console.log(req.query)
  let reWriteResult = [];
  if (req.query.id_jadwal) {
    connection.query('SELECT mahasiswa.id as id_mahasiswa, mahasiswa.* from  mahasiswa inner join kelas on mahasiswa.kelas = kelas.id where mahasiswa.kelas = ?', req.query.id_kelas, function (error, resultsAllMhs, fields) {
      if (error) throw error;
      // console.log(resultsAllMhs)
      return connection.query('SELECT * from log_absensi_mhs inner join jadwal_kelas on log_absensi_mhs.id_jadwal_kelas = jadwal_kelas.id inner join mahasiswa on log_absensi_mhs.npm = mahasiswa.npm where log_absensi_mhs.id_jadwal_kelas = ?', req.query.id_jadwal, function (error, resultsLogMhs, fields) {
        // connected!
        // console.log(resultsLogMhs);

        for (let z = 0; z < resultsAllMhs.length; z++) {

          for (let x = 0; x < resultsLogMhs.length; x++) {
            // console.log(resultsAllMhs[z].npm) 
            if (resultsAllMhs[z].npm == resultsLogMhs[x].npm) {
              // console.log('is True')

              reWriteResult.push({
                nama: resultsAllMhs[z].nama,
                npm: resultsAllMhs[z].npm,
                hasSendLocation: true,
                index: z
              })
            }
          }
        }

        for (let w=0; w < resultsLogMhs.length; w++ ){        
          _.remove(resultsAllMhs, obj => obj.id_mahasiswa === resultsLogMhs[w].id);
        }
      
        let unionTwice  = _.union(resultsAllMhs, resultsLogMhs);
        res.json({data:unionTwice})



      })

    });
  } else {
    return connection.query('SELECT * from  mahasiswa inner join kelas on mahasiswa.kelas = kelas.id', function (error, results, fields) {
      if (error) throw error;
      // connected!
      console.log(results);
      res.json({
        data: results
      });
    });


  }



});

// get all log mahasiswa
router.get('/get-all-log-mhs', async (req, res) => {

  console.log(req.query)

  if (req.query.id_jadwal) {
    return connection.query('SELECT * from log_absensi_mhs inner join jadwal_kelas on log_absensi_mhs.id_jadwal_kelas = jadwal_kelas.id inner join mahasiswa on log_absensi_mhs.npm = mahasiswa.npm where log_absensi_mhs.id_jadwal_kelas = ?', req.query.id_jadwal, function (error, results, fields) {
      if (error) throw error;
      // connected!
      console.log("masuk all log mhs")
      console.log(results);
      res.json({
        data: results
      });
    });
  } else {
    return connection.query('SELECT * from log_absensi_mhs inner join jadwal_kelas on log_absensi_mhs.id_jadwal_kelas = jadwal_kelas.id inner join mahasiswa on log_absensi_mhs.npm = mahasiswa.npm', function (error, results, fields) {
      if (error) throw error;
      // connected!
      // console.log(results);
      res.json({
        data: results
      });
    });

  }


});

// get all dosen
router.get('/get-all-dosen', async (req, res) => {
  connection.query('SELECT * from dosen ', function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results);
    res.json({
      data: results
    });
  });
});

// get all log dosen
router.get('/get-all-log-dsn', async (req, res) => {
  connection.query('SELECT * from log_absensi_dosen inner join jadwal_kelas on log_absensi_dosen.id_jadwal_kelas = jadwal_kelas.id inner join dosen on log_absensi_dosen.nip = dosen.nip', function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results);
    res.json({
      data: results
    });
  });
});


router.post('/save-location-mhs', async (req, res) => {

  console.log(req.body)

  const {
    id_jadwal_kelas,
    longitude,
    latitude,
    npm,
    token,
    address,
  } = req.body;


  connection.query('select * from mahasiswa where npm = ?', npm, function (rows) {

    console.log(rows)
    connection.query('insert into log_absensi_mhs SET ?', [{
      npm,
      latitude,
      longitude,
      id_jadwal_kelas,
      token,
      address
    }], function (error, results, fields) {
      if (error) throw error;
      console.log(results.insertId);

      res.json({
        status: 200,
        message: 'location successfully saved'
      });

    });



  })




})


router.post('/save-location-dosen', async (req, res) => {

  console.log(req.body)

  const {
    id_jadwal_kelas,
    longitude,
    latitude,
    nip,
    token,
    address,
  } = req.body;


  connection.query('select * from dosen where nip = ?', nip, function (rows) {

    console.log(rows)
    connection.query('insert into log_absensi_dosen SET ?', [{
      nip,
      latitude,
      longitude,
      id_jadwal_kelas,
      token,
      address
    }], function (error, results, fields) {
      if (error) throw error;
      console.log(results.insertId);

      res.json({
        status: 200,
        message: 'location successfully saved'
      });

    });



  })




})


router.post('/login-mhs', async (req, res) => {

  var query = connection.query("select * from mahasiswa where email = ? ", req.body.email, function (err, data) {

    console.log(req.body)
    console.log(data);
    if (err) {
      console.log(err);
      return next("Mysql error, check your query");
    }

    if (data.length < 1) {

      console.log({
        status: 'Username Tidak ditemukan.'
      });

      res.json({
        isValid: false,
        status: 'Username Tidak ditemukan.'
      });

    } else {



      if ((req.body.email.toLowerCase() === data[0].email) && (req.body.password === data[0].password)) {

        console.log({
          status: 'Login berhasil.'
        });

        console.log(data)

        res.json({
          id: data[0].id,
          nama: data[0].nama,
          email: data[0].email,
          npm: data[0].npm,
          password: data[0].password,
          kelas: data[0].kelas,
          alamat: data[0].alamat,
          token: data[0].token,
          status: 'Login Berhasil',
          isValid: true
        });

      } else {

        console.log({
          status: 'Id / password salah.'
        });

        res.json({
          id: '',
          nama: '',
          email: '',
          npm: '',
          password: '',
          alamat: '',
          token: '',
          status: 'Id / password salah.',
          isValid: false
        });

      }
    }
  });


});

router.post('/login-dosen', async (req, res) => {
  var query = connection.query("select * from dosen where email = ? ", req.body.email, function (err, data) {

    console.log(req.body)
    console.log(data);
    if (err) {
      console.log(err);
      return next("Mysql error, check your query");
    }

    if (data.length < 1) {

      console.log({
        status: 'Username Tidak ditemukan.'
      });

      res.json({
        isValid: false,
        status: 'Username Tidak ditemukan.'
      });

    } else {



      if ((req.body.email === data[0].email) && (req.body.password === data[0].password)) {

        console.log({
          status: 'Login berhasil.'
        });

        res.json({
          id: data[0].id,
          nama: data[0].nama,
          email: data[0].email,
          nip: data[0].nip,
          password: data[0].password,
          alamat: data[0].alamat,
          token: data[0].token,
          status: 'Login Berhasil',
          isValid: true
        });

      } else {

        console.log({
          status: 'Id / password salah.'
        });

        res.json({
          id: '',
          nama: '',
          email: '',
          nip: '',
          password: '',
          alamat: '',
          token: '',
          status: 'Id / password salah.',
          isValid: false
        });

      }
    }
  });
});

module.exports = router;