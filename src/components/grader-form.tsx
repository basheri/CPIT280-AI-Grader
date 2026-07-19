"use client";

import { FormEvent, useState } from "react";

type InputSectionProps = {
  number: number;
  title: string;
  description: string;
  textName: string;
  fileName: string;
  placeholder: string;
};

function InputSection({ number, title, description, textName, fileName, placeholder }: InputSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 font-bold text-white">{number}</span>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      <label className="block text-sm font-bold text-slate-700" htmlFor={textName}>لصق النص</label>
      <textarea id={textName} name={textName} rows={5} placeholder={placeholder} className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 leading-7 text-slate-900 placeholder:text-slate-400" />
      <div className="my-4 flex items-center gap-3 text-xs font-bold text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />أو<span className="h-px flex-1 bg-slate-200" />
      </div>
      <label className="block text-sm font-bold text-slate-700" htmlFor={fileName}>رفع ملف</label>
      <input id={fileName} name={fileName} type="file" accept=".txt,.pdf,.docx" className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm file:ml-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-bold file:text-white" />
      <p className="mt-2 text-xs text-slate-400">TXT أو PDF أو DOCX</p>
    </section>
  );
}

export function GraderForm() {
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("تم تجهيز الواجهة الأولية. سيضيف Claude Code منطق الاستخراج والتصحيح في المهام التالية.");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <InputSection number={1} title="سؤال الواجب" description="ألصق نص السؤال أو ارفع ملف السؤال." textName="questionText" fileName="questionFile" placeholder="اكتب أو ألصق سؤال الواجب هنا..." />
      <InputSection number={2} title="Rubric التصحيح" description="أدخل المعايير والدرجة القصوى لكل معيار." textName="rubricText" fileName="rubricFile" placeholder="ألصق Rubric التصحيح هنا..." />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 font-bold text-white">3</span>
          <div><h2 className="text-lg font-extrabold text-slate-900">الدرجة الكلية</h2><p className="mt-1 text-sm leading-6 text-slate-500">القيمة الافتراضية 20 ويمكن تعديلها.</p></div>
        </div>
        <label className="block text-sm font-bold text-slate-700" htmlFor="totalScore">الدرجة</label>
        <input id="totalScore" name="totalScore" type="number" min="0.25" step="0.25" defaultValue="20" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-lg font-bold sm:w-48" />
      </section>
      <InputSection number={4} title="إجابة الطالب" description="ألصق الإجابة أو ارفع ملفًا واحدًا للطالب." textName="answerText" fileName="answerFile" placeholder="ألصق إجابة الطالب هنا..." />
      {message ? <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">{message}</div> : null}
      <button type="submit" className="w-full rounded-2xl bg-teal-700 px-6 py-4 text-lg font-black text-white shadow-lg shadow-teal-900/10 transition hover:bg-teal-800 active:translate-y-px">تصحيح الإجابة</button>
    </form>
  );
}
