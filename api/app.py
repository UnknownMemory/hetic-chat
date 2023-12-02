import os

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from models.models import db

app: Flask = Flask(__name__)

load_dotenv('../api/.env.local') if app.debug else load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = str(os.getenv('POSTGRES_URL'))

cors: CORS = CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)

with app.app_context():
    db.create_all()
    db.session.commit()


@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"
