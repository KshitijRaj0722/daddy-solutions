"use client";

import { useState } from "react";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { services, type Service } from "@/lib/content";
import { cn } from "@/lib/utils";

function ServiceCard({ service, delay }: { service: Service; delay: number }) {
  return (
    <Reveal delay={delay} className={cn(service.featured && "sm:col-span-2")}>
      <article
        className={cn(
          "card-lift hairline group flex h-full flex-col rounded-2xl bg-ink-900/50 p-6 sm:p-7",
          service.featured && "bg-gradient-to-br from-ink-850 to-ink-900",
          service.temporary && "border-dashed bg-ink-900/30",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "hairline grid size-11 place-items-center rounded-xl bg-ink-800 transition-colors duration-300",
              service.temporary
                ? "text-bone-dim"
                : "text-brass group-hover:bg-brass group-hover:text-ink-950",
            )}
          >
            <Icon name={service.icon} size={20} />
          </span>
          {service.featured && (
            <span className="rounded-full bg-brass/10 px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.18em] text-brass uppercase">
              Most asked for
            </span>
          )}
          {service.temporary && (
            <span className="hairline rounded-full px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.18em] text-mute uppercase">
              Limited
            </span>
          )}
        </div>

        <h3 className="mt-6 text-xl tracking-tight text-bone">
          {service.title}
        </h3>
        <p className="mt-2.5 text-[0.97rem] leading-relaxed text-mute">
          {service.blurb}
        </p>

        <ul
          className={cn(
            "mt-5 flex flex-wrap gap-x-4 gap-y-2 pt-1",
            service.featured && "mt-auto pt-6",
          )}
        >
          {service.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-center gap-1.5 font-mono text-[0.72rem] tracking-wide text-bone-dim/70"
            >
              <span
                className={cn(
                  "size-1 rounded-full",
                  service.temporary ? "bg-mute" : "bg-brass/60",
                )}
              />
              {bullet}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}

const primaryServices = services.filter((s) => !s.more && !s.temporary);
const moreServices = services.filter((s) => s.more || s.temporary);

export function Services() {
  const [showMore, setShowMore] = useState(false);

  return (
    <Section id="services">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              Everything between{" "}
              <span className="font-normal text-brass italic">“what if”</span>{" "}
              and <span className="text-bone">“it&rsquo;s live.”</span>
            </>
          }
          intro="Our core engineering work — plus a few extras we run for select clients. Take one, take all of them; most start with a build and stay for the maintenance."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {primaryServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} delay={i * 60} />
          ))}
        </div>

        <div
          id="more-services"
          className={cn(
            "mt-4 gap-4 sm:grid-cols-2 lg:grid-cols-3",
            showMore ? "grid" : "hidden",
          )}
        >
          {moreServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} delay={i * 60} />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            aria-expanded={showMore}
            aria-controls="more-services"
            className="hairline rounded-full bg-ink-900/60 px-5 py-2.5 font-mono text-xs tracking-wide text-bone-dim transition-colors hover:border-brass/40 hover:text-brass"
          >
            {showMore
              ? "Show fewer services"
              : `More services (${moreServices.length})`}
          </button>

          {showMore && (
            <p className="font-mono text-xs text-mute">
              <span className="text-bone-dim">Limited</span> = offered to select
              clients and may be retired. Ask if you need one — our core
              software work isn&rsquo;t going anywhere.
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
