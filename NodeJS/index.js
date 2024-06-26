var express = require('express');
var mysql = require('mysql2');
var bodyParser = require('body-parser');
var axios = require('axios');
var fs = require('fs');
var path = require('path');

var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/content'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'Temder',
  password: 'Start123#',
  database: 'homepage',
  dateStrings: true
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
  if (req.url == '/api/views') {
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
  } else {
    next();
  }
});

// Create API endpoints to fetch the number of website views and calendar data
app.get('/api/views', function(req, res, next) {
  connection.query('SELECT views FROM website_views', function (error, result, fields) {
    if (error) {
      res.status(500).send('Database query (get website views) failed');
      return;
    }
    res.json({ count: result });
    next();
  });
});
app.get('/api/calendar/*', function(req, res, next) {
  connection.query(`SELECT * FROM calendar WHERE start_time LIKE '${req.params[0]}%';`, function (error, result, fields) {
    if (error) {
      res.status(500).send('Database query (get calendar event) failed');
    }
    res.json(result);
    next();
  })
});
app.get('/api/calendar/remove/*', function(req, res) {
  connection.query(`DELETE FROM calendar WHERE  event_id=${req.params[0]};`, function (error, result, fields) {
    if (error) {
      res.status(500).send('Database query (remove calendar event) failed');
    }
  })
});

// Handle form submission
app.post('/create_event', (req, res) => {
  const { title, description, start_time, end_time, location, is_all_day } = req.body;
  const isAllDay = is_all_day ? 1 : 0;

  const sql = 'INSERT INTO calendar (title, description, start_time, end_time, location, created_at, is_all_day) VALUES (?, ?, ?, ?, ?, NOW(), ?)';
  const values = [title, description, start_time, end_time, location, isAllDay];

  connection.query(sql, values, (err, result) => {
      if (err) throw err;
      res.send('New event created successfully');
  });
});

// Handle image generation
app.post('/generate-image', async (req, res) => {
  const { prompt, aspect_ratio, model, ai_image_number } = req.body;
  const apiKey = '21ce9ad7-e57a-42e4-a163-13c2082a98b7'; //c86d07e2-65be-41c5-9fe7-185950a97f7f(keine credits)
  
  try {
      const response = await axios.post('https://app.imggen.ai/v1/generate-image', {
          prompt,
          aspect_ratio,
          model
      }, {
          headers: {
              'X-IMGGEN-KEY': apiKey,
              'Content-Type': 'application/json'
          }
      });
      
      const imageBase64 = response.data.images[0];
      const imageBuffer = Buffer.from(imageBase64, 'base64');
      const imagePath = path.join(__dirname, 'content', 'images', `generated_image${ai_image_number}.jpg`);
      fs.writeFileSync(imagePath, imageBuffer);

      res.json({ imageUrl: `./images/generated_image${ai_image_number}.jpg` });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to generate image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});