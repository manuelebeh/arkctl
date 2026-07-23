from app.models import User

_USERS: dict[str, User] = {}


def create_user(*, email: str, full_name: str | None = None) -> User:
    user = User(email=email, full_name=full_name)
    _USERS[email] = user
    return user


def get_user_by_email(*, email: str) -> User | None:
    return _USERS.get(email)
