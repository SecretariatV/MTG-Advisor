from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Cors allows you to communicate with React on different ports
CORS(app)

@app.route('/api/message')
def get_message():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(debug=True)