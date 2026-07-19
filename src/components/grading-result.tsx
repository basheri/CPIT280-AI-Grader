"use client";

import { useState, useCallback } from "react";
import type { NormalizedGradingResult, CriterionResult } from "@/lib/schemas";
import { clampScore, calculateTotal } from "@/domain/scoring";

type GradingResultProps = {
  initialResult: NormalizedGradingResult;
  onReset: () => void;
};

export function GradingResult({ initialResult, onReset }: GradingResultProps) {
  const [result, setResult] = useState(initialResult);

  const updateCriterionScore = useCallback(
    (index: number, value: number) => {
      setResult((prev) => {
        const criteria = prev.criteria.map((c, i) => {
          if (i !== index) return c;
          return { ...c, proposedScore: clampScore(value, c.maxScore) };
        });
        return {
          ...prev,
          criteria,
          earnedTotal: calculateTotal(criteria.map((c) => c.proposedScore)),
        };
      });
    },
    []
  );

  const updateCriterionField = useCallback(
    (index: number, field: keyof Pick<CriterionResult, "evidence" | "rationale">, value: string) => {
      setResult((prev) => ({
        ...prev,
        criteria: prev.criteria.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
      }));
    },
    []
  );

  const updateTextField = useCallback(
    (field: "strengths" | "improvements" | "finalFeedback", value: string) => {
      setResult((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(result.finalFeedback);
  }, [result.finalFeedback]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="space-y-5">
      {/* Score Header */}
      <section className="rounded-2xl border border-teal-200 bg-teal-50 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">الدرجة المقترحة</h2>
            <p className="mt-1 text-3xl font-black text-teal-700">
              {result.earnedTotal} / {result.requestedTotal}
            </p>
          </div>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">
            اقتراح الذكاء الاصطناعي
          </span>
        </div>
      </section>

      {/* Rubric Mismatch Warning */}
      {result.rubricMismatch && (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          مجموع معايير الـRubric لا يطابق الدرجة الكلية المطلوبة.
        </div>
      )}

      {/* General Warnings */}
      {result.warnings.length > 0 && (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          <ul className="list-inside list-disc space-y-1">
            {result.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Criteria */}
      {result.criteria.map((criterion, index) => (
        <section
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">{criterion.name}</h3>
            <div className="flex items-center gap-2">
              <label htmlFor={`score-${index}`} className="text-sm font-bold text-slate-500">
                الدرجة:
              </label>
              <input
                id={`score-${index}`}
                type="number"
                min="0"
                max={criterion.maxScore}
                step="0.25"
                value={criterion.proposedScore}
                onChange={(e) => updateCriterionScore(index, Number(e.target.value))}
                className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-center font-bold"
              />
              <span className="text-sm text-slate-400">/ {criterion.maxScore}</span>
            </div>
          </div>

          <label htmlFor={`evidence-${index}`} className="block text-sm font-bold text-slate-700">
            الدليل
          </label>
          <textarea
            id={`evidence-${index}`}
            rows={2}
            value={criterion.evidence}
            onChange={(e) => updateCriterionField(index, "evidence", e.target.value)}
            className="mt-1 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm leading-6 text-slate-900"
          />

          <label htmlFor={`rationale-${index}`} className="mt-2 block text-sm font-bold text-slate-700">
            التبرير
          </label>
          <textarea
            id={`rationale-${index}`}
            rows={2}
            value={criterion.rationale}
            onChange={(e) => updateCriterionField(index, "rationale", e.target.value)}
            className="mt-1 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm leading-6 text-slate-900"
          />

          {criterion.warning && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {criterion.warning}
            </p>
          )}
        </section>
      ))}

      {/* Strengths */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label htmlFor="strengths" className="block text-base font-extrabold text-slate-900">
          نقاط القوة
        </label>
        <textarea
          id="strengths"
          rows={3}
          value={result.strengths}
          onChange={(e) => updateTextField("strengths", e.target.value)}
          className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 leading-7 text-slate-900"
        />
      </section>

      {/* Improvements */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label htmlFor="improvements" className="block text-base font-extrabold text-slate-900">
          نقاط التحسين
        </label>
        <textarea
          id="improvements"
          rows={3}
          value={result.improvements}
          onChange={(e) => updateTextField("improvements", e.target.value)}
          className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 leading-7 text-slate-900"
        />
      </section>

      {/* Final Feedback */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label htmlFor="finalFeedback" className="block text-base font-extrabold text-slate-900">
          الملاحظات النهائية
        </label>
        <textarea
          id="finalFeedback"
          rows={4}
          value={result.finalFeedback}
          onChange={(e) => updateTextField("finalFeedback", e.target.value)}
          className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 leading-7 text-slate-900"
        />
      </section>

      {/* Actions */}
      <div className="flex gap-3 print:hidden">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          نسخ الملاحظات
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          طباعة
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 rounded-2xl bg-teal-700 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-teal-800"
        >
          تصحيح إجابة جديدة
        </button>
      </div>
    </div>
  );
}
