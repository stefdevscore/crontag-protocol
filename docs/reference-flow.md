# crontag — Canonical End-to-End Reference Flow (V1)

## Purpose

This document describes a single, canonical end-to-end reference flow
demonstrating how the crontag protocol can be used in practice.

The purpose of this flow is to show that the protocol is **complete,
non-custodial, and usable** without relying on any off-chain authority,
privileged interface, or hidden trust assumption.

“Canonical” here means **reference-complete**, not exclusive or mandatory.
This flow is illustrative, not prescriptive.

---

## Actors

- **contextOwner**  
  An address that configures minting rules for a specific context.

- **user**  
  An address that mints and holds an `AccessPass`.

- **access point**  
  Any application, service, or venue that evaluates access.

- **verifier**  
  The reference `AccessVerifier` contract used to evaluate access.

---

## Preconditions

- The crontag protocol contracts are deployed on a public blockchain
- The addresses of `AccessPassV1`, `ContextControllerV1`, and `AccessVerifierV1`
  are publicly known
- No off-chain databases, user accounts, custodial services, or privileged APIs
  are required

---

## Reference Flow

1. A `contextOwner` selects a `contextId` representing a unit of access
   (for example, an event, membership, or subscription).

2. The `contextOwner` optionally configures minting rules in a
   `ContextController`, defining constraints scoped to the
   `(contextOwner, contextId)` pair.

   These constraints may include a mint window, allowlist, or supply cap.

3. A `user` initiates a mint transaction against `AccessPassV1`, specifying:
   - `contextId`
   - tier
   - expiration time
   - transferability flag
   - optional controller address

4. If a controller address is provided, `AccessPassV1` calls
   `controller.canMint(user, contextId)`.

   - If the call returns `false`, the transaction reverts.
   - If the call returns `true`, minting proceeds.

5. `AccessPassV1` mints a new `AccessPass` NFT to the user, recording immutable
   facts at mint time.

   Any protocol fees are collected as part of the transaction.

6. The minted `AccessPass` exists independently in the user’s wallet and does
   not depend on any user interface, server, or off-chain system.

7. At a later time, an access point evaluates whether the user should be granted
   access by calling the reference `AccessVerifier` contract.

8. The verifier reads on-chain `AccessPass` data and applies its published,
   deterministic rules (such as ownership, expiration, tier, and `contextId`
   matching).

   No controller logic or off-chain data is consulted during verification.

9. The verifier returns a deterministic allow or deny result.
   The access point enforces access based solely on this result.

10. Any third party can independently reproduce the access decision using the
    same on-chain data and verifier logic.

---

## Postconditions

- The `AccessPass` remains immutable until expiration
- Changes to minting rules do not affect existing passes
- Replacing the verifier changes future access interpretation but not past issuance
- If all user interfaces disappear, issued `AccessPass` tokens remain valid and verifiable

---

## Explicit Omissions

This reference flow intentionally omits:

- revocation
- renewal
- issuer verification
- context legitimacy
- dispute resolution

These concerns are explicitly outside the scope of crontag protocol v1.

The protocol guarantees **inspectable facts**, not social meaning or correctness.

---

## Versioning

This reference flow applies to **crontag protocol v1**.

Any materially different end-to-end guarantees require a new protocol version.