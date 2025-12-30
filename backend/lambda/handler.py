from mangum import Mangum
from api.flask_app import app

handler = Mangum(app)