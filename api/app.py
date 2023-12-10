import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from models.models import db
from views.routes import routes


app: Flask = Flask(__name__)
PSQL_URL: str = ''

if app.debug:
    load_dotenv('../api/.env.local')
    PSQL_URL = str(os.getenv('POSTGRES_URL'))
else:
    load_dotenv()
    PSQL_URL: str = str(os.getenv('POSTGRES_URL')).replace('postgres://', 'postgresql://')

app.config['SQLALCHEMY_DATABASE_URI'] = PSQL_URL

cors: CORS = CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)

with app.app_context():
    db.create_all()
    db.session.commit()

routes(app, db)
