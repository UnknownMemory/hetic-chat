import os

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv('./api/.env.local') if app.debug else load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = str(os.getenv('POSTGRES_URL'))

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
db = SQLAlchemy(app)

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"
