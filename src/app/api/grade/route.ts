import { NextResponse } from "next/server";
import { GradingInputSchema } from "@/lib/schemas";
import { validateTotalUploadSize } from "@/lib/validate-uploads";
import { extractText } from "@/server/extractors/extract-text";
import { ExtractionError } from "@/server/extractors/errors";
import { gradeAnswer } from "@/server/grading/grade";
import {
  AITimeoutError,
  AIProviderError,
  AIConnectionError,
  AIResponseValidationError,
} from "@/server/grading/errors";

async function resolveText(
  textField: FormDataEntryValue | null,
  fileField: FormDataEntryValue | null
): Promise<string> {
  if (fileField instanceof File && fileField.size > 0) {
    return extractText(fileField);
  }
  return typeof textField === "string" ? textField.trim() : "";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const files: File[] = [];
    for (const key of ["questionFile", "rubricFile", "answerFile"]) {
      const f = formData.get(key);
      if (f instanceof File && f.size > 0) files.push(f);
    }
    validateTotalUploadSize(files);

    const questionText = await resolveText(
      formData.get("questionText"),
      formData.get("questionFile")
    );
    const rubricText = await resolveText(
      formData.get("rubricText"),
      formData.get("rubricFile")
    );
    const answerText = await resolveText(
      formData.get("answerText"),
      formData.get("answerFile")
    );

    const totalScoreRaw = formData.get("totalScore");
    const totalScore = totalScoreRaw ? Number(totalScoreRaw) : 20;

    const validation = GradingInputSchema.safeParse({
      questionText,
      rubricText,
      totalScore,
      answerText,
    });

    if (!validation.success) {
      const messages = validation.error.issues.map((i) => i.message);
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }

    const result = await gradeAnswer(validation.data);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ExtractionError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 400 });
    }
    if (err instanceof AITimeoutError) {
      return NextResponse.json({ error: err.message }, { status: 504 });
    }
    if (err instanceof AIProviderError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    if (err instanceof AIConnectionError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    if (err instanceof AIResponseValidationError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    return NextResponse.json({ error: "حدث خطأ غير متوقع." }, { status: 500 });
  }
}
