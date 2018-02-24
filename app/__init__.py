from flask import flasklask

# Initialize the flask app
app = Flask(__name__, instance_relative_config=True)

# load views. This is where our application's routes live.
from app import views

# load the app's config from config.py
# flask does this automatically from the
# root folder. 
app.config.from_object('config')