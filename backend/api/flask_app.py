from flask import Flask, jsonify, request
from flask_cors import CORS
from pydantic import BaseModel, ValidationError
from app.app import guess_word

app = Flask(__name__)
CORS(app)

class GuessRequest(BaseModel):
    candidate: str
    word_to_guess: str = None
    user_tries: int = 0
    game_over: bool = True

@app.route("/api/guess", methods=["POST"])
def guess_word_endpoint():
    try:
        data = request.get_json()
        guess_request = GuessRequest(**data)
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400

    candidate = guess_request.candidate
    word_to_guess = guess_request.word_to_guess
    user_tries = guess_request.user_tries
    game_over = guess_request.game_over

    correct_letter_and_index, correct_letter_wrong_index, incorrect_letter, word_to_guess, user_tries, game_over, is_valid_word = guess_word(candidate, word_to_guess, user_tries, game_over)
    
    response = {
        "word_to_guess": word_to_guess,
        "correct_letter_and_index": correct_letter_and_index,
        "correct_letter_wrong_index": correct_letter_wrong_index,
        "incorrect_letter": incorrect_letter,
        "user_tries": user_tries,
        "game_over": game_over,
        "is_valid_word": is_valid_word
    }

    return jsonify(response)