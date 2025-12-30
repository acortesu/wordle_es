import json
from app.flask_app import app

def handler(event, context):
    body = event.get("body", "")

    if event.get("isBase64Encoded"):
        import base64
        body = base64.b64decode(body)

    if isinstance(body, bytes):
        body = body.decode("utf-8")

    with app.test_request_context(
        path=event["rawPath"],
        method=event["requestContext"]["http"]["method"],
        headers=event.get("headers", {}),
        data=body,
        content_type="application/json",
    ):
        response = app.full_dispatch_request()

    return {
        "statusCode": response.status_code,
        "headers": dict(response.headers),
        "body": response.get_data(as_text=True),
    }