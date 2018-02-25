from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords,wordnet
from nltk.stem import WordNetLemmatizer
from itertools import product
import numpy

def score_sentence_similarity(str1, str2):
    ##---------------Defining stopwords for English Language---------------##
    stop_words = set(stopwords.words("english"))

    ##---------------Initialising Lists---------------##
    filtered_sentence1 = []
    filtered_sentence2 = []
    lemm_sentence1 = []
    lemm_sentence2 = []
    sims = []
    temp1 = []
    temp2 = []
    simi = []
    final = []
    same_sent1 = []
    same_sent2 = []
    #ps = PorterStemmer()

    ##---------------Defining WordNet Lematizer for English Language---------------##
    lemmatizer  =  WordNetLemmatizer()

    ##---------------Tokenizing and removing the Stopwords---------------##

    for words1 in word_tokenize(str1):
        if words1 not in stop_words:
            if words1.isalnum():
                filtered_sentence1.append(words1)

    ##---------------Lemmatizing: Root Words---------------##

    for i in filtered_sentence1:
        lemm_sentence1.append(lemmatizer.lemmatize(i))

    ##---------------Tokenizing and removing the Stopwords---------------##

    for words2 in word_tokenize(str2):
        if words2 not in stop_words:
            if words2.isalnum():
                filtered_sentence2.append(words2)

    ##---------------Lemmatizing: Root Words---------------##

    for i in filtered_sentence2:
        lemm_sentence2.append(lemmatizer.lemmatize(i))

    ##---------------Similarity index calculation for each word---------------##
    for word1 in lemm_sentence1:
        simi =[]
        for word2 in lemm_sentence2:
            sims = []
           # print(word1)
            #print(word2)
            syns1 = wordnet.synsets(word1)
            #print(syns1)
            #print(wordFromList1[0])
            syns2 = wordnet.synsets(word2)
            #print(wordFromList2[0])
            for sense1, sense2 in product(syns1, syns2):
                d = wordnet.wup_similarity(sense1, sense2)
                if d != None:
                    sims.append(d)
        
            #print(sims)
            #print(max(sims))
            if sims != []:        
               max_sim = max(sims)
               #print(max_sim)
               simi.append(max_sim)
                 
        if simi != []:
            max_final = max(simi)
            final.append(max_final)

    ##---------------Final Output---------------##

    similarity_index = numpy.mean(final)
    similarity_index = round(similarity_index , 2)
    return similarity_index

if __name__ == "__main__":
    s1 = "I was given a card by her in the garden."
    s2 = "In the garden, she gave me a card."
    score = score_sentence_similarity(s1, s2)
    print("Sentence 1: ",s1)
    print("Sentence 2: ",s2)
    print("Similarity index value : ", score)

    if score>0.8:
        print("Similar")
    elif score>=0.6:
        print("Somewhat Similar")
    else:
        print("Not Similar")
        
