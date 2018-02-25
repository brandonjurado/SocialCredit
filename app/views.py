#!/usr/bin/env python3
from __future__ import print_function
from app import app
import tweepy
from flask import Flask, redirect, url_for, session, request, render_template, flash
import flask
import sys
reload(sys)
sys.setdefaultencoding("utf-8")
from textblob import TextBlob

#Variables that contains the user credentials to access Twitter API
access_token = "136402168-5ytEveDaVtc9UBU0jWbuL8M4I69IXiNTsmgYKczE"
access_token_secret = "CGS2XkVPEWASS9eqjA8Rf9sWeR6uH26GAxVfsQud9zG2v"
consumer_key = "ejU5ZdF4lx1MIQ2z5NBpFroes"
consumer_secret = "LWxNpU7wqTpdVoVLecZjYZlorsgyvcTV4iMF0WeDDC0kJelpFu"
session = dict()
db = dict()
callback_url = 'http://127.0.0.1:5000/verify'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

from flask_cors import CORS, cross_origin
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/twitter', methods=['POST', 'GET'])
@cross_origin()
def twitter():
    print('=============Twitter method called!=================\n',file=sys.stdout)
    # Creating the authentication object
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    try:
        #get the request tokens
        redirect_url= auth.get_authorization_url()
        session['request_token'] = auth.request_token
    except tweepy.TweepError:
        print('Error! Failed to get request token')

    #this is twitter's url for authentication
    return flask.redirect(redirect_url)

@app.route("/verify")
def get_verification():
    print('==============Verification method called!==================\n',file=sys.stdout)
    #get the verifier key from the request url
    verifier= request.args['oauth_verifier']

    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    token = session['request_token']
    del session['request_token']
    auth.request_token = token

    try:
        auth.get_access_token(verifier)
    except tweepy.TweepError:
        print('Error! Failed to get access token.')

    #now you have access!
    api = tweepy.API(auth)
    # Get and store authenticated users information in 'user' var
    #user = api.get_user('kayhart_')
    user = api.me()
    tweets = get_all_tweets(user, api)
    #print("\n\n\n\n===================\nTweets: ", tweets)
    positive = 0
    negative = 0
    neutral = 0
    runningScore = 0
    count = 0
    parseBlob = ''
    for i in range(len(tweets)):
        parseBlob += str(tweets[i][2])
    text = parseBlob.decode('ascii', errors="ignore")
    blob = TextBlob(text)
    for sentence in blob.sentences:
        runningScore += sentence.sentiment.polarity
        count += 1
        if sentence.sentiment.polarity < 0:
            negative += 1
        elif sentence.sentiment.polarity >0:
            positive += 1
        else:
            neutral += 1
    interScore = (positive/negative) * (runningScore/count)
    finalScore = 1 - (interScore)/2
    print (positive, neutral, negative, runningScore, interScore, finalScore)
    # User data printed in line below in console for testing - figure out what we can do with this data in Front-End View
    #print("\n\n\n\n===================\nUser data in json format: ", user._json)
    #store in a db
    db['api']=api
    db['access_token_key']=auth.request_token['oauth_token']
    db['access_token_secret']=auth.request_token['oauth_token_secret']
    return flask.redirect(flask.url_for('index'))

def get_all_tweets(user, api):
    #initialize a list to hold all the tweepy Tweets
    alltweets = []
    screen_name = user.screen_name
    new_tweets = api.user_timeline(screen_name = screen_name,count=200)
    #save most recent tweets
    alltweets.extend(new_tweets)

    #save the id of the oldest tweet less one
    oldest = alltweets[-1].id - 1

    #keep grabbing tweets until there are no tweets left to grab
    while len(new_tweets) > 0:
        #all subsiquent requests use the max_id param to prevent duplicates
        new_tweets = api.user_timeline(screen_name = screen_name,count=200,max_id=oldest)
        #save most recent tweets
        alltweets.extend(new_tweets)
        #update the id of the oldest tweet less one
        oldest = alltweets[-1].id - 1

    #transform the tweepy tweets into a 2D array that will populate the csv
    outtweets = [[tweet.id_str, tweet.created_at, tweet.text.encode("utf-8")] for tweet in alltweets]
    return outtweets
