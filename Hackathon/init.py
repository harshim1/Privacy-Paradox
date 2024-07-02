from flask import Flask
from flask_login import LoginManager
from events import socketio, users
import os

app = Flask(__name__)
app.secret_key = '1234'
app.app_context().push()
file_path = os.path.abspath(os.getcwd())+"\database\database.db"
app.config['SQLALCHEMY_DATABASE_URI'] = 'qlite:///' + file_path
app.secret_key = 'e101fde772e201928228'
login_manager = LoginManager(app)
login_manager.login_view = "login"
login_manager.login_message = "You need to log in to perform this action"
login_manager.login_message_category = "invalid-notif"
socketio.init_app(app)