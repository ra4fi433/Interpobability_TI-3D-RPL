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


//   while (true) {
//     try{
//     const res = await fetch("http://python-s:5000/rpc", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload)
//     });

//     // 1. Check if the HTTP status is 200-299
//     if (!res.ok) {
//       console.error(`Server returned status ${res.status}`);
//       const text = await res.text(); // Get the error as text/HTML
//       console.error("Error body:", text.substring(0, 100)); // Print first 100 chars
//     } else {
//       // 2. Only parse as JSON if the request was successful
//       const data = await res.json();
//       console.log("Success:", data);
//     }
//   }
//     catch (err) {
//     console.error("Network or Parsing Error:", err.message);
//     }
//     // console.log(await res.json());

//     await new Promise(r => setTimeout(r, 5000));
  
//   }
// }

// callRpc();

