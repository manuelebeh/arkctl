from dataclasses import dataclass


@dataclass(frozen=True)
class AccountId:
    value: str
