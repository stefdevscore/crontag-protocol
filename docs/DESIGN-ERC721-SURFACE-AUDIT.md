# ERC-721 Surface Audit vs Protocol Invariants

This document audits the ERC-721 standard surface area against the invariants
declared for `AccessPassV1`.

It is **non-normative**, but **constraining**: any implementation of
`AccessPassV1` that relies on ERC-721 MUST conform to the classifications
and obligations described here.

If an implementation diverges, that divergence MUST be explicit and justified.

---

## Audit Frame

All ERC-721 features are evaluated against the following protocol invariants:

- Immutability of access-relevant facts
- Non-retroactivity
- Explicit transferability
- No hidden authority
- Misuse must be undeniable

When ambiguity exists, restriction is preferred over permissiveness.

---

## Canonical Verification Boundary

This document audits the ERC-721 **write and mutation surface** used by
`AccessPassV1`.

**Interpretation of access facts is explicitly out of scope for ERC-721.**

All access interpretation MUST be performed via `AccessVerifierV1`.

### Implications

- ERC-721 read functions (`ownerOf`, `balanceOf`) provide **raw state only**
- Ownership alone MUST NOT be treated as proof of access
- Any logic combining:

  - ownership
  - expiration
  - tier
  - `contextId`

  MUST be delegated to the canonical verifier

This preserves a strict separation between:

- **Fact encoding** (AccessPassV1)
- **Fact interpretation** (AccessVerifierV1)

and prevents hidden or inconsistent access logic.

---

## ERC-721 Surface Classification

### Ownership Inspection

**Functions**

- `ownerOf`
- `balanceOf`

**Status:** ALLOWED

**Rationale:**

- Ownership visibility is fundamental to access verification.
- These functions are read-only and do not imply authority.
- Required for downstream composability.

**Constraints:**

- Ownership inspection MUST NOT be treated as sufficient proof of access.
- Ownership MUST be combined with context, tier, and expiration checks via the
  canonical verifier.

---

### Transfers

**Functions**

- `transferFrom`
- `safeTransferFrom`

**Status:** CONDITIONALLY ALLOWED

**Rationale:**

- Transferability is an explicit attribute of each pass.
- Transfers are permitted only if the pass was minted as transferable.

**Required Constraints:**

- If `transferable == false`, ALL transfer paths MUST revert.
- No exceptions, including owner-only or internal transfers.
- This applies to:
  - direct transfers
  - safe transfers
  - internal transfer logic

**Invariant Link:**

- Explicit transfer semantics
- No hidden authority

---

### Approvals

**Functions**

- `approve`
- `setApprovalForAll`

**Status:** RESTRICTED

**Rationale:**

- Approvals imply future transfer authority.
- For non-transferable passes, approvals create indirect transferability.

**Required Constraints:**

- Approval functions MUST always revert.
- No distinction is made between transferable and non-transferable passes.
- No indirect transfer authority is permitted under any circumstances.

**Invariant Link:**

- Explicit transfer semantics
- No hidden authority

---

### Approval Queries

**Functions**

- `getApproved`
- `isApprovedForAll`

**Status:** DERIVED

**Rationale:**

- These functions are meaningful only if approvals exist.
- For non-transferable passes, behavior must not imply latent transferability.

**Required Constraints:**

- MUST return zero address / false values.
- MUST NOT imply latent or future transfer authority.

---

### Burning

**Functions**

- `_burn`
- any public or internal burn path

**Status:** FORBIDDEN (v1)

**Rationale:**

- Burning destroys evidence.
- Burned passes cannot be inspected later.
- This violates the principle that misuse must be undeniable.

**Required Constraints:**

- No burn function of any kind.
- No owner burn.
- No admin burn.
- No implicit burn via transfer hooks.

**Invariant Link:**

- Misuse must be undeniable
- Non-retroactivity

---

### Metadata

**Functions**

- `tokenURI`
- metadata storage or resolution

**Status:** OPTIONAL, STRONGLY DISCOURAGED

**Rationale:**

- Metadata introduces off-chain interpretation.
- Metadata can imply legitimacy or meaning.
- Metadata is not required for verification.

**Constraints (if included):**

- Must be strictly informational.
- Must not affect access verification.
- Must not imply issuer legitimacy.

**Recommendation:**

- Omit metadata entirely in v1.

---

### Enumeration

**Extensions**

- `ERC721Enumerable`

**Status:** OPTIONAL, LIKELY UNNECESSARY

**Rationale:**

- Enumeration increases complexity and mutation surface.
- Not required for access verification.
- Indexers provide equivalent functionality externally.

**Recommendation:**

- Do not include unless a hard requirement emerges.

---

### Hooks

**Functions**

- `_beforeTokenTransfer`
- `_afterTokenTransfer`

**Status:** ALLOWED, HIGH-RISK

**Rationale:**

- Hooks are often used to smuggle logic.
- Hooks can silently introduce authority or side effects.
- Hooks MUST NOT introduce reentrancy-sensitive state.
- Reentrancy guards are intentionally omitted; safety relies on invariant ordering.

**Required Constraints:**

- Hooks may enforce invariant-level guards only.
- No external calls.
- No role checks.
- No state mutation unrelated to invariants.

**Invariant Link:**

- No hidden authority
- Immutability

---

### Minting

**Functions**

- `_mint`
- `_safeMint`

**Status:** ALLOWED, HEAVILY CONSTRAINED

**Rationale:**

- Minting is the only moment where rules may apply.
- Controllers, fees, and issuance constraints belong here.

**Required Constraints:**

- Controllers may be consulted ONLY during mint.
- No post-mint authority of any kind.
- Minted facts must be immutable thereafter.
- Controllers MUST be declarative predicates (`view` only).
- Controllers MUST NOT mutate state.
- Controllers MUST NOT be observable or consulted after mint.

**Invariant Link:**

- Non-retroactivity
- Controller scope limitation

---

## Summary of Implementation Obligations

### Mandatory

An ERC-721–based implementation of `AccessPassV1` MUST:

- Enforce transferability inside transfer paths
- Gate approvals based on transferability
- Omit all burn paths
- Avoid admin, owner, or governance roles
- Avoid retroactive checks
- Avoid controller references after mint
- Disable all approval-related write paths unconditionally

---

### Forbidden

The following MUST NOT exist in v1:

- `Ownable`
- `AccessControl`
- `Pausable`
- `Burnable`
- Upgradeability hooks
- Emergency or override functions
- Silent approval allowances

---

### Optional (Default: NO)

The following are optional but discouraged unless justified:

- Metadata
- Enumeration
- Hooks beyond transfer guards

---

## Conclusion

ERC-721 provides sufficient structural capability for `AccessPassV1`, but only
when heavily constrained.

Verification logic is intentionally excluded from the ERC-721 surface.
`AccessVerifierV1` is the sole canonical mechanism for interpreting access facts
encoded by `AccessPassV1`.

Any system that bypasses the verifier risks violating protocol invariants even
if the underlying ERC-721 implementation is compliant.

This audit defines the **allowed subset** of ERC-721 behavior compatible with
the protocol invariants.

Any implementation that exceeds this surface area risks violating the core
principles of immutability, non-retroactivity, and undeniability.

All code MUST conform to these constraints, not reinterpret them.

---
