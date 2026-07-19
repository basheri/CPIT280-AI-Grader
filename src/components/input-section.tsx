type InputSectionProps = {
  number: number;
  title: string;
  description: string;
  textName: string;
  fileName: string;
  placeholder: string;
  error?: string;
};

export function InputSection({
  number,
  title,
  description,
  textName,
  fileName,
  placeholder,
  error,
}: InputSectionProps) {
  const descId = `${textName}-desc`;
  const errorId = `${textName}-error`;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 font-bold text-white">
          {number}
        </span>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
          <p id={descId} className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <label className="block text-sm font-bold text-slate-700" htmlFor={textName}>
        لصق النص
      </label>
      <textarea
        id={textName}
        name={textName}
        rows={5}
        placeholder={placeholder}
        aria-required="true"
        aria-describedby={`${descId}${error ? ` ${errorId}` : ""}`}
        aria-invalid={error ? "true" : undefined}
        className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 leading-7 text-slate-900 placeholder:text-slate-400"
      />

      <div className="my-4 flex items-center gap-3 text-xs font-bold text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        أو
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <label className="block text-sm font-bold text-slate-700" htmlFor={fileName}>
        رفع ملف
      </label>
      <input
        id={fileName}
        name={fileName}
        type="file"
        accept=".txt,.pdf,.docx"
        aria-describedby={descId}
        className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm file:ml-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-bold file:text-white"
      />
      <p className="mt-2 text-xs text-slate-400">TXT أو PDF أو DOCX</p>

      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm font-bold text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}
