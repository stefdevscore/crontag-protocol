# crontag — Acceptable Failures (V1)

## Purpose

This document enumerates failure modes that are **explicitly acceptable** in
crontag protocol v1.

These outcomes are **not bugs** and do not indicate protocol malfunction.
Preventing them would require discretionary authority, hidden trust, or mutation
of immutable facts.

This document does **not** redefine protocol invariants.  
It clarifies which undesirable outcomes do **not** constitute invariant violations.

---

## Acceptable Protocol-Level Failures

The following outcomes may occur without violating protocol correctness:

- Duplicate `contextId` values across different `contextOwner` addresses
- Duplicate `contextId` values within different `ContextController` contracts
- Issuers reusing a `contextId` across multiple issuance periods
- Users minting `AccessPass` tokens directly via contract calls, bypassing any UI
- `ContextController` contracts being misconfigured by their `contextOwner`
- `AccessVerifier` contracts being replaced with different evaluation logic by integrations

---

## Acceptable Off-Chain Failures

The protocol assumes the following off-chain failures are possible and acceptable:

- Off-chain context data disappearing
- Off-chain context data being misleading, incomplete, or incorrect
- User interfaces misrepresenting context meaning
- User interfaces becoming unavailable or non-functional

These failures do not affect the validity or verifiability of issued `AccessPass` tokens.

---

## Acceptable Actor Behavior

The protocol does not attempt to constrain or enforce actor intent.  
The following behaviors are explicitly tolerated:

- Issuers behaving dishonestly
- Issuers misrepresenting events, memberships, or access guarantees
- Users transferring `AccessPass` tokens in unintended ways when transferability allows
- Users misunderstanding what an `AccessPass` represents

Actor behavior does not invalidate protocol facts.

---

## Outcomes Explicitly Not Prevented

The protocol does not prevent the following outcomes:

- Conflicting claims about what a context represents
- Social disputes over legitimacy or authenticity
- Economic unfairness or pricing manipulation by issuers

These outcomes may be undesirable but are outside the protocol’s authority.

---

## Design Rationale

crontag prioritizes **transparency over prevention**.

The protocol makes facts immutable and logic inspectable.
It does not attempt to enforce social correctness, legitimacy, or fairness.

All acceptable failures are either:

- visible on-chain, or
- derivable from published, inspectable logic

Time-bound access is enforced mechanically; temporal meaning is not.

---

## Versioning

These acceptable failures apply strictly to **crontag protocol v1**.

Any change to what is considered an acceptable failure requires a new protocol version.