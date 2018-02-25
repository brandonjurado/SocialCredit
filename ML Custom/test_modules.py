# -*- coding: utf-8 -*-
import tokenize
from nltk.corpus import words as nltk_words
from multiprocessing import Pool
from time import time


text = "this’s a sent tokenize test. this is sent two. is this sent three? sent 4 is cool! Now it’s your turn."
from nltk.tokenize import sent_tokenize
sent_tokenize_list = sent_tokenize(text)
print (len(sent_tokenize_list))
print (sent_tokenize_list)
