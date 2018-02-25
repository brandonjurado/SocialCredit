from __future__ import print_function
from app import app
import tweepy
from flask import Flask, redirect, url_for, session, request, render_template, flash
import flask


import sys

#Variables that contains the user credentials to access Twitter API
access_token = ""
access_token_secret = ""
consumer_key = ""
consumer_secret = ""
session = dict()
db = dict()
callback_url = 'http://127.0.0.1:5000/verify'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/twitter', methods=['POST', 'GET'])
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
    user = api.me()
    # User data printed in line below in console for testing - figure out what we can do with this data in Front-End View
    #print("\n\n\n\n===================\nUser data in json format: ", user._json)
    #store in a db
    db['api']=api
    db['access_token_key']=auth.request_token['oauth_token']
    db['access_token_secret']=auth.request_token['oauth_token_secret']
    return flask.redirect(flask.url_for('index'))
