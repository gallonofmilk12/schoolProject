import json
from flask import Flask, jsonify
from flask_cors import CORS  # Add this import

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load data from JSON file
def load_graph_data():
    with open('graph_data.json', 'r') as file:
        return json.load(file)

# Load data once when starting the application
graph_data = load_graph_data()

@app.route('/api/graphs/<graph_type>')
def get_graph_data(graph_type):
    if graph_type in graph_data:
        return jsonify(graph_data[graph_type])
    return jsonify({'error': 'Graph type not found'}), 404

if __name__ == '__main__':
    try:
        print("Starting server on http://localhost:5000")
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        print(f"Error starting server: {e}")
