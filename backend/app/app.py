from app.word_service import get_random_word, word_exists


def guess_word(candidate, word_to_guess, user_tries, game_over):

    # 🎯 Seleccionar palabra secreta SOLO una vez
    if game_over and not word_to_guess:
        word_to_guess = get_random_word()
        game_over = False
        user_tries = 0

    correct_letter_and_index = []
    correct_letter_wrong_index = []
    incorrect_letter = []

    # ✅ VALIDACIÓN SOLO SI EL USUARIO ESCRIBIÓ ALGO
    is_valid_word = False
    if candidate:
        is_valid_word = word_exists(candidate.lower())

    if is_valid_word:
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

    return {
        "word_to_guess": word_to_guess,
        "user_tries": user_tries,
        "game_over": game_over,
        "correct_letter_and_index": correct_letter_and_index,
        "correct_letter_wrong_index": correct_letter_wrong_index,
        "incorrect_letter": incorrect_letter,
        "is_valid_word": is_valid_word
    }