from functools import wraps
from flask import request, jsonify
import jwt
from app.models.auth_models import User

def token_required(f):
    """
    Decorator function to ensure that a request has a valid JWT token.
    
    Args:
        f (function): The function to be wrapped, which requires authentication.
    
    Returns:
        function: The wrapped function with token validation.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        """
        The actual decorator function that checks for a valid JWT token in the request.

        Args:
            *args: Positional arguments for the wrapped function.
            **kwargs: Keyword arguments for the wrapped function.

        Returns:
            Flask response: JSON response indicating success or failure of token validation.
        """
        token = None
        # Check if Authorization header is present and extract the token
        if 'Authorization' in request.headers:
            try:
                # Extract token from 'Authorization' header, expecting 'Bearer <token>'
                token = request.headers['Authorization'].split(" ")[1]
            except IndexError:
                 # Handle case where token format is invalid
                return jsonify({'message': 'Token format is invalid!'}), 401
        
        # If no token is provided
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
             # Decode the token using the secret key and HS256 algorithm
            data = jwt.decode(token, 'your_secret_key', algorithms=["HS256"])
            # Find user by email (stored in 'sub' field of token payload)
            current_user = User.find_by_email(data['sub'])
            if not current_user:
                # If user is not found, raise an exception
                raise ValueError("User not found")
        except jwt.ExpiredSignatureError:
            # Handle case where the token has expired
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            # Handle case where the token is invalid
            return jsonify({'message': 'Invalid token!'}), 401
        except Exception as e:
            # Handle any other exceptions that occur
            return jsonify({'message': 'An error occurred while decoding the token!', 'error': str(e)}), 401
        
        # Pass the current_user to the wrapped function
        return f(current_user, *args, **kwargs)
    
    return decorated
