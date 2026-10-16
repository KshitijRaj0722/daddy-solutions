"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Mobile-only floating CTA. Appears once the hero is behind the reader and
 * steps aside as soon as the contact section is reached.
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const contact = document.getElementById("contact");
      const reachedContact =
        !!contact && contact.getBoundingClientRect().top < window.innerHeight;
      setVisible(window.scrollY > 600 && !reachedContact);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300 md:hidden",
        "bg-gradient-to-t from-ink-950 via-ink-950/90 to-transparent",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <Button href="#contact" size="lg" className="w-full">
        Talk to us
        <Icon name="arrowRight" size={18} />
      </Button>
    </div>
  );
}
