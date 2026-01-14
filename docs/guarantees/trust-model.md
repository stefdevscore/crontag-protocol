# crontag — Trust Model (v1)

## Purpose

crontag is a minimal protocol for issuing and verifying **time-bound access** in a way that is:

- verifiable
- non-custodial
- explicit about trust boundaries

Its goal is to make **access claims provable over time** without requiring users or integrators to trust a central platform, database, or operator.

crontag is **not** a marketplace, ticketing platform, payment processor, discovery layer, or governance system at the protocol layer.

---

## Problem

Most access systems today share the same structural weaknesses:

- Access can be revoked without notice
- Ownership is represented off-chain
- Rules change without visibility
- Context (events, memberships) and authority are tightly coupled

As a result, users do not own access as a durable fact.  
They are granted permission that can be silently modified or withdrawn.

These failures are technical in nature: mutable databases, opaque business logic, and discretionary operators make access unverifiable over time.

---

## Design Principles

crontag is built on the following principles:

1. **Facts should be immutable**  
   What happened should not be editable after the fact.

2. **Meaning should be allowed to evolve**  
   Interpretation can change without rewriting history.

3. **Trust boundaries should be explicit**  
   Every trust assumption should be visible and inspectable.

4. **Issuance and access should be separated**  
   The right to mint is not the right to decide access.

5. **Interpretation should be explicit and publicly inspectable**  
   No hidden logic, heuristics, or implied legitimacy.

6. **Infrastructure should be boring and minimal**  
   Fewer moving parts, fewer places to hide authority.

---

## System Overview

crontag separates access into **three on-chain components** and **one optional off-chain context layer**.  
Each component has a single, well-defined responsibility.

---

## AccessPass (Immutable Core)

The `AccessPass` is the core on-chain primitive, implemented as an ERC-721 NFT.

Each pass records **immutable facts at mint time**:

- owner
- expiration time
- tier
- transferability
- context identifier (`contextId`)
- optional mint controller address

These facts **cannot be changed** after minting.  
The blockchain is the sole authority for their validity.

The `AccessPass` does **not** encode issuer legitimacy, semantic correctness, or context ownership beyond the recorded controller address.

---

## ContextController (Optional Mint Gate)

A `ContextController` is an **optional on-chain contract** that enforces minting constraints.

If an `AccessPass` references a controller, the controller is consulted **only at mint time** to determine whether minting is allowed.

### Scope

Minting rules are scoped to a `(contextOwner, contextId)` pair.

The controller stores and evaluates rules keyed by **both** values.

Controllers may enforce rules such as:

- maximum supply per `(contextOwner, contextId)`
- mint windows per `(contextOwner, contextId)`
- allowlists per `(contextOwner, contextId)`

Only the `contextOwner` for a given scope may configure rules for that scope.

### Constraints

- Controllers affect **issuance only**
- Controllers are **not consulted during access verification**
- Controllers have **no authority after minting**

Existing `AccessPass` tokens remain valid until expiry, regardless of later controller changes.

The protocol does **not** enforce global uniqueness, authenticity, or ownership of `contextId`.  
Context identifiers are opaque and non-authoritative by design.

---

## AccessVerifier (Access Evaluation)

Access is evaluated by an explicit verifier contract.

Access points call a verifier to determine whether access should be granted.  
The `AccessPass` itself does not encode interpretation.

A verifier:

- reads immutable `AccessPass` data
- applies published, deterministic rules
- returns an explicit allow or deny result

The verifier does **not** infer issuer legitimacy, authenticity, or semantic correctness of a context.

Verifiers are:

- stateless
- publicly inspectable
- replaceable via versioning

Previously issued `AccessPass` tokens remain unchanged.

Selection of a verifier is an **explicit integration decision** and represents the primary trust surface at access time.

---

## Context Layer (Optional, Off-Chain)

Context provides **human-readable meaning** for an `AccessPass`, such as:

- event details
- membership descriptions
- UI metadata

Context data may be stored off-chain and referenced via `contextId`.

This layer exists solely to power user interfaces.  
It does **not** decide access and is **not required** for correctness.

---

## Trust Model

### What users and integrators can trust

- Ownership, expiry, and transferability are enforced on-chain
- Access decisions are reproducible using published verifier logic
- Issued passes cannot be silently altered or revoked
- Minting constraints are explicit when present

### What users and integrators must trust

- Context data, if used, is served honestly
- User interfaces reflect on-chain state accurately
- Verifier selection reflects the intended access policy

### What users and integrators do _not_ need to trust

- Platform custody
- Platform discretion over access
- Platform permanence
- Hidden revocation mechanisms

---

## Failure Modes

crontag is designed to **fail transparently**:

- If off-chain context disappears, `AccessPass` tokens remain valid and verifiable
- If a verifier is replaced, new logic is explicit and inspectable
- If a controller is misconfigured, mint behavior is visible on-chain

crontag does not attempt to prevent misuse.  
It makes misuse **visible**.

---

## Economic Model

A protocol fee may be applied at mint time:

- flat percentage per mint
- hard-capped per transaction
- enforced on-chain
- visible to users at issuance

The fee supports maintenance of access infrastructure.

crontag does not impose recurring fees, rent extraction, or lock-in.  
Economic parameters are considered part of the protocol surface and must remain inspectable.

---

## Non-Goals (Protocol Scope)

At the **crontag protocol layer**, the system explicitly does **not** provide:

- marketplaces
- discovery or promotion
- secondary sales logic
- token incentives
- governance systems
- on-chain event management
- custodial access control
- global context registries or uniqueness enforcement

These concerns are intentionally excluded from the protocol to preserve minimalism,
inspectability, and clear trust boundaries.

Client applications, integrations, or downstream systems **may** implement any of the above
using crontag as a primitive, but such functionality exists **outside** the protocol and
introduces additional trust assumptions that are not covered by crontag’s guarantees.

---

## Summary

crontag separates **what happened** from **how it is interpreted**.

Facts are immutable.  
Issuance and access are distinct.  
Interpretation is explicit and inspectable.  
Trust boundaries are clear.

The protocol makes limited promises — and keeps them.
