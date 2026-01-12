# Versioning

This repository defines **crontag protocol v1**.

Versioning in this repository is intentionally limited and does **not**
follow conventional library or product release semantics.

---

## Protocol Versioning

The crontag protocol is versioned by **explicit declaration**, not by
incremental releases.

- **Protocol v1** is defined by the normative documents in `/docs`
- The guarantees, invariants, and trust boundaries of v1 are fixed
- Protocol v1 contracts are immutable once deployed

Any change that alters protocol guarantees, invariants, or trust boundaries
requires a **new protocol version** and will be defined in a **separate
repository**.

This repository will never contain protocol v2.

---

## Contract Versioning

On-chain contracts are versioned **explicitly in their names**, for example:

- `AccessPassV1`
- `ContextControllerV1`
- `AccessVerifierV1`

Contracts are **not upgradeable**.
New behavior requires new contracts with new version identifiers.

---

## Repository Versioning

The version field in `package.json` reflects the **state of the repository**,
not the protocol.

Repository version numbers may change to reflect:
- documentation updates
- tooling additions
- test coverage
- deployment scripts

They do **not** imply:
- protocol evolution
- backwards compatibility
- upgrade safety
- contract changes

Repository versioning is intentionally non-authoritative.

---

## Git Tags and Milestones

Git tags may be used to mark **explicit milestones**, such as:

- documentation freeze
- contract deployment
- protocol v1 declaration

Tags are descriptive and do not imply upgrade paths or compatibility.

---

## Summary

- Protocol versions are declared, not incremented
- Contracts are immutable and explicitly versioned
- Repository versions are informational only
- Protocol v2 will be defined in a separate repository

This structure preserves explicit trust boundaries and prevents
accidental conflation of tooling, code, and protocol guarantees.