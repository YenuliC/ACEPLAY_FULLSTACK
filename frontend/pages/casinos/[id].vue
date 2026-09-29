<script setup>
definePageMeta({ middleware: "auth" });

import { ref, computed, onMounted } from "vue";
import { useApi } from "@/composables/useApi";

const route   = useRoute();
const casino  = ref(null);
const loading = ref(true);
const error   = ref(null);

const d      = computed(() => casino.value?.data || null);
const info   = computed(() => d.value?.casino || {});
const urls   = computed(() => info.value?.url || {});
const games  = computed(() => urls.value?.game || {});
const social = computed(() => urls.value?.socialMedia || {});

const gameCategories = [
  { key: "slot",         label: "Slot",          icon: "🎰" },
  { key: "fishing",      label: "Fishing",        icon: "🎣" },
  { key: "live",         label: "Live",           icon: "🃏" },
  { key: "sports",       label: "Sports",         icon: "⚽" },
  { key: "bingo",        label: "Bingo",          icon: "🎱" },
  { key: "cockFighting", label: "Cock Fighting",  icon: "🐓" },
  { key: "others",       label: "Others",         icon: "🎯" }
];

const gameTypeIcons = {
  slot: "🎰", fishing: "🎣", crash: "💥", live: "🃏",
  sports: "⚽", bingo: "🎱", cockFighting: "🐓", lottery: "🎫", others: "🎯"
};

const formatAmount = (n) => {
  if (n === undefined || n === null || n === "") return "—";
  if (typeof n === "string" && isNaN(Number(n))) return n;
  return Number(n).toLocaleString();
};

const currency   = computed(() => info.value?.currency || "฿");
const rtpPercent = (rtp) => (rtp ? (rtp * 100).toFixed(2) + "%" : "—");

const fc = (n) => {
  const f = formatAmount(n);
  return f === "—" ? "—" : `${currency.value}${f}`;
};

const multiplier = (bet, win) => {
  const b = Number(bet), w = Number(win);
  if (!b || !w || b <= 0) return null;
  return Math.round(w / b) + "x";
};

const hasHighestWon = (hw) => hw && (hw.date || hw.time || hw.betAmount || hw.winAmount);

const depositRange = computed(() => {
  const p = d.value?.payment;
  if (!p) return null;
  const min = formatAmount(p.minDepositPerTime);
  const max = formatAmount(p.maxDepositPerTime);
  const cur = info.value?.currency || "THB";
  return (min === "—" && max === "—") ? null : `${min} - ${max} ${cur}`;
});

const load = async () => {
  loading.value = true;
  error.value   = null;
  try {
    casino.value = await useApi(`/casinos/${route.params.id}`);
  } catch (e) {
    error.value = e?.data?.message || "Casino not found";
  } finally {
    loading.value = false;
  }
};

const logout = () => { localStorage.removeItem("token"); navigateTo("/login"); };
onMounted(load);
</script>

<template>
  <div class="admin-shell page">

    <!-- ── Admin nav ── -->
    <header class="site-header">
      <div class="site-logo">
        <span class="logo-icon">♠</span>
        <span class="logo-text">ACEPlay <em>Admin</em></span>
      </div>
      <nav class="site-nav">
        <NuxtLink to="/dashboard" class="nav-link">Dashboard</NuxtLink>
        <NuxtLink to="/casinos"   class="nav-link">Casinos</NuxtLink>
        <button class="nav-logout" @click="logout">Logout</button>
      </nav>
    </header>

    <main class="page-main">
      <div v-if="loading" class="state-msg">Loading casino…</div>
      <div v-else-if="error" class="state-msg err">{{ error }}</div>

      <template v-else-if="casino">

        <!-- admin breadcrumb -->
        <div class="top-bar">
          <NuxtLink to="/casinos" class="breadcrumb">← Back to Casinos</NuxtLink>
          <NuxtLink :to="`/casinos/edit/${casino._id}`" class="btn-edit">✏️ Edit Casino</NuxtLink>
        </div>

        <!-- ════════════════════════════
             CASINO HEADER
        ════════════════════════════ -->
        <div class="c-header">

          <!-- LEFT: name, meta, desc, CTA buttons -->
          <div class="c-left">
            <h1 class="c-name">{{ info.name }}</h1>
            <div class="c-meta">
              <span v-if="info.launchYear">Launch Year: {{ info.launchYear }}</span>
              <template v-if="info.launchYear && depositRange"> | </template>
              <span v-if="depositRange">Deposit Range: {{ depositRange }}</span>
            </div>
            <p v-if="info.description" class="c-desc">{{ info.description }}</p>
            <div class="c-ctas">
              <a v-if="urls.main"        :href="urls.main"       target="_blank" class="cta cta-black">Play Now</a>
              <a v-if="urls.backup?.[0]" :href="urls.backup[0]"  target="_blank" class="cta cta-outline">Backup Link</a>
              <a v-if="urls.promotion"   :href="urls.promotion"  target="_blank" class="cta cta-outline">Explore Promotions</a>
            </div>
          </div>

          <!-- RIGHT: logo + key features -->
          <div class="c-right">
            <img v-if="urls.logo" :src="urls.logo" :alt="info.name" class="c-logo" />
            <div v-else class="c-logo-ph">{{ (info.name || "?").charAt(0) }}</div>
            <ul v-if="d?.keyFeatures?.length" class="c-features">
              <li v-for="(f, i) in d.keyFeatures" :key="i">
                <span class="chk">✓</span> {{ f }}
              </li>
            </ul>
          </div>

        </div>

        <!-- Certifications -->
        <div v-if="d?.certified" class="c-certs">
          <template v-for="(cert, key) in d.certified" :key="key">
            <span v-if="cert.status" class="cert">✔ {{ cert.name }}</span>
          </template>
        </div>

        <!-- ════════════════════════════
             GAME TABS
        ════════════════════════════ -->
        <div class="tabs-bar">
          <span class="tab-arrow">&#10094;</span>
          <div class="tabs-inner">
            <a
              v-for="cat in gameCategories" :key="cat.key"
              :class="['tab-item', { 'tab-no-link': !games[cat.key] }]"
              @click.prevent="games[cat.key] && window.open(games[cat.key], '_blank')"
            >
              {{ cat.icon }} {{ cat.label }}
            </a>
          </div>
          <span class="tab-arrow">&#10095;</span>
        </div>

        <!-- ════════════════════════════
             WELCOME BONUS
        ════════════════════════════ -->
        <div v-if="d?.welcomeBonus?.title || d?.welcomeBonus?.image" class="wb-card">
          <div class="wb-left">
            <img v-if="d.welcomeBonus.image" :src="d.welcomeBonus.image" class="wb-img" />
          </div>
          <div class="wb-right">
            <p v-if="d.welcomeBonus.subTitle" class="wb-sub">{{ d.welcomeBonus.subTitle }}</p>
            <h2 class="wb-title" v-html="(d.welcomeBonus.title||'').replace(/\n/g,'<br/>')"></h2>
            <div class="wb-terms">
              <template v-if="d.welcomeBonus.deposit">
                Deposit {{ formatAmount(d.welcomeBonus.deposit) }}
                <span class="arr">→</span>
              </template>
              <template v-if="d.welcomeBonus.bonus">
                Bonus {{ formatAmount(d.welcomeBonus.bonus) }}
                <span v-if="d.welcomeBonus.deposit && d.welcomeBonus.bonus" class="arr">→</span>
                <strong v-if="d.welcomeBonus.deposit && d.welcomeBonus.bonus">
                  Get {{ formatAmount(Number(d.welcomeBonus.deposit) + Number(d.welcomeBonus.bonus)) }}
                </strong>
              </template>
            </div>
            <p v-if="d.welcomeBonus.turnover" class="wb-fine">
              (Turnover {{ formatAmount(d.welcomeBonus.turnover) }}
              <template v-if="d.welcomeBonus.maxWithdrawal"> Max Withdrawal {{ formatAmount(d.welcomeBonus.maxWithdrawal) }}</template>)
            </p>
            <a v-if="d.welcomeBonus.url" :href="d.welcomeBonus.url" target="_blank" class="wb-btn">Join Promotion</a>
          </div>
        </div>

        <!-- ════════════════════════════
             BIG WIN HISTORY
        ════════════════════════════ -->
        <div v-if="d?.bigWinHistory?.length" class="section">
          <h2 class="section-title">Celebrate Big Wins Only at {{ info.name }}!</h2>
          <p class="section-sub">
            Experience the thrill of real player victories with massive payouts every day —
            stay inspired by the hottest winning games, because your next big win could be just one spin away! 🎲
          </p>
          <div class="hscroll">
            <div v-for="(bw, i) in d.bigWinHistory" :key="i" class="gcard">
              <img v-if="bw.image?.cover" :src="bw.image.cover" :alt="bw.gameName" class="gcard-img" />
              <div v-else class="gcard-img-ph">🎰</div>
              <div class="gcard-body">
                <div v-if="bw.date || bw.time" class="gc-date">
                  {{ bw.date }}<template v-if="bw.date && bw.time"> • </template>{{ bw.time }}
                </div>
                <div class="gc-name">{{ bw.gameName }}<span v-if="bw.gamePlatform" class="gc-dot"> • {{ bw.gamePlatform }}</span></div>
                <div v-if="bw.betAmount" class="gc-bet">Bet: {{ fc(bw.betAmount) }}</div>
                <div v-if="bw.winAmount" class="gc-win-row">
                  <span class="gc-win">Win: {{ fc(bw.winAmount) }}</span>
                  <span v-if="multiplier(bw.betAmount,bw.winAmount)" class="gc-mult">{{ multiplier(bw.betAmount,bw.winAmount) }}</span>
                </div>
                <a v-if="bw.url" :href="bw.url" target="_blank" class="gc-btn">Play Now</a>
              </div>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════
             TOP GAMES — matches Image 1
        ════════════════════════════ -->
        <div v-if="d?.topGames?.length" class="section">
          <h2 class="section-title">Top-Played Games Loved by Millions</h2>
          <p class="section-sub">
            Play the top-rated games loved by millions of players and experience nonstop excitement —
            the biggest wins are waiting for you! 🎮 🔥
          </p>
          <div class="hscroll">
            <div v-for="(tg, i) in d.topGames" :key="i" class="gcard">
              <img v-if="tg.highestWon?.image?.cover" :src="tg.highestWon.image.cover" :alt="tg.gameName" class="gcard-img" />
              <div v-else class="gcard-img-ph">🎮</div>
              <div class="gcard-body">
                <div class="gc-name">{{ tg.gameName }}<span v-if="tg.gamePlatform" class="gc-dot"> • {{ tg.gamePlatform }}</span></div>
                <div v-if="tg.rtp" class="gc-rtp">Winning Rate: <strong>{{ rtpPercent(tg.rtp) }}</strong></div>
                <template v-if="hasHighestWon(tg.highestWon)">
                  <div class="gc-hw-label">
                    🏆 Highest Winning
                    <span v-if="tg.highestWon.date || tg.highestWon.time" class="gc-hw-date">
                      · {{ tg.highestWon.date }}<template v-if="tg.highestWon.date && tg.highestWon.time"> - </template>{{ tg.highestWon.time }}
                    </span>
                  </div>
                  <div v-if="tg.highestWon.betAmount || tg.highestWon.winAmount" class="gc-bw-row">
                    <span v-if="tg.highestWon.betAmount" class="gc-bet">Bet: {{ fc(tg.highestWon.betAmount) }}</span>
                    <span v-if="tg.highestWon.winAmount" class="gc-win">Win: {{ fc(tg.highestWon.winAmount) }}</span>
                    <span v-if="multiplier(tg.highestWon.betAmount,tg.highestWon.winAmount)" class="gc-mult">
                      {{ multiplier(tg.highestWon.betAmount,tg.highestWon.winAmount) }}
                    </span>
                  </div>
                </template>
                <a v-if="tg.url" :href="tg.url" target="_blank" class="gc-btn">Play Now</a>
              </div>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════
             PROMOTIONS — matches Image 2
        ════════════════════════════ -->
        <div v-if="d?.promotions?.length" class="section">
          <h2 class="section-title">Exclusive Promotions You Can't Miss!</h2>
          <p class="section-sub">
            Join your favorite gaming destination and enjoy exclusive bonuses, high-value cashback, VIP rewards,
            and thrilling events every day. Don't miss your chance to win big! 💎 💙 🔥
          </p>
          <div class="hscroll">
            <div v-for="(promo, i) in d.promotions" :key="i" class="pcard">
              <img v-if="promo.image" :src="promo.image" :alt="promo.name" class="pcard-img" />
              <div v-else class="pcard-img-ph">🎁</div>
              <div class="pcard-body">
                <div class="pcard-name">{{ promo.name }}</div>
                <div v-if="promo.tag" class="pcard-tag">🏷 {{ promo.tag }}</div>
                <div class="pcard-grid">
                  <span class="pg-lbl">Deposit:</span>  <span class="pg-val">{{ formatAmount(promo.deposit) }}</span>
                  <span class="pg-lbl">Bonus:</span>    <span class="pg-val">{{ formatAmount(promo.bonus) }}</span>
                  <span class="pg-lbl">Turnover:</span> <span class="pg-val">{{ formatAmount(promo.turnover) }}</span>
                  <span class="pg-lbl">Net Win:</span>  <span class="pg-val">{{ promo.netwin || '-' }}</span>
                  <span class="pg-lbl">Max Withdrawal:</span>
                  <span class="pg-val pg-hi">{{ formatAmount(promo.maxWithdrawal) }}</span>
                  <span class="pg-lbl">Game Types:</span>
                  <span class="pg-val pg-icons">
                    <span v-for="gt in (promo.gameTypes||[])" :key="gt" :title="gt">{{ gameTypeIcons[gt] || gt }}</span>
                  </span>
                </div>
                <div class="pcard-btns">
                  <a :href="promo.url || urls.promotion || '#'" target="_blank" class="pbtn-join">Join Now</a>
                  <a :href="urls.promotion || promo.url || '#'" target="_blank" class="pbtn-all">All Promotions</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════
             PAYMENT INFO
        ════════════════════════════ -->
        <div v-if="d?.payment" class="section">
          <h2 class="section-title">Payment Information</h2>
          <div class="pay-grid">
            <div class="pay-cell"><div class="pay-lbl">MIN DEPOSIT</div><div class="pay-val">{{ formatAmount(d.payment.minDepositPerTime) }} {{ info.currency }}</div></div>
            <div class="pay-cell"><div class="pay-lbl">MAX DEPOSIT</div><div class="pay-val">{{ formatAmount(d.payment.maxDepositPerTime) }} {{ info.currency }}</div></div>
            <div class="pay-cell"><div class="pay-lbl">MAX DEPOSIT/DAY</div><div class="pay-val">{{ d.payment.maxDepositPerDay || '—' }}</div></div>
            <div class="pay-cell"><div class="pay-lbl">MIN WITHDRAWAL</div><div class="pay-val">{{ formatAmount(d.payment.minWithdrawalPerTime) }} {{ info.currency }}</div></div>
            <div class="pay-cell"><div class="pay-lbl">MAX WITHDRAWAL</div><div class="pay-val">{{ formatAmount(d.payment.maxWithdrawalPerTime) }} {{ info.currency }}</div></div>
            <div class="pay-cell"><div class="pay-lbl">MAX WITHDRAWAL/DAY</div><div class="pay-val">{{ d.payment.maxWithdrawalPerDay || '—' }}</div></div>
          </div>
          <div v-if="d.payment.channel?.length" class="pay-channels">
            <span v-for="ch in d.payment.channel" :key="ch" class="chan-chip">{{ ch.toUpperCase() }}</span>
          </div>
        </div>

        <!-- ════════════════════════════
             SOCIAL MEDIA
        ════════════════════════════ -->
        <div v-if="Object.values(social).some(v => v)" class="section">
          <h2 class="section-title">Social Media</h2>
          <div class="social-row">
            <a v-if="social.line"       :href="social.line"       target="_blank" class="sc sc-line">LINE</a>
            <a v-if="social.telegram"   :href="social.telegram"   target="_blank" class="sc sc-tg">Telegram</a>
            <a v-if="social.facebook"   :href="social.facebook"   target="_blank" class="sc sc-fb">Facebook</a>
            <a v-if="social.instragram" :href="social.instragram" target="_blank" class="sc sc-ig">Instagram</a>
            <a v-if="social.x"          :href="social.x"          target="_blank" class="sc sc-x">X</a>
          </div>
        </div>

      </template>
    </main>
  </div>
</template>

<style scoped>
* { box-sizing:border-box; }
.page { min-height:100vh; }
.page-main { max-width:960px; margin:0 auto; padding:20px 16px 56px; }

/* ── Admin nav ── */
.site-header { background:var(--ace-black); color:#fff; padding:0 24px; display:flex; align-items:center; justify-content:space-between; height:56px; position:sticky; top:0; z-index:100; border-bottom:2px solid var(--ace-gold); }
.site-logo { display:flex; align-items:center; gap:8px; }
.logo-icon { font-size:22px; color:var(--ace-gold); }
.logo-text { font-size:17px; font-weight:700; }
.logo-text em { color:var(--ace-gold); font-style:normal; }
.site-nav { display:flex; align-items:center; gap:8px; }
.nav-link { color:rgba(255,255,255,.65); text-decoration:none; font-size:14px; padding:5px 11px; border-radius:6px; }
.nav-link:hover { background:rgba(246,176,33,.15); color:var(--ace-gold); }
.nav-logout { background:transparent; border:1.5px solid rgba(255,255,255,.25); color:rgba(255,255,255,.7); padding:5px 13px; border-radius:6px; cursor:pointer; font-size:13px; }
.nav-logout:hover { background:#ef4444; border-color:#ef4444; color:#fff; }

/* ── breadcrumb ── */
.top-bar { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
.breadcrumb { color:var(--ace-gold); text-decoration:none; font-size:13px; }
.btn-edit { background:rgba(246,176,33,.1); color:var(--ace-gold); border:1px solid rgba(246,176,33,.3); padding:7px 15px; border-radius:7px; text-decoration:none; font-size:13px; font-weight:600; }

/* ════════════════════════════
   CASINO HEADER
════════════════════════════ */
.c-header { background:var(--ace-bg-card); display:flex; justify-content:space-between; gap:24px; align-items:flex-start; flex-wrap:wrap; border:1px solid var(--ace-border); border-radius:12px; padding:20px 24px; margin-bottom:16px; }

/* LEFT */
.c-left { flex:1; min-width:260px; display:flex; flex-direction:column; gap:10px; }
.c-name { font-size:34px; font-weight:800; color:var(--ace-text); margin:0; letter-spacing:-0.5px; }
.c-meta { font-size:13px; font-weight:600; color:var(--ace-orange); }
.c-desc { font-size:14px; color:var(--ace-text-muted); line-height:1.6; margin:0; }
.c-ctas { display:flex; gap:8px; flex-wrap:wrap; margin-top:4px; }
.cta { padding:9px 18px; border-radius:6px; font-size:13px; font-weight:700; text-decoration:none; white-space:nowrap; }
.cta-black   { background:var(--ace-gradient); color:var(--ace-black); }
.cta-black:hover { opacity:.92; }
.cta-outline { background:transparent; color:var(--ace-text); border:1px solid var(--ace-border); }
.cta-outline:hover { border-color:var(--ace-gold); color:var(--ace-gold); }

/* RIGHT */
.c-right { flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:12px; }
.c-logo { width:120px; height:120px; object-fit:contain; border-radius:10px; border:1px solid var(--ace-border); background:var(--ace-bg-input); }
.c-logo-ph { width:120px; height:120px; border-radius:10px; background:var(--ace-gradient); color:var(--ace-black); font-size:40px; font-weight:900; display:flex; align-items:center; justify-content:center; }
.c-features { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:5px; }
.c-features li { font-size:13px; color:var(--ace-text-muted); display:flex; align-items:flex-start; gap:6px; justify-content:flex-end; text-align:right; }
.chk { color:#4ade80; font-weight:900; flex-shrink:0; }

/* certs */
.c-certs { display:flex; gap:12px; flex-wrap:wrap; padding:8px 0 14px; }
.cert { font-size:13px; font-weight:700; color:#4ade80; display:flex; align-items:center; gap:4px; }

/* ════════════════════════════
   GAME TABS
════════════════════════════ */
.tabs-bar { display:flex; align-items:center; gap:4px; border-top:1px solid var(--ace-border); border-bottom:1px solid var(--ace-border); padding:8px 0; margin-bottom:16px; }
.tabs-inner { display:flex; gap:2px; overflow-x:auto; flex:1; }
.tabs-inner::-webkit-scrollbar { display:none; }
.tab-item { padding:8px 18px; border-radius:20px; font-size:13px; font-weight:600; color:var(--ace-text-muted); background:transparent; white-space:nowrap; cursor:pointer; border:1px solid transparent; text-decoration:none; transition:all .15s; }
.tab-item:hover { background:var(--ace-bg-elevated); border-color:var(--ace-border); color:var(--ace-text); }
.tab-no-link { opacity:.4; cursor:default; }
.tab-arrow { font-size:13px; color:var(--ace-text-light); cursor:pointer; padding:4px 6px; flex-shrink:0; user-select:none; }

/* ════════════════════════════
   WELCOME BONUS
════════════════════════════ */
.wb-card { display:flex; background:var(--ace-bg-card); border:1px solid var(--ace-border); border-radius:8px; overflow:hidden; margin-bottom:20px; }
.wb-left { flex-shrink:0; }
.wb-img { width:280px; max-width:40vw; height:100%; object-fit:cover; display:block; }
.wb-right { flex:1; padding:20px 24px; display:flex; flex-direction:column; justify-content:center; gap:10px; }
.wb-sub { font-size:15px; font-weight:700; color:#c084fc; margin:0; }
.wb-title { font-size:18px; font-weight:800; color:var(--ace-text); margin:0; line-height:1.5; }
.wb-terms { display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:14px; font-weight:700; color:var(--ace-text); }
.arr { color:var(--ace-text-light); font-weight:400; }
.wb-fine { font-size:12px; color:var(--ace-text-muted); margin:0; }
.wb-btn { display:inline-block; align-self:flex-start; background:var(--ace-gradient); color:var(--ace-black); padding:10px 22px; border-radius:6px; font-size:14px; font-weight:700; text-decoration:none; }
.wb-btn:hover { opacity:.92; }

/* ════════════════════════════
   SECTION WRAPPER
════════════════════════════ */
.section { background:var(--ace-bg-card); margin-bottom:0; padding:24px 20px 28px; border:1px solid var(--ace-border); border-radius:12px; margin-bottom:16px; }
.section-title { font-size:26px; font-weight:800; color:var(--ace-text); margin:0 0 6px; letter-spacing:-0.3px; }
.section-sub { font-size:13px; color:var(--ace-text-muted); margin:0 0 16px; line-height:1.6; }

/* ── Horizontal scroll ── */
.hscroll { display:flex; gap:14px; overflow-x:auto; padding-bottom:10px; }
.hscroll::-webkit-scrollbar { height:4px; }
.hscroll::-webkit-scrollbar-track { background:var(--ace-border); border-radius:2px; }
.hscroll::-webkit-scrollbar-thumb { background:var(--ace-text-light); border-radius:2px; }

/* ════════════════════════════
   GAME CARDS (big wins + top games)
════════════════════════════ */
.gcard { min-width:280px; max-width:280px; flex-shrink:0; background:var(--ace-bg-elevated); border:1px solid var(--ace-border); border-radius:10px; overflow:hidden; }
.gcard-img { width:100%; height:175px; object-fit:cover; display:block; }
.gcard-img-ph { width:100%; height:175px; background:var(--ace-bg-input); display:flex; align-items:center; justify-content:center; font-size:40px; }
.gcard-body { padding:12px 14px; display:flex; flex-direction:column; gap:5px; }

.gc-date { font-size:11px; color:var(--ace-text-muted); }
.gc-name { font-size:14px; font-weight:700; color:var(--ace-text); line-height:1.3; }
.gc-dot  { font-weight:500; color:var(--ace-text-muted); font-size:13px; }
.gc-rtp  { font-size:13px; color:var(--ace-text-muted); }
.gc-rtp strong { color:#4ade80; font-weight:800; }

.gc-hw-label { font-size:12px; font-weight:700; color:var(--ace-orange); display:flex; flex-wrap:wrap; align-items:center; gap:3px; }
.gc-hw-date  { font-size:11px; font-weight:500; color:var(--ace-text-muted); }

.gc-bw-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.gc-bet  { font-size:12px; color:var(--ace-text-muted); }
.gc-win  { font-size:14px; font-weight:800; color:#4ade80; }
.gc-mult { background:rgba(242,127,16,.15); color:var(--ace-orange); border:1px solid rgba(242,127,16,.3); padding:2px 8px; border-radius:10px; font-size:11px; font-weight:800; }

.gc-win-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }

.gc-btn { display:block; background:var(--ace-gradient); color:var(--ace-black); text-align:center; padding:10px; border-radius:6px; font-size:13px; font-weight:700; text-decoration:none; margin-top:6px; }
.gc-btn:hover { opacity:.92; }

/* ════════════════════════════
   PROMOTION CARDS
════════════════════════════ */
.pcard { min-width:252px; max-width:252px; flex-shrink:0; background:var(--ace-bg-elevated); border:1px solid var(--ace-border); border-radius:10px; overflow:hidden; }
.pcard-img { width:100%; height:155px; object-fit:cover; display:block; }
.pcard-img-ph { width:100%; height:155px; background:var(--ace-bg-input); display:flex; align-items:center; justify-content:center; font-size:40px; }
.pcard-body { padding:12px 14px; display:flex; flex-direction:column; gap:8px; }
.pcard-name { font-size:13px; font-weight:700; color:var(--ace-text); line-height:1.3; }
.pcard-tag  { font-size:12px; color:var(--ace-gold); font-weight:600; }

.pcard-grid { display:grid; grid-template-columns:auto 1fr; gap:3px 10px; font-size:12px; }
.pg-lbl { color:var(--ace-text-muted); font-weight:600; white-space:nowrap; }
.pg-val { font-weight:700; color:var(--ace-text); }
.pg-hi  { color:var(--ace-orange); }
.pg-icons { display:flex; gap:3px; font-size:14px; }

.pcard-btns { display:flex; gap:6px; margin-top:2px; }
.pbtn-join { flex:1; display:block; background:var(--ace-gradient); color:var(--ace-black); text-align:center; padding:9px 6px; border-radius:6px; font-size:12px; font-weight:700; text-decoration:none; }
.pbtn-join:hover { opacity:.92; }
.pbtn-all  { flex:1; display:block; background:transparent; color:var(--ace-text); text-align:center; padding:9px 6px; border-radius:6px; font-size:12px; font-weight:700; text-decoration:none; border:1px solid var(--ace-border); }
.pbtn-all:hover { border-color:var(--ace-gold); color:var(--ace-gold); }

/* ════════════════════════════
   PAYMENT
════════════════════════════ */
.pay-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--ace-border); border:1px solid var(--ace-border); border-radius:8px; overflow:hidden; margin-bottom:12px; }
.pay-cell { background:var(--ace-bg-elevated); padding:14px 12px; text-align:center; }
.pay-lbl { font-size:10px; color:var(--ace-text-muted); font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px; }
.pay-val { font-size:16px; font-weight:800; color:var(--ace-text); }
.pay-channels { display:flex; gap:8px; flex-wrap:wrap; margin-top:10px; }
.chan-chip { background:rgba(246,176,33,.12); color:var(--ace-gold); padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; }

/* ════════════════════════════
   SOCIAL
════════════════════════════ */
.social-row { display:flex; gap:10px; flex-wrap:wrap; }
.sc { padding:9px 20px; border-radius:7px; font-size:13px; font-weight:700; text-decoration:none; }
.sc-line { background:#06c755; color:#fff; }
.sc-tg   { background:#0088cc; color:#fff; }
.sc-fb   { background:#1877f2; color:#fff; }
.sc-ig   { background:linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); color:#fff; }
.sc-x    { background:#000; color:#fff; }

/* states */
.state-msg { padding:60px; text-align:center; color:var(--ace-text-muted); font-size:15px; }
.err { color:#f87171; }
</style>
