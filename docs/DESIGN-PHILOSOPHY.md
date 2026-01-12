# crontag — Philosophy

This document explains the design philosophy behind the crontag protocol.

It is **not** a specification and does not define protocol guarantees.
Those are defined in the Trust Model and other normative documents.

This document exists to explain *why* the protocol is shaped the way it is,
in human terms, without introducing new authority or requirements.

---

## Access is power

Access is not a technical detail.

Access determines who may enter a space, use a service, participate in an
event, or exercise a right. Wherever access exists, power exists.

Most access systems attempt to hide this fact behind user interfaces,
databases, or discretionary rules. crontag begins from the opposite
assumption:

**Access is power, and power should be visible.**

---

## The core failure of access systems

Most access systems fail in the same way:

- access can be revoked silently
- rules change without visibility
- ownership is represented off-chain
- authority is implied, not declared

Users are told they “own” access, but in practice they hold a permission
that can be modified or withdrawn at any time.

These failures are not moral or social failures.  
They are structural failures caused by mutable systems and hidden authority.

crontag is an attempt to remove those failure modes — not by enforcing
correct behavior, but by making behavior explicit.

---

## Authority cannot be eliminated

No system eliminates authority.

Systems that claim to be “trustless” or “neutral” usually relocate authority
into places where it is harder to see: administrators, platforms, operators,
or opaque logic.

crontag does not attempt to eliminate authority.

Instead, it makes authority:

- explicit
- local
- inspectable
- replaceable

Authority exists, but it cannot hide.

---

## Immutability is a social constraint

Immutability is not used because “blockchain is good”.

It is used because **history matters when trust erodes**.

When access facts are mutable:
- disputes become unresolvable
- power becomes deniable
- users cannot prove what was true at the time

crontag treats access facts as historical records.
What was issued cannot be rewritten.

Interpretation may change.  
Enforcement may change.  
History does not.

---

## Why legitimacy is not enforced

Legitimacy is a social concept.

It depends on:
- context
- norms
- institutions
- reputation
- law

Encoding legitimacy at the protocol layer would require:
- a definition of “legitimate”
- an enforcement mechanism
- a process for disputes

That would introduce centralized authority, discretion, and mutation.

crontag deliberately refuses this role.

The protocol records facts.  
Legitimacy is decided elsewhere.

---

## Why misuse is acceptable

Preventing misuse requires discretion.

Discretion requires judgment.  
Judgment requires authority.

crontag does not attempt to prevent misuse.
Instead, it makes misuse **visible and inert**.

- dishonest issuers can be observed
- misleading contexts can be inspected
- broken rules are evident on-chain

Visibility is safer than prevention.
Transparency is safer than discretion.

---

## Why incentives are not enforced at the protocol layer

Incentives require definitions of “good behavior”.

Definitions require governance.
Governance requires mutability.

crontag avoids protocol-level incentives not because incentives are
unimportant, but because enforcing them at this layer would compromise the
protocol’s neutrality and longevity.

Incentives are expected to exist:
- in clients
- in access points
- in reputation systems
- in institutions

The protocol ensures those layers can operate honestly.
It does not attempt to replace them.

---

## Minimalism as a safety property

Complex systems create hiding places.

Every additional feature introduces:
- more rules
- more exceptions
- more authority
- more ambiguity

crontag is intentionally minimal.

This is not aesthetic minimalism.
It is **risk minimization**.

Fewer moving parts mean fewer places where power can hide.

---

## What crontag is trying to make possible

crontag exists to make the following possible:

- access claims that remain verifiable over time
- explicit separation between issuance and acceptance
- replaceable interpretation without rewriting history
- access systems where trust boundaries are visible

It does not promise fairness.
It does not promise honesty.
It does not promise good outcomes.

It promises **clarity**.

---

## What crontag is not trying to do

crontag does not attempt to:

- protect users from bad actors
- enforce social norms
- resolve disputes
- replace institutions
- become a platform

Those responsibilities remain where they already exist.

---

## Constraints as a feature

crontag is intentionally incomplete.

That incompleteness is not a weakness.
It is what allows the protocol to remain neutral, inspectable, and durable.

The protocol makes limited promises — and keeps them.