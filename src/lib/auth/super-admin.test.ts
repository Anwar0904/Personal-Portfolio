import test from "node:test";
import assert from "node:assert/strict";

import { isSuperAdmin } from "./super-admin";

test("normalizes stored super admin role names regardless of spacing or casing", () => {
    assert.equal(isSuperAdmin("super_admin"), true);
    assert.equal(isSuperAdmin("super admin"), true);
    assert.equal(isSuperAdmin("SUPER ADMIN"), true);
    assert.equal(isSuperAdmin({ name: "super admin" }), true);
    assert.equal(isSuperAdmin({ name: "admin" }), false);
});
