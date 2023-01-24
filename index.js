const express = require('express');
const cors = require('cors');
const roslib = require('roslib');
const app = express();
const port = 8004;
const init_time = Date.now() / 1000;
let xvalue = 40;
let seq = 0;

function requestTime(){
  return Math.floor((Date.now() / 1000)-init_time).toString();
}

//Module usage
app.use(express.json());

let allowedOrigins = ['http://localhost:19001'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      let msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

//Routes
app.post('/api/pos', (req, res) => {
  console.log('Inbound API POST request at ' + requestTime() + ' seconds');
  console.log(req.body);
  xvalue = parseFloat(req.body.xvalue);
  res.sendStatus(201);
})

app.get('/api', (req, res) => {
  console.log('Inbound API GET request at ' + requestTime() + ' seconds');
  res.json({response: 'Touched the api', magic_number: xvalue});
})

app.get('/', (req, res) => {
  console.log('Inbound default GET request at ' + requestTime() + ' seconds');
  res.send('Debug route');
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

//ROS code
const ros_server = "localhost:8006"
const ros = new roslib.Ros();
ros.connect('ws://' + ros_server);
console.log("ROSLib server at " + ros_server)

app.post('/api/ros', (req, res) => {
  console.log('Inbound ROS API POST request at ' + requestTime() + ' seconds');
  console.log(req.body);
  const xvalue = parseFloat(req.body.xvalue);
  const yvalue = parseFloat(req.body.yvalue);
  const zvalue = parseFloat(req.body.zvalue);

  roslib.Topic()
  
  let setpointPosition = new roslib.Topic({
    ros : ros,
    name : '/uav/raw_ref',
    messageType : 'mavros_msgs/PositionTarget'
  });

  var new_setpoint = new roslib.Message({
    header: {
      seq: seq += 1,
      frame_id: "uav" 
    },
    coordinate_frame: 1,
    type_mask: 2040,
    position: {
      x : xvalue,
      y : yvalue,
      z : zvalue
    },
    velocity: {x: 0.0, y: 0.0, z: 0.0},
    acceleration_or_force: {x: 0.0, y: 0.0, z: 0.0},
    yaw: 0.0,
    yaw_rate: 0.0
  });

  setpointPosition.publish(new_setpoint);
  console.log("Sent setpoint")
  res.sendStatus(201);
})