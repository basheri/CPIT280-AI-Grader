import { cleanup, render, fireEvent, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GraderForm } from "./grader-form";

afterEach(cleanup);

function renderForm() {
  const { container } = render(<GraderForm />);
  const form = container.querySelector("form")!;
  return within(form);
}

describe("GraderForm", () => {
  it("renders all four sections with correct headings", () => {
    const view = renderForm();
    expect(view.getByText("سؤال الواجب")).toBeInTheDocument();
    expect(view.getByText("Rubric التصحيح")).toBeInTheDocument();
    expect(view.getByText("الدرجة الكلية")).toBeInTheDocument();
    expect(view.getByText("إجابة الطالب")).toBeInTheDocument();
  });

  it("shows validation errors when submitting with all fields empty", () => {
    const view = renderForm();
    fireEvent.click(view.getByRole("button", { name: "تصحيح الإجابة" }));

    expect(view.getByText("أدخل نص السؤال أو ارفع ملفًا.")).toBeInTheDocument();
    expect(view.getByText("أدخل نص الـRubric أو ارفع ملفًا.")).toBeInTheDocument();
    expect(view.getByText("أدخل إجابة الطالب أو ارفع ملفًا.")).toBeInTheDocument();
  });

  it("does not show validation errors when textareas are filled", () => {
    const view = renderForm();

    fireEvent.change(view.getByPlaceholderText("اكتب أو ألصق سؤال الواجب هنا..."), {
      target: { value: "سؤال اختبار" },
    });
    fireEvent.change(view.getByPlaceholderText("ألصق Rubric التصحيح هنا..."), {
      target: { value: "معيار 1: 10 درجات" },
    });
    fireEvent.change(view.getByPlaceholderText("ألصق إجابة الطالب هنا..."), {
      target: { value: "إجابة الطالب" },
    });

    fireEvent.click(view.getByRole("button", { name: "تصحيح الإجابة" }));

    expect(view.queryByText("أدخل نص السؤال أو ارفع ملفًا.")).not.toBeInTheDocument();
    expect(view.queryByText("أدخل نص الـRubric أو ارفع ملفًا.")).not.toBeInTheDocument();
    expect(view.queryByText("أدخل إجابة الطالب أو ارفع ملفًا.")).not.toBeInTheDocument();
  });

  it("shows error when total score is below 0.25", () => {
    const view = renderForm();
    const scoreInput = view.getByLabelText("الدرجة");
    fireEvent.change(scoreInput, { target: { value: "0" } });
    fireEvent.click(view.getByRole("button", { name: "تصحيح الإجابة" }));

    expect(view.getByText("يجب أن تكون الدرجة 0.25 على الأقل.")).toBeInTheDocument();
  });

  it("has aria-required on required inputs", () => {
    const view = renderForm();
    expect(view.getByPlaceholderText("اكتب أو ألصق سؤال الواجب هنا...")).toHaveAttribute(
      "aria-required",
      "true"
    );
    expect(view.getByPlaceholderText("ألصق Rubric التصحيح هنا...")).toHaveAttribute(
      "aria-required",
      "true"
    );
    expect(view.getByPlaceholderText("ألصق إجابة الطالب هنا...")).toHaveAttribute(
      "aria-required",
      "true"
    );
    expect(view.getByLabelText("الدرجة")).toHaveAttribute("aria-required", "true");
  });

  it("validation errors have role=alert", () => {
    const view = renderForm();
    fireEvent.click(view.getByRole("button", { name: "تصحيح الإجابة" }));

    const alerts = view.getAllByRole("alert");
    expect(alerts.length).toBeGreaterThanOrEqual(3);
  });

  it("renders the default total score as 20", () => {
    const view = renderForm();
    expect(view.getByLabelText("الدرجة")).toHaveValue(20);
  });
});
