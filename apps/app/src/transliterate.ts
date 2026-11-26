// Simple offline phonetic transliterator for Hindi and Bengali (Quick Insert),
// moved unchanged from the old app.

type Lang = "hi" | "bn";

export function phoneticTransliterate(input: string, lang: Lang): string {
  const isBn = lang === "bn";
  const vowels: Record<string, string> = isBn
    ? { aa: "আ", a: "অ", ii: "ঈ", i: "ই", uu: "ঊ", u: "উ", ai: "ঐ", e: "এ", au: "ঔ", o: "ও" }
    : { aa: "आ", a: "अ", ii: "ई", i: "इ", uu: "ऊ", u: "उ", ai: "ऐ", e: "ए", au: "औ", o: "ओ" };
  const matras: Record<string, string> = isBn
    ? { aa: "া", a: "", ii: "ী", i: "ি", uu: "ূ", u: "ু", ai: "ৈ", e: "ে", au: "ৌ", o: "ো" }
    : { aa: "ा", a: "", ii: "ी", i: "ि", uu: "ू", u: "ु", ai: "ै", e: "े", au: "ौ", o: "ो" };
  const virama = isBn ? "্" : "्";
  const anusvara = isBn ? "ং" : "ं";
  const cons: Record<string, string> = isBn ? {
    ksh: "ক্ষ", kh: "খ", gh: "ঘ", chh: "ছ", ch: "চ", jh: "ঝ", sh: "শ", th: "থ", dh: "ধ", ph: "ফ", bh: "ভ",
    k: "ক", g: "গ", j: "জ", t: "ত", d: "দ", n: "ন", p: "প", b: "ব", m: "ম", y: "য", r: "র", l: "ল", w: "ব", v: "ভ", s: "স", h: "হ"
  } : {
    ksh: "क्ष", gya: "ज्ञ", tra: "त्र", kh: "ख", gh: "घ", chh: "छ", ch: "च", jh: "झ", sh: "श", th: "थ", dh: "ध", ph: "फ", bh: "भ",
    k: "क", g: "ग", j: "ज", t: "त", d: "द", n: "न", p: "प", b: "ब", m: "म", y: "य", r: "र", l: "ल", v: "व", w: "व", s: "स", h: "ह"
  };
  const consKeys = Object.keys(cons).sort((a, b) => b.length - a.length);
  const vowelKeys = Object.keys(vowels).sort((a, b) => b.length - a.length);

  return input.split(/(\s+)/).map((token) => {
    if (/^\s+$/.test(token)) return token;
    let out = "";
    let idx = 0;
    const lower = token.toLowerCase();
    while (idx < lower.length) {
      if (lower[idx] === ".") { out += "।"; idx += 1; continue; }
      if (lower[idx] === "m" && idx + 1 < lower.length && !/[aeiou]/.test(lower[idx + 1] ?? "") && idx > 0) {
        out += anusvara; idx += 1; continue;
      }
      const cMatch = consKeys.find((k) => lower.startsWith(k, idx));
      if (cMatch) {
        out += cons[cMatch] ?? "";
        idx += cMatch.length;
        const vMatch = vowelKeys.find((k) => lower.startsWith(k, idx));
        if (vMatch) {
          out += matras[vMatch] ?? "";
          idx += vMatch.length;
        } else if (idx < lower.length && /[a-z]/.test(lower[idx] ?? "")) {
          out += virama;
        }
        continue;
      }
      const vMatch = vowelKeys.find((k) => lower.startsWith(k, idx));
      if (vMatch) {
        out += vowels[vMatch] ?? "";
        idx += vMatch.length;
        continue;
      }
      out += token[idx] ?? "";
      idx += 1;
    }
    return out;
  }).join("");
}
