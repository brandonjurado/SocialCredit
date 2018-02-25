# -*- coding: utf-8 -*-
import tokenize
from nltk.corpus import words as nltk_words
from multiprocessing import Pool
from time import time

def is_english_word(word):
    # creation of this dictionary would be done outside of 
    #     the function because you only need to do it once.
    dictionary = dict.fromkeys(nltk_words.words(), None)
    try:
        x = dictionary[word]
        return True
    except KeyError:
        return False
text = 'Hello woel I am greate'
text2 = '''
Bolg later reports to his father that he was attacked by Legolas and Azog yells at him because the Elf Prince survived and would now send an army after the Orcs. He then tells Bolg to travel to Mount Gundabad and prepare a second Orc army for war along with swarms of Bats. Legolas and Tauriel follow Bolg to Gundabad and leave to warn the others. Bolg later appears at Ravenhill with his second army to aid Azog. Bolg knocks Bilbo out with his mace before finding Tauriel and badly injuring her in combat. Before he can finish her, Kili arrives and briefly duels the Orc but Bolg proves to be stronger and he impales Kili through the chest with his mace's hilt resulting in the Dwarf's death. In anger, Tauriel throws Bolg off the mountain and is dragged down with him. He is then spotted by Legolas and the two engage in a fierce duel ending with Legolas killing Bolg by stabbing a dagger through his head. The giant Gundabad orc then falls down to a large rock below, and was crushed by a giant boulder.

PersonalityEdit
Hardly any different from Azog, Bolg is a murderous, callous, idealistic, merciless and cruel warrior. He is extremely sadistic, showing no qualms about massacring the Men of the Lake-town and even relishing Kili's death. He is also psychopathic and remorseless, shown by how he pitilessly orders the attack on Laketown. But he is highly intelligent, an excellent leader and tactician. Bolg is enigmatic and powerful, possessing immense strength of will and superb tactical ability. He shows himself to be just as pitiless as his warrior father and is almost unimaginably determined and ferocious. Despite this, he has a strong relationship with Azog as Bolg displays fierce loyalty to his father and a great desire to make him proud.

AbilitiesEdit
Bolg is a skillful leader, Azog's second-in-command of the Gundabad Orc pack. He is a highly skillful hand-to-hand combatant and swordsman, showing excellent skill during his climactic fight against Legolas. His fighting style, unlike Azog's preferred Warg-riding style that emphasized blows with heavy momentum, is emphasized with lightning speed and agility, as well as martial arts techniques and using the environment against his opponent. His skill as a fighter is later shown by how he is put in charge of the Orc packs whilst Azog stays to fight Gandalf. Bolg has an astonishingly high tolerance of pain, shown by the fact that he refuses to be knocked out or even bleed when Legolas slams his head into a wooden pillar repeatedly. He is also a highly skilled Warg-rider.
'''
token_list = text.split()
p = Pool(10)

start = time()
wrong_ones = p.map(is_english_word, token_list)
end1 = time()- start

start = time()
for token in token_list:
    if not is_english_word(token):
        wrong_ones += 1
end2 = time()-start

print ('t1:',end1,'\nt2:',end2)

print ('Number of words:',len(token_list))
print ('Not a word: ', wrong_ones)
