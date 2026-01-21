from flask import Flask
from routes.auth import auth
from routes.crop_classification import crop_classify
from flask_cors import CORS
from routes.weather_routes import weather_bp
from routes.market_routes import market_bp
from routes.farmer_routes import farmer_bp
from routes.chatbot_routes import chatbot_bp
from routes.soil_routes import soil_bp
app = Flask(__name__)
CORS(app)
app.register_blueprint(chatbot_bp)
app.register_blueprint(weather_bp)
app.register_blueprint(market_bp)
app.register_blueprint(auth)
app.register_blueprint(crop_classify)
app.register_blueprint(farmer_bp)
app.register_blueprint(soil_bp)
if __name__ == "__main__":
    app.run(debug=True)