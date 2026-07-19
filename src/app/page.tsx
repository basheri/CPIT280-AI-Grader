import { GraderForm } from "@/components/grader-form";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8 text-center">
        <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800">
          CPIT280 · Human-Computer Interaction
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          مساعد تصحيح الواجبات
        </h1>
        <p className="mx-auto mt-3 max-w-2xl leading-8 text-slate-600">
          ارفع السؤال والـRubric وإجابة الطالب، ثم راجع الدرجة المقترحة من الذكاء الاصطناعي قبل اعتمادها.
        </p>
      </header>
      <GraderForm />
      <footer className="mt-8 text-center text-sm text-slate-500">
        لا يتم حفظ الملفات أو النتائج بشكل دائم.
      </footer>
    </main>
  );
}
