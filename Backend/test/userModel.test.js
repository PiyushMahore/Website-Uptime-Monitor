import "../src/config/env.js";
import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import { User } from "../src/models/user.model.js";

test("user JSON never includes passwords or authentication secrets", () => {
  const user = new User({
    fullName: "Test User",
    userName: "test-user",
    email: "test@example.com",
    password: "NeverSerializeThis123",
    refreshToken: "hashed-refresh-token",
    resetOtpHash: "hashed-reset-code",
  });
  const json = user.toJSON();
  assert.equal(json.fullName, "Test User");
  assert.equal("password" in json, false);
  assert.equal("refreshToken" in json, false);
  assert.equal("resetOtpHash" in json, false);
  assert.equal("resetOtpExpiresAt" in json, false);
});

test("refresh tokens are stored as a one-way hash", () => {
  const user = new User({ fullName: "Test", userName: "test", email: "test@example.com", password: "TestPassword123" });
  user.hashRefreshToken("refresh-token-value");
  assert.notEqual(user.refreshToken, "refresh-token-value");
  assert.match(user.refreshToken, /^[a-f\d]{64}$/);
});

test("bcrypt hashes can still be validated after the major-version upgrade", async () => {
  const hash = await bcrypt.hash("TestPassword123", 4);
  const user = new User({ fullName: "Test", userName: "test", email: "test@example.com", password: hash });
  assert.equal(await user.changePassword("TestPassword123"), true);
  assert.equal(await user.changePassword("incorrect"), false);
});
