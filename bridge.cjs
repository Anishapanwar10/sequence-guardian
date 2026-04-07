const http = require('http');
const { exec } = require('child_process');
const url = require('url');

const server = http.createServer((req, res) => {
  // Set CORS headers so the React app can talk to this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const queryObject = url.parse(req.url, true).query;

  if (req.url.startsWith('/update')) {
    const { id, start, end } = queryObject;
    console.log(`Received request to update ${id} to ${start}-${end}`);

    // Execute the Python script we created earlier
    exec(`python update_excel.py "${id}" "${start}" "${end}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
        return;
      }
      console.log(`Python Output: ${stdout}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Excel Updated Successfully', output: stdout }));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3001, () => {
  console.log('Excel Bridge Server running at http://localhost:3001');
});
