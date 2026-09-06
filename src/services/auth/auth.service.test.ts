import test from "node:test";
import assert from "node:assert/strict";

import { clearEmailVerificationFields } from "./auth.service";

test("clears verification fields by setting them to null", () => {
    const user = {
        emailVerificationToken: "token",
        emailVerificationExpires: new Date("2026-01-01T00:00:00.000Z"),
    };

    clearEmailVerificationFields(user);

    assert.equal(user.emailVerificationToken, null);
    assert.equal(user.emailVerificationExpires, null);
});
