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

            new_user: User = User(username=data['username'], password=hashed)
            database.session.add(new_user)
            try:
                database.session.commit()
            except exc.IntegrityError:
                return jsonify({'error': 'Une erreur est survenue'})

            return jsonify({'success': 'Compte créé'})

        return jsonify({'error': 'Une erreur est survenue'})

    @app.route("/api/user/<user_id>", methods=['GET', 'POST', 'UPDATE', 'DELETE'])
    def users(user_id):
        return f"<p>Hello, World! {user_id}</p>"
