import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

describe("submitTransaction sponsorship fallback control flow", () => {
  it("submits directly once outside the sponsorship try/catch", () => {
    const content = fs.readFileSync(path.resolve(__dirname, "./useStellarWallet.ts"), "utf-8");
    const start = content.indexOf("const submitTransaction = useCallback");
    const end = content.indexOf("    let getResponse: any = null;", start);
    const block = content.slice(start, end);

    expect(block).toContain("let shouldSubmitDirect = false;");
    expect(block).toContain("shouldSubmitDirect = true;");
    expect(block).toContain("if (shouldSubmitDirect) {\n      txHash = await submitDirect();\n    }");
    expect(block.match(/txHash = await submitDirect\(\);/g)).toHaveLength(1);

    const sponsorshipTry = block.slice(block.indexOf("try {"), block.indexOf("if (shouldSubmitDirect)"));
    expect(sponsorshipTry).not.toContain("rpcServer.sendTransaction");
    expect(sponsorshipTry).not.toContain("await submitDirect()");
  });

  it("uses direct submission unless sponsorship is explicitly enabled", () => {
    const content = fs.readFileSync(path.resolve(__dirname, "./useStellarWallet.ts"), "utf-8");
    expect(content).toContain('const SPONSORSHIP_ENABLED = process.env.NEXT_PUBLIC_SPONSORSHIP_ENABLED === "true"');
    expect(content).toContain("if (SPONSORSHIP_ENABLED) {");
    expect(content).toContain("} else {\n      shouldSubmitDirect = true;\n    }");
  });
});
