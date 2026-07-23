from domain.greeting import Greeting


def greet(name: str) -> str:
    return Greeting(text=f"Hello, {name}").text
