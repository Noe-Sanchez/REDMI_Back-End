const express = require('express')
const app = express()
const port = 8004

app.get('/api', (req, res) => {
  console.log('Inbound API request');
  res.set({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.json({response: 'Touched the api', data: '420'});
})

app.get('/', (req, res) => {
  console.log('Inbound default request');
  res.send('Debug route')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
