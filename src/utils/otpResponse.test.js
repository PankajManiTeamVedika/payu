import { isOtpSuccessResponse } from "./otpResponse";

describe("isOtpSuccessResponse", () => {
  it("accepts server-controlled success payloads", () => {
    const response = { ok: true };

    expect(isOtpSuccessResponse(response, { success: true })).toBe(true);
    expect(isOtpSuccessResponse(response, { responseCode: "SUCCESS" })).toBe(true);
    expect(isOtpSuccessResponse(response, { verified: true })).toBe(true);
    expect(isOtpSuccessResponse(response, { status: "true" })).toBe(true);
  });

  it("accepts the backend's boolean status field (e.g. sendOtp/verifyOtp responses)", () => {
    const response = { ok: true };

    expect(
      isOtpSuccessResponse(response, {
        status: true,
        message: "OTP sent successfully",
        mobile: "******2614",
      })
    ).toBe(true);
    expect(isOtpSuccessResponse(response, { status: false })).toBe(false);
  });
});
