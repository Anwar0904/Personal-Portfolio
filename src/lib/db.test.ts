import test from "node:test";
import assert from "node:assert/strict";

import { getMongoUriCandidates } from "./db";

test("returns the configured URI before the local fallback URI", () => {
    const candidates = getMongoUriCandidates(
        "mongodb+srv://cluster.example.mongodb.net/adm-platform",
        "mongodb://127.0.0.1:27017/adm-platform"
    );

    assert.deepEqual(candidates, [
        "mongodb+srv://cluster.example.mongodb.net/adm-platform",
        "mongodb://127.0.0.1:27017/adm-platform",
    ]);
});

test("deduplicates the fallback URI when it matches the configured URI", () => {
    const candidates = getMongoUriCandidates(
        "mongodb://127.0.0.1:27017/adm-platform",
        "mongodb://127.0.0.1:27017/adm-platform"
    );

    assert.deepEqual(candidates, ["mongodb://127.0.0.1:27017/adm-platform"]);
});
