# CPIT280 AI Grader

تطبيق ويب شخصي وبسيط لمساعدة معلم مقرر **CPIT280 – Human-Computer Interaction** في تصحيح إجابة طالب وفق سؤال وRubric مرفقين، وإخراج درجة مقترحة من 20 مع مبررات قابلة للمراجعة.

## نطاق الإصدار الأول

- صفحة واحدة فقط.
- لا يوجد تسجيل دخول.
- لا توجد قاعدة بيانات.
- لا يوجد حفظ دائم لملفات الطلاب.
- رفع أو لصق:
  1. سؤال الواجب.
  2. Rubric التصحيح.
  3. إجابة الطالب.
- الدرجة الكلية الافتراضية: 20.
- تقييم كل معيار بصورة مستقلة.
- إظهار الدليل والمبرر لكل درجة.
- إمكانية تعديل الدرجة والتغذية الراجعة يدويًا.
- نسخ النتيجة أو طباعتها PDF من المتصفح.

## خارج النطاق

- إدارة الطلاب والشعب.
- التكامل مع Blackboard.
- كشف الانتحال.
- التصحيح الجماعي.
- لوحة مؤشرات.
- حسابات المستخدمين والصلاحيات.
- تخزين دائم للملفات والنتائج.

## التقنية

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Zod
- Vitest + Testing Library
- API متوافق مع OpenAI/OpenRouter باستخدام `fetch` دون ربط التطبيق بمزوّد واحد

## التشغيل المحلي

المتطلبات:

- Node.js 20.9 أو أحدث
- npm

```bash
npm install
cp .env.example .env.local
npm run dev
```

ثم افتح:

```text
http://localhost:3000
```

## أوامر الجودة

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## العمل باستخدام Claude Code

ابدأ دائمًا من جذر المشروع:

```bash
claude --permission-mode plan
```

ثم اطلب من Claude قراءة:

- `CLAUDE.md`
- `docs/PRD.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/TEST_PLAN.md`

يوجد برومبت بدء جاهز في:

```text
prompts/CLAUDE_CODE_MASTER_PROMPT.md
```

## الخصوصية

- لا تُحفظ الملفات في قاعدة بيانات.
- لا تُسجل إجابات الطلاب في السجلات.
- تتم المعالجة داخل الطلب ثم تُتلف البيانات بعد إعادة النتيجة.
- يمنع رفع ملفات `.env` أو المفاتيح السرية إلى GitHub.
