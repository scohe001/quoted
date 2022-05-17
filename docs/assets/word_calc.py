from itertools import groupby

def getVal(letter):
   if(not letter.isalpha()): return 0;
   modifier = -1 if letter in 'aeiou' else 1
   return (ord(letter.lower()) - ord('a') + 1) * modifier


def getScore(word):
   return sum([getVal(char) for char in word.word])

filename = "word_list.txt"
outname = "scoreDictionary.json"
cnt = 0

class Word:
   word = ''
   score = 0

   def __init__(self, word):
      self.word = word
   def __str__(self):
      return self.word + ":" + str(self.score)
   def __repr__(self):
      return self.__str__()

words = []

with open(filename) as file:
   for line in file:
      cnt += 1
      # if(cnt > 5): break;

      word = Word(line.strip())
      word.score = getScore(word)
      words.append(word)

      # print(word)
      # print(getScore(word))
      # print

# print(words)
print
scoredWords = {}
for key, group in groupby(sorted(words, key=lambda w: int(w.score)), lambda w: w.score):
   for word in group:
      if word.score not in scoredWords:
         scoredWords[word.score] = []

      scoredWords[word.score].append(word.word)
      
      # print("%s : %d." % (word.word, word.score))
   # print("")

# print scoredWords

# for x in xrange(-50, 200):
#    if x not in scoredWords:
#       print(x)

# Dictionaries aren't sorted, so best we can do is a list of tuples
sortedWords = sorted(scoredWords.items(), key=lambda x: x[0])
# print sortedWords

with open(outname, 'w') as f:
   f.write('{\n')
   for idx, (score, words) in enumerate(sortedWords):
      f.write('    "' + str(score) + '": [\n')

      for idx2, word in enumerate(words):
         f.write('        "' + word + '"')

         if(idx2 + 1 < len(words)):
            f.write(',')
         f.write('\n')

      f.write('    ]')
      if(idx + 1 < len(scoredWords.keys())):
         f.write(',')
      f.write('\n')

   f.write('}\n')