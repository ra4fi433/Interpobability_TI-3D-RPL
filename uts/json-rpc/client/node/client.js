//  const fetch = require("node-fetch");

// const url = "http://python:5000/rpc";

async function callRpc() {
  const payload = 

  {
    jsonrpc: "2.0",
    method: "sample.add",
    params: [10, 1],
    id: 2
  }



  while (true) {
    const res = await fetch("http://python-s:5000/rpc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    console.log(await res.json());

    await new Promise(r => setTimeout(r, 5000));
  }
}

callRpc();

