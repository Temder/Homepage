var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var mysql = require('mysql2');
var path = require('path');
var livereload = require('livereload');
var connectLivereload = require('connect-livereload');

// Create a livereload server with more specific configuration
const liveReloadServer = livereload.createServer({
  exts: ['html', 'css', 'js', 'png', 'gif', 'jpg', 'jpeg'],
  delay: 0,
  port: 35729
});

// Watch the entire src directory
liveReloadServer.watch(path.join(__dirname, 'src'));

// Wait for browser to connect before actually reloading
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

var app = express();
var PORT = process.env.PORT || 8080;

// Important: Add livereload middleware before any other middleware
app.use(connectLivereload());

app.use(express.static(__dirname + '/src'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//#region Database connection
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', //Temder
  password: '', //Start123#
  database: 'homepage',
  dateStrings: true
});

connection.connect(function(error) {
  if (error) throw error;
  console.log('Connected to the database');
});
//#endregion




//#region IP getting
app.use((req, res, next) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Handle IPv4-mapped IPv6 addresses
  if (ip.includes('::ffff:')) {
    ip = ip.split('::ffff:')[1];
  }

  req.clientIp = ip;
  next();
});
//#endregion




//#region Database update views
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
//#endregion




//#region Views and calendar data
app.get('/api/views', function(req, res, next) {
  connection.query('SELECT views FROM website_views', function (error, result, fields) {
    if (error) {
      res.status(500).send('Database query (get website views) failed');
      return;
    }
    res.json(result);
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
    next();
  })
});
//#endregion




//#region Calendar event creation
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
//#endregion




//#region Image getting
var imgCount = 0;
app.get('/images', (req, res) => {
  const directoryPath = './src/graphics/generated_images';
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory: ' + err);
    }
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file) && file.includes('generated_image'))
                        .map(file => path.join(directoryPath.replace('src/', ''), file));
    imgCount = images.length;
    res.json(images);
  });
});
//#endregion




//#region Image generation
app.post('/generate-image', async (req, res) => {
  const { prompt, width, height } = req.body;
  /*const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjdlYzA4NWQwNmM1ZTUxNzFlNjUwMTllMmFkMzA2NDdiIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDctMDNUMDc6Mzk6MzQuNjU0ODU4In0.97IJq6HF-ZBZd6tfOPDLn14bSqRombLL050P0cBouL8'; //21ce9ad7-e57a-42e4-a163-13c2082a98b7 c86d07e2-65be-41c5-9fe7-185950a97f7f(keine credits)
  var process_id = '';

  const options = {
    method: 'POST',
    url: 'https://api.monsterapi.ai/v1/generate/sdxl-base',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    data: {enhance: true, optimize: true, safe_filter: true, prompt: prompt, aspect_ratio: aspect_ratio, style: style}
  };
  
  axios
    .request(options)
    .then(function (response) {
      process_id = response.data.process_id;

      const checkStatus = () => {
        const options2 = {
          method: 'GET',
          url: `https://api.monsterapi.ai/v1/status/${process_id}`,
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${apiKey}`
          }
        };
        axios
          .request(options2)
          .then(function (response) {
            const { status, result } = response.data;
            if (status === 'IN_QUEUE' || status === 'IN_PROGRESS') {
              console.log('Status:', status, ' - Checking again in 5 seconds...');
              setTimeout(checkStatus, 5000); // Poll every 5 seconds
            } else if (status === 'COMPLETED') {
              console.log('Image generated:', result);
              const imageUrl = result.output[0];
              saveImage(imageUrl);
            } else {
              console.error('Unexpected status:', status);
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      }
      checkStatus(); // Initial status check
    })
    .catch(function (error) {
      console.error(error);
    });

  function saveImage(url) {
    axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer'
    })
      .then(function (response) {
        const imageName = path.join(__dirname, 'content', 'images', `generated_image${ai_image_number}.jpg`);
        fs.writeFile(imageName, response.data, 'binary', function (err) {
          if (err) {
            console.error('Error saving the image:', err);
          } else {
            console.log('Image saved as', imageName);
            res.json({ imageUrl: `./images/generated_image${ai_image_number}.jpg` });
          }
        });
      })
      .catch(function (error) {
        console.error('Error fetching the image:', error);
      });
  }*/

  /*axios
    .request(options2)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });*/
  /*try {
    const directoryPath = path.join(__dirname, 'content/images');
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.log('Unable to scan directory: ' + err);
      }
      const images = files.filter(file => /\.(jp.|jp.g|png|g.f)$/.te.t(file).&& file.includes('generated_image'));
      imgCount = images.length;
    });
    
    const response = await axios.post('http://localhost:7860/sdapi/v1/txt2img', {
      prompt,
      width,
      height
    });
    //console.log(response.data.info);

    imgCount++;
    const imageBase64 = response.data.images[0];
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const imagePath = path.join(__dirname, 'content', 'images', `generated_image${imgCount}.jpg`);
    fs.writeFileSync(imagePath, imageBuffer);

    res.json({ imageUrl: `./images/generated_image${imgCount}.jpg` });
  } catch (error) {
    if (error.data) {
      console.log(error.data);
    } else {
      console.log(error);
    }
    res.status(500).json({ error: 'Failed to generate image' });
  }*/
});
//#endregion




//#region Image generation status
app.get('/generationStatus', async (req, res) => {
  
});
//#endregion

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});