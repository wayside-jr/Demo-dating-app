from flask import Flask, request, jsonify, send_from_directory
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
UPLOAD_FOLDER = os.path.join(basedir, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'dating.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    photo = db.Column(db.String(200), nullable=True)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# NEW: Like model
class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    liker_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    liked_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# --------------------------
# Create DB
# --------------------------
with app.app_context():
    db.create_all()

# --------------------------
# Auth Routes (same)
# --------------------------
@app.route('/auth/signup', methods=['POST'])
def signup():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    photo_file = request.files.get('photo')

    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'Email already exists'}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    photo_filename = None
    if photo_file:
        ext = os.path.splitext(photo_file.filename)[1]
        photo_filename = f"{datetime.utcnow().timestamp()}_{username}{ext}"
        photo_file.save(os.path.join(app.config['UPLOAD_FOLDER'], photo_filename))

    new_user = User(username=username, email=email, password=hashed_pw, photo=photo_filename)
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
        return jsonify({
            'access_token': access_token,
            'username': user.username,
            'user_id': user.id,
            'photo': user.photo
        }), 200
    return jsonify({'msg': 'Invalid credentials'}), 401

@app.route('/auth/edit', methods=['PUT'])
@jwt_required()
def edit_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    username = request.form.get('username')
    email = request.form.get('email')
    photo_file = request.files.get('photo')

    if username: 
        user.username = username
    if email: 
        user.email = email
    if photo_file:
        if user.photo:
            old_path = os.path.join(app.config['UPLOAD_FOLDER'], user.photo)
            if os.path.exists(old_path):
                os.remove(old_path)
        ext = os.path.splitext(photo_file.filename)[1]
        photo_filename = f"{datetime.utcnow().timestamp()}_{user.id}{ext}"
        photo_file.save(os.path.join(app.config['UPLOAD_FOLDER'], photo_filename))
        user.photo = photo_filename

    db.session.commit()

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'photo': user.photo
    }), 200

@app.route('/auth/delete', methods=['DELETE'])
@jwt_required()
def delete_account():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    if user.photo:
        photo_path = os.path.join(app.config['UPLOAD_FOLDER'], user.photo)
        if os.path.exists(photo_path):
            os.remove(photo_path)

    db.session.delete(user)
    db.session.commit()
    return jsonify({'msg': 'Account deleted successfully'}), 200

# --------------------------
# Serve uploaded photos
# --------------------------
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --------------------------
# Users Route (now returns likes_count)
# --------------------------
@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user_id = int(get_jwt_identity())
    users = User.query.filter(User.id != current_user_id).all()
    output = []
    for u in users:
        likes_count = Like.query.filter_by(liked_user_id=u.id).count()
        output.append({
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'photo': u.photo,
            'likes_count': likes_count
        })
    return jsonify(output), 200

@app.route('/users/me', methods=['GET'])
@jwt_required()
def get_me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404
    return jsonify({'id': user.id, 'username': user.username, 'email': user.email, 'photo': user.photo}), 200

# --------------------------
# Likes Routes
# --------------------------
@app.route('/likes', methods=['GET'])
@jwt_required()
def get_my_likes():
    """Return ids the current user has liked"""
    current_user_id = int(get_jwt_identity())
    likes = Like.query.filter_by(liker_id=current_user_id).all()
    return jsonify([l.liked_user_id for l in likes]), 200

@app.route('/likes/<int:user_id>', methods=['POST'])
@jwt_required()
def like_user(user_id):
    current_user_id = int(get_jwt_identity())
    if current_user_id == user_id:
        return jsonify({'msg': 'Cannot like yourself'}), 400
    if Like.query.filter_by(liker_id=current_user_id, liked_user_id=user_id).first():
        return jsonify({'msg': 'Already liked'}), 400
    new_like = Like(liker_id=current_user_id, liked_user_id=user_id)
    db.session.add(new_like)
    db.session.commit()
    return jsonify({'msg': 'Liked'}), 201

@app.route('/likes/<int:user_id>', methods=['DELETE'])
@jwt_required()
def unlike_user(user_id):
    current_user_id = int(get_jwt_identity())
    like = Like.query.filter_by(liker_id=current_user_id, liked_user_id=user_id).first()
    if not like:
        return jsonify({'msg': 'Not liked'}), 404
    db.session.delete(like)
    db.session.commit()
    return jsonify({'msg': 'Unliked'}), 200

# --------------------------
# Chat Routes (same)
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
# WebSocket Events (same)
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
    emit('receive_message', message, room=room)
    if not data.get('id'):
        new_msg = Message(sender_id=data['sender_id'], receiver_id=data['receiver_id'], content=data['content'])
        db.session.add(new_msg)
        db.session.commit()
        message['id'] = new_msg.id
        emit('receive_message', message, room=room)

# --------------------------
# Run
# --------------------------
if __name__ == '__main__':
    socketio.run(app, debug=True)