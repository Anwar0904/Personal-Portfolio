import test from "node:test";
import assert from "node:assert/strict";

import { UpdateUserSchema } from "./user.validator";

test("UpdateUserSchema accepts email and role updates", () => {
    const parsed = UpdateUserSchema.parse({
        firstName: "Updated FirstName",
        lastName: "Updated LastName",
        email: "new@example.com",
        role: "68a1b2c3d4e5f60718293a4b",
    });

    assert.equal(parsed.firstName, "Updated FirstName");
    assert.equal(parsed.lastName, "Updated LastName");
    assert.equal(parsed.email, "new@example.com");
    assert.equal(parsed.role, "68a1b2c3d4e5f60718293a4b");
});
