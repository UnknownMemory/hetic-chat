from flask_sqlalchemy import SQLAlchemy

db: SQLAlchemy = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String(16), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
