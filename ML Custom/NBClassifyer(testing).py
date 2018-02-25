import nltk.classify.util
from nltk.classify import NaiveBayesClassifier
from nltk.corpus import movie_reviews


def word_feats(words):
    return dict([(word, True) for word in words])


negids = movie_reviews.fileids('neg')
posids = movie_reviews.fileids('pos')
print(negids[:10])
for i in negids:
    print (movie_reviews.words(fileids=[i])
#Creates a dictionary of the words from reviews tagged as negative
negfeats = [( word_feats( movie_reviews.words(fileids=[f]) ) , 'neg') for f in negids]
print(negfeats[:10])
posfeats = [( word_feats( movie_reviews.words(fileids=[f]) ) , 'pos') for f in posids]

negcutoff = len(negfeats) * 3 / 4
poscutoff = len(posfeats) * 3 / 4
print (negcutoff)
print (poscutoff)
trainfeats = negfeats[:int(negcutoff)] + posfeats[:int(poscutoff)]
testfeats = negfeats[int(negcutoff):] + posfeats[int(poscutoff):]
print
'train on %d instances, test on %d instances' % (len(trainfeats), len(testfeats))

classifier = NaiveBayesClassifier.train(trainfeats)
print
'accuracy:', nltk.classify.util.accuracy(classifier, testfeats)
classifier.show_most_informative_features()
