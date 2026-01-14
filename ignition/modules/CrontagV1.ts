// ignition/modules/CrontagV1.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CrontagV1", (m) => {
  const accessPass = m.contract("AccessPassV1", [
    "crontag Access Pass",
    "CRONTAG",
  ]);

  const contextController = m.contract("ContextControllerV1", [
    m.getAccount(0),
  ]);

  const accessVerifier = m.contract("AccessVerifierV1", [accessPass]);

  return {
    accessPass,
    contextController,
    accessVerifier,
  };
});
