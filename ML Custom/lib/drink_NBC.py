from nltk.classify import NaiveBayesClassifier
from nltk import word_tokenize

def word_feats(words):
    return dict([(word, True) for word in words])

def load():
    with open('drink_bad_things.csv', 'r') as f:
        negids = f.readlines()
    with open('drink_good_things.txt', 'r') as f:
        posids = f.readlines()

    negout = [word_tokenize(line, language='english') for line in negids]
    posout = [word_tokenize(line, language='english') for line in posids]
    #Creates a dictionary of the words tagged as True for pos and neg
    negfeats = [( word_feats(f) , 'neg') for f in negout]
    posfeats = [( word_feats(f) , 'pos') for f in posout]
    trainfeats = negfeats + posfeats
    return NaiveBayesClassifier.train(trainfeats)

def predict(trained_alg, input_msg):
    return trained_alg.classify(word_feats(word_tokenize(input_msg, language='english')))

if __name__ == "__main__":
    clf = load()
    print(clf.classify(word_feats(word_tokenize('I love my drinking buddie!', language='english'))))
    print(clf.classify(word_feats(word_tokenize('last night was fun', language='english'))))

    print(clf.classify(word_feats(word_tokenize('OMG why are you like this? coffee', language='english'))))
    print(clf.classify(word_feats(word_tokenize('doritos are fine', language='english'))))
