import random
from data import (words)


def guess_word(candidate, word_to_guess, user_tries, game_over):

    if game_over and not word_to_guess:
        word_to_guess = random.choice(words) 
        game_over = False
        user_tries = 0

    correct_letter_and_index = []
    correct_letter_wrong_index = []
    incorrect_letter = []

    for i, letter in enumerate(candidate.lower()):
        if i >= len(word_to_guess):
            continue
        if letter == word_to_guess[i]:
            correct_letter_and_index.append({"letter": letter, "index": i})
        elif letter in word_to_guess:
            correct_letter_wrong_index.append({"letter": letter, "index": i})
        else:
            incorrect_letter.append({"letter": letter, "index": i})

    user_tries += 1

    game_over = user_tries >= 6 or len(correct_letter_and_index) == len(word_to_guess)

    return correct_letter_and_index, correct_letter_wrong_index, incorrect_letter, word_to_guess, user_tries, game_over
