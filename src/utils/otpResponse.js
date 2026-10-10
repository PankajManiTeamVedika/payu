export const isOtpSuccessResponse = (response, payload) => {
  if (!response || typeof response !== "object") return false;

  if (typeof response.ok === "boolean" && !response.ok) return false;

  if (payload && typeof payload === "object") {
    const normalized = {
      ...payload,
      success: payload.success ?? payload.isSuccess,
      verified: payload.verified ?? payload.isVerified,
      responseCode: payload.responseCode ?? payload.code ?? payload.statusCode,
      status: payload.status,
    };

    if (typeof normalized.success === "boolean") {
      return normalized.success;
    }

    if (typeof normalized.verified === "boolean") {
      return normalized.verified;
    }

    const responseCode = String(normalized.responseCode ?? "").trim().toUpperCase();
    if (responseCode) {
      return ["SUCCESS", "OK", "VERIFIED", "200", "200 OK"].includes(responseCode);
    }

    if (typeof normalized.status === "boolean") {
      return normalized.status;
    }

    if (typeof normalized.status === "string") {
      return ["success", "true", "ok", "verified"].includes(normalized.status.toLowerCase());
    }
  }

  return false;
};
