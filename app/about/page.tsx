import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/images";
import NewsletterSection from "@/components/NewsletterSection";

export const metadata: Metadata = {
  title: "About — Amara Africa",
  description:
    "A small house, founded in 2025, with offices in Dubai, Cape Town and Lusaka. Our story, our team, and what we hold to.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero-ish header */}
      <section
        className="section-x pt-[144px] md:pt-[184px] pb-[60px] md:pb-[85px]"
        style={{ background: "var(--dd-white)" }}
      >
        <div className="max-w-container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-7">
              <p className="label mb-6">About</p>
              <h1 className="h1-display">
                A small house,{" "}
                <span className="gold-italic">quietly founded</span>, in 2025.
              </h1>
            </div>
            <div className="md:col-span-5 flex flex-col justify-end">
              <p className="body-copy max-w-[460px]">
                Amara Africa was founded in Dubai in 2025 by a small group
                of people who had spent fifteen years writing safaris for other
                companies, and who wanted to write them again, differently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand story split */}
      <section
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ background: "var(--dd-parchment)" }}
      >
        <div
          className="relative w-full"
          style={{ aspectRatio: "4 / 5", minHeight: 400 }}
        >
          <Image
            src={images.textiles}
            alt="Handwoven textiles folded on a low wooden bench"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex items-center">
          <div className="px-[clamp(22px,4.8vw,78px)] py-[clamp(52px,7vw,108px)] max-w-[640px]">
            <p className="label mb-5">The Story</p>
            <h2 className="h2-section">
              Written,{" "}
              <span className="gold-italic">not assembled</span>.
            </h2>
            <div className="mt-8 flex flex-col gap-5">
              <p className="body-copy">
                We spent years inside larger houses. We learned how to write a
                safari, and we learned — slowly, and with some frustration —
                what is lost when a file is handed down an assembly line, and
                what is gained when it is not.
              </p>
              <p className="body-copy">
                Amara Africa exists to keep a small number of journeys held
                by a small number of hands. Our Dubai office holds the guest
                relationship; our Cape Town product team holds the itinerary;
                our Lusaka team holds the ground operation. Three rooms, one
                voice, one pace.
              </p>
              <p className="body-copy">
                We are a house of three cities and three countries. We are from
                the Gulf, from Southern Africa, and from East Africa. Our
                clients are, quietly, the same.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        className="section-x section-y-lg"
        style={{ background: "var(--dd-white)" }}
      >
        <div className="max-w-container mx-auto">
          <div className="mb-[52px] md:mb-[76px]">
            <p className="label mb-5">The Team</p>
            <h2 className="h2-section">
              The{" "}
              <span className="gold-italic">hands behind the house</span>.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-9">
            <TeamCard
              name="Lloyd Barkhuizen"
              role="Co-Founder & UAE Sales Lead"
              office="Dubai"
              image={images.foodWine}
              alt="Lloyd Barkhuizen, Co-Founder of Amara Africa"
              bio={[
                "With over thirty years in the travel industry, Lloyd brings a depth of experience that few can match. His enduring passion for Africa — its landscapes, its people, its capacity to transform a traveller — is the thread that runs through everything he does.",
                "That passion, combined with a relentless focus on the guest experience, led him to co-found Amara Africa. Based in the UAE, Lloyd holds every client relationship in the Gulf personally, ensuring that each journey is as considered as the continent it explores.",
              ]}
            />
            <TeamCard
              name="Emma Jackson"
              role="SA Product Manager"
              office="Cape Town"
              image={images.lodgeInterior}
              alt="A considered lodge interior selected by the product team"
              bio={[
                "Emma builds every itinerary. She walks every lodge we hold, every year, and she knows which room has the late-afternoon light and which has the river frontage.",
                "Before Amara Africa she spent eight years as a senior product lead at one of Southern Africa's most respected safari houses.",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Philosophy statement */}
      <section
        className="section-x section-y"
        style={{ background: "var(--dd-parchment)" }}
      >
        <div className="max-w-container mx-auto">
          <div className="max-w-[980px] mx-auto text-center">
            <p className="label mb-6">Our philosophy</p>
            <blockquote>
              <p
                className="font-serif italic"
                style={{
                  fontSize: "clamp(30px, 3.6vw, 48px)",
                  lineHeight: 1.2,
                  color: "var(--dd-ink)",
                }}
              >
                &ldquo;A journey is not a product. It is a considered
                arrangement of hours, written for one household, by people who
                intend to be on the end of the phone while it happens.&rdquo;
              </p>
            </blockquote>
            <p className="label mt-8">
              Amara Africa · A Private House · Est. 2025
            </p>
          </div>

          <div className="mt-14 flex justify-center">
            <Link href="/enquire" className="text-link">
              Begin Your Journey &rarr;
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}

function TeamCard({
  name,
  role,
  office,
  image,
  alt,
  bio,
}: {
  name: string;
  role: string;
  office: string;
  image: string;
  alt: string;
  bio: string[];
}) {
  return (
    <div>
      <div
        className="relative w-full"
        style={{ aspectRatio: "4 / 5", background: "var(--dd-parchment)" }}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="mt-6">
        <p className="label mb-3">
          {role} · {office}
        </p>
        <h3
          className="font-serif italic text-[30px] leading-[1.1]"
          style={{ color: "var(--dd-ink)" }}
        >
          {name}
        </h3>
        <div className="mt-5 flex flex-col gap-3 max-w-[520px]">
          {bio.map((p, i) => (
            <p key={i} className="body-copy-sm">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
