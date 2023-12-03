from dataclasses import dataclass

from flask_sqlalchemy import SQLAlchemy

db: SQLAlchemy = SQLAlchemy()


@dataclass
class User(db.Model):
    __tablename__ = "user"

    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username: str = db.Column(db.String(16), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)


@dataclass
class Chat(db.Model):
    __tablename__ = "chat"

    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id: int = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user2_id: int = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    __table_args__ = (db.UniqueConstraint("user_id", "user2_id"),)


@dataclass
class Message(db.Model):
    __tablename__ = "message"

    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    chat_id: int = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False)
    author: int = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at: str = db.Column(db.DateTime, nullable=False)
