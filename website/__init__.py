from flask import Flask
from website.views import views

def create_app():
    app = Flask(__name__)
    app.secret_key = 'safasafsafasa' 
    app.register_blueprint(views) 
    return app
