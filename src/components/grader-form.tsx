"use client";

import { FormEvent, useState } from "react";
import { InputSection } from "./input-section";
import { GradingResult } from "./grading-result";
import type { NormalizedGradingResult } from "@/lib/schemas";

type FormErrors = {
  question?: string;
  rubric?: string;
  answer?: string;
  totalScore?: string;
};

export function GraderForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<NormalizedGradingResult | null>(null);

  function validate(form: FormData): FormErrors {
    const errs: FormErrors = {};

    const questionText = (form.get("questionText") as string)?.trim();
    const questionFile = form.get("questionFile") as File | null;
    if (!questionText && (!questionFile || questionFile.size === 0)) {
      errs.question = "أدخل نص السؤال أو ارفع ملفًا.";
    }

    const rubricText = (form.get("rubricText") as string)?.trim();
    const rubricFile = form.get("rubricFile") as File | null;
    if (!rubricText && (!rubricFile || rubricFile.size === 0)) {
      errs.rubric = "أدخل نص الـRubric أو ارفع ملفًا.";
    }

    const answerText = (form.get("answerText") as string)?.trim();
    const answerFile = form.get("answerFile") as File | null;
    if (!answerText && (!answerFile || answerFile.size === 0)) {
      errs.answer = "أدخل إجابة الطالب أو ارفع ملفًا.";
    }

    const totalScore = Number(form.get("totalScore"));
    if (!Number.isFinite(totalScore) || totalScore < 0.25) {
      errs.totalScore = "يجب أن تكون الدرجة 0.25 على الأقل.";
    }

    return errs;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const errs = validate(form);
    setErrors(errs);
    setApiError(null);

    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/grade", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        const errorMessages: Record<number, string> = {
          400: data.error ?? "بيانات غير صالحة.",
          502: data.error ?? "خطأ من خدمة الذكاء الاصطناعي.",
          504: "انتهت مهلة الاتصال. حاول مرة أخرى.",
        };
        setApiError(errorMessages[response.status] ?? "حدث خطأ غير متوقع.");
        return;
      }

      const gradingResult = (await response.json()) as NormalizedGradingResult;
      setResult(gradingResult);
    } catch {
      setApiError("تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setResult(null);
    setApiError(null);
    setErrors({});
  }

  if (result) {
    return <GradingResult initialResult={result} onReset={handleReset} />;
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <InputSection
        number={1}
        title="سؤال الواجب"
        description="ألصق نص السؤال أو ارفع ملف السؤال."
        textName="questionText"
        fileName="questionFile"
        placeholder="اكتب أو ألصق سؤال الواجب هنا..."
        error={errors.question}
      />

      <InputSection
        number={2}
        title="Rubric التصحيح"
        description="أدخل المعايير والدرجة القصوى لكل معيار."
        textName="rubricText"
        fileName="rubricFile"
        placeholder="ألصق Rubric التصحيح هنا..."
        error={errors.rubric}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 font-bold text-white">
            3
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">الدرجة الكلية</h2>
            <p id="totalScore-desc" className="mt-1 text-sm leading-6 text-slate-500">
              القيمة الافتراضية 20 ويمكن تعديلها.
            </p>
          </div>
        </div>
        <label className="block text-sm font-bold text-slate-700" htmlFor="totalScore">
          الدرجة
        </label>
        <input
          id="totalScore"
          name="totalScore"
          type="number"
          min="0.25"
          step="0.25"
          defaultValue="20"
          aria-required="true"
          aria-describedby={`totalScore-desc${errors.totalScore ? " totalScore-error" : ""}`}
          aria-invalid={errors.totalScore ? "true" : undefined}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold sm:w-48"
        />
        {errors.totalScore && (
          <p id="totalScore-error" role="alert" className="mt-2 text-sm font-bold text-red-600">
            {errors.totalScore}
          </p>
        )}
      </section>

      <InputSection
        number={4}
        title="إجابة الطالب"
        description="ألصق الإجابة أو ارفع ملفًا واحدًا للطالب."
        textName="answerText"
        fileName="answerFile"
        placeholder="ألصق إجابة الطالب هنا..."
        error={errors.answer}
      />

      {apiError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900"
        >
          {apiError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        aria-disabled={submitting}
        className="w-full rounded-2xl bg-teal-700 px-6 py-4 text-lg font-black text-white shadow-lg shadow-teal-900/10 transition hover:bg-teal-800 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "جارٍ التصحيح..." : "تصحيح الإجابة"}
      </button>
    </form>
  );
}
