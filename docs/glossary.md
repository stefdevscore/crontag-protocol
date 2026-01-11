# Glossary

This glossary defines terms as they are used **within the crontag protocol** and
its immediate interaction surface.

Definitions are technical and normative.  
Common-language meanings may differ.

---

## Access

A binary decision (`allow` or `deny`) made at an access point based on explicit,
inspectable rules applied to an `AccessPass`.

Access is not a right, entitlement, or promise.  
It is an evaluation performed at a specific moment in time.

---

## AccessPass

An immutable on-chain token representing a time-bound access claim.

An `AccessPass` records factual data at mint time, including ownership, expiration,
tier, transferability, a context identifier, and an optional controller reference.

An `AccessPass` does not encode meaning, legitimacy, price, or interpretation.  
It is a **fact record**, not an access policy.

---

## Access Point

Any application, service, venue, or system that evaluates access and enforces a
local acceptance decision.

An access point:
- calls an `AccessVerifier`
- may apply additional local policy
- enforces the final access outcome

Access points are **not part of the protocol** and carry no protocol-level authority.

---

## AccessVerifier

A stateless on-chain contract that evaluates whether access should be granted.

An `AccessVerifier`:
- reads immutable `AccessPass` data
- applies explicit, published rules
- returns a deterministic allow or deny result

Verifier selection is an explicit integration decision and represents a trust
boundary outside the scope of the `AccessPass`.

---

## Acceptance Control

The authority to decide which `AccessPass` tokens are honored by a specific
access point.

Acceptance control:
- lives entirely at the access point
- is absolute, local, and replaceable
- is not granted or revoked by the protocol

Acceptance control reflects where power already exists in practice.

---

## Client

A user-facing application that interacts with the crontag protocol.

Clients may:
- facilitate minting
- display pass data
- call verifiers
- present access outcomes

Clients are non-custodial and non-authoritative by design.
Users may bypass clients and interact directly with contracts.

---

## Context

Human-readable or application-level meaning associated with an `AccessPass`.

Context may include event details, membership descriptions, or UI metadata.

Context:
- does not decide access
- is not required for correctness
- may be stored off-chain
- may disappear or be misleading without affecting protocol validity

---

## ContextController

An optional on-chain contract that enforces minting constraints.

A `ContextController`:
- is consulted **only at mint time**
- scopes rules to `(contextOwner, contextId)`
- has no authority after minting
- does not participate in access verification

Controllers affect **issuance only**, never access.

---

## Context Identifier (`contextId`)

An opaque identifier associated with an `AccessPass`.

The protocol does **not** enforce:
- global uniqueness
- authenticity
- ownership
- semantic meaning

`contextId` values are non-authoritative by design.

---

## Context Owner

The address authorized to configure minting rules for a specific
`(contextOwner, contextId)` scope within a `ContextController`.

Context ownership:
- applies only to minting configuration
- does not imply legitimacy
- does not grant access authority
- does not control interpretation

---

## Expiration

A timestamp recorded at mint time after which an `AccessPass` is considered invalid
by compliant verifiers.

Expiration:
- is enforced mechanically
- cannot be extended or shortened
- cannot be revoked

---

## Fact

An immutable piece of information recorded on-chain.

In crontag, facts include:
- ownership
- expiration
- tier
- transferability
- `contextId`
- recorded controller address

Facts are not interpretations and do not imply meaning or legitimacy.

---

## Issuance

The act of minting an `AccessPass`.

Issuance:
- records immutable facts
- may be constrained by a `ContextController`
- cannot be undone or modified

Issuance authority does **not** imply access authority.

---

## Issuer (Context Creator)

An actor who initiates issuance by:
- selecting a `contextId`
- optionally configuring a `ContextController`
- enabling users to mint `AccessPass` tokens

Issuers may:
- set pricing externally
- behave dishonestly
- misrepresent context meaning

The protocol does not validate issuer legitimacy.

---

## Interpretation

The application of meaning or policy to factual data.

In crontag, interpretation:
- occurs outside the `AccessPass`
- is implemented by verifiers and access points
- is explicit, inspectable, and replaceable

Interpretation may evolve without rewriting facts.

---

## Minting

The creation of a new `AccessPass` on-chain.

Minting is a one-time event that permanently records all immutable pass data.

---

## Pricing Control

The authority to determine how much users are charged for access.

Pricing control:
- does not live in the protocol
- is not enforced by `AccessPass` or controllers
- exists in issuers, clients, sale contracts, or off-chain systems

The protocol enforces only a mechanical protocol fee on on-chain mint value.

---

## Protocol Fee

A fixed percentage fee applied at mint time to the on-chain value sent with a
mint transaction.

The protocol fee:
- is enforced mechanically
- is visible to users
- applies only to value the protocol receives
- does not imply price, value, or fairness

---

## Protocol Layer

The set of on-chain contracts and rules that define crontag’s guarantees.

The protocol layer is intentionally minimal and excludes:
- UX
- marketplaces
- governance
- pricing enforcement
- access policy

---

## Tier

An immutable categorical value recorded on an `AccessPass` at mint time.

Tier has no intrinsic meaning at the protocol layer.
Its interpretation is entirely verifier- or policy-defined.

---

## Transferability

A property recorded at mint time indicating whether an `AccessPass` may be
transferred between owners.

Transferability rules:
- are enforced on-chain
- cannot be modified after minting

---

## Trust Boundary

A point at which a system requires an assumption about behavior or correctness
outside the protocol’s guarantees.

crontag makes trust boundaries **explicit and inspectable**, not implicit or hidden.

---

## Verifiability

The property that a claim or decision can be independently reproduced using
publicly available on-chain data and published logic.

Verifiability does not imply correctness of meaning — only correctness of evaluation.