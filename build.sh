pip install -r requirements.txt --no-index

export FLASK_APP=run.py
flask run

cd app/static/js; npm run webpack      