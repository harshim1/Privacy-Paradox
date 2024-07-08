from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from cryptography.fernet import Fernet
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

mysql = MySQL(app)

# Generate or load the encryption key
key = Fernet.generate_key()
cipher_suite = Fernet(key)

@app.route('/')
def index():
    return "Chat Application is running!"

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    sender = data['sender']
    receiver = data['receiver']
    message = data['message']
    encrypt = data['encrypt']

    if encrypt:
        message = cipher_suite.encrypt(message.encode()).decode()

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO messages (sender, receiver, message) VALUES (%s, %s, %s)",
                (sender, receiver, message))
    mysql.connection.commit()
    cur.close()

    return jsonify({'status': 'Message sent!'}), 201

@app.route('/get_messages/<receiver>', methods=['GET'])
def get_messages(receiver):
    cur = mysql.connection.cursor()
    cur.execute("SELECT sender, message, timestamp FROM messages WHERE receiver = %s", [receiver])
    messages = cur.fetchall()
    cur.close()

    decrypted_messages = []
    for msg in messages:
        try:
            decrypted_message = cipher_suite.decrypt(msg[1].encode()).decode()
        except:
            decrypted_message = msg[1]
        decrypted_messages.append({'sender': msg[0], 'message': decrypted_message, 'timestamp': msg[2]})

    return jsonify(decrypted_messages), 200

if __name__ == '__main__':
    app.run(debug=True)
