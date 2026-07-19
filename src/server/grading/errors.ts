export class AITimeoutError extends Error {
  constructor(message = "انتهت مهلة الاتصال بخدمة الذكاء الاصطناعي.") {
    super(message);
    this.name = "AITimeoutError";
  }
}

export class AIProviderError extends Error {
  readonly status: number;

  constructor(status: number, message = "خطأ من مزود خدمة الذكاء الاصطناعي.") {
    super(message);
    this.name = "AIProviderError";
    this.status = status;
  }
}

export class AIConnectionError extends Error {
  constructor(message = "تعذر الاتصال بخدمة الذكاء الاصطناعي.") {
    super(message);
    this.name = "AIConnectionError";
  }
}

export class AIResponseValidationError extends Error {
  constructor(message = "استجابة الذكاء الاصطناعي غير صالحة.") {
    super(message);
    this.name = "AIResponseValidationError";
  }
}
