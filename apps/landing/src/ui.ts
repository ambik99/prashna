// Class lists shared by several parts of the Landing Page.

/** Fades, unblurs and slides in once it scrolls into view (landing.ts). Set --delay to stagger. */
export const reveal =
  "reveal js:opacity-0 in-view:animate-reveal in-view:will-change-[opacity,filter,transform] motion-reduce:opacity-100! motion-reduce:animate-none!";

/** A width that leaves a margin on each side: 24px, or 16px on phones. */
export const contentWidth = "mx-auto w-[min(960px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]";

export const sectionTitle =
  "max-w-[640px] font-display font-[300] text-[clamp(32px,4vw,40px)] leading-[1.1] tracking-[-0.025em] text-balance";
export const sectionSub = "mt-20 max-w-[440px] text-[16px] leading-[24px] text-muted text-balance";
export const sectionHead = "flex flex-col items-center text-center";

/** A small raised piece of UI inside the feature cards. */
export const ui = "rounded-[10px] bg-raised shadow-chip";
export const chip =
  "inline-flex items-center gap-5 px-10 py-4 rounded-[999px] bg-raised shadow-chip text-[12px] font-[500] whitespace-nowrap [&_b]:font-[600]";
/** Grey placeholder lines standing in for text. */
export const bars = "mt-8 grid gap-5 [&>i]:block [&>i]:h-5 [&>i]:rounded-[3px] [&>i]:bg-tint-8 [&>i:last-child]:w-[60%]";

export const card = "flex flex-col rounded-[16px] bg-tint-4";
export const quoteCard = "flex flex-col justify-between gap-28 p-20 rounded-[16px] bg-tint-3";

/** Screenshot frames. */
export const sheetShadow = "shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)]";
