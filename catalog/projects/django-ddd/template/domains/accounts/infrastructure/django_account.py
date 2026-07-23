from domains.accounts.domain.account_id import AccountId


class DjangoAccountRepository:
    def next_id(self, email: str) -> AccountId:
        return AccountId(value=email)
