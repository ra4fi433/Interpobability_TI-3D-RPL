//---------------Libraries---------------
const express = require("express");
const xmlrpc = require("xmlrpc");
const bodyParser = require("body-parser");
//---------------Libraries---------------

//------------Create Express app
const app = express();
app.use(bodyParser.json());
//------------Create Express app

//-----------------XML-RPC client (connect to your Java service)-----------------
const client = xmlrpc.createClient({
  host: "java-dev", // or service name if using docker-compose
  port: 8080,
  path: "/RPC2"
});
//-----------------XML-RPC client (connect to your Java service)-----------------

//---------------------------Serve simple UI-------------------------------------
app.get("/", (req, res) => {
  // HTML response
  res.send(`
    <!DOCTYPE html>
    <html>
    <head> 
    <!-- -----Styles for UI------ -->
      <title>Calculator XML-RPC</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          font-family: sans-serif;
          background-color: #f4f4f9;
        }
        .container {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        input {
          padding: 8px;
          margin: 5px;
          width: 60px;
        }
        button {
          padding: 8px 15px;
          margin: 5px;
          cursor: pointer;
        }
        .reset-btn {
          background-color: #ff4d4d;
          color: white;
          border: none;
          border-radius: 4px;
        }
        #result {
          margin-top: 20px;
          color: #333;
        }
      </style>
    </head>
<!-- -----Styles for UI------ -->
    <body>
<!-- -----Combination of HTML and JS to simultaneously call API and display result--------------- -->
      <div class="container">
        <h1>Calculator XML-RPC</h1>
        <input id="x" type="number" placeholder="x" />
        <input id="y" type="number" placeholder="y" />
        <br/><br/>
        <button onclick="calc('hitungPenjumlahan')">Tambah</button>
        <button onclick="calc('hitungPengurangan')">Kurang</button>
        <button onclick="calc('hitungPerkalian')">Kali</button>
        <button onclick="calc('hitungPembagian')">Bagi</button>
        <br/>
        <button class="reset-btn" onclick="resetForm()">Reset</button>

        <h2 id="result">Hasil: -</h2>
      </div>
<!-- -----Combination of HTML and JS to simultaneously call API and display result--------------- -->

<!-- ----- JavaScript to call API --------------- -->
      <script>
        async function calc(method) {
          const x = document.getElementById('x').value;
          const y = document.getElementById('y').value;
          
          if(x === '' || y === '') {
            alert("Masukkan angka terlebih dahulu!");
            return;
          }

          const res = await fetch('/api/' + method, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ x, y })
          });

          const data = await res.json();
          document.getElementById('result').innerText = "Hasil: " + data.result;
        }

        function resetForm() {
          document.getElementById('x').value = '';
          document.getElementById('y').value = '';
          document.getElementById('result').innerText = "Hasil: -";
        }
      </script>
<!-- ----- JavaScript to call API --------------- -->
    </body>
    </html>
  `);
});
//---------------------------Serve simple UI-------------------------------------


//-------------------------API routes (bridge to XML-RPC)------------------------
app.post("/api/:method", (req, res) => {
  const { x, y } = req.body;
  const method = req.params.method;

  client.methodCall(`server.${method}`, [parseInt(x), parseInt(y)], (err, value) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ result: value });
  });
});
//-------------------------API routes (bridge to XML-RPC)------------------------

//------------------------------Start server-------------------------------------
app.listen(3000, () => {
  console.log("UI running at http://localhost:3000");
});
//------------------------------Start server-------------------------------------
