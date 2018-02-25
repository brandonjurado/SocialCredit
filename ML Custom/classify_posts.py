import json
from nltk import sent_tokenize
from lib import drink_NBC

clf = drink_NBC.load()

lang = 'en-US'

t1 = 'Opening a cold one with the boys'
t2 = 'Love this tweet. I can\'t believe how godd it is.'

print(drink_NBC.predict(clf, t1))
print(drink_NBC.predict(clf, t2))
