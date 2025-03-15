from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder='templates') 

@app.route('/')
def index():
    print("Index route accessed")
    return render_template('index.html') 

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import BadRequest


# Initialize Flask app and SQLite database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///login.db'  # SQLite database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# User model (SQLAlchemy ORM)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    user_type = db.Column(db.String(50), nullable=False)

# Create the database (run once to initialize the schema)
with app.app_context():
    db.create_all()

# User type validation function
def validate_user_type(user_type):
    allowed_user_types = ['police', 'legal professional', 'public']
    if user_type not in allowed_user_types:
        raise BadRequest('Invalid user type. Allowed values: police, legal professional, public.')

# Signup Route
@app.route('/auth', methods=['POST'])
def signup_or_login():
    # Check if the incoming request is JSON or form data
    if request.is_json:
        data = request.get_json()  # Get JSON data
    else:
        data = request.form  # Get form data (for traditional form submission)

    action = data.get('action')
    username = data.get('username')
    password = data.get('password')
    user_type = data.get('user_type')

    # Ensure all required fields are present
    if not username or not password or not user_type or not action:
        return jsonify({'status': 'error', 'message': 'Username, password, user type, and action are required'}), 400

    try:
        # Validate user type
        validate_user_type(user_type)
    except BadRequest as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

    if action == 'signup':
        # Check if the user already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'status': 'error', 'message': 'User already exists'}), 400
        
        # Hash the password before storing it
        hashed_password = generate_password_hash(password, method='sha256')
        new_user = User(username=username, password=hashed_password, user_type=user_type)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'User created successfully'}), 201

    elif action == 'login':
        # Find the user by username
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        # Check if the password is correct
        if not check_password_hash(user.password, password):
            return jsonify({'status': 'error', 'message': 'Incorrect password'}), 400
        
        return jsonify({'status': 'success', 'message': 'Login successful', 'user_type': user.user_type}), 200

    return jsonify({'status': 'error', 'message': 'Invalid action'}), 400

if __name__ == '__main__':
    app.run(debug=True)
