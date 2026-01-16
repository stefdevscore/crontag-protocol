// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ContextControllerV1
 *
 * @notice
 * Declarative, issuance-only mint gate for AccessPassV1.
 *
 * ---------------------------------------------------------------------
 * IMPORTANT — ADVISORY CONSTRAINTS
 * ---------------------------------------------------------------------
 *
 * All constraints defined in this contract are ADVISORY.
 *
 * They:
 * - gate cooperative minting behavior
 * - do NOT constitute cryptographic enforcement
 * - may be violated by dishonest issuers or routers
 *
 * Violations are intentionally possible and are meant to be
 * observable on-chain rather than prevented.
 *
 * This preserves:
 * - non-retroactivity
 * - controller purity
 * - auditability over enforcement
 *
 * ---------------------------------------------------------------------
 *
 * This contract:
 * - Encodes minting constraints per (contextOwner, contextId)
 * - Is consulted ONLY at mint time
 * - Has NO post-mint authority
 * - Does NOT interpret context semantics
 *
 * Authority is explicitly scoped:
 * - Each contextId has exactly one contextOwner
 * - Only that contextOwner may configure rules for that contextId
 */
contract ContextControllerV1 {
  /* ---------------------------------------------------------------------
   * Errors
   * ------------------------------------------------------------------ */

  error NotAuthorized();
  error ContextAlreadyRegistered();
  error ZeroAddress();

  /* ---------------------------------------------------------------------
   * Context Ownership
   * ------------------------------------------------------------------ */

  // contextId => explicitly declared context owner
  mapping(bytes32 => address) public contextOwner;

  modifier onlyContextOwner(bytes32 contextId) {
    if (contextOwner[contextId] != msg.sender) revert NotAuthorized();
    _;
  }

  /* ---------------------------------------------------------------------
   * Context Rules (ADVISORY)
   * ------------------------------------------------------------------ */

  struct ContextRules {
    uint64 mintStart; // advisory start time; 0 = no restriction
    uint64 mintEnd; // advisory end time; 0 = no restriction
    uint64 maxSupply; // advisory cap; 0 = unlimited
    uint64 minted; // issuance counter (context-local, advisory)
    bool useAllowlist; // advisory allowlist toggle
  }

  // contextId => rules
  mapping(bytes32 => ContextRules) internal _rules;

  // contextId => minter => allowed (advisory)
  mapping(bytes32 => mapping(address => bool)) internal _allowlist;

  /* ---------------------------------------------------------------------
   * Events (observability, not control)
   * ------------------------------------------------------------------ */

  /**
   * @notice
   * Emitted when an advisory supply constraint is crossed.
   *
   * This event does NOT imply invalidity.
   * It exists purely to make violations undeniable.
   */
  event AdvisoryConstraintBreached(
    bytes32 indexed contextId,
    uint64 minted,
    uint64 maxSupply
  );

  /* ---------------------------------------------------------------------
   * Context Registration
   * ------------------------------------------------------------------ */

  /**
   * @notice
   * Register a new contextId and explicitly declare its owner.
   *
   * Ownership is declarative, not inferred from msg.sender.
   *
   * A contextId may only be registered once.
   * Registration is explicit and irreversible.
   */
  function registerContext(bytes32 contextId, address owner) external {
    if (owner == address(0)) revert ZeroAddress();
    if (contextOwner[contextId] != address(0)) {
      revert ContextAlreadyRegistered();
    }

    contextOwner[contextId] = owner;
  }

  /* ---------------------------------------------------------------------
   * Configuration (future minting only, advisory)
   * ------------------------------------------------------------------ */

  function setContextRules(
    bytes32 contextId,
    uint64 mintStart,
    uint64 mintEnd,
    uint64 maxSupply,
    bool useAllowlist
  ) external onlyContextOwner(contextId) {
    _rules[contextId].mintStart = mintStart;
    _rules[contextId].mintEnd = mintEnd;
    _rules[contextId].maxSupply = maxSupply;
    _rules[contextId].useAllowlist = useAllowlist;
    // NOTE: minted counter intentionally NOT reset
  }

  function setAllowlist(
    bytes32 contextId,
    address minter,
    bool allowed
  ) external onlyContextOwner(contextId) {
    _allowlist[contextId][minter] = allowed;
  }

  /* ---------------------------------------------------------------------
   * Mint Predicate (issuance-only, declarative, advisory)
   * ------------------------------------------------------------------ */

  function canMint(
    address minter,
    bytes32 contextId
  ) external view returns (bool) {
    // Unregistered contexts cannot mint
    if (contextOwner[contextId] == address(0)) {
      return false;
    }

    ContextRules memory rules = _rules[contextId];

    if (rules.mintStart != 0 && block.timestamp < rules.mintStart) {
      return false;
    }

    if (rules.mintEnd != 0 && block.timestamp > rules.mintEnd) {
      return false;
    }

    if (rules.maxSupply != 0 && rules.minted >= rules.maxSupply) {
      return false;
    }

    if (rules.useAllowlist && !_allowlist[contextId][minter]) {
      return false;
    }

    return true;
  }

  /* ---------------------------------------------------------------------
   * Issuance Accounting (explicit, opt-in, advisory)
   * ------------------------------------------------------------------ */

  /**
   * @notice
   * SHOULD be called by the contextOwner after a successful mint.
   *
   * This function:
   * - has NO enforcement power
   * - preserves non-retroactivity
   * - avoids side effects in canMint
   *
   * Failure to call this function does NOT invalidate any mint.
   * Overuse of this function may result in advisory constraint breaches,
   * which are surfaced via events.
   */
  function recordMint(bytes32 contextId) external onlyContextOwner(contextId) {
    ContextRules storage rules = _rules[contextId];

    rules.minted += 1;

    if (rules.maxSupply != 0 && rules.minted > rules.maxSupply) {
      emit AdvisoryConstraintBreached(contextId, rules.minted, rules.maxSupply);
    }
  }
}
