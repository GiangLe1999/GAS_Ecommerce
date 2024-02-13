"use strict";

const StatusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  BAD_REQUEST: "Bad request error",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden error",
  CONFLICT: "Conflict error",
};

// Kế thừa message và status từ Error của NodeJS
class ErrorResponse extends Error {
  constructor(message, status) {
    // Truyền message cho class Error (class cha) bằng method super
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class UnauthorizedRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class ForbiddenRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.BAD_REQUEST,
    statusCode = StatusCode.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  UnauthorizedRequestError,
  ForbiddenRequestError,
  BadRequestError,
};
