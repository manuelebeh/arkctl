from models.greeting import Greeting


def get_greeting(name: str) -> Greeting:
    return Greeting(text=f"Hello, {name}")
