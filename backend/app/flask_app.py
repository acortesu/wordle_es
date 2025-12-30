from flask import Flask, request, jsonify
from app.app import guess_word

app = Flask(__name__)

@app.route("/api/guess", methods=["POST"])
def guess():
    data = request.get_json(force=True)

    result = guess_word(
        candidate=data.get("candidate"),
        word_to_guess=data.get("word_to_guess"),
        user_tries=data.get("user_tries", 0),
        game_over=data.get("game_over", True),
    )

    return jsonify({
        "result": result
    })