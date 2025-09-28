import socketio

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1OTAxMDU4OCwianRpIjoiNGM4MzhhZmItNTNhMS00ODE2LWI2MGItNTY2Y2RmYjJlZWEzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjIiLCJuYmYiOjE3NTkwMTA1ODgsImNzcmYiOiJlYzI0Yzk1OC0yZDM5LTRkZGYtODYwNS1mNDE0MTYxZGE0MzEiLCJleHAiOjE3NTkwOTY5ODh9.FAVZbJ1oA1B5VOa-ihCtyx5SQo6erNhD988RpWGRISQ"
ROOM_ID = "1_2"  # Alice is 1, Bob is 2

sio = socketio.Client()

@sio.event
def connect():
    print("Bob connected to server")
    sio.emit("join", {"room": ROOM_ID})

@sio.event
def receive_message(data):
    sender = "Bob" if data["sender_id"] == 2 else "Alice"
    print(f"{sender}: {data['content']}")

def send_loop():
    while True:
        msg = input("Type a message: ")
        if not msg.strip():
            continue
        message_data = {
            "sender_id": 2,
            "receiver_id": 1,
            "content": msg,
            "room": ROOM_ID
        }
        sio.emit("send_message", message_data)

sio.connect("http://127.0.0.1:5000", auth={"token": TOKEN})
send_loop()
