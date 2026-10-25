import { BookOpen, FileText, GraduationCap } from "lucide-react";

const requirements = [
  {
    icon: BookOpen,
    title: "Passport",
    text: "A valid passport. You will upload a clear photo or scan of it.",
  },
  {
    icon: FileText,
    title: "CV with your photo",
    text: "Your CV with a passport-size photo of you on it.",
  },
  {
    icon: GraduationCap,
    title: "School certificate",
    text: "JHS certificate or higher. Anything from JHS upwards is accepted.",
  },
];

export default function Requirements() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="text-3xl font-bold md:text-4xl">What you need</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Recruitment is free. Bring these three documents and you are ready to
          apply.
        </p>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {requirements.map((item) => (
            <li key={item.title} className="rounded-3xl bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-primary">
                <item.icon size={24} aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}