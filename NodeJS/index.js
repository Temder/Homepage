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
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  req.clientIp = ip;
  next();
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

app.get('/', (req, res) => {
    const clientIp = req.clientIp;
  
    con.query('SELECT * FROM website_views WHERE ip_addr = INET_ATON(?)', [clientIp], (err, result) => {
        if (err) {
            res.status(500).send('Database query failed');
            return;
        }
    
        if (result.length > 0) {
            // IP exists, update views
            con.query('UPDATE website_views SET views = views + 1 WHERE ip_addr = INET_ATON(?)', [clientIp], (err, updateResult) => {
                if (err) {
                    res.status(500).send('Database update failed');
                    return;
                }
                res.send('View count updated');
            });
        } else {
            // IP does not exist, insert new row
            con.query('INSERT INTO website_views (ip_addr, views) VALUES (INET_ATON(?), 1)', [clientIp], (err, insertResult) => {
                if (err) {
                    res.status(500).send('Database insert failed');
                    return;
                }
                res.send('New IP recorded');
            });
        }
    });
});

app.listen(8080);
console.log('Running at Port 8080');