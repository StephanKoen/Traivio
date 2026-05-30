import type { Metadata } from "next";
import EnquireForm from "@/components/EnquireForm";

export const metadata: Metadata = {
  title: "Enquire Privately — Amara Africa",
  description:
    "Write to us. A senior member of our Dubai office will reply in person, within one working day. No automated confirmations.",
};

export default function EnquirePage() {
  return (
    <>
      <section
        className="section-x pt-[144px] md:pt-[184px] pb-[60px]"
        style={{ background: "var(--dd-white)" }}
      >
        <div className="max-w-container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-7">
              <p className="label mb-6">Enquire Privately</p>
              <h1 className="h1-display">
                Write to us, and{" "}
                <span className="gold-italic">we will write back</span>.
              </h1>
            </div>
            <div className="md:col-span-5 flex flex-col justify-end">
              <p className="body-copy max-w-[460px]">
                A senior member of our Dubai office will reply in person,
                within one working day. You will hear from a named individual.
                There is no automated confirmation, and there is no mailing
                list behind this form.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-x pb-[120px] md:pb-[170px]"
        style={{ background: "var(--dd-white)" }}
      >
        <div className="max-w-container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-[72px]">
            <div className="md:col-span-7">
              <div
                className="p-8 md:p-9"
                style={{
                  background: "var(--dd-white)",
                  border: "0.5px solid var(--dd-border)",
                }}
              >
                <EnquireForm />
              </div>
            </div>

            <aside className="md:col-span-5 md:col-start-8">
              <div
                className="p-8 md:p-9"
                style={{
                  background: "var(--dd-white)",
                  border: "0.5px solid var(--dd-border)",
                }}
              >
                <p className="label mb-5">Offices</p>
                <div className="flex flex-col gap-6">
                  <Office
                    city="Dubai"
                    description="Jumeirah Village Circle — guest relationships and the Gulf office."
                  />
                  <Office
                    city="George"
                    description="Garden Route, South Africa — strategy and operations."
                  />
                </div>

                <div className="mt-8 hairline pt-6">
                  <p className="label mb-3">WhatsApp</p>
                  <a
                    href="https://wa.me/971588585960"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif italic text-[22px] leading-snug transition-colors duration-300 hover:text-[color:var(--dd-gold-antique)]"
                    style={{ color: "var(--dd-ink)" }}
                  >
                    +971 58 858 5960
                  </a>
                  <p
                    className="mt-2 text-[13px] leading-relaxed"
                    style={{ color: "var(--dd-stone)" }}
                  >
                    UAE Business WhatsApp — we typically reply within a few hours.
                  </p>
                </div>

                <div className="mt-8 hairline pt-6">
                  <p className="label mb-3">Reply time</p>
                  <p
                    className="font-serif italic text-[22px] leading-snug"
                    style={{ color: "var(--dd-ink)" }}
                  >
                    Within one working day, from a named individual.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function Office({
  city,
  description,
}: {
  city: string;
  description: string;
}) {
  return (
    <div>
      <p
        className="font-serif italic text-[22px] leading-snug"
        style={{ color: "var(--dd-ink)" }}
      >
        {city}
      </p>
      <p
        className="mt-2 text-[13px] leading-relaxed"
        style={{ color: "var(--dd-stone)" }}
      >
        {description}
      </p>
    </div>
  );
}
