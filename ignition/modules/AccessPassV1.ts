import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AccessPassV1Module", (m) => {
  const accessPass = m.contract("AccessPassV1", [
    "crontag Access Pass",
    "CRONPASS",
  ]);

  return { accessPass };
});
