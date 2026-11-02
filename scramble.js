/* "New numbers" generators for the vitamin calculation questions.
   Each generator returns { q, answers: [{label, value, unit, tol}], steps: [markdown] }.
   Keys are "<questions file slug>#<question id>". Methods match the worked answers in questions/*.md. */
(() => {
'use strict';

const pick = a => a[Math.floor(Math.random() * a.length)];
const range = (lo, hi, step = 1) => { const out = []; for (let x = lo; x <= hi + 1e-9; x += step) out.push(+x.toFixed(4)); return out; };
const SUPD = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
const sup = n => String(n).replace(/[0-9-]/g, c => SUPD[c]);

// plain decimals for everyday sizes, 4.7 × 10⁴ style for very big or small
function f(x, sig = 3) {
  if (x === 0) return '0';
  const neg = x < 0; x = Math.abs(x);
  let out;
  if (x >= 0.01 && x < 1e5) {
    out = String(+x.toPrecision(Math.max(sig, x >= 100 ? String(Math.round(x)).length : sig)));
  } else {
    let ex = Math.floor(Math.log10(x)), m = +(x / Math.pow(10, ex)).toPrecision(sig);
    if (m >= 10) { m = +(m / 10).toPrecision(sig); ex++; }
    out = (m === 1 ? '' : m + ' × ') + '10' + sup(ex);
  }
  return (neg ? '−' : '') + out;
}
const r2 = x => +x.toFixed(2);

const rel = (label, value, unit, r = 0.03) => ({ label, value, unit, tol: { rel: r } });

const G = {};

// ---------------------------------------------------------------- Topic 2: RAE of a meal
G['02-vitamin-a#Q5'] = () => {
  const ret = pick(range(40, 300, 10)), bc = pick(range(600, 4800, 120)), oc = pick(range(240, 1440, 48));
  const sex = pick([['woman', 600], ['man', 700]]);
  const rae = ret + bc / 12 + oc / 24, pct = rae / sex[1] * 100;
  return {
    q: `A meal contains **${ret} µg retinol**, **${bc} µg β-carotene** and **${oc} µg other carotenoids**.\n\n1. Find the total vitamin A in µg RAE.\n2. What % of an adult ${sex[0]}'s ${sex[1]} µg does it give?`,
    answers: [rel('Total', rae, 'µg RAE'), rel('% of RDA', pct, '%')],
    steps: [
      `**Convert each part.**\n\nRetinol counts 1 : 1 = ${ret} µg RAE\n\nβ-carotene ÷ 12 = ${bc} ÷ 12 = ${f(bc / 12)} µg RAE\n\nOther carotenoids ÷ 24 = ${oc} ÷ 24 = ${f(oc / 24)} µg RAE\n\nFrom: §3 Equation 1`,
      `**Add.**\n\nRAE = ${ret} + ${f(bc / 12)} + ${f(oc / 24)} = **${f(rae)} µg RAE**`,
      `**% of RDA.**\n\n${f(rae)} ÷ ${sex[1]} × 100 = **${f(pct)}%**\n\nFrom: §4`,
    ],
  };
};

// Topic 2: β-carotene needed to match a food
G['02-vitamin-a#M5'] = () => {
  const food = pick([['beef liver, 3 oz', 6582], ['sweet potato, 1 whole', 1403], ['spinach, ½ cup', 573], ['carrots, ½ cup', 459]]);
  const kind = pick([['β-carotene', 12], ['other carotenoids', 24]]);
  const need = food[1] * kind[1];
  return {
    q: `A portion of **${food[0]}** gives **${food[1]} µg RAE**.\n\nHow many µg of **${kind[0]}** would you need to eat to get the same vitamin A?`,
    answers: [rel(kind[0], need, 'µg')],
    steps: [`${kind[0][0].toUpperCase() + kind[0].slice(1)}: ${kind[1]} µg = 1 µg RAE.\n\nSo multiply the RAE by ${kind[1]}:\n\n${food[1]} × ${kind[1]} = **${f(need)} µg**\n\nFrom: §3 Equation 1`],
  };
};

// ---------------------------------------------------------------- Topic 3: vitamin K by body weight
G['03-vitamin-k#M4'] = () => {
  const kg = pick(range(50, 105, 1));
  const food = pick([['raw leaf lettuce', 62.5, 'cup'], ['raw spinach', 145, 'cup'], ['cooked broccoli', 220, 'cup'], ['olive oil', 8.1, 'tbsp']]);
  const n = kg / food[1];
  return {
    q: `A person weighs **${kg} kg**.\n\n1. Estimate their vitamin K Adequate Intake using the body-weight rule.\n2. How many ${food[2]}s of ${food[0]} (${food[1]} µg per ${food[2]}) would that take?`,
    answers: [rel('AI', kg, 'µg/day'), rel(food[2] + 's', n, food[2] + 's')],
    steps: [
      `**1.** AI = 1 µg × ${kg} kg = **${kg} µg/day**\n\nFrom: §7 Equation 1`,
      `**2.** ${kg} ÷ ${food[1]} = **${f(n)} ${food[2]}s**\n\nFrom: §3`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 4: µg and IU
G['04-vitamin-d#M4'] = () => {
  const iu = pick([400, 600, 800, 1000, 1500, 2000, 2500, 4000, 5000, 10000]);
  const ug = iu / 40;
  const grp = pick([['an infant', 10], ['an adolescent', 15], ['an adult', 10], ['a healthy older adult', 15], ['a housebound older adult', 20]]);
  return {
    q: `1. A supplement contains **${iu} IU** of vitamin D. How many µg is that?\n2. Is it above the US UL of 100 µg?\n3. The recommended intake for ${grp[0]} is **${grp[1]} µg/day**. How many IU is that?`,
    answers: [rel('1. Supplement', ug, 'µg'), rel('3. Intake', grp[1] * 40, 'IU')],
    steps: [
      `**1.** IU → µg: divide by 40.\n\n${iu} ÷ 40 = **${f(ug)} µg**\n\nFrom: §5 Equation 1`,
      `**2.** ${f(ug)} µg is ${ug > 100 ? '**above**' : ug === 100 ? '**equal to**' : '**below**'} the US UL of 100 µg.\n\nFrom: §11`,
      `**3.** µg → IU: multiply by 40.\n\n${grp[1]} × 40 = **${grp[1] * 40} IU**\n\nFrom: §5 Equation 1, §10`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 5: α-tocopherol equivalents
G['05-vitamin-e#Q4'] = () => {
  const a = pick(range(5, 60, 1)), b = pick(range(0, 40, 2)), g = pick(range(0, 60, 5)), t = pick(range(0, 15, 1));
  const te = a + 0.5 * b + 0.1 * g + 0.3 * t;
  return {
    q: `Per 100 g, an oil contains **${a} mg α-tocopherol**, **${b} mg β-tocopherol**, **${g} mg γ-tocopherol** and **${t} mg α-tocotrienol**.\n\nFind its vitamin E content in mg α-TE.`,
    answers: [rel('Vitamin E', te, 'mg α-TE per 100 g')],
    steps: [
      `**Multiply each vitamer by its factor.**\n\nα-tocopherol: ${a} × 1 = ${a}\n\nβ-tocopherol: ${b} × 0.5 = ${r2(0.5 * b)}\n\nγ-tocopherol: ${g} × 0.1 = ${r2(0.1 * g)}\n\nα-tocotrienol: ${t} × 0.3 = ${r2(0.3 * t)}\n\nFrom: §2 Equation 1`,
      `**Add.**\n\nα-TE = ${a} + ${r2(0.5 * b)} + ${r2(0.1 * g)} + ${r2(0.3 * t)} = **${r2(te)} mg α-TE per 100 g**`,
    ],
  };
};

// Topic 5: vitamin E AI from PUFA
G['05-vitamin-e#M4'] = () => {
  const pufa = pick(range(8, 30, 1));
  const src = pick([['sunflower oil', 5.6, 'tbsp'], ['safflower oil', 4.6, 'tbsp'], ['almonds', 7.4, 'oz'], ['hazelnuts', 4.3, 'oz']]);
  const ai = 0.4 * pufa, n = ai / src[1];
  return {
    q: `A person eats **${pufa} g of PUFA** a day.\n\n1. Find their vitamin E Adequate Intake.\n2. How many ${src[2]} of ${src[0]} (${src[1]} mg α-tocopherol per ${src[2]}) would cover it?`,
    answers: [rel('AI', ai, 'mg α-TE/day'), rel('Amount', n, src[2])],
    steps: [
      `**1.** AI = 0.4 × ${pufa} = **${r2(ai)} mg α-TE/day**\n\nFrom: §2 Equation 2`,
      `**2.** ${r2(ai)} ÷ ${src[1]} = **${f(n)} ${src[2]}**\n\nFrom: §1`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 6: thiamin from energy intake
G['06-thiamin-b1#Q5'] = () => {
  const kcal = pick(range(1600, 3400, 100)), fac = pick([0.07, 0.1]);
  const mj = kcal * 4.2 / 1000, pri = fac * mj;
  return {
    q: `A person eats **${kcal} kcal** a day. Using a PRI of **${fac} mg thiamin per MJ**, find:\n\n1. the energy intake in MJ\n2. the thiamin PRI in mg/day`,
    answers: [rel('1. Energy', mj, 'MJ'), rel('2. Thiamin', pri, 'mg/day')],
    steps: [
      `**1.** 1 kcal ≈ 4.2 kJ, and 1000 kJ = 1 MJ.\n\nMJ = ${kcal} × 4.2 ÷ 1000 = **${r2(mj)} MJ**\n\nFrom: §3 Equation 1`,
      `**2.** PRI = ${fac} × ${r2(mj)} = **${f(pri)} mg/day**`,
    ],
  };
};

G['06-thiamin-b1#M6'] = () => {
  const mj = pick(range(6, 15, 0.5));
  return {
    q: `A person eats **${mj} MJ** a day. Find their thiamin requirement using **0.07 mg/MJ**, and using **0.1 mg/MJ**.`,
    answers: [rel('At 0.07 mg/MJ', 0.07 * mj, 'mg/day'), rel('At 0.1 mg/MJ', 0.1 * mj, 'mg/day')],
    steps: [`**0.07 mg/MJ:** 0.07 × ${mj} = **${f(0.07 * mj)} mg/day**\n\n**0.1 mg/MJ:** 0.1 × ${mj} = **${f(0.1 * mj)} mg/day**\n\nFrom: §3 Equation 1`],
  };
};

// ---------------------------------------------------------------- Topic 8: niacin equivalents
G['08-niacin-b3#Q4'] = () => {
  const nia = pick(range(4, 30, 1)), trp = pick(range(300, 1500, 60));
  const ne = nia + trp / 60;
  return {
    q: `A day's diet contains **${nia} mg preformed niacin** and **${trp} mg tryptophan**.\n\nFind the total niacin equivalents.`,
    answers: [rel('Niacin', ne, 'mg NE')],
    steps: [
      `**Tryptophan to niacin:** ${trp} ÷ 60 = ${f(trp / 60)} mg\n\nFrom: §3 Equation 1`,
      `**Add the preformed niacin:** NE = ${nia} + ${f(trp / 60)} = **${f(ne)} mg NE**`,
    ],
  };
};

G['08-niacin-b3#M4'] = () => {
  const nia = pick(range(4, 16, 1)), trp = pick(range(180, 720, 60)), mj = pick(range(7, 12, 0.5));
  const ne = nia + trp / 60, need = 1.6 * mj, pct = ne / need * 100;
  return {
    q: `A meal provides **${nia} mg preformed niacin** and **${trp} mg tryptophan**.\n\n1. Find the niacin equivalents.\n2. A person eating **${mj} MJ** a day needs 1.6 mg NE per MJ. What % of their daily need does the meal give?`,
    answers: [rel('1. Niacin', ne, 'mg NE'), rel('2. % of need', pct, '%')],
    steps: [
      `**1.** NE = ${nia} + (${trp} ÷ 60) = ${nia} + ${f(trp / 60)} = **${f(ne)} mg NE**\n\nFrom: §3 Equation 1`,
      `**2.** Need = 1.6 × ${mj} = ${f(need)} mg NE\n\n% = ${f(ne)} ÷ ${f(need)} × 100 = **${f(pct)}%**`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 10: B6 from protein
G['10-vitamin-b6#Q5'] = () => {
  const p = pick(range(50, 180, 5));
  return {
    q: `A person eats **${p} g of protein** a day.\n\n1. Find their B6 reference intake in mg/day (15 µg per g protein).\n2. Find their average requirement in mg/day (13 µg per g protein).`,
    answers: [rel('1. Reference intake', 15 * p / 1000, 'mg/day'), rel('2. Average requirement', 13 * p / 1000, 'mg/day')],
    steps: [
      `**1.** 15 × ${p} = ${15 * p} µg = **${f(15 * p / 1000)} mg/day**\n\nFrom: §2 Equation 1`,
      `**2.** 13 × ${p} = ${13 * p} µg = **${f(13 * p / 1000)} mg/day**`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 12: DFE
G['12-folate-b9#Q6'] = () => {
  const food = pick(range(100, 350, 10)), fort = pick(range(0, 250, 50)); let supp = pick([0, 200, 400, 400, 800]); if (!fort && !supp) supp = 400;
  const fa = fort + supp, dfe = food + 1.7 * fa;
  const extra = [fort ? `**${fort} µg folic acid** from fortified bread` : '', supp ? `a **${supp} µg folic acid** supplement` : ''].filter(Boolean).join(' and ');
  return {
    q: `A woman's diet gives **${food} µg natural food folate**${extra ? ', plus ' + extra : ''}.\n\n1. Find her total DFE.\n2. Does she meet the pregnancy PRI of 600 µg/day?`,
    answers: [rel('DFE', dfe, 'µg DFE')],
    steps: [
      `**1.** Synthetic folic acid = ${fort && supp ? `${fort} + ${supp} = ` : ''}${fa} µg\n\nDFE = ${food} + (1.7 × ${fa}) = ${food} + ${f(1.7 * fa)} = **${f(dfe)} µg DFE**\n\nFrom: §3 Equation 1`,
      `**2.** ${f(dfe)} µg is ${dfe >= 600 ? '**above**' : '**below**'} 600 µg, so she ${dfe >= 600 ? 'meets' : 'does not meet'} the pregnancy PRI.\n\nFrom: §2`,
    ],
  };
};

G['12-folate-b9#M4'] = () => {
  const fa = pick([100, 150, 200, 250, 400, 500, 800]);
  return {
    q: `How many µg of natural food folate would you need to match the DFE of **${fa} µg** of folic acid?`,
    answers: [rel('Food folate', 1.7 * fa, 'µg')],
    steps: [`DFE of the folic acid = 1.7 × ${fa} = ${f(1.7 * fa)} µg DFE\n\nFood folate counts 1 : 1, so you need **${f(1.7 * fa)} µg** food folate.\n\nFrom: §3 Equation 1`],
  };
};

window.SCRAMBLE = G;
window.SCRAMBLE_FMT = f;
})();
