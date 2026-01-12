# crontag — Control & Trust FAQ (V1)

This document explains where control lives in crontag and why it is deliberately
separated rather than centralized.

The goal is not to eliminate control, but to make it **explicit, local, and
inspectable** instead of hidden behind platforms or discretionary systems.

---

## Where does control actually live?

crontag separates different kinds of control instead of collapsing them into a
single authority.

This separation reflects how power already exists in practice and prevents it
from being obscured or silently abused.

---

## 1. Issuance Control

**Issuance control governs how future `AccessPass` tokens may be created.**

- Lives in `ContextController`
- Is optional
- Is visible on-chain
- Is forward-looking only

This answers the question:

> **“How may future passes be created?”**

Issuance control affects **minting only**.

Once an `AccessPass` is minted:

- issuance rules no longer apply
- rules cannot be retroactively enforced
- existing passes remain valid until expiry

Changes to issuance rules affect **future mints only**.

---

## 2. Acceptance Control (Key Concept)

**Acceptance control governs which `AccessPass` tokens are honored by a specific
access point.**

- Lives in the access point
- Is absolute
- Is local
- Is explicit

This answers the question:

> **“Which passes will I honor?”**

This is where real power has always existed in access systems.

crontag does not attempt to centralize, abstract, or disguise this power.
Instead, it makes acceptance criteria:

- explicit
- inspectable
- replaceable

Acceptance control is not granted by the protocol and cannot be revoked by it.

---

## 3. Pricing Control

**Pricing control governs how much users are asked to pay for access.**

Pricing does **not** live in the crontag protocol.

The protocol enforces only a **mechanical protocol fee at mint time**, calculated
as a percentage of the on-chain value sent to the `AccessPass` mint transaction.

This answers the question:

> **“What does the protocol charge to issue a pass?”**

It does **not** answer:

> “What is access worth?”  
> “Was the price fair?”  
> “Was payment correct or complete?”

### Protocol fee

- Applied at mint time only
- Enforced mechanically on-chain
- Calculated as a percentage of the value actually sent
- Visible to the user at the moment of mint

The protocol does not know or infer the “real” or “intended” price of access.

---

### How do issuers set prices?

Context creators (issuers) set pricing **outside the protocol**, using mechanisms
such as:

- **On-chain sale or wrapper contracts**  
  A contract enforces a fixed price and then calls `AccessPass.mint`.
  The protocol fee is applied to the on-chain payment.

- **Client- or UI-enforced pricing**  
  A user interface instructs the user how much to send when minting.
  The protocol fee is applied to the value actually sent.

- **Off-chain payment with free minting**  
  Payment occurs off-chain, and the on-chain mint value is zero.
  The protocol fee is zero and issuance facts remain verifiable.

All of these models are intentional and valid.

---

### What the protocol does not do with pricing

crontag does **not**:

- store or enforce a declared price
- verify that a user paid a specific amount
- validate value or fairness
- reconcile off-chain payments
- bind payment to access validity

Pricing is an economic and social concern, not a protocol concern.

**crontag enforces facts, not prices.**

The protocol taxes transactions, not intent.

---

## Why this separation matters

By separating issuance control, acceptance control, and pricing control,
crontag avoids:

- hidden authority
- silent rule changes
- retroactive enforcement
- platform discretion disguised as neutrality
- economic logic leaking into protocol truth

Malicious or erroneous issuance or pricing is harmless **when acceptance rules
are explicit and enforced honestly at the access point**.

The protocol guarantees **inspectable facts**.  
Acceptance and pricing remain **local decisions**.

---

## What crontag does _not_ do

- It does not decide which issuers are legitimate
- It does not enforce fairness, honesty, or value
- It does not arbitrate disputes
- It does not override acceptance decisions
- It does not protect users from bad pricing

These concerns exist outside the protocol by design.

---

## Summary

- Issuance control determines how passes may be created
- Acceptance control determines which passes are honored
- Pricing control determines what users are charged
- These controls are deliberately separated
- Power is made explicit instead of hidden

crontag does not remove control.  
It removes ambiguity about **where control lives**.

---

## Versioning

This FAQ applies to **crontag protocol v1**.

Any change to control or pricing boundaries requires a new protocol version.
