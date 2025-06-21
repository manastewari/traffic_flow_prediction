from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from scipy import sparse

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Load trained model and encoder
model = joblib.load("traffic_model.pkl")
encoder = joblib.load("encoder.pkl")

# Define expected feature names
CATEGORICAL_FEATURES = ["City", "Vehicle Type", "Weather", "Economic Condition", "Day Of Week"]
NUMERICAL_FEATURES = ["Hour Of Day", "Speed", "Is Peak Hour", "Random Event Occurred", "Energy Consumption"]

@app.route('/')
def home():
    return "🚦 Traffic Flow Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Create DataFrame for one input
        cat_df = pd.DataFrame([[data[feature] for feature in CATEGORICAL_FEATURES]],
                              columns=CATEGORICAL_FEATURES)
        num_df = pd.DataFrame([[data[feature] for feature in NUMERICAL_FEATURES]],
                              columns=NUMERICAL_FEATURES)

        # Transform input using encoder
        X_cat = encoder.transform(cat_df)
        X_num = num_df.values

        # Combine features
        X = sparse.hstack([X_cat, X_num], format="csr")

        # Predict using model
        prediction = model.predict(X)[0]

        return jsonify({"predicted_traffic_density": round(prediction, 4)})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
