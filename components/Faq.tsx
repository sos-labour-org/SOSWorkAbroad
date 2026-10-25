import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";

const { uae, europe } = siteConfig.packages;

const faqs = [
  {
    q: "How do I know SOS Work Abroad is genuine?",
    a: `We are a licensed recruitment agency. Our licence number is ${siteConfig.licence}. You never pay a recruitment fee, and you are welcome to call or message us on WhatsApp before you apply.`,
  },
  {
    q: "Is registration really free?",
    a: "Yes. Registering and being recruited cost you nothing. The only payment is the travel package, and you pay it only after your documents are uploaded.",
  },
  {
    q: "What does the travel package cover?",
    a: `The UAE package is ${formatPrice(uae.amount, uae.currency)} and the European package is ${formatPrice(europe.amount, europe.currency)}. Each covers your flight ticket, medical examinations, documentation and processing, and everything else you need to travel.`,
  },
  {
    q: "What do I need to apply?",
    a: "Three things: your passport, a CV with your photo on it, and your school certificate (JHS or higher). You upload them on this website, so a clear photo or scan is enough.",
  },
  {
    q: "When will the first batch leave?",
    a: `The first UAE batch leaves in ${siteConfig.firstBatch.label}. Apply early so you can be considered for it. Applications continue after that for later batches.`,
  },
  {
    q: "Can I go straight to Europe instead of the UAE?",
    a: "Yes. Choose the European Jobs route when you apply. Working in the UAE also makes it easier to move on to European opportunities later.",
  },
  {
    q: "When do I pay?",
    a: "After you have uploaded all your documents. The payment step stays locked until your documents are complete, so you never pay before we have everything we need. You also get a reference number to keep track of your application.",
  },
  {
    q: "Is my passport and personal information safe?",
    a: "Your documents are stored privately, and only our authorised team can see them. We use them only for your application.",
  },
];

export default function Faq() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="text-3xl font-bold md:text-4xl">Questions? Answers.</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          The things people ask us most before they apply.
        </p>

        <div className="mt-10 max-w-3xl space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="group rounded-2xl bg-muted p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  className="shrink-0 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}