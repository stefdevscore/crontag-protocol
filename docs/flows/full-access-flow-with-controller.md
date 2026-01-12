# crontag — Full Access Flow with Optional Controller (V1)

## Purpose

This document describes a complete end-to-end flow for access evaluation in
crontag protocol v1 when a context **optionally** requires a mint controller.

The purpose of this flow is to demonstrate how **issuance provenance can be
inferred from immutable on-chain facts**, and how **acceptance is enforced
locally by an access point**, without introducing protocol-level authority.

This document is explanatory and illustrative.
It does not define protocol guarantees or prescribe enforcement policy.

---

## Actors

- **contextOwner**
  Configures optional minting constraints for a context.

- **user**
  Mints and holds an `AccessPass`.

- **ContextController**
  Enforces minting constraints at issuance time only.

- **AccessPass**
  Records immutable access facts at mint time.

- **AccessVerifier**
  Evaluates minimal, objective validity of an `AccessPass`.

- **access point**
  Enforces local acceptance policy using verifier output and immutable facts.

---

## Phase 1: Issuance (Minting)

1. A `contextOwner` selects a `contextId` representing a unit of access.

2. The `contextOwner` optionally deploys or configures a `ContextController`
   to enforce minting constraints scoped to the `(contextOwner, contextId)` pair.

3. A `user` initiates a mint transaction against `AccessPass`, specifying:

   - `contextId`
   - expiration time
   - tier
   - transferability flag
   - optional controller address

4. If a controller address is provided, `AccessPass` calls
   `controller.canMint(user, contextId)`.

   - If the call returns `false`, the transaction reverts.
   - If the call returns `true`, minting proceeds.

5. If minting succeeds, `AccessPass` mints a new token and immutably records
   all provided facts, including the controller address
   (or `address(0)` if no controller was used).

---

## Phase 2: Fact Persistence

After minting, the `AccessPass` exists independently of any interface or service.

The following facts are permanently recorded on-chain:

- owner
- `expiresAt`
- tier
- transferability
- `contextId`
- controller address

These values **cannot be altered or revoked**.

---

## Phase 3: Minimal Verification

When access is requested, an access point calls the `AccessVerifier`.

The verifier evaluates only objective, on-chain facts:

- the user owns the pass
- the pass is not expired
- the tier requirement is met
- the `contextId` matches

The verifier:

- does not reference the controller
- does not consult off-chain data
- does not infer legitimacy or semantic meaning

The result is a deterministic allow or deny decision.

---

## Phase 4: Acceptance Policy (Controller Required)

If the access point requires issuance provenance, it performs an additional,
local policy check:

- read the immutable controller address recorded on the `AccessPass`
- compare it to the required controller configured in the access point

If the addresses match, access is granted.  
If they do not match, access is denied.

This check enforces issuance provenance **without modifying the AccessPass
and without querying the controller**.

The provenance signal carries **no protocol-level guarantee of legitimacy**;
it is purely factual.

---

## Phase 5: Acceptance Policy (Controller Not Required)

If the access point does not require a controller, no provenance check is performed.

Any `AccessPass` that passes minimal verification is accepted, regardless of
how it was minted.

This explicitly models **open contexts** where issuance provenance is irrelevant.

---

## Security Properties

- The recorded controller address cannot be forged or altered after minting
- Malicious or erroneous minting does not affect protocol correctness
- Acceptance rules are explicit, local, and replaceable
- No protocol state is mutated during access evaluation

---

## Conclusion

crontag infers issuance provenance using immutable on-chain facts recorded at
mint time.

Access points may choose to enforce or ignore provenance based on local policy.
This separation preserves protocol neutrality while enabling strong, explicit
access control without introducing hidden authority.

---

## Versioning

This flow applies to **crontag protocol v1**.

Any change to these mechanics requires a new protocol version.
