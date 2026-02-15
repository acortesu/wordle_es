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
    data = request.get_json()

    candidate = data.get("candidate", "").lower()
    word_to_guess = data.get("word_to_guess", "")

    user_tries = int(data.get("user_tries", 0))
    game_over = bool(data.get("game_over", True))

    result = guess_word(
        candidate=candidate,
        word_to_guess=word_to_guess,
        user_tries=user_tries,
        game_over=game_over,
    )

    return jsonify(result)