import bcrypt

from sqlalchemy import exc
from flask import request
from flask import jsonify

from models.models import User


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
        if request.method == 'GET':
            users_list: User = User.query.order_by(User.id).paginate(page=page, per_page=10, error_out=False)

            if users_list.items:
                return jsonify(users_list.items)
            return jsonify({'error': 'Une erreur est survenue'})
