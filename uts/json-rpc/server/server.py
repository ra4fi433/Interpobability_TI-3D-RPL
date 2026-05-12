from flask import Flask, request, jsonify
app = Flask (__name__)
@app.route('/rpc', methods=['POST'])

# Tugas 

def rpc():
    data = request.get_json()

    if data["method"] == "sample.add":
        result = sum(data["params"])
        return jsonify({
            "jsonrpc": "2.0",
            "result": result,
            "id": data["id"]
        })

    elif data["method"] == "sample.multiply":
        result = data["params"][0] * data["params"][1]
        return jsonify({
            "jsonrpc": "2.0",
            "result": result,
            "id": data["id"]
        })

    elif data["method"] == "sample.subtract":
        result = data["params"][0] - data["params"][1]
        return jsonify({
            "jsonrpc": "2.0",
            "result": result,
            "id": data["id"]
        })

    else:
        return jsonify({
            "jsonrpc": "2.0",
            "error": "Method not found",
            "id": data["id"]
        })
# latihan 
# def rpc():
#     data = request.get_json()
#     if data["method"] == "sample.add":
#         result = sum(data["params"])
#         return jsonify({"jsonrpc": "2.0", "result": result, "id": data["id"]})
#     else:
#         return jsonify({"jsonrpc": "2.0", "error": "Method not found", "id": data["id"]})
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)