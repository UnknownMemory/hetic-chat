import bcrypt

from sqlalchemy import exc, or_
from flask import request
from flask import jsonify
from datetime import datetime

from models.models import User, Chat, Message


def routes(app, database):

    @app.route("/api/register", methods=['POST'])
    def register():
        data: dict = request.json

        if data['username'] and data['password']:
            salt: bytes = bcrypt.gensalt()
            hashed: bytes = bcrypt.hashpw(data['password'].encode('utf-8'), salt)

            new_user: User = User(username=data['username'], password=hashed.decode('utf-8'))
            database.session.add(new_user)
            try:
                database.session.commit()
            except exc.IntegrityError:
                return jsonify({'error': 'Une erreur est survenue'})

            return jsonify({'id': new_user.id, 'user': new_user.username})

        return jsonify({'error': 'Une erreur est survenue'})
        

    @app.route("/api/login", methods=['POST'])
    def login():
        data: dict = request.json

        current_user: User = User.query.filter_by(username=data['username']).first()
        if current_user:
            if bcrypt.checkpw(data['password'].encode('utf8'), current_user.password.encode('utf8')):
                return jsonify({'id': current_user.id, 'user': current_user.username})

        return jsonify({'error': 'Une erreur est survenue'})
    

    @app.route("/api/user/<user_id>", methods=['GET', 'POST', 'UPDATE', 'DELETE'])
    def user(user_id: int):
        if request.method == 'GET':
            current_user: User = User.query.filter_by(id=user_id).first()
            if current_user:
                return jsonify({'id': current_user.id, 'user': current_user.username})


    @app.route("/api/users/<int:page>", methods=['GET'])
    def users(page):
        user_id = request.args.get('user_id')
        if request.method == 'GET':
            users_list: User = User.query.filter(User.id != user_id).order_by(User.id).paginate(page=page, per_page=10,
                                                                                                error_out=False)

            if users_list.items:
                return jsonify(users_list.items)
            return jsonify([])
        

    @app.route("/api/chat/goc", methods=['GET'])
    def chat_goc():
        user_id = request.args.get('user_id')
        user2_id = request.args.get('user2_id')

        filter_user = or_(Chat.user_id == user_id, Chat.user_id == user2_id)
        filter_user2 = or_(Chat.user2_id == user_id, Chat.user2_id == user2_id)

        room = Chat.query.filter(filter_user, filter_user2).first()

        if room:
            return jsonify(room)

        new_room: Chat = Chat(user_id=user_id, user2_id=user2_id)
        database.session.add(new_room)
        database.session.commit()
        if new_room:
            return jsonify(new_room)

        return jsonify({'error': 'Une erreur est survenue'})


    @app.route("/api/chat/<int:chat_id>", methods=['GET'])
    def chat(chat_id):

        room = Chat.query.filter(Chat.id == chat_id).first()

        if room:
            return jsonify(room)

        return jsonify({'error': 'Une erreur est survenue'})
    

    @app.route("/api/chat/<int:chat_id>/messages", methods=['GET'])
    def messages(chat_id):

        message: Message = Message.query.filter(Message.chat_id == chat_id).order_by(Message.id).paginate(page=1, per_page=10, error_out=False)

        if message.items:
            return jsonify(message.items)

        return jsonify({'error': 'Une erreur est survenue'})


    @app.route("/api/sendMsg", methods=['POST'])
    def send_msg():
        data: dict = request.json

        message: Message = Message(message=data['message'], chat_id=data['chat_id'], author=data['user_id'], created_at=datetime.now())
        database.session.add(message)
        database.session.commit()
        if message:
            return jsonify(message)

        return jsonify({'error': 'Une erreur est survenue'})
