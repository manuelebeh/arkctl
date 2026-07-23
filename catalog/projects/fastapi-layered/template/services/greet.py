from repositories.greeting import get_greeting


def greet(name: str) -> str:
    return get_greeting(name).text
