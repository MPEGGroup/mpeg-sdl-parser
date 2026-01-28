export interface CheckResult {
  message: string;
  severity: "error" | "warning" | "info";
}

export interface Check {
  check(): CheckResult;
}
