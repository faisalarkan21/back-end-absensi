const express = require('express');
var mysql = require('mysql');
var _ = require('lodash');
var moment = require('moment');
const router = express.Router();
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'arkan14811',
  database: 'absensi_gundar'
});


Date.createFromMysql = function (mysql_string) {
  var t, result = null;

  if (typeof mysql_string === 'string') {
    t = mysql_string.split(/[- :]/);

    //when t[3], t[4] and t[5] are missing they defaults to zero
    result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
  }

  return result;
}

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

router.post('/add-dsn', async (req, res) => {
  console.log(req.query)
  connection.query('insert into dosen set ?', req.body, function (error, results, fields) {
    if (error) throw error;
    // connected!
    // console.log(results);
    res.sendStatus(200)
  });
});


router.post('/add-mhs', async (req, res) => {
  console.log(req.body)



  connection.query("select * from kelas where id = ?", req.body.kelas, function (error, results, fields) {
    console.log(results)
    req.body.kelas = results[0].id;
    console.log(req.body)
    connection.query('insert into mahasiswa set ?', req.body, function (error, results, fields) {
      if (error) throw error;
      // connected!
      // console.log(results);
      res.sendStatus(200)
    });
  });
});



router.get('/get-mhs', async (req, res) => {
  console.log(req.query)

  connection.query("SELECT mahasiswa.id as id_mahasiswa, mahasiswa.* from  mahasiswa inner join kelas on mahasiswa.kelas = kelas.id where mahasiswa.npm = ?", req.query.npm, function (error, results, fields) {
    // console.log(results)
    // req.body.kelas = results[0].id;
    // console.log(req.body)
    res.json({
      data: results
    })

  });
});

router.get('/get-dsn', async (req, res) => {
  console.log(req.query)

  connection.query("SELECT * from dosen where nip = ?", req.query.nip, function (error, results, fields) {
    console.log(results)
    // req.body.kelas = results[0].id;
    // console.log(req.body)
    res.json({
      data: results
    })

  });
});



router.get('/get-list-kelas', async (req, res) => {
  console.log(req.query)

  connection.query("select * from kelas", function (error, results, fields) {
    // console.log(results)
    // req.body.kelas = results[0].id;
    // console.log(req.body)
    res.json({
      data: results
    })

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

        for (let w = 0; w < resultsLogMhs.length; w++) {
          _.remove(resultsAllMhs, obj => obj.id_mahasiswa === resultsLogMhs[w].id);
        }

        let unionTwice = _.union(resultsAllMhs, resultsLogMhs);
        res.json({
          data: unionTwice
        })



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


router.get('/get-all-log-mhs-xls', async (req, res) => {

  console.log(req.query)

  /**
   * minta kesini buat ngambil query 
   */


  /**
   * Query SQL lau buat ngambil kedatabase tar di regenerate jdi XLS
   */
  //  `
  //  SELECT log_absensi_mhs.id as log_id, log_absensi_mhs.npm, mahasiswa.nama as nama_mahasiswa, 
  //  mahasiswa.email as email_mahasiswa, dosen.nama as nama_dosen, dosen.nip, dosen.email, 
  //  jadwal_kelas.hari, jadwal_kelas.matkul, jadwal_kelas.waktu, jadwal_kelas.ruang, 
  //  log_absensi_mhs.address as lokasi_absen, log_absensi_mhs.date_on_sign as waktu_save_lokasi  


  //  from log_absensi_mhs inner join jadwal_kelas on log_absensi_mhs.id_jadwal_kelas = jadwal_kelas.id 
  //  inner join mahasiswa on log_absensi_mhs.npm = mahasiswa.npm 
  //  inner join dosen on jadwal_kelas.dosen = dosen.id

  //  `


  return connection.query('SELECT log_absensi_mhs.id as log_id, log_absensi_mhs.npm, mahasiswa.nama as nama_mahasiswa, mahasiswa.email as email_mahasiswa, dosen.nama as nama_dosen, dosen.nip, dosen.email, jadwal_kelas.hari, jadwal_kelas.matkul, jadwal_kelas.waktu, jadwal_kelas.ruang, log_absensi_mhs.address as lokasi_absen, log_absensi_mhs.date_on_sign as waktu_save_lokasi  from log_absensi_mhs inner join jadwal_kelas on log_absensi_mhs.id_jadwal_kelas = jadwal_kelas.id inner join mahasiswa on log_absensi_mhs.npm = mahasiswa.npm inner join dosen on jadwal_kelas.dosen = dosen.id', function (error, results, fields) {
    if (error) throw error;
    // connected!  
    console.log(results);

    results.forEach(function (part, index, theArray) {
      const convertedDate = moment(results[index].waktu_save_lokasi).format('YYYY-MM-DD, h:mm:ss a')
      console.log(results[index].waktu_save_lokasi)
      theArray[index].waktu_save_lokasi = convertedDate;
    });

    console.log(results);


    res.json({
      data: results
    });
  });


});


router.get('/get-all-log-dosen-xls', async (req, res) => {

  console.log(req.query)


  return connection.query('SELECT log_absensi_dosen.id as log_id, log_absensi_dosen.nip, dosen.nama as nama_dosen, dosen.nip, dosen.email, jadwal_kelas.hari, jadwal_kelas.matkul, jadwal_kelas.waktu, jadwal_kelas.ruang, log_absensi_dosen.address as lokasi_absen, log_absensi_dosen.date_on_sign as waktu_save_lokasi  from log_absensi_dosen inner join jadwal_kelas on log_absensi_dosen.id_jadwal_kelas = jadwal_kelas.id inner join dosen on jadwal_kelas.dosen = dosen.id', function (error, results, fields) {
    if (error) throw error;
    // connected!  


    results.forEach(function (part, index, theArray) {
      const convertedDate = moment(results[index].waktu_save_lokasi).format('YYYY-MM-DD, h:mm:ss a')
      console.log(results[index].waktu_save_lokasi)
      theArray[index].waktu_save_lokasi = convertedDate;
    });


    // console.log(results);

    res.json({
      data: results
    });
  });


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


router.post('/update-mhs', async (req, res) => {
  console.log(req.body)
  connection.query('update mahasiswa SET ? where npm = ? ', [req.body, req.body.npm], function (error, results, fields) {
    if (error) throw error;
    // connected!
    // console.log(results);  
    res.sendStatus(200)
  });
});

router.post('/update-dsn', async (req, res) => {
  console.log(req.body)
  connection.query('update dosen SET ? where nip = ? ', [req.body, req.body.nip], function (error, results, fields) {
    if (error) throw error;
    // connected!
    // console.log(results);  
    res.sendStatus(200)
  });
});

router.post('/delete-mhs', async (req, res) => {
  console.log(req.body)
  connection.query('delete from mahasiswa where npm = ? ', req.body.npm, function (error, results, fields) {
    if (error) throw error;
    // connected!
    // console.log(results);  
    res.sendStatus(200)
  });
});


router.post('/delete-dsn', async (req, res) => {
  console.log(req.body)


  connection.query('select * from dosen where nip = ? ', req.body.nip, function (error, resultsDosen, fields) {
    if (error) throw error;
    console.log('resultsDosen', resultsDosen[0])
    connection.query('update jadwal_kelas SET dosen = ? where dosen = ? ', [null, resultsDosen[0].id], function (error, results, fields) {
      if (error) throw error;


      connection.query('delete from log_absensi_dosen where nip = ? ', req.body.nip, function (error, results, fields) {
        if (error) throw error;
        // connected!
        // console.log(results);  


        connection.query('delete from dosen where nip = ? ', req.body.nip, function (error, results, fields) {
          if (error) throw error;
          // connected!
          // console.log(results);  
          res.sendStatus(200)
        });

      });
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