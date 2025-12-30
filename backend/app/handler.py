import json
from app.flask_app import app

def handler(event, context):
    body = event.get("body")
    headers = event.get("headers") or {}
    method = event.get("httpMethod")
    path = event.get("path")

    with app.test_request_context(
        path=path,
        method=method,
        headers=headers,
        data=body,
    ):
        response = app.full_dispatch_request()

        return {
            "statusCode": response.status_code,
            "headers": dict(response.headers),
            "body": response.get_data(as_text=True),
        }