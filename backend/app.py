from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, decode_token
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, disconnect
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)

# --------------------------
# Config
# --------------------------
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'dating.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True)

# --------------------------
# Models
# --------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# --------------------------
# Create DB
# --------------------------
with app.app_context():
    db.create_all()

# --------------------------
# Auth Routes
# --------------------------
@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'Email already exists'}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg': 'User created successfully'}), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({'access_token': access_token, 'username': user.username, 'user_id': user.id}), 200
    return jsonify({'msg': 'Invalid credentials'}), 401

# --------------------------
# Users Route
# --------------------------
@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user_id = get_jwt_identity()
    users = User.query.filter(User.id != int(current_user_id)).all()
    output = [{'id': u.id, 'username': u.username, 'email': u.email} for u in users]
    return jsonify(output), 200

# --------------------------
# Chat Routes (REST)
# --------------------------
@app.route('/messages', methods=['POST'])
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    receiver_id = data.get('receiver_id')
    content = data.get('content')

    if not content or not receiver_id:
        return jsonify({'msg': 'Missing content or receiver_id'}), 400

    msg = Message(sender_id=current_user_id, receiver_id=receiver_id, content=content)
    db.session.add(msg)
    db.session.commit()

    return jsonify({'msg': 'Message sent', 'message': {
        'id': msg.id,
        'sender_id': msg.sender_id,
        'receiver_id': msg.receiver_id,
        'content': msg.content,
        'timestamp': msg.timestamp.isoformat()
    }}), 201

@app.route('/messages/<int:user_id>', methods=['GET'])
@jwt_required()
def get_messages(user_id):
    current_user_id = get_jwt_identity()
    messages = Message.query.filter(
        ((Message.sender_id==current_user_id) & (Message.receiver_id==user_id)) |
        ((Message.sender_id==user_id) & (Message.receiver_id==current_user_id))
    ).order_by(Message.timestamp).all()

    output = [{
        'id': m.id,
        'sender_id': m.sender_id,
        'receiver_id': m.receiver_id,
        'content': m.content,
        'timestamp': m.timestamp.isoformat()
    } for m in messages]

    return jsonify(output), 200

# --------------------------
# WebSocket Events
# --------------------------
@socketio.on('connect')
def socket_connect(auth):
    token = auth.get("token") if auth else None
    if not token:
        disconnect()
        return
    try:
        decoded = decode_token(token)
        print(f"Socket connected: User {decoded['sub']}")
    except Exception as e:
        print("JWT decode failed:", e)
        disconnect()

@socketio.on('join')
def handle_join(data):
    room = data['room']
    join_room(room)
    print(f"User joined room {room}")

@socketio.on('send_message')
def handle_send_message(data):
    room = data['room']
    message = {
        'id': data.get('id'),
        'sender_id': data['sender_id'],
        'receiver_id': data['receiver_id'],
        'content': data['content'],
        'timestamp': data.get('timestamp') or datetime.utcnow().isoformat()
    }

    # Broadcast to the room
    emit('receive_message', message, room=room)

    # Save to DB if not already saved
    if not data.get('id'):
        new_msg = Message(
            sender_id=data['sender_id'],
            receiver_id=data['receiver_id'],
            content=data['content']
        )
        db.session.add(new_msg)
        db.session.commit()
        message['id'] = new_msg.id
        emit('receive_message', message, room=room)  # ensure everyone gets DB id

# --------------------------
# Run
# --------------------------
if __name__ == '__main__':
    socketio.run(app, debug=True)
