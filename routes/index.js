const express = require('express');
var mysql = require('mysql');
var _ = require('lodash');
var moment = require('moment');
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
const json2xls = require('json2xls');


const router = express.Router();
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'new_absensi_gundar'
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

router.post('/add-admin', async (req, res) => {
  console.log(req.body)
  const encriptedPass = SHA256(req.body.password);
  console.log(encriptedPass)
  connection.query('insert into admin set ? ', [{
    username: req.body.username,
    password: encriptedPass
  }], function (error, results, fields) {
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

  connection.query('SELECT kelas.kelas as nama_kelas, jadwal_kelas.id as id_jadwal, dosen.id as id_dosen, jadwal_kelas.*, dosen.* from jadwal_kelas INNER JOIN dosen ON jadwal_kelas.dosen = dosen.id inner join kelas on jadwal_kelas.kelas = kelas.id where kelas.id = ?', req.query.kelas, function (error, results, fields) {
    if (error) throw error;

    connection.query('SELECT log_absensi_dosen.*, kelas.* from kelas inner join jadwal_kelas on jadwal_kelas.kelas = kelas.id inner join log_absensi_dosen on jadwal_kelas.id = log_absensi_dosen.id_jadwal_kelas where kelas.id = ?', req.query.kelas, function (error, resultsLogDosen, fields) {
     
      connection.query('SELECT log_absensi_mhs.*, kelas.* from kelas inner join jadwal_kelas on jadwal_kelas.kelas = kelas.id inner join log_absensi_mhs on jadwal_kelas.id = log_absensi_mhs.id_jadwal_kelas where kelas.id = ? and log_absensi_mhs.npm = ?', [req.query.kelas, req.query.npm], function (error, resultsLogMhs, fields) {
      
     
      if (error) throw error;
      // connected!
      results.map((v) => {
        let z = 0;
        resultsLogDosen.map((q) => {
          if (v.id_jadwal === q.id_jadwal_kelas)
            z += 1;
          v.pertemuanDosen = z;
        })
      })

      results.map((v) => {
        let z = 0;
        resultsLogMhs.map((q) => {
          if (v.id_jadwal === q.id_jadwal_kelas)
            z += 1;
          v.pertemuanMhs= z;
        })
      })




      console.log(results);



      res.json({
        data: results,
        // resultsLogDosen
        // resultsLogMhs
      });
    });
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
  console.log(req.query)
  connection.query('SELECT kelas.kelas as nama_kelas, jadwal_kelas.id as id_jadwal, dosen.id as id_dosen, jadwal_kelas.*, dosen.* from jadwal_kelas INNER JOIN dosen ON jadwal_kelas.dosen = dosen.id inner join kelas on jadwal_kelas.kelas = kelas.id where dosen = ?', req.query.id, function (error, results, fields) {
    if (error) throw error;

    connection.query('SELECT log_absensi_dosen.id as id_log, log_absensi_dosen.*, jadwal_kelas.*, dosen.nama as nama_dosen, kelas from log_absensi_dosen inner join jadwal_kelas on jadwal_kelas.id = log_absensi_dosen.id_jadwal_kelas inner join dosen on dosen.id = jadwal_kelas.dosen where log_absensi_dosen.nip order by log_absensi_dosen.date_on_sign ASC', req.query.nip, function (error, resultsLogDosen, fields) {
      // connected!
      console.log(resultsLogDosen.length);
      results.map((v) => {
        let z = 0;
        resultsLogDosen.map((q) => {
          if (v.id_jadwal === q.id_jadwal_kelas)
            z += 1;
          v.pertemuanDosen = z;
        })
      })
      res.json({
        data: results,
        resultsLogDosen
      });
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
      return connection.query('SELECT log_absensi_mhs.id as id_log_mahasiswa, log_absensi_mhs.*, mahasiswa.* from log_absensi_mhs inner join jadwal_kelas on log_absensi_mhs.id_jadwal_kelas = jadwal_kelas.id inner join mahasiswa on log_absensi_mhs.npm = mahasiswa.npm where log_absensi_mhs.id_jadwal_kelas = ?', req.query.id_jadwal, function (error, resultsLogMhs, fields) {
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
          _.remove(resultsAllMhs, obj => obj.email === resultsLogMhs[w].email);
        }

        let setDefaultIsValid = {}
        resultsAllMhs.isValid = setDefaultIsValid;


        resultsAllMhs.map(val => {
          Object.assign(val, {
            isValid: null,
            date_on_sign: null,
            id_log_mahasiswa: null
          })
        })


        let unionTwice = _.union(resultsAllMhs, resultsLogMhs);

        console.log(unionTwice)
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
  } else if (req.query.npm) {
    return connection.query('SELECT * from log_absensi_mhs inner join jadwal_kelas on log_absensi_mhs.id_jadwal_kelas = jadwal_kelas.id inner join mahasiswa on log_absensi_mhs.npm = mahasiswa.npm where mahasiswa.npm =  ? ', req.query.npm, function (error, results, fields) {
      if (error) throw error;
      // connected!
      // console.log(results);

      res.json({
        data: results
      });
    });

  } else {
    return connection.query('SELECT * from log_absensi_mhs inner join jadwal_kelas on log_absensi_mhs.id_jadwal_kelas = jadwal_kelas.id inner join mahasiswa on log_absensi_mhs.npm = mahasiswa.npm inner join kelas on jadwal_kelas.kelas = kelas.id', function (error, results, fields) {
      if (error) throw error;
      // connected!

      results.map((v, i) => {
        v.pertemuan = i + 1;
        v.date_on_sign = moment(v.date_on_sign).lang('id').format('LLLL');
      })
      console.log(results);
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


  return connection.query('SELECT log_absensi_mhs.id as log_id,  kelas.kelas,  log_absensi_mhs.npm, mahasiswa.nama as nama_mahasiswa, mahasiswa.email as email_mahasiswa, dosen.nama as nama_dosen, dosen.nip, dosen.email, jadwal_kelas.hari, jadwal_kelas.matkul, jadwal_kelas.waktu, jadwal_kelas.ruang, log_absensi_mhs.address as lokasi_absen, log_absensi_mhs.date_on_sign as waktu_save_lokasi  from log_absensi_mhs inner join jadwal_kelas on log_absensi_mhs.id_jadwal_kelas = jadwal_kelas.id inner join mahasiswa on log_absensi_mhs.npm = mahasiswa.npm inner join dosen on jadwal_kelas.dosen = dosen.id inner join kelas on kelas.id = jadwal_kelas.kelas', function (error, results, fields) {
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


router.get('/get-all-kelas', async (req, res) => {
  connection.query('SELECT * from kelas ', function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results);
    res.json({
      data: results
    });
  });
});


router.get('/get-all-jadwal-kelas', async (req, res) => {
  console.log(req.query)
  connection.query('SELECT * from kelas where kelas = ? ', req.query.kelas, function (error, resultsKelas, fields) {
    if (error) throw error;

    connection.query('SELECT jadwal_kelas.id as id_jadwal, jadwal_kelas.* from jadwal_kelas inner join kelas on kelas.id = jadwal_kelas.kelas where jadwal_kelas.kelas = ? ', resultsKelas[0].id, function (error, results, fields) {
      if (error) throw error;
      // connected!

      connection.query('SELECT log_absensi_dosen.id as id_log, log_absensi_dosen.*, jadwal_kelas.*, dosen.nama as nama_dosen, kelas from log_absensi_dosen inner join jadwal_kelas on jadwal_kelas.id = log_absensi_dosen.id_jadwal_kelas inner join dosen on dosen.id = jadwal_kelas.dosen where log_absensi_dosen.id_jadwal_kelas order by log_absensi_dosen.date_on_sign ASC', function (error, resultsLogKelas, fields) {
        if (error) throw error;


        let weekRemoving = [];

        results.map((x) => {
          x.log_dosen = []
        })

        results.map((x, i) => {
          weekRemoving[i] = i = []
        })


        resultsLogKelas.map((z, x) => {
          results.map((v, i) => {
            if (z.id_jadwal_kelas === v.id_jadwal) {
              v.log_dosen.push({
                id_log: z.id_log,
                id_jadwal: v.id_jadwal,
                hari: v.hari,
                matkul: v.matkul,
                ruang: v.ruang,
                nama_dosen: z.nama_dosen,
                alamat: z.address,
                longitude: z.longitude,
                latitude: z.latitude,
                date_on_sign: moment(z.date_on_sign).format('DD-MM')
              })
            }
          })
        })


        let totalWeek = 12;


        for (let z = 0; z < results.length; z++) {
          for (let x = 0; x < totalWeek - results[z].log_dosen.length; x++) {
            weekRemoving[z].push({})
          }
        }

        results.map((v, i) => {
          for (let x = 0; x < weekRemoving[i].length; x++) {
            v.log_dosen.push({})
          }
        })

        console.log(resultsLogKelas)
        res.json({
          data: results,
          resultsLogKelas,
          kelas: req.query.kelas
        });
      });
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

router.post('/update-mhs-log-validation', async (req, res) => {
  console.log(req.body)
  connection.query('update log_absensi_mhs SET isValid =  ? where id = ? ', [req.body.isValid, req.body.id_log_mhs], function (error, results, fields) {
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
    console.log(results);
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

router.post('/delete-kelas', async (req, res) => {
  console.log(req.body)
  connection.query('delete from kelas where id = ? ', req.body.id, function (error, results, fields) {
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



///get-log
router.get('/get-log', async (req, res) => {
  console.log(req.query)

  connection.query('SELECT jadwal_kelas.kelas, mahasiswa.id as id_mahasiswa, mahasiswa.*, kelas.kelas as kelas from  jadwal_kelas inner join kelas on jadwal_kelas.kelas = kelas.id inner join mahasiswa on kelas.id = mahasiswa.kelas where jadwal_kelas.id = ? ', req.query.idJadwal, function (error, resultsAllMhs, fields) {
    connection.query('SELECT log_absensi_dosen.id as id_log_dsn, log_absensi_dosen.*, jadwal_kelas.*,  dosen.*, kelas.* from log_absensi_dosen inner join jadwal_kelas on log_absensi_dosen.id_jadwal_kelas = jadwal_kelas.id inner join dosen on log_absensi_dosen.nip = dosen.nip inner join kelas on jadwal_kelas.kelas = kelas.id where log_absensi_dosen.id = ?', req.query.id, function (error, resultsLogDosen, fields) {
      if (error) throw error;
      // connected!
      resultsLogDosen.map((v) => {
        v.date_on_sign = moment(v.date_on_sign).lang('id').format('LLL');
      })
      // console.log(resultsLogDosen)
      // console.log(coba)
      connection.query('SELECT log_absensi_mhs.id as id_log_mhs, log_absensi_mhs.*, jadwal_kelas.*, mahasiswa.*, kelas.* from log_absensi_mhs inner join jadwal_kelas on log_absensi_mhs.id_jadwal_kelas = jadwal_kelas.id inner join mahasiswa on log_absensi_mhs.npm = mahasiswa.npm inner join kelas on jadwal_kelas.kelas = kelas.id where log_absensi_mhs.id_jadwal_kelas = ? order by log_absensi_mhs.date_on_sign ASC', resultsLogDosen[0].id_jadwal_kelas, function (error, resultsLogMhs, fields) {
        if (error) throw error;


        resultsLogMhs.map((v) => {
          v.date_on_sign = moment(v.date_on_sign).lang('id').format('LLL');
        })

        let reWriteLogPertMhs = [];
        let findUniqueMhs = _.uniqBy(resultsLogMhs, 'npm');
        let getAllMhsWithSequence = [];

        findUniqueMhs.map((v, i) => {
          getAllMhsWithSequence[i] = _.filter(resultsLogMhs, {
            'npm': v.npm
          });
        })

        let atPert = req.query.idPert;
        getAllMhsWithSequence.map((v) => {
          console.log((v[parseInt(atPert - 1)]))
          if (v[parseInt(atPert)] != null) {
            reWriteLogPertMhs.push(v[atPert - 1])
          }
        })


        reWriteLogPertMhs.map((v) => {
          _.remove(resultsAllMhs, {
            npm: v.npm
          })
        })


        resultsAllMhs.map((v) => {
          v.isValid = null,
            v.date_on_sign = null
        })

        // resultsAllMhs.push(reWriteLogPertMhs)

        Array.prototype.push.apply(resultsAllMhs, reWriteLogPertMhs);

        // console.log(resultsAllMhs[1])


        res.json({
          data: {
            logDosen: resultsLogDosen[0],
            logMhs: resultsAllMhs,
            // getAllMhsWithSequence:getAllMhsWithSequence,
            // reWriteLogPertMhs
          }
        });
      });
    });
  });
});

router.get('/get-log-mobile', async (req, res) => {
  console.log(req.query.id_jadwal_kelas)

  // console.log(coba)

  connection.query('SELECT jadwal_kelas.kelas, mahasiswa.id as id_mahasiswa, mahasiswa.* from  jadwal_kelas inner join kelas on jadwal_kelas.kelas = kelas.id inner join mahasiswa on kelas.id = mahasiswa.kelas where jadwal_kelas.id = ? ', req.query.id_jadwal, function (error, resultsAllMhs, fields) {
    connection.query('SELECT log_absensi_mhs.id as id_log_mhs, log_absensi_mhs.*, jadwal_kelas.*, mahasiswa.*, kelas.* from log_absensi_mhs inner join jadwal_kelas on log_absensi_mhs.id_jadwal_kelas = jadwal_kelas.id inner join mahasiswa on log_absensi_mhs.npm = mahasiswa.npm inner join kelas on jadwal_kelas.kelas = kelas.id where log_absensi_mhs.id_jadwal_kelas = ? order by log_absensi_mhs.date_on_sign ASC', req.query.id_jadwal, function (error, resultsLogMhs, fields) {
      if (error) throw error;


      resultsLogMhs.map((v) => {
        v.date_on_sign = moment(v.date_on_sign).lang('id').format('LLL');
      })

      let reWriteLogPertMhs = [];
      let findUniqueMhs = _.uniqBy(resultsLogMhs, 'npm');
      let getAllMhsWithSequence = [];

      findUniqueMhs.map((v, i) => {
        getAllMhsWithSequence[i] = _.filter(resultsLogMhs, {
          'npm': v.npm
        });
      })

      let atPert = req.query.idPert;
      // console.log(parseInt( atPert))
      getAllMhsWithSequence.map((v) => {

        // console.log(v[parseInt(atPert)])
        if (v[parseInt(atPert)] !== undefined) {
          reWriteLogPertMhs.push(v[parseInt(atPert)])
        }
      })


      reWriteLogPertMhs.map((v) => {
        _.remove(resultsAllMhs, {
          npm: v.npm
        })
      })


      resultsAllMhs.map((v) => {
        v.id_log_mhs = null
        v.isValid = null,
          v.date_on_sign = null
      })

      // resultsAllMhs.push(reWriteLogPertMhs)

      Array.prototype.push.apply(resultsAllMhs, reWriteLogPertMhs);

      // console.log(reWriteLogPertMhs)
      res.json({
        data: {
          logMhs: resultsAllMhs,
          // getAllMhsWithSequence
        }
      });
    });
  });
});

router.get('/get-log-mobile-dosen', async (req, res) => {
  console.log(req.query)

  // console.log(coba)
  connection.query('SELECT log_absensi_dosen.id as id_log_dsn, log_absensi_dosen.*, jadwal_kelas.*, dosen.*, kelas.* from log_absensi_dosen inner join jadwal_kelas on log_absensi_dosen.id_jadwal_kelas = jadwal_kelas.id inner join kelas on jadwal_kelas.kelas = kelas.id inner join dosen on log_absensi_dosen.nip = dosen.nip where log_absensi_dosen.id_jadwal_kelas = ? order by log_absensi_dosen.date_on_sign ASC', req.query.id_jadwal, function (error, resultsLogMhs, fields) {
    if (error) throw error;


    resultsLogMhs.map((v) => {
      v.date_on_sign = moment(v.date_on_sign).lang('id').format('LLL');
    })

    let reWriteLogPertMhs = [];
    let findUniqueMhs = _.uniqBy(resultsLogMhs, 'nip');
    let getAllMhsWithSequence = [];

    findUniqueMhs.map((v, i) => {
      getAllMhsWithSequence[i] = _.filter(resultsLogMhs, {
        'nip': v.nip
      });
    })

    let atPert = req.query.idPert;
    // console.log(parseInt( atPert))
    getAllMhsWithSequence.map((v) => {

      // console.log(v[parseInt(atPert)])
      if (v[parseInt(atPert)] !== undefined) {
        reWriteLogPertMhs.push(v[parseInt(atPert)])
      }
    })


    // console.log(reWriteLogPertMhs)
    res.json({
      data: {
        logDsn: reWriteLogPertMhs,
        // getAllMhsWithSequence
      }
    });
  });
});


router.get('/get-log-mobile-mahasiswa', async (req, res) => {
  console.log(req.query)

  // console.log(coba)
  connection.query('SELECT log_absensi_mhs.id as id_log_mhs, log_absensi_mhs.*, jadwal_kelas.*, mahasiswa.*, kelas.* from log_absensi_mhs inner join jadwal_kelas on log_absensi_mhs.id_jadwal_kelas = jadwal_kelas.id inner join mahasiswa on log_absensi_mhs.npm = mahasiswa.npm inner join kelas on jadwal_kelas.kelas = kelas.id where log_absensi_mhs.id_jadwal_kelas = ? and log_absensi_mhs.npm = ? order by log_absensi_mhs.date_on_sign ASC', [req.query.id_jadwal, req.query.npm], function (error, resultsLogMhs, fields) {
    if (error) throw error;


    resultsLogMhs.map((v) => {
      v.date_on_sign = moment(v.date_on_sign).lang('id').format('LLL');
    })

    let reWriteLogPertMhs = [];
    let findUniqueMhs = _.uniqBy(resultsLogMhs, 'npm');
    let getAllMhsWithSequence = [];



    let atPert = req.query.idPert;
    // console.log(parseInt( atPert))



    if (resultsLogMhs[parseInt(atPert)] !== undefined) {
      reWriteLogPertMhs.push(resultsLogMhs[parseInt(atPert)])
    }




    // console.log(reWriteLogPertMhs)
    res.json({
      data: {
        logMhs: reWriteLogPertMhs,
        // resultsLogMhs
      }
    });
  });
});



router.post('/change-log-mhs/:id', async (req, res) => {
  console.log(req.body)
  console.log(req.params)
  connection.query('update log_absensi_mhs SET ? where id = ? ', [{
    isValid: req.body.status === '' ? null : req.body.status
  }, req.params.id], function (error, results, fields) {
    if (error) throw error;
    // connected!
    // console.log(results);  
    res.sendStatus(200)
  });



})



router.post('/change-log-dsn/:id', async (req, res) => {
  console.log(req.body)
  console.log(req.params)
  connection.query('update log_absensi_dosen SET ? where id = ? ', [{
    isValid: req.body.status === '' ? null : req.body.status
  }, req.params.id], function (error, results, fields) {
    if (error) throw error;
    // connected!
    // console.log(results);  
    res.sendStatus(200)
  });



})


router.post('/add-kelas', async (req, res) => {
  console.log(req.body)
  console.log(req.params)
  connection.query('insert into kelas set ? ', [{
    kelas: req.body.namaKelas,
  }], function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results);
    res.send(200);
  });



})

// get all log dosen
router.get('/get-all-log-dsn', async (req, res) => {

  console.log(req.query.nip)

  if (req.query.nip) {
    connection.query('SELECT * from log_absensi_dosen inner join jadwal_kelas on log_absensi_dosen.id_jadwal_kelas = jadwal_kelas.id inner join dosen on log_absensi_dosen.nip = dosen.nip inner join kelas on jadwal_kelas.kelas = kelas.id where log_absensi_dosen.id_jadwal_kelas = ?', req.query.id_jadwal, function (error, results, fields) {
      if (error) throw error;
      // connected!
      console.log(results);

      results.map((v, i) => {
        v.pertemuan = i + 1;
        v.date_on_sign = moment(v.date_on_sign).lang('id').format('LLLL');
      })
      console.log(results);

      res.json({
        data: results
      });
    });

  } else {
    connection.query('SELECT * from log_absensi_dosen inner join jadwal_kelas on log_absensi_dosen.id_jadwal_kelas = jadwal_kelas.id inner join dosen on log_absensi_dosen.nip = dosen.nip inner join kelas on jadwal_kelas.kelas = kelas.id', function (error, results, fields) {
      if (error) throw error;
      // connected!
      // console.log(results);
      results.map((v) => {
        v.date_on_sign = moment(v.date_on_sign).lang('id').format('LLL');
      })

      res.json({
        data: results
      });
    });
  }
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
      address,
      date_on_sign: moment().format('YYYY/MM/DD HH:mm:ss')

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
      address,
      date_on_sign: moment().format('YYYY/MM/DD HH:mm:ss')
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
  var query = connection.query("select * from dosen where email = ? ", req.body.email.toLowerCase(), function (err, data) {

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

router.post('/login-admin', async (req, res) => {
  var query = connection.query("select * from admin where username = ? ", req.body.username, function (err, data) {

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


      const encriptedPass = SHA256(req.body.password).toString();

      console.log(encriptedPass)
      if ((req.body.username === data[0].username) && (encriptedPass === data[0].password)) {

        console.log({
          status: 'Login berhasil.'
        });

        res.json({
          nama: data[0].username,
          status: 'Login Berhasil',
          isValid: true
        });

      } else {

        console.log({
          status: 'Id / password salah.'
        });

        res.json({
          status: 'Id / password salah.',
          isValid: false
        });

      }
    }
  });
});

module.exports = router;