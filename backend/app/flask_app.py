import os
from flask import Flask, request, jsonify
from app.app import guess_word
from flask_cors import CORS

STAGE = os.getenv("STAGE", "local")

app = Flask(__name__)

if STAGE == "local":
    CORS(app)

@app.route("/api/guess", methods=["POST"])
def guess():
    data = request.get_json() or {}

    candidate = data.get("candidate", "")
    word_to_guess = data.get("word_to_guess")
    user_tries = data.get("user_tries", 0)
    game_over = data.get("game_over", True)

    (
        correct_letter_and_index,
        correct_letter_wrong_index,
        incorrect_letter,
        word_to_guess,
        user_tries,
        game_over,
        is_valid_word,
    ) = guess_word(
        candidate=candidate,
        word_to_guess=word_to_guess,
        user_tries=user_tries,
        game_over=game_over,
    )

    return jsonify({
        "correct_letter_and_index": correct_letter_and_index,
        "correct_letter_wrong_index": correct_letter_wrong_index,
        "incorrect_letter": incorrect_letter,
        "word_to_guess": word_to_guess,
        "user_tries": user_tries,
        "game_over": game_over,
        "is_valid_word": is_valid_word,
    })