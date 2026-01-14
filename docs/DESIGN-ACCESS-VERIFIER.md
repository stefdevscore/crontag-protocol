# AccessVerifierV1 — Canonical Access Verifier

## Purpose

**AccessVerifierV1** is the canonical, stateless verifier for `AccessPassV1`.

It evaluates whether a given account **currently satisfies** the explicit facts encoded in an access pass.
It does **not** issue tokens, **does not** modify state, and **does not** interpret meaning beyond what is recorded on-chain.

The verifier exists to answer one question, deterministically:

> “Given these inputs, does this access pass satisfy the stated requirements right now?”

---

## Design Intent

AccessVerifierV1 is deliberately constrained.

It exists to:

- Reduce duplicated verification logic across applications
- Provide a canonical reference implementation
- Preserve protocol invariants by preventing hidden authority or interpretation

It is **not** an authorization oracle, policy engine, or trust system.

---

## Verification Inputs

AccessVerifierV1 evaluates access using **only** the following inputs:

- `account` — the address claiming access
- `tokenId` — the AccessPassV1 token being evaluated
- `contextId` — the expected context identifier
- `requiredTier` — the minimum acceptable tier

All verification is derived from immutable on-chain data.

---

## Verification Checks

Access is granted **if and only if** all of the following are true:

1. **Token Existence**

   - `tokenId` must exist

2. **Ownership**

   - `account` must be the current owner of `tokenId`

3. **Context Match**

   - `pass.contextId == contextId`

4. **Expiration**

   - `pass.expiresAt == 0` **OR**
   - `block.timestamp <= pass.expiresAt`

5. **Tier Requirement**
   - `pass.tier >= requiredTier`

If **any** check fails, verification returns `false`.

No partial success.
No ambiguity.
No side effects.

---

## Explicit Non-Responsibilities

AccessVerifierV1 **does not**:

- Infer issuer legitimacy
- Consult controllers
- Enforce allowlists
- Enforce pricing or payments
- Read off-chain data
- Cache results
- Mutate state
- Emit events
- Encode business logic or semantics

Any such logic belongs **outside** the protocol.

---

## Determinism & Safety

- The verifier is **purely observational**
- Results are deterministic for a given block state
- No call ordering, replay, or reentrancy concerns
- Safe to call on-chain or off-chain
- Safe to compose with other systems

---

## Invariants Preserved

AccessVerifierV1 preserves the protocol’s core invariants:

- **Immutability** — no mutation of pass data
- **Non-Retroactivity** — past issuance is never reinterpreted
- **Explicit Facts Only** — no inferred authority
- **No Hidden Authority** — verification is transparent and inspectable
- **Misuse Is Undeniable** — invalid data yields explicit denial

---

## Intended Usage

AccessVerifierV1 is intended to be used by:

- Smart contracts enforcing gated behavior
- Off-chain services validating access
- Frontends displaying access state
- Auditors verifying protocol correctness

It is safe to rely on as a **reference implementation**, not as a policy layer.
