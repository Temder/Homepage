var express = require('express');
var mysql = require('mysql2');
var app = express();

app.use(express.static(__dirname + '/content'));

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'Temder',
  password: 'Start123#',
  database: 'homepage'
});

connection.connect(function(error) {
  if (error) throw error;
  console.log('Connected!');
});

// Middleware to get client IP
app.use((req, res, next) => {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Handle IPv4-mapped IPv6 addresses
  if (ip.includes('::ffff:')) {
    ip = ip.split('::ffff:')[1];
  }

  req.clientIp = ip;
  next();
});

// Middleware to log and update views count
app.use((req, res, next) => {
  const clientIp = req.clientIp;

  connection.query('SELECT * FROM website_views WHERE ip_addr = INET_ATON(?)', [clientIp], (err, result) => {
    if (err) {
      console.error('Database query failed', err);
      return res.status(500).send('Database query failed');
    }

    if (result.length > 0) {
      // IP exists, update views
      connection.query('UPDATE website_views SET views = views + 1 WHERE ip_addr = INET_ATON(?)', [clientIp], (err, updateResult) => {
        if (err) {
          console.error('Database update failed', err);
          return res.status(500).send('Database update failed');
        }
        console.log('View count updated');
        next();
      });
    } else {
      // IP does not exist, insert new row
      connection.query('INSERT INTO website_views (ip_addr, views) VALUES (INET_ATON(?), 1)', [clientIp], (err, insertResult) => {
        if (err) {
          console.error('Database insert failed', err);
          return res.status(500).send('Database insert failed');
        }
        console.log('New IP recorded');
        next();
      });
    }
  });
});

// Create an API endpoint to fetch the number of website views
app.get('/api/views', function(req, res) {
  connection.query("SELECT views FROM website_views", function (error, result, fields) {
    if (error) {
      res.status(500).send('Database query failed');
      return;
    }
    res.json({ count: result });
  });
});

app.listen(8080);
console.log('Running at http://127.0.0.1:8080');