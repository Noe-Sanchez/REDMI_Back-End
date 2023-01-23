const express = require('express')
const cors = require('cors');
const app = express()
const port = 8004
const init_time = Date.now() / 1000;
let magic_number = 40

function requestTime(){
  return Math.floor((Date.now() / 1000)-init_time).toString();
}

app.use(express.json()) 

var allowedOrigins = ['http://localhost:19001'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.post('/api', (req, res) => {
  console.log('Inbound API POST request at ' + requestTime() + ' seconds');
  console.log(req.body)
  magic_number = parseFloat(req.body.data_to_post);
  res.sendStatus(201)
})

app.get('/api', (req, res) => {
  console.log('Inbound API GET request at ' + requestTime() + ' seconds');
  res.json({response: 'Touched the api', magic_number: magic_number});
})

app.get('/', (req, res) => {
  console.log('Inbound default GET request at ' + requestTime() + ' seconds');
  res.send('Debug route')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
