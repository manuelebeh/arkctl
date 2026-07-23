from dataclasses import dataclass


@dataclass
class User:
    email: str
    full_name: str | None = None
