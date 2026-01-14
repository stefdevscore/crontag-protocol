# Design Primitives

This document records the **design rationale for core primitives** used by the crontag protocol.

It is **non-normative**: it does not define protocol behavior.
However, it is **constraining**: implementations that diverge from the rationale
documented here must do so deliberately and with explicit justification.

This document exists to prevent accidental drift, convenience-driven design,
and retroactive rationalization.

---

## AccessPassV1 Primitive Choice: ERC-721

### Purpose of the Primitive

`AccessPassV1` represents an **individual, inspectable, ownable access fact**.

The primitive chosen to represent this fact must support:

- persistence across time,
- explicit ownership,
- third-party verification,
- optional transferability,
- composability with external systems,
- and semantic neutrality.

The primitive must **record facts**, not interpret them.

---

## Required Properties

Derived directly from the protocol invariants, the primitive must provide:

### 1. Singularity

Each access pass is a distinct object.

- A pass cannot be split, merged, or partially transferred.
- A pass represents a single, atomic credential.

---

### 2. Stable Identity

Each pass must have a stable identifier that:

- persists across transfers,
- persists across time,
- can be referenced by third parties.

Identity must not be contextual or inferred.

---

### 3. Explicit Ownership

At any point in time:

- exactly one address is the owner of a pass,
- ownership must be discoverable on-chain,
- ownership must not rely on off-chain agreements.

---

### 4. Optional Transferability

Transferability is an **attribute of the pass**, not of the protocol.

- Some passes must be transferable.
- Some passes must be non-transferable.
- This distinction must be enforceable at the protocol level.

---

### 5. Composability

External systems must be able to:

- inspect ownership,
- verify existence,
- reason about passes,

without privileged access, custom adapters, or trusted intermediaries.

---

### 6. Semantic Minimalism

The primitive must not:

- imply legitimacy,
- imply real-world access,
- encode value semantics,
- interpret meaning.

Meaning is external and plural.

---

## Evaluation of Alternatives

### ERC-20 (Fungible Tokens)

**Rejected.**

- Fungibility destroys singular identity.
- Balances cannot encode per-pass immutability.
- Partial transfer violates credential semantics.
- No stable per-pass reference exists.

ERC-20 optimizes for value transfer, not access facts.

---

### ERC-1155 (Multi-Token / Semi-Fungible)

**Rejected.**

- Token IDs represent classes, not individuals.
- Quantity-based ownership undermines singularity.
- Per-instance immutability is unnatural and error-prone.
- Batch semantics encourage fractional treatment.

ERC-1155 optimizes for efficiency, not accountability.

---

### Pure Registries / Attestation Systems

**Rejected.**

- Ownership becomes implicit rather than enforced.
- Transfer semantics must be reimplemented ad hoc.
- Composability with wallets and indexers is weaker.
- Verification requires bespoke logic.

Registries record claims; they do not model possession.

---

### Soulbound-Only Tokens (Non-Transferable by Design)

**Rejected as a default.**

- Some contexts legitimately require transfer.
- Hardcoding non-transferability removes expressive power.
- Transferability is a property of the pass, not the protocol.

Soulbound is a policy decision, not a primitive.

---

## Why ERC-721 Fits

ERC-721 provides the **minimum structural guarantees** required:

- one token maps to one owner,
- stable, on-chain identity,
- explicit ownership semantics,
- broad ecosystem support,
- semantic neutrality.

Crucially, ERC-721:

- does not infer meaning,
- does not enforce legitimacy,
- does not embed governance,
- does not impose value semantics.

It records **what exists** and **who holds it**, nothing more.

This aligns directly with the protocol principle:

> If the protocol cannot defend itself from misuse, it must make misuse undeniable.

ERC-721 makes facts visible without judging them.

---

## What ERC-721 Does Not Decide

Choosing ERC-721 does **not** decide:

- whether passes are transferable,
- whether approvals are allowed,
- whether tokens can be burned,
- whether metadata exists,
- whether passes represent valid access.

All such decisions are **protocol-level constraints**, enforced by invariants.

ERC-721 is the substrate, not the policy.

---

## AccessVerifierV1 Primitive: Canonical Interpretation

### Purpose of the Primitive

`AccessVerifierV1` exists to **interpret access facts**, not to create or mutate them.

It is the canonical mechanism for answering the question:

> “Does this account currently satisfy the access requirements encoded by this pass?”

---

### Responsibilities

The verifier MUST:

- validate token existence,
- confirm ownership,
- match `contextId`,
- enforce expiration,
- enforce tier requirements,

and return a deterministic allow / deny result.

---

### Explicit Non-Responsibilities

The verifier MUST NOT:

- infer issuer legitimacy,
- consult controllers,
- reference off-chain data,
- mutate state,
- enforce policy beyond encoded facts,
- cache or remember past decisions.

It is a **pure interpreter** of immutable facts.

---

### Why a Separate Verifier Is Required

Embedding access logic inside the token primitive would:

- couple interpretation to storage,
- encourage hidden authority,
- risk retroactive reinterpretation,
- fragment access semantics across implementations.

By isolating interpretation into a dedicated primitive:

- access logic becomes auditable,
- behavior becomes deterministic,
- alternative verifiers can exist explicitly,
- misuse becomes visible rather than implicit.

This preserves the invariant:

> Facts are immutable; meaning is contextual.

---

### Canonical Boundary

The protocol defines a strict boundary:

- `AccessPassV1` — encodes facts
- `AccessVerifierV1` — interprets facts
- everything else — composes or applies meaning externally

Any system that bypasses the verifier is explicitly choosing
**non-canonical interpretation**.

---

## Conclusion

The crontag protocol relies on **two complementary primitives**:

- `AccessPassV1` for immutable fact encoding
- `AccessVerifierV1` for deterministic access interpretation

Together, they provide:

- strong guarantees,
- minimal authority,
- maximal composability,
- and explicit misuse visibility.

All remaining protocol components MUST respect this boundary.

Convenience is never justification for collapsing it.

---
