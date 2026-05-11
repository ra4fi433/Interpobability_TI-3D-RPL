import time
import requests

url = "http://python-s:5000/rpc"

print("Client started", flush=True)

while True:
    payload = {
        "jsonrpc": "2.0",
        "method": "sample.multiply",
        "params": [5, 31],
        "id": 1
    }
    

    try:
        print("Sending request...", flush=True)

        res = requests.post(url, json=payload)

        print("Status:", res.status_code, flush=True)

        print("Response:", flush=True)
        print(res.json(), flush=True)

    except Exception as e:
        print("Error:", e, flush=True)

    time.sleep(5)

# import time
# import requests

# url = "http://python-s:5000/rpc"

# while True:
#     payload = {
#         "jsonrpc": "2.0",
#         "method": "sample.multiply",
#         "params": [5, 31],
#         "id": 1
#     }

#     try:
#         res = requests.post(url, json=payload)

#         print("Response:")
#         print(res.json())

#     except Exception as e:
#         print("Error:", e)

#     time.sleep(5)


# # if __name__ == '__main__':
# #     app.run(host="0.0.0.0", port=50000)
    
# # url = "http://python-s:5000/rpc"
# # payload = {"jsonrpc": "2.0", "method": "sample.multiply", "params": [5, 31], "id": 1} # Tugas 
# # # payload = {"jsonrpc": "2.0", "method": "sample.add", "params": [5, 31], "id": 1} # Latihan
# # res = requests.post(url, json=payload)
# # print("Response:")
# # print(res.json()) # Output: {"jsonrpc":"2.0", "result":8, "id":1}
