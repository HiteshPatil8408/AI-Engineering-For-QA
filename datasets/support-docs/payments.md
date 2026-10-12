# Fictional payment policy

Payment requests must include an idempotency key. Transient gateway errors may be retried up to twice with exponential backoff. Never retry a declined card automatically.
