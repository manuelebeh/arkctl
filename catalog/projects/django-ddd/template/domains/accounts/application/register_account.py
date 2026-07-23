from domains.accounts.domain.account_id import AccountId


def register_account(*, email: str) -> AccountId:
    return AccountId(value=email)
