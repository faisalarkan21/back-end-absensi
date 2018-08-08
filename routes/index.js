const express = require('express');
var mysql = require('mysql');

const router = express.Router();
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'absensi_gundar'
});


router.get('/', async (req, res) => {
  res.json({
    response: "Halloo"
  })
});




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
  connection.query('SELECT * from jadwal_kelas', function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results);
    res.json({data:results});
  });
});

router.get('/jadwal-dosen', async (req, res) => {
  connection.query('SELECT * from jadwal_ajar', function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results);
    res.json({data:results});
  });
});

router.post('/save-location-mhs', async (req, res) => {

  console.log(req.body)

  const { id_jadwal_kelas, longitude, latitude, id } = req.body;

  connection.query('update mahasiswa SET id_jadwal_kelas = ?, longitude = ?, latitude = ? where id = ?', [ id_jadwal_kelas, longitude, latitude, id], function (error, results, fields) {
    if (error) throw error;
    console.log(results.insertId);
  });



})


router.post('/login', async (req, res) => {

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

    

      if ((req.body.email === data[0].email) && (req.body.password === data[0].password)) {

        console.log({
          status: 'Login berhasil.'
        });

        res.json({
          id: data[0].id,
          nama: data[0].nama,
          email: data[0].email,
          npm: data[0].npm,
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

router.post('/main-login', async (req, res) => {

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