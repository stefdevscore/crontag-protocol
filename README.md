# crontag Protocol

crontag is a minimal protocol for issuing and verifying **time-bound access**
as immutable, on-chain facts.

It enables access claims to be **verifiable over time** without requiring
custody, platforms, or discretionary operators.

crontag is a protocol primitive, not a product or platform.

---

## What it does

At the protocol layer, crontag provides:

- an immutable record of access facts (`AccessPass`)
- optional, explicit constraints on issuance (`ContextController`)
- deterministic, inspectable access evaluation (`AccessVerifier`)

The protocol deliberately separates:

- **facts** — what was issued
- **interpretation** — how access is evaluated
- **enforcement** — who honors access

---

## What it does *not* do

crontag does **not**:

- decide legitimacy or semantic meaning
- enforce pricing, value, or fairness
- provide marketplaces, clients, or discovery
- control access points
- support revocation or governance

These concerns exist outside the protocol by design.

---

## Design stance

- Facts are immutable
- Meaning may evolve
- Trust boundaries are explicit
- Misuse is visible, not prevented

The protocol makes limited promises — and keeps them.

---

## Documentation

Protocol guarantees, constraints, and failure modes are defined in
[`/docs`](./docs):

### Guarantees (Normative)

- [Trust Model](./docs/guarantees/trust-model.md)  
- [Protocol Invariants](./docs/guarantees/protocol-invariants.md)  
- [Acceptable Failures](./docs/guarantees/acceptable-failures.md)  

### Reference Flows

- [Canonical Reference Flow](./docs/flows/reference-flow.md)  
- [Full Access Flow with Optional Controller](./docs/flows/full-access-flow-with-controller.md)  

### Governance & Control

- [Control & Trust FAQ](./docs/governance/control-and-trust-faq.md)  

### Shared References

- [Glossary](./docs/glossary.md)  
- [Versioning](./docs/VERSIONING.md)

These documents are **normative** for **crontag protocol v1**.

---

## Versioning

This repository defines **crontag protocol v1**.

The protocol, contract, and repository versioning model is defined in
[`docs/VERSIONING.md`](./docs/VERSIONING.md).

Any change to protocol guarantees requires a new protocol version,
which will be defined in a separate repository.