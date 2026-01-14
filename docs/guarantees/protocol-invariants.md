# crontag — Protocol Invariants (V1)

This document defines the invariants that must hold for any compliant
implementation of the crontag protocol v1.

If any invariant listed here is violated, the system must be considered
**non-compliant**, regardless of intent, implementation details, or outcomes.

These invariants are normative and version-scoped.

---

## Core Invariants

- AccessPass fields are immutable after mint
- The blockchain is the sole authority for AccessPass validity
- Issuance, access, and meaning are strictly separated
- ContextControllers affect minting only
- AccessVerifiers affect access only
- Verifiers do not infer issuer legitimacy or context meaning
- Minting rule authority is scoped to `(contextOwner, contextId)`
- `contextId` has no global uniqueness or ownership
- Existing AccessPasses cannot be silently altered or revoked
- Misuse is made visible, not prevented

---

## Non-Negotiables

The following constraints must never be violated in protocol v1:

- No upgradeable proxies
- No global registries or uniqueness enforcement
- No revocation mechanisms
- No protocol-level governance
- No custodial control

Any system that violates these constraints is not crontag v1.

---

## Authority Boundaries

The protocol explicitly does **not**:

- define or enforce semantic correctness
- define legitimate issuers
- arbitrate disputes
- enforce fairness or honesty
- prevent deceptive or adversarial behavior

All authority boundaries are explicit and inspectable.

---

## Failure Assumptions

The protocol assumes the following failure modes are possible and acceptable:

- Off-chain context data may disappear or be misleading
- ContextControllers may be misconfigured
- Issuers may behave dishonestly
- Users may bypass any UI and interact directly with contracts
- Verifiers may be replaced with different logic by access points or integrations

These failures do not invalidate issued AccessPasses or protocol correctness.

---

## Guarantee Scope

Given compliance with the invariants above, the protocol guarantees that:

- If all user interfaces disappear, issued AccessPasses remain verifiable
- All access decisions are reproducible from on-chain data
- All authority boundaries are explicit and inspectable

The protocol makes no guarantees beyond this scope.

---

## Versioning

These invariants apply strictly to **crontag protocol v1**.

Any change to these invariants requires a new protocol version.
