import socketio

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1ODk5NjI0OSwianRpIjoiYTg5ZTZjNjQtZmZmMy00YzcyLWFjYzQtM2ZmNGQ4Y2Y3YTAzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3NTg5OTYyNDksImNzcmYiOiI1ODg1YTAyYi1mZGQ0LTQ1OGEtOGY5Yy00MjZjYzliYzcwM2QiLCJleHAiOjE3NTkwODI2NDl9.N8ghbsqlDUQ0KUT6XNb0lfprkfRo5Sy_exZwUa1CgPg"
ROOM_ID = "1_2"  # Alice is 1, Bob is 2

sio = socketio.Client()

@sio.event
def connect():
    print("Alice connected to server")
    sio.emit("join", {"room": ROOM_ID})

@sio.event
def receive_message(data):
    sender = "Alice" if data["sender_id"] == 1 else "Bob"
    print(f"{sender}: {data['content']}")

def send_loop():
    while True:
        msg = input("Type a message: ")
        if not msg.strip():
            continue
        message_data = {
            "sender_id": 1,
            "receiver_id": 2,
            "content": msg,
            "room": ROOM_ID
        }
        sio.emit("send_message", message_data)

sio.connect("http://127.0.0.1:5000", auth={"token": TOKEN})
send_loop()
