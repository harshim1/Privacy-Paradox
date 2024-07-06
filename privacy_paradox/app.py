from flask import Flask, request, jsonify
from flask_mysqldb import MySQL

app = Flask(__name__)

# MySQL database configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'your_password'
app.config['MYSQL_DB'] = 'privacy_paradox_db'

mysql = MySQL(app)

@app.route('/messages', methods=['POST'])
def create_message():
    content = request.json['content']
    encrypted_content = request.json['encrypted_content']

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO messages (content, encrypted_content) VALUES (%s, %s)", (content, encrypted_content))
    mysql.connection.commit()

    return jsonify({'message': 'Message created successfully'}), 201

@app.route('/messages', methods=['GET'])
def get_messages():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM messages")
    messages = cur.fetchall()

    output = []
    for message in messages:
        output.append({'id': message[0], 'content': message[1], 'encrypted_content': message[2], 'created_at': message[3]})

    return jsonify({'messages': output})

if __name__ == '__main__':
    app.run(debug=True)