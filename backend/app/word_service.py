import random
from boto3.dynamodb.conditions import Key
from app.dynamodb_client import table
from app.data import words as local_words  # fallback local


# 🎯 Selecciona una palabra secreta
def get_random_word(difficulty="medium"):
    try:
        response = table.query(
            KeyConditionExpression=Key("difficulty").eq(difficulty)
        )

        items = response.get("Items", [])
        if not items:
            raise ValueError("No words found in DynamoDB")

        return random.choice(items)["word"]

    except Exception as e:
        # 🔥 Fallback CRÍTICO (local)
        print(f"[WARN] DynamoDB fallback (get_random_word): {e}")
        return random.choice(local_words)


# ✅ Valida si una palabra existe (usa GSI)
def word_exists(word: str) -> bool:
    # 🔒 GUARD CLAUSE: jamás consultar DynamoDB con empty string
    if not word or not word.strip():
        return False

    response = table.query(
        IndexName="word-index",
        KeyConditionExpression=Key("word").eq(word.lower()),
        Limit=1
    )

    return response.get("Count", 0) > 0