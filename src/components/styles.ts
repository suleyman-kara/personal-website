// Shared class strings, unchanged from the single-page version. Plain module so
// both server and client components can use them.
export const card =
  'rounded-2xl bg-card border border-line/80 shadow-[0_2px_5px_-1px_rgba(50,50,93,0.08),0_1px_3px_-1px_rgba(0,0,0,0.06)] dark:shadow-none';
// Shared hover/press polish. Lift: project-family cards. Press: primary/secondary buttons.
export const lift =
  'transition-[transform,box-shadow] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_13px_27px_-5px_rgba(50,50,93,0.15),0_8px_16px_-8px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)] dark:hover:border-line-strong';
export const press = 'transition-[color,background-color,border-color,transform] duration-200 ease-out-expo active:scale-[0.98]';
export const nudgeRight = 'transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5';
export const nudgeLeft = 'transition-transform duration-200 ease-out-expo group-hover:-translate-x-0.5';
export const nudgeUpRight = `${nudgeRight} group-hover:-translate-y-0.5`;
export const chip = 'inline-flex items-center rounded-full bg-chip text-muted text-xs font-medium px-2.5 py-1';
export const primaryBtn = `group inline-flex items-center gap-2 rounded-full bg-[#635BFF] hover:bg-[#5249e6] text-white font-medium px-6 py-3 shadow-lg shadow-[#635BFF]/25 ${press}`;
export const secondaryBtn = `group inline-flex items-center gap-1.5 rounded-full bg-card border border-line hover:border-line-strong text-ink font-medium px-6 py-3 shadow-sm ${press}`;
export const textLink = 'group inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline';
