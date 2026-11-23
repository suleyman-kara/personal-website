'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUp, Check, Clock, GitCommitHorizontal, Info, Minus, Radio, Scale, X } from 'lucide-react';
import snapshot from '@/data/forecast.json';
import { rv } from '@/motion';
import { localePath } from '@/lib/site';
import type { Lang } from '@/data/portfolioData';
import { card, chip, nudgeRight, textLink } from './styles';

// status.json (schema 1) is published every 4 hours by suleyman-kara/crypto-forecasting-live.
// src/data/forecast.json is the build-time snapshot (scripts/fetch-forecast.mjs); the card
// renders it first, then swaps in the live file when it is newer.
export const STATUS_URL =
  'https://raw.githubusercontent.com/suleyman-kara/crypto-forecasting-live/main/live/status.json';
const REFRESH_MS = 5 * 60 * 1000;
const FRESH_MS = 6 * 60 * 60 * 1000;
const MIN_SCORED = 30;
// After this long past the close, say the update is late rather than "scoring".
const LATE_MS = 60 * 60 * 1000;
const PROJECT_ID = 'crypto-forecasting-live';

type Direction = 'up' | 'down';
type Action = 'long' | 'flat';
type Outcome = 'hit' | 'miss' | 'pending' | 'skipped';

export interface ForecastStatus {
  schema: 1;
  generatedAt: string;
  asset: string;
  interval: string;
  mode: string;
  startingBalance: number;
  model: { version: string; trainedThrough: string } | null;
  current: {
    candleOpen: string;
    targetClose: string;
    p: number;
    direction: Direction;
    action: Action;
    threshold: number;
  } | null;
  stats: {
    predictions: number;
    scored: number;
    hits: number;
    accuracy: number | null;
    accuracy30d: number | null;
    equity: number;
    returnPct: number;
    buyHoldReturnPct: number;
    maxDrawdownPct: number;
    since: string | null;
  };
  equity: { t: string; model: number; buyHold: number }[];
  recent: {
    candleOpen: string;
    p: number | null;
    direction: Direction;
    action: Action;
    outcome: Outcome;
    realizedReturnPct: number | null;
  }[];
  backtest: {
    period: { from: string; to: string };
    accuracy: number;
    auc: number;
    returnPct: number;
    buyHoldReturnPct: number;
    maxDrawdownPct: number;
    sharpe: number;
    trades: number;
  } | null;
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';
/** Same checks as scripts/fetch-forecast.mjs. */
function isStatus(v: unknown): v is ForecastStatus {
  return (
    isObj(v) &&
    v.schema === 1 &&
    typeof v.generatedAt === 'string' &&
    !Number.isNaN(Date.parse(v.generatedAt)) &&
    isObj(v.stats) &&
    Array.isArray(v.equity) &&
    Array.isArray(v.recent) &&
    (v.current == null || isObj(v.current)) &&
    (v.backtest == null || isObj(v.backtest))
  );
}

const initial = snapshot as unknown as ForecastStatus;
const isEmpty = (d: ForecastStatus) => !d.current && d.stats.predictions === 0 && d.equity.length === 0;

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

function formatters(lang: Lang) {
  const loc = lang === 'tr' ? 'tr-TR' : 'en-US';
  const pctFmt = new Intl.NumberFormat(loc, { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const signedFmt = new Intl.NumberFormat(loc, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: 'exceptZero',
  });
  const wholePct = new Intl.NumberFormat(loc, { style: 'percent', maximumFractionDigits: 0 });
  const usdFmt = new Intl.NumberFormat(loc, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const usdCompact = new Intl.NumberFormat(loc, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 });
  const numFmt = new Intl.NumberFormat(loc, { maximumFractionDigits: 2 });
  const intFmt = new Intl.NumberFormat(loc);
  const timeFmt = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC' });
  const clockFmt = new Intl.DateTimeFormat(loc, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC' });
  const dayFmt = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const dateFmt = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const rel = new Intl.RelativeTimeFormat(loc, { numeric: 'auto' });
  const d = (iso: string) => new Date(iso);
  return {
    /** Percent-unit value (12.3 means 12.3%). */
    pct: (v: number | null | undefined) => (v == null ? '–' : pctFmt.format(v / 100)),
    signed: (v: number | null | undefined) => (v == null ? '–' : signedFmt.format(v / 100)),
    /** Fraction (0.53 means 53%). */
    frac: (v: number | null | undefined) => (v == null ? '–' : pctFmt.format(v)),
    whole: (v: number) => wholePct.format(v),
    usd: (v: number) => (Math.abs(v) >= 100_000 ? usdCompact.format(v) : usdFmt.format(v)),
    num: (v: number | null | undefined) => (v == null ? '–' : numFmt.format(v)),
    int: (v: number) => intFmt.format(v),
    time: (iso: string) => `${timeFmt.format(d(iso))} UTC`,
    clock: (iso: string) => `${clockFmt.format(d(iso))} UTC`,
    day: (iso: string) => dayFmt.format(d(iso)),
    date: (iso: string) => dateFmt.format(d(iso)),
    ago: (ms: number) => {
      const min = Math.round(ms / 60_000);
      if (min < 60) return rel.format(-Math.max(min, 1), 'minute');
      const h = Math.round(min / 60);
      if (h < 48) return rel.format(-h, 'hour');
      return rel.format(-Math.round(h / 24), 'day');
    },
    countdown: (ms: number) => {
      const s = Math.max(0, Math.floor(ms / 1000));
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      const pad = (n: number) => String(n).padStart(2, '0');
      if (lang === 'tr') return h > 0 ? `${h} sa ${pad(m)} dk` : `${m} dk ${pad(sec)} sn`;
      return h > 0 ? `${h}h ${pad(m)}m` : `${m}m ${pad(sec)}s`;
    },
  };
}
type Fmt = ReturnType<typeof formatters>;

/* ------------------------------------------------------------------ */
/* Data: snapshot first, then the live file                            */
/* ------------------------------------------------------------------ */

function useForecast() {
  const [data, setData] = useState<ForecastStatus>(initial);
  const lastFetch = useRef(0);

  const load = useCallback(async () => {
    lastFetch.current = Date.now();
    try {
      const res = await fetch(STATUS_URL, { cache: 'no-store' });
      if (!res.ok) return;
      const next: unknown = await res.json();
      if (!isStatus(next)) return;
      // Newer wins; the empty placeholder snapshot loses to any published file.
      setData((cur) => (isEmpty(cur) || Date.parse(next.generatedAt) > Date.parse(cur.generatedAt) ? next : cur));
    } catch {
      // Offline or blocked: keep what is on screen.
    }
  }, []);

  useEffect(() => {
    load();
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastFetch.current >= REFRESH_MS) load();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  return data;
}

/** Wall clock, null until mounted so the prerendered HTML has no time-dependent text. */
function useNow(tickMs: number) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), tickMs);
    return () => window.clearInterval(id);
  }, [tickMs]);
  return now;
}

/* ------------------------------------------------------------------ */
/* Colors                                                              */
/* ------------------------------------------------------------------ */
// Validated with the dataviz palette checker against the card surface in each mode
// (light #FFFFFF, dark #0D2540): indigo = model, orange = buy & hold.
const MODEL = { stroke: 'stroke-[#635BFF] dark:stroke-[#7F77FF]', fill: 'fill-[#635BFF] dark:fill-[#7F77FF]', bg: 'bg-[#635BFF] dark:bg-[#7F77FF]' };
const HOLD = { stroke: 'stroke-[#E5672F] dark:stroke-[#D95926]', fill: 'fill-[#E5672F] dark:fill-[#D95926]', bg: 'bg-[#E5672F] dark:bg-[#D95926]' };
const UP = 'text-emerald-700 dark:text-emerald-400';
const DOWN = 'text-rose-700 dark:text-rose-400';

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function StatusBadge({ data, now, lang, fmt }: { data: ForecastStatus; now: number | null; lang: Lang; fmt: Fmt }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  if (isEmpty(data)) return <span className={chip}>{t('Coming soon', 'Yakında')}</span>;
  const age = now == null ? null : now - Date.parse(data.generatedAt);
  if (age != null && age < FRESH_MS && data.current) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-2.5 py-1">
        <span className="relative flex w-2 h-2" aria-hidden>
          <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
        </span>
        {t('Live', 'Canlı')}
      </span>
    );
  }
  return (
    <span className={chip} title={fmt.time(data.generatedAt)}>
      {t('Last update', 'Son güncelleme')} {age == null ? fmt.time(data.generatedAt) : fmt.ago(age)}
    </span>
  );
}

function DirectionMark({ dir, lang, className = '' }: { dir: Direction; lang: Lang; className?: string }) {
  const up = dir === 'up';
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${up ? UP : DOWN} ${className}`}>
      <Icon className="w-[1em] h-[1em]" strokeWidth={2.5} aria-hidden />
      {up ? (lang === 'en' ? 'Up' : 'Yükseliş') : lang === 'en' ? 'Down' : 'Düşüş'}
    </span>
  );
}

const confidence = (p: number, dir: Direction) => (dir === 'up' ? p : 1 - p);

function CurrentPrediction({ data, now, lang, fmt, compact }: { data: ForecastStatus; now: number | null; lang: Lang; fmt: Fmt; compact?: boolean }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const c = data.current;
  if (!c) {
    return (
      <div className="text-sm text-muted">
        {t('Waiting for the next prediction.', 'Sonraki tahmin bekleniyor.')}
        <div className="mt-1 text-xs text-subtle">{t('Published every 4 hours, minutes after each candle opens.', 'Her 4 saatte bir, mum açıldıktan birkaç dakika sonra yayınlanır.')}</div>
      </div>
    );
  }
  const left = now == null ? null : Date.parse(c.targetClose) - now;
  return (
    <div className={compact ? '' : 'grid sm:grid-cols-2 gap-5 sm:gap-8'}>
      <div>
        <div className="text-xs text-subtle">
          {t('Next 4h candle', 'Sonraki 4 saatlik mum')} · {fmt.time(c.candleOpen)}
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <DirectionMark dir={c.direction} lang={lang} className={compact ? 'text-2xl' : 'text-3xl'} />
          <span className="text-sm text-muted">
            <span className="font-semibold text-ink">{fmt.whole(confidence(c.p, c.direction))}</span> {t('confidence', 'güven')}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="text-muted">
            {t('Position', 'Pozisyon')}:{' '}
            <span className="font-semibold text-ink">{c.action === 'long' ? 'Long' : t('Flat (cash)', 'Nakit')}</span>
          </span>
          <span className="text-xs text-subtle tabular-nums">
            p(↑) = {fmt.num(c.p)} · {t('long above', 'long eşiği')} {fmt.num(c.threshold)}
          </span>
        </div>
      </div>
      <div className={compact ? 'mt-4 flex items-center gap-2 text-sm' : 'sm:border-l sm:border-line/70 sm:pl-8'}>
        {compact ? (
          <>
            <Clock className="w-4 h-4 text-subtle shrink-0" aria-hidden />
            <span className="text-muted">
              {left == null ? (
                <>
                  {t('Closes at', 'Kapanış')} {fmt.clock(c.targetClose)}
                </>
              ) : left > 0 ? (
                <>
                  {t('Resolves in', 'Sonuca')} <span className="font-semibold text-ink tabular-nums">{fmt.countdown(left)}</span>
                  {lang === 'tr' && ' kaldı'}
                </>
              ) : left > -LATE_MS ? (
                t('Candle closed, scoring soon', 'Mum kapandı, puanlama bekleniyor')
              ) : (
                t('Candle closed, awaiting update', 'Mum kapandı, güncelleme bekleniyor')
              )}
            </span>
          </>
        ) : (
          <>
            <div className="text-xs text-subtle">{t('Resolves in', 'Sonuca kalan süre')}</div>
            <div className="mt-2 text-3xl font-semibold text-ink tabular-nums" aria-live="off">
              {left == null ? '–' : left > 0 ? fmt.countdown(left) : left > -LATE_MS ? t('Scoring…', 'Puanlanıyor…') : t('Awaiting update', 'Güncelleme bekleniyor')}
            </div>
            <div className="mt-2 text-sm text-muted">
              {t('Candle closes at', 'Mum kapanışı')} {fmt.time(c.targetClose)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, sub, note }: { label: string; value: string; sub?: ReactNode; note?: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="mt-1">
        <span className="text-xl font-semibold text-ink">{value}</span>
        {note && <span className="ml-2 align-middle">{note}</span>}
        {sub && <div className="mt-0.5 text-xs text-subtle">{sub}</div>}
      </dd>
    </div>
  );
}

function CollectingChip({ scored, lang }: { scored: number; lang: Lang }) {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px] font-medium px-2 py-0.5 whitespace-nowrap">
      {lang === 'en' ? 'Collecting data' : 'Veri toplanıyor'} · {scored}/{MIN_SCORED}
    </span>
  );
}

function Stats({ data, lang, fmt, compact }: { data: ForecastStatus; lang: Lang; fmt: Fmt; compact?: boolean }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const s = data.stats;
  const collecting = s.scored < MIN_SCORED;
  const accuracy = (
    <Stat
      label={t('Hit rate', 'İsabet oranı')}
      value={fmt.frac(s.accuracy)}
      note={collecting ? <CollectingChip scored={s.scored} lang={lang} /> : undefined}
      sub={t(
        `${fmt.int(s.hits)} of ${fmt.int(s.scored)} scored · ${fmt.int(s.predictions)} predictions`,
        `${fmt.int(s.scored)} sonuçtan ${fmt.int(s.hits)} isabet · ${fmt.int(s.predictions)} tahmin`,
      )}
    />
  );
  const ret = (
    <Stat
      label={t('Paper return', 'Paper getiri')}
      value={fmt.signed(s.returnPct)}
      sub={
        <>
          {t('Buy & hold', 'Al-tut')} {fmt.signed(s.buyHoldReturnPct)}
        </>
      }
    />
  );
  if (compact) {
    return (
      <dl className="grid grid-cols-2 gap-4">
        {accuracy}
        {ret}
      </dl>
    );
  }
  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6 rounded-xl bg-inset border border-line/60 p-4 sm:p-5">
      {accuracy}
      {ret}
      <Stat label={t('Max drawdown', 'Maks. düşüş')} value={fmt.pct(s.maxDrawdownPct)} sub={t('Paper portfolio', 'Paper portföy')} />
      <Stat
        label={t('Paper balance', 'Paper bakiye')}
        value={fmt.usd(s.equity)}
        sub={t(`from ${fmt.usd(data.startingBalance)} virtual`, `${fmt.usd(data.startingBalance)} sanal bakiyeden`)}
      />
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* Equity chart: hand-written SVG, model vs buy & hold, one $ axis     */
/* ------------------------------------------------------------------ */

function niceTicks(min: number, max: number, count: number) {
  const span = max - min || Math.abs(max) * 0.02 || 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return { lo, hi, ticks };
}

function EquityChart({ points, lang, fmt, height, compact }: { points: ForecastStatus['equity']; lang: Lang; fmt: Fmt; height: number; compact?: boolean }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    setW(el.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const names = { model: t('Model', 'Model'), hold: t('Buy & hold', 'Al-tut') };
  const n = points.length;
  const last = points[n - 1];
  const times = points.map((p) => Date.parse(p.t));
  const values = points.flatMap((p) => [p.model, p.buyHold]);
  const { lo, hi, ticks } = niceTicks(Math.min(...values), Math.max(...values), compact ? 2 : 4);
  const labelEnds = !compact && w >= 520;

  const m = { top: 10, right: labelEnds ? 84 : 8, bottom: 22, left: compact ? 50 : 58 };
  const iw = Math.max(1, w - m.left - m.right);
  const ih = height - m.top - m.bottom;
  const t0 = times[0];
  const t1 = times[n - 1];
  const x = (ts: number) => m.left + (t1 === t0 ? iw : ((ts - t0) / (t1 - t0)) * iw);
  const y = (v: number) => m.top + ih - ((v - lo) / (hi - lo || 1)) * ih;
  const path = (key: 'model' | 'buyHold') =>
    points.map((p, i) => `${i ? 'L' : 'M'}${x(times[i]).toFixed(1)},${y(p[key]).toFixed(1)}`).join('');

  // About three date labels, spread along the axis.
  const xTickIdx = n < 2 ? [0] : Array.from(new Set([0, Math.round((n - 1) / 2), n - 1]));

  const pick = (clientX: number) => {
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect) return;
    const px = clientX - rect.left;
    let best = 0;
    for (let i = 1; i < n; i++) if (Math.abs(x(times[i]) - px) < Math.abs(x(times[best]) - px)) best = i;
    setIdx(best);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      setIdx((i) => {
        const cur = i ?? n - 1;
        return Math.min(n - 1, Math.max(0, cur + (e.key === 'ArrowRight' ? 1 : -1)));
      });
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      setIdx(e.key === 'Home' ? 0 : n - 1);
    } else if (e.key === 'Escape') setIdx(null);
  };

  // End labels: drop both when they would collide (the legend still names the series).
  const yEndModel = y(last.model);
  const yEndHold = y(last.buyHold);
  const endsApart = Math.abs(yEndModel - yEndHold) >= 14;

  const summary = t(
    `Paper portfolio value over time. Model ${fmt.usd(last.model)}, buy & hold ${fmt.usd(last.buyHold)} at ${fmt.time(last.t)}.`,
    `Zaman içinde paper portföy değeri. ${fmt.time(last.t)} itibarıyla model ${fmt.usd(last.model)}, al-tut ${fmt.usd(last.buyHold)}.`,
  );
  const hover = idx == null ? null : points[idx];
  const hx = idx == null ? 0 : x(times[idx]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className={`w-3.5 h-0.5 rounded-full ${MODEL.bg}`} aria-hidden />
          {names.model} <span className="font-semibold text-ink tabular-nums">{fmt.usd(last.model)}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={`w-3.5 h-0.5 rounded-full ${HOLD.bg}`} aria-hidden />
          {names.hold} <span className="font-semibold text-ink tabular-nums">{fmt.usd(last.buyHold)}</span>
        </span>
      </div>
      <div
        ref={wrap}
        className="relative mt-3 outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-accent/50 touch-pan-y"
        style={{ height }}
        tabIndex={0}
        role="group"
        aria-label={summary}
        onKeyDown={onKey}
        onFocus={() => setIdx((i) => i ?? n - 1)}
        onBlur={() => setIdx(null)}
      >
        {w > 0 && (
          <svg width={w} height={height} className="block overflow-visible" aria-hidden>
            {ticks.map((v) => (
              <g key={v}>
                <line x1={m.left} x2={w - m.right} y1={y(v)} y2={y(v)} className="stroke-line" strokeWidth={1} shapeRendering="crispEdges" />
                <text x={m.left - 8} y={y(v)} dy="0.32em" textAnchor="end" className="fill-subtle text-[10px] tabular-nums">
                  {fmt.usd(v)}
                </text>
              </g>
            ))}
            {xTickIdx.map((i, k) => (
              <text
                key={i}
                x={x(times[i])}
                y={height - 6}
                textAnchor={xTickIdx.length === 1 ? 'end' : k === 0 ? 'start' : k === xTickIdx.length - 1 ? 'end' : 'middle'}
                className="fill-subtle text-[10px]"
              >
                {fmt.day(points[i].t)}
              </text>
            ))}
            <path d={path('buyHold')} fill="none" className={HOLD.stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            <path d={path('model')} fill="none" className={MODEL.stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {hover && (
              <line x1={hx} x2={hx} y1={m.top} y2={m.top + ih} className="stroke-line-strong" strokeWidth={1} shapeRendering="crispEdges" />
            )}
            {(hover
              ? [
                  { v: hover.buyHold, c: HOLD.fill, cx: hx },
                  { v: hover.model, c: MODEL.fill, cx: hx },
                ]
              : [
                  { v: last.buyHold, c: HOLD.fill, cx: x(t1) },
                  { v: last.model, c: MODEL.fill, cx: x(t1) },
                ]
            ).map((d, k) => (
              <circle key={k} cx={d.cx} cy={y(d.v)} r={4} className={`${d.c} stroke-card`} strokeWidth={2} />
            ))}
            {labelEnds && endsApart && (
              <>
                <text x={x(t1) + 10} y={yEndModel} dy="0.32em" className="fill-muted text-[11px] font-medium">
                  {names.model}
                </text>
                <text x={x(t1) + 10} y={yEndHold} dy="0.32em" className="fill-muted text-[11px] font-medium">
                  {names.hold}
                </text>
              </>
            )}
            {/* Hit area: the whole plot, so the pointer only has to find the date. */}
            <rect
              x={m.left}
              y={0}
              width={iw}
              height={height}
              fill="transparent"
              onPointerMove={(e: PointerEvent<SVGRectElement>) => pick(e.clientX)}
              onPointerDown={(e: PointerEvent<SVGRectElement>) => pick(e.clientX)}
              onPointerLeave={() => setIdx(null)}
            />
          </svg>
        )}
        {hover && (
          <div
            className="pointer-events-none absolute top-0 z-10 rounded-lg bg-card border border-line shadow-lg dark:shadow-none px-3 py-2 text-xs whitespace-nowrap"
            style={hx > w / 2 ? { right: w - hx + 10 } : { left: hx + 10 }}
          >
            <div className="text-subtle">{fmt.time(hover.t)}</div>
            {[
              { v: hover.model, name: names.model, bg: MODEL.bg, base: points[0].model },
              { v: hover.buyHold, name: names.hold, bg: HOLD.bg, base: points[0].buyHold },
            ].map((r) => (
              <div key={r.name} className="mt-1 flex items-center gap-2">
                <span className={`w-3 h-0.5 rounded-full ${r.bg}`} aria-hidden />
                <span className="font-semibold text-ink tabular-nums">{fmt.usd(r.v)}</span>
                <span className="text-subtle tabular-nums">{fmt.signed(((r.v - r.base) / r.base) * 100)}</span>
                <span className="text-muted">{r.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {!compact && (
        <details className="mt-3 text-xs">
          <summary className="cursor-pointer text-subtle hover:text-accent w-max">{t('Show data table', 'Veri tablosunu göster')}</summary>
          <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-line/70">
            <table className="w-full text-left tabular-nums">
              <thead className="sticky top-0 bg-inset text-subtle">
                <tr>
                  <th className="font-medium px-3 py-1.5">{t('Time', 'Zaman')}</th>
                  <th className="font-medium px-3 py-1.5 text-right">{names.model}</th>
                  <th className="font-medium px-3 py-1.5 text-right">{names.hold}</th>
                </tr>
              </thead>
              <tbody className="text-body">
                {points.map((p) => (
                  <tr key={p.t} className="border-t border-line/50">
                    <td className="px-3 py-1">{fmt.time(p.t)}</td>
                    <td className="px-3 py-1 text-right">{fmt.usd(p.model)}</td>
                    <td className="px-3 py-1 text-right">{fmt.usd(p.buyHold)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Recent predictions and backtest                                     */
/* ------------------------------------------------------------------ */

function OutcomeMark({ outcome, lang }: { outcome: Outcome; lang: Lang }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const map = {
    hit: { Icon: Check, label: t('Hit', 'İsabet'), cls: UP },
    miss: { Icon: X, label: t('Miss', 'Iska'), cls: DOWN },
    pending: { Icon: Clock, label: t('Pending', 'Bekliyor'), cls: 'text-subtle' },
    skipped: { Icon: Minus, label: t('Skipped', 'Atlandı'), cls: 'text-faint' },
  } as const;
  const o = map[outcome] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${o.cls}`}>
      <o.Icon className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden />
      {o.label}
    </span>
  );
}

function Recent({ rows, lang, fmt }: { rows: ForecastStatus['recent']; lang: Lang; fmt: Fmt }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const [all, setAll] = useState(false);
  const shown = all ? rows : rows.slice(0, 8);
  return (
    <div>
      <ul className="divide-y divide-line/60 text-sm">
        {shown.map((r) => (
          <li key={r.candleOpen} className="py-2.5 grid grid-cols-[1fr_auto] sm:grid-cols-[9.5rem_1fr_auto_4.5rem] items-center gap-x-4 gap-y-1">
            <span className="text-xs text-subtle tabular-nums sm:text-sm">{fmt.time(r.candleOpen)}</span>
            <span className="row-start-2 sm:row-start-auto inline-flex flex-wrap items-center gap-x-2.5">
              <DirectionMark dir={r.direction} lang={lang} />
              {r.p != null && <span className="text-xs text-subtle tabular-nums">{fmt.whole(confidence(r.p, r.direction))}</span>}
              <span className="text-xs text-muted">· {r.action === 'long' ? 'Long' : t('Flat', 'Nakit')}</span>
            </span>
            <span className="justify-self-end">
              <OutcomeMark outcome={r.outcome} lang={lang} />
            </span>
            <span
              className="row-start-2 col-start-2 sm:row-start-auto sm:col-start-auto justify-self-end text-xs text-muted tabular-nums"
              title={t('Realized return', 'Gerçekleşen getiri')}
            >
              {r.realizedReturnPct == null ? '' : fmt.signed(r.realizedReturnPct)}
            </span>
          </li>
        ))}
      </ul>
      {rows.length > shown.length && (
        <button type="button" onClick={() => setAll(true)} className="mt-2 text-sm font-medium text-accent hover:underline">
          {t(`Show ${rows.length - shown.length} more`, `${rows.length - shown.length} tane daha göster`)}
        </button>
      )}
    </div>
  );
}

function Backtest({ b, lang, fmt }: { b: NonNullable<ForecastStatus['backtest']>; lang: Lang; fmt: Fmt }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const items = [
    { label: t('Hit rate', 'İsabet oranı'), value: fmt.frac(b.accuracy) },
    { label: 'ROC-AUC', value: fmt.num(b.auc) },
    { label: t('Return', 'Getiri'), value: fmt.signed(b.returnPct), sub: `${t('Buy & hold', 'Al-tut')} ${fmt.signed(b.buyHoldReturnPct)}` },
    { label: t('Max drawdown', 'Maks. düşüş'), value: fmt.pct(b.maxDrawdownPct) },
    { label: 'Sharpe', value: fmt.num(b.sharpe) },
    { label: t('Trades', 'İşlem'), value: fmt.int(b.trades) },
  ];
  return (
    <div className="rounded-xl bg-inset border border-line/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-sm font-semibold text-ink">{t('Backtest · walk-forward, out of sample', 'Backtest · walk-forward, örneklem dışı')}</h4>
        <span className="text-xs text-subtle">
          {fmt.date(b.period.from)} – {fmt.date(b.period.to)}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4">
        {items.map((i) => (
          <div key={i.label}>
            <dt className="text-xs text-subtle">{i.label}</dt>
            <dd className="mt-0.5 font-semibold text-ink">
              {i.value}
              {i.sub && <div className="text-xs font-normal text-subtle">{i.sub}</div>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Disclaimer({ lang }: { lang: Lang }) {
  return (
    <p className="flex items-start gap-2 text-xs text-subtle">
      <Info className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden />
      {lang === 'en'
        ? 'Paper trading · real prices, virtual balance · not investment advice'
        : 'Paper trading · gerçek fiyatlar, sanal bakiye · yatırım tavsiyesi değildir'}
    </p>
  );
}

function EmptyState({ lang, compact }: { lang: Lang; compact?: boolean }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const steps = [
    { Icon: Radio, title: t('Predict before the close', 'Kapanıştan önce tahmin'), text: t('Every 4 hours the model publishes whether the next BTC-USD candle closes up.', 'Model her 4 saatte bir, sonraki BTC-USD mumunun yükselişle kapanıp kapanmayacağını yayınlar.') },
    { Icon: GitCommitHorizontal, title: t('Commit to git', 'Git’e commit'), text: t('Each prediction is committed before its outcome is known, so the log can’t be edited later.', 'Her tahmin, sonucu belli olmadan commit edilir; kayıt sonradan değiştirilemez.') },
    { Icon: Scale, title: t('Score against reality', 'Gerçekle karşılaştır'), text: t('Hits, misses and a $10,000 paper portfolio are tracked against buy & hold.', 'İsabetler, ıskalar ve 10.000 $’lık paper portföy al-tut ile karşılaştırılır.') },
  ];
  return (
    <div>
      <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-ink`}>{t('Model goes live soon', 'Model yakında canlı')}</h3>
      <p className="mt-1.5 text-sm text-muted leading-relaxed max-w-xl">
        {t(
          'The first predictions will appear here as soon as the pipeline starts publishing. Until then there is nothing to show, by design: no numbers before they are real.',
          'Sistem yayına başladığında ilk tahminler burada görünecek. O zamana kadar gösterilecek bir şey yok, bilinçli olarak: gerçek olmayan rakam yok.',
        )}
      </p>
      {!compact && (
        <ol className="mt-6 grid sm:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <li key={i} className="rounded-xl bg-inset border border-line/60 p-4">
              <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                <s.Icon className="w-4 h-4" aria-hidden />
              </span>
              <div className="mt-3 text-sm font-semibold text-ink">{s.title}</div>
              <p className="mt-1 text-xs text-muted leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export default function LiveForecast({ lang, variant = 'full' }: { lang: Lang; variant?: 'full' | 'compact' }) {
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr);
  const data = useForecast();
  const now = useNow(1000);
  const fmt = formatters(lang);
  const empty = isEmpty(data);
  const meta = `${data.asset} · ${data.interval} · ${t('paper portfolio', 'paper portföy')}`;

  if (variant === 'compact') {
    const href = localePath(lang, `/projects/${PROJECT_ID}/`);
    return (
      <div {...rv} data-glow className={`${card} p-5 sm:p-7`}>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div>
            <h3 className="font-semibold text-ink">{t('Live ML forecast', 'Canlı ML tahmini')}</h3>
            <div className="text-xs text-subtle">{meta}</div>
          </div>
          <StatusBadge data={data} now={now} lang={lang} fmt={fmt} />
        </div>
        {empty ? (
          <div className="mt-5">
            <EmptyState lang={lang} compact />
          </div>
        ) : (
          <div className="mt-5 grid lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-5 min-w-0 space-y-5">
              <CurrentPrediction data={data} now={now} lang={lang} fmt={fmt} compact />
              <Stats data={data} lang={lang} fmt={fmt} compact />
            </div>
            <div className="lg:col-span-7 min-w-0">
              {data.equity.length > 0 && <EquityChart points={data.equity} lang={lang} fmt={fmt} height={150} compact />}
            </div>
          </div>
        )}
        <div className="mt-6 pt-4 border-t border-line/70 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <Disclaimer lang={lang} />
          <Link href={href} className={textLink}>
            {t('How it works', 'Nasıl çalışıyor')} <ArrowRight className={`w-4 h-4 ${nudgeRight}`} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section {...rv} data-glow aria-labelledby="live-forecast-title" className={`${card} p-5 sm:p-7`}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h2 id="live-forecast-title" className="text-xl font-semibold text-ink">
            {t('Live forecast', 'Canlı tahmin')}
          </h2>
          <div className="mt-0.5 text-xs text-subtle">{meta}</div>
        </div>
        <StatusBadge data={data} now={now} lang={lang} fmt={fmt} />
      </div>

      {empty ? (
        <div className="mt-6">
          <EmptyState lang={lang} />
        </div>
      ) : (
        <>
          <div className="mt-6">
            <CurrentPrediction data={data} now={now} lang={lang} fmt={fmt} />
          </div>
          <div className="mt-7">
            <Stats data={data} lang={lang} fmt={fmt} />
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-ink">{t('Paper portfolio vs buy & hold', 'Paper portföy ve al-tut')}</h3>
            <div className="mt-3">
              {data.equity.length > 0 ? (
                <EquityChart points={data.equity} lang={lang} fmt={fmt} height={220} />
              ) : (
                <p className="text-sm text-subtle">{t('The equity curve starts after the first scored prediction.', 'Getiri eğrisi ilk sonuçlanan tahminden sonra başlar.')}</p>
              )}
            </div>
          </div>
          {data.recent.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-ink">{t('Recent predictions', 'Son tahminler')}</h3>
              <div className="mt-2">
                <Recent rows={data.recent} lang={lang} fmt={fmt} />
              </div>
            </div>
          )}
        </>
      )}

      {data.backtest && (
        <div className="mt-8">
          <Backtest b={data.backtest} lang={lang} fmt={fmt} />
        </div>
      )}

      <div className="mt-7 pt-4 border-t border-line/70 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <Disclaimer lang={lang} />
        {data.model && (
          <span className="text-xs text-faint">
            Model {data.model.version} · {t('trained through', 'eğitim verisi sonu:')} {fmt.date(data.model.trainedThrough)}
          </span>
        )}
      </div>
    </section>
  );
}
