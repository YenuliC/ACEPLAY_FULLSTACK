<script setup>
import { ref, reactive, watch, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  initialData:    { type: Object,  default: null },
  initialSlug:    { type: String,  default: "" },
  initialCountry: { type: String,  default: "" },
  loading:        { type: Boolean, default: false },
  submitLabel:    { type: String,  default: "Save Casino" },
  draftKey:       { type: String,  default: null }   // localStorage key for draft persistence
});

const emit = defineEmits(["submit"]);

const makeEmptyBigWin = () => ({
  date: "", time: "", gameName: "", gamePlatform: "",
  betAmount: null, winAmount: null, url: "",
  image: { cover: "", winLists: ["", "", ""] }
});

const makeEmptyTopGame = () => ({
  gameName: "", gamePlatform: "", rtp: null, url: "",
  highestWon: { date: "", time: "", betAmount: null, winAmount: null, image: { cover: "", winLists: ["", "", ""] } }
});

const makeEmptyPromotion = () => ({
  name: "", tag: "", image: "", deposit: null, bonus: null,
  turnover: null, netwin: null, gameTypes: [], maxWithdrawal: null,
  availability: "", url: ""
});

const makeEmpty = () => ({
  casino: {
    name: "", currency: "", system: "", description: "",
    launchYear: "", language: [],
    url: {
      main: "", referral: "", query: "",
      backup: ["", "", ""],
      promotion: "", logo: "",
      game: { slot: "", fishing: "", crash: "", live: "", sports: "", bingo: "", cockFighting: "", lottery: "", others: "" },
      socialMedia: { line: "", telegram: "", facebook: "", instragram: "", x: "" }
    }
  },
  keyFeatures: [""],
  payment: {
    minDepositPerTime: null, maxDepositPerTime: null,
    maxDepositPerDay: "",
    minWithdrawalPerTime: null, maxWithdrawalPerTime: null,
    maxWithdrawalPerDay: "",
    channel: []
  },
  welcomeBonus: {
    title: "", subTitle: "", description: "",
    deposit: null, bonus: null, turnover: "", netwin: null,
    maxWithdrawal: null, gameTypes: [], url: "", image: ""
  },
  topGame: {
    gameName: "", gamePlatform: "", rtp: null, url: "",
    highestWon: { date: "", time: "", betAmount: null, winAmount: null, image: { cover: "", winLists: ["", "", ""] } }
  },
  bigWinHistory: [makeEmptyBigWin()],
  topGames: [],
  promotions: [makeEmptyPromotion()],
  certified: {
    gc:    { name: "Gaming Curacao", status: false },
    gli:   { name: "Gaming Laboratories International", status: false },
    iTech: { name: "iTech Labs", status: false }
  }
});

// ─── Form state ───────────────────────────────────────────────────────────

const slug    = ref(props.initialSlug);
const country = ref(props.initialCountry);
const form    = reactive(props.initialData ? JSON.parse(JSON.stringify(props.initialData)) : makeEmpty());

// ─── Draft persistence ────────────────────────────────────────────────────

const draftBanner = ref(false);   // show "Draft restored" banner
let draftTimer    = null;

const readDraft = () => {
  if (!props.draftKey || !import.meta.client) return null;
  try { return JSON.parse(localStorage.getItem(props.draftKey) || "null"); } catch { return null; }
};

const writeDraft = () => {
  if (!props.draftKey || !import.meta.client) return;
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    localStorage.setItem(props.draftKey, JSON.stringify({
      slug:    slug.value,
      country: country.value,
      form:    JSON.parse(JSON.stringify(form))
    }));
  }, 800);
};

const clearDraft = () => {
  if (props.draftKey && import.meta.client) localStorage.removeItem(props.draftKey);
};

const applyDraft = (draft) => {
  if (!draft) return;
  if (draft.slug)    slug.value    = draft.slug;
  if (draft.country) country.value = draft.country;
  if (draft.form)    Object.assign(form, draft.form);
};

// Expose so parent can call clearDraft() after a successful save
defineExpose({ clearDraft });

// On mount: restore draft (create mode has no initialData, edit mode loads it asynchronously)
onMounted(() => {
  if (!props.initialData) {
    const draft = readDraft();
    if (draft) { applyDraft(draft); draftBanner.value = true; }
  }
});

// For edit mode: after server data loads, overlay the draft on top
watch(() => props.initialData, (val) => {
  if (val) {
    Object.assign(form, JSON.parse(JSON.stringify(val)));
    const draft = readDraft();
    if (draft) { applyDraft(draft); draftBanner.value = true; }
  }
});

watch(() => props.initialSlug,    (v) => { slug.value    = v; });
watch(() => props.initialCountry, (v) => { country.value = v; });

// Save draft on any change
watch([slug, country], writeDraft);
watch(form, writeDraft, { deep: true });

onUnmounted(() => clearTimeout(draftTimer));

const activeTab   = ref("basic");
const visitedTabs = ref(new Set(["basic"]));

const tabs = [
  { id: "basic",   label: "General Details",        desc: "Casino name, description, logo & features" },
  { id: "urls",    label: "Website & Links",        desc: "Main URLs, game links & social media" },
  { id: "payment", label: "Payment Settings",       desc: "Deposit, withdrawal limits & channels" },
  { id: "bonus",   label: "Welcome Bonus",          desc: "First-time player bonus details" },
  { id: "games",   label: "Featured Games",         desc: "Top game highlights & game list" },
  { id: "bigwins", label: "Big Win History",        desc: "Record notable player wins" },
  { id: "promos",  label: "Promotions & Offers",    desc: "Active promotions for players" },
  { id: "certs",   label: "Trust & Certifications", desc: "Licenses and certification badges" }
];

const activeTabIndex = computed(() => tabs.findIndex(t => t.id === activeTab.value));
const currentTab     = computed(() => tabs[activeTabIndex.value]);
const isFirstTab     = computed(() => activeTabIndex.value === 0);
const isLastTab      = computed(() => activeTabIndex.value === tabs.length - 1);

const goNext = () => {
  if (!isLastTab.value) {
    activeTab.value = tabs[activeTabIndex.value + 1].id;
    visitedTabs.value.add(activeTab.value);
  }
};
const goPrev = () => {
  if (!isFirstTab.value) activeTab.value = tabs[activeTabIndex.value - 1].id;
};

const goTab = (id) => {
  activeTab.value = id;
  visitedTabs.value.add(id);
};

watch(activeTab, (tab) => {
  if (tab === "promos" && form.promotions.length === 0) {
    form.promotions.push(makeEmptyPromotion());
  }
  if (tab === "bigwins" && form.bigWinHistory.length === 0) {
    form.bigWinHistory.push(makeEmptyBigWin());
  }
});

// ─── Language helper ──────────────────────────────────────────────────────

const LANGS = ["th", "en", "zh", "id", "vi", "ms", "km", "my"];

const toggleLang = (lang) => {
  const arr = form.casino.language;
  const idx = arr.indexOf(lang);
  idx === -1 ? arr.push(lang) : arr.splice(idx, 1);
};

// ─── Game type helper ─────────────────────────────────────────────────────

const GAME_TYPES = ["slot", "fishing", "crash", "live", "sports", "bingo", "cockFighting", "lottery", "others"];

const toggleGameType = (arr, type) => {
  const idx = arr.indexOf(type);
  idx === -1 ? arr.push(type) : arr.splice(idx, 1);
};

// ─── Channel helper ───────────────────────────────────────────────────────

const CHANNELS = ["promptpay", "truemoney", "bank", "crypto", "visa", "mastercard"];

const toggleChannel = (ch) => {
  const arr = form.payment.channel;
  const idx = arr.indexOf(ch);
  idx === -1 ? arr.push(ch) : arr.splice(idx, 1);
};

// ─── Key features ─────────────────────────────────────────────────────────

const addFeature  = ()    => form.keyFeatures.push("");
const removeFeature = (i) => form.keyFeatures.splice(i, 1);

// ─── Big Win History ──────────────────────────────────────────────────────

const addBigWin    = ()    => form.bigWinHistory.push(makeEmptyBigWin());
const removeBigWin = (i)   => form.bigWinHistory.splice(i, 1);

// ─── Top Games ────────────────────────────────────────────────────────────

const addTopGame    = ()    => form.topGames.push(makeEmptyTopGame());
const removeTopGame = (i)   => form.topGames.splice(i, 1);

// ─── Promotions ───────────────────────────────────────────────────────────

const addPromotion    = ()    => form.promotions.push(makeEmptyPromotion());
const removePromotion = (i)   => form.promotions.splice(i, 1);

// ─── Submit ───────────────────────────────────────────────────────────────

const handleSubmit = () => {
  emit("submit", {
    slug:    slug.value,
    country: country.value,
    data:    JSON.parse(JSON.stringify(form))
  });
};
</script>

<template>
  <div class="cf-wrap">

    <!-- Draft restored banner -->
    <div v-if="draftBanner" class="cf-draft-banner">
      <span>Draft restored from your last session.</span>
      <button type="button" @click="draftBanner = false">✕</button>
    </div>

    <!-- ── Slug & Country ─────────────────────────────────────── -->
    <div class="cf-row-2">
      <div class="cf-field">
        <label>Slug <span class="req">*</span></label>
        <input v-model="slug" placeholder="Enter casino slug (e.g. my-casino)" />
      </div>
      <div class="cf-field">
        <label>Country <span class="req">*</span></label>
        <select v-model="country">
          <option value="">— Select —</option>
          <option value="thailand">Thailand</option>
          <option value="bangladesh">Bangladesh</option>
          <option value="philippines">Philippines</option>
          <option value="indonesia">Indonesia</option>
          <option value="vietnam">Vietnam</option>
          <option value="malaysia">Malaysia</option>
        </select>
      </div>
    </div>

    <!-- ── Tab nav ────────────────────────────────────────────── -->
    <div class="cf-tabs">
      <button
        v-for="(t, i) in tabs" :key="t.id"
        :class="['cf-tab', { active: activeTab === t.id, visited: visitedTabs.has(t.id) && activeTab !== t.id }]"
        type="button"
        @click="goTab(t.id)"
      >
        <span class="cf-tab-step">{{ i + 1 }}</span>
        <span class="cf-tab-label">{{ t.label }}</span>
      </button>
    </div>

    <!-- Active section header -->
    <div class="cf-panel-header">
      <div class="cf-step-badge">Step {{ activeTabIndex + 1 }} of {{ tabs.length }}</div>
      <h2 class="cf-panel-title">{{ currentTab.label }}</h2>
      <p class="cf-panel-desc">{{ currentTab.desc }}</p>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         TAB: BASIC INFO
    ══════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'basic'" class="cf-panel">
      <div class="cf-row-2">
        <div class="cf-field">
          <label>Casino Name <span class="req">*</span></label>
          <input v-model="form.casino.name" placeholder="Enter casino name" />
        </div>
        <div class="cf-field">
          <label>Currency</label>
          <input v-model="form.casino.currency" placeholder="Enter currency symbol (e.g. ฿, $)" />
        </div>
      </div>
      <div class="cf-row-2">
        <div class="cf-field">
          <label>System / CMS</label>
          <input v-model="form.casino.system" placeholder="Enter system or CMS name" />
        </div>
        <div class="cf-field">
          <label>Launch Year</label>
          <input v-model="form.casino.launchYear" placeholder="Enter launch year" />
        </div>
      </div>
      <div class="cf-field">
        <label>Description</label>
        <textarea v-model="form.casino.description" rows="3" placeholder="Enter casino description" />
      </div>

      <div class="cf-field">
        <label>Languages</label>
        <div class="cf-checks">
          <label v-for="lang in LANGS" :key="lang" class="cf-check">
            <input type="checkbox" :checked="form.casino.language.includes(lang)" @change="toggleLang(lang)" />
            {{ lang.toUpperCase() }}
          </label>
        </div>
      </div>

      <div class="cf-field">
        <label>Logo URL</label>
        <input v-model="form.casino.url.logo" placeholder="Enter logo image URL" />
        <img v-if="form.casino.url.logo" :src="form.casino.url.logo" class="cf-logo-preview" />
      </div>

      <!-- Key Features -->
      <div class="cf-section-heading">Casino Highlights</div>
      <div v-for="(feat, i) in form.keyFeatures" :key="i" class="cf-row-del">
        <input v-model="form.keyFeatures[i]" placeholder="Enter feature text" />
        <button type="button" class="cf-del" @click="removeFeature(i)">✕</button>
      </div>
      <button type="button" class="cf-add" @click="addFeature">+ Add Feature</button>

    </div>

    <!-- ══════════════════════════════════════════════════════════
         TAB: URLs & LINKS
    ══════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'urls'" class="cf-panel">
      <div class="cf-section-heading">Website Links</div>
      <div class="cf-field"><label>Main URL</label><input v-model="form.casino.url.main" placeholder="Enter main website URL" /></div>
      <div class="cf-field"><label>Referral URL</label><input v-model="form.casino.url.referral" placeholder="Enter referral URL" /></div>
      <div class="cf-field"><label>Query String</label><input v-model="form.casino.url.query" placeholder="Enter query string parameters" /></div>
      <div class="cf-field"><label>Promotion URL</label><input v-model="form.casino.url.promotion" placeholder="Enter promotion page URL" /></div>

      <div class="cf-section-heading">Backup Website Links</div>
      <div v-for="(_, i) in form.casino.url.backup" :key="i" class="cf-field">
        <label>Backup {{ i + 1 }}</label>
        <input v-model="form.casino.url.backup[i]" placeholder="Enter backup URL" />
      </div>

      <div class="cf-section-heading">Game Page Links</div>
      <div class="cf-row-2" v-for="field in ['slot','fishing','crash','live','sports','bingo','cockFighting','lottery','others']" :key="field">
        <div class="cf-field" style="grid-column:span 2">
          <label>{{ field.charAt(0).toUpperCase() + field.slice(1) }}</label>
          <input v-model="form.casino.url.game[field]" placeholder="Enter game category URL" />
        </div>
      </div>

      <div class="cf-section-heading">Social Media Links</div>
      <div v-for="sm in ['line','telegram','facebook','instragram','x']" :key="sm" class="cf-field">
        <label>{{ sm.charAt(0).toUpperCase() + sm.slice(1) }}</label>
        <input v-model="form.casino.url.socialMedia[sm]" placeholder="Enter social media URL" />
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         TAB: PAYMENT
    ══════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'payment'" class="cf-panel">
      <div class="cf-section-heading">Deposit Limits</div>
      <div class="cf-row-2">
        <div class="cf-field"><label>Min Deposit / Time</label><input type="number" v-model.number="form.payment.minDepositPerTime" placeholder="Enter minimum deposit" /></div>
        <div class="cf-field"><label>Max Deposit / Time</label><input type="number" v-model.number="form.payment.maxDepositPerTime" placeholder="Enter maximum deposit" /></div>
      </div>
      <div class="cf-field"><label>Max Deposit / Day</label><input v-model="form.payment.maxDepositPerDay" placeholder="Enter max deposit per day or unlimited" /></div>

      <div class="cf-section-heading">Withdrawal Limits</div>
      <div class="cf-row-2">
        <div class="cf-field"><label>Min Withdrawal / Time</label><input type="number" v-model.number="form.payment.minWithdrawalPerTime" placeholder="Enter minimum withdrawal" /></div>
        <div class="cf-field"><label>Max Withdrawal / Time</label><input type="number" v-model.number="form.payment.maxWithdrawalPerTime" placeholder="Enter maximum withdrawal" /></div>
      </div>
      <div class="cf-field"><label>Max Withdrawal / Day</label><input v-model="form.payment.maxWithdrawalPerDay" placeholder="Enter max withdrawal per day or unlimited" /></div>

      <div class="cf-section-heading">Accepted Payment Methods</div>
      <div class="cf-field">
        <label>Payment Channels</label>
        <div class="cf-checks">
          <label v-for="ch in CHANNELS" :key="ch" class="cf-check">
            <input type="checkbox" :checked="form.payment.channel.includes(ch)" @change="toggleChannel(ch)" />
            {{ ch }}
          </label>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         TAB: WELCOME BONUS
    ══════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'bonus'" class="cf-panel">
      <div class="cf-field"><label>Title</label><input v-model="form.welcomeBonus.title" placeholder="Enter bonus title" /></div>
      <div class="cf-field"><label>Subtitle</label><input v-model="form.welcomeBonus.subTitle" placeholder="Enter bonus subtitle" /></div>
      <div class="cf-field"><label>Description</label><textarea v-model="form.welcomeBonus.description" rows="3" placeholder="Enter bonus description" /></div>
      <div class="cf-row-2">
        <div class="cf-field"><label>Deposit Required</label><input type="number" v-model.number="form.welcomeBonus.deposit" placeholder="Enter required deposit" /></div>
        <div class="cf-field"><label>Bonus Amount</label><input type="number" v-model.number="form.welcomeBonus.bonus" placeholder="Enter bonus amount" /></div>
      </div>
      <div class="cf-row-2">
        <div class="cf-field"><label>Turnover</label><input v-model="form.welcomeBonus.turnover" placeholder="Enter turnover requirement" /></div>
        <div class="cf-field"><label>Max Withdrawal</label><input type="number" v-model.number="form.welcomeBonus.maxWithdrawal" placeholder="Enter max withdrawal" /></div>
      </div>
      <div class="cf-field"><label>Promotion URL</label><input v-model="form.welcomeBonus.url" placeholder="Enter promotion URL" /></div>
      <div class="cf-field"><label>Banner Image URL</label><input v-model="form.welcomeBonus.image" placeholder="Enter banner image URL" /></div>
      <img v-if="form.welcomeBonus.image" :src="form.welcomeBonus.image" class="cf-img-preview" />

      <div class="cf-field">
        <label>Eligible Game Types</label>
        <div class="cf-checks">
          <label v-for="gt in GAME_TYPES" :key="gt" class="cf-check">
            <input type="checkbox" :checked="form.welcomeBonus.gameTypes.includes(gt)" @change="toggleGameType(form.welcomeBonus.gameTypes, gt)" />
            {{ gt }}
          </label>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         TAB: TOP GAMES
    ══════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'games'" class="cf-panel">
      <div class="cf-section-heading">Highlight Game</div>
      <div class="cf-row-2">
        <div class="cf-field"><label>Game Name</label><input v-model="form.topGame.gameName" placeholder="Enter game name" /></div>
        <div class="cf-field"><label>Platform</label><input v-model="form.topGame.gamePlatform" placeholder="Enter game platform" /></div>
      </div>
      <div class="cf-row-2">
        <div class="cf-field"><label>RTP</label><input type="number" step="0.001" v-model.number="form.topGame.rtp" placeholder="Enter RTP value (e.g. 0.962)" /></div>
        <div class="cf-field"><label>Game URL</label><input v-model="form.topGame.url" placeholder="Enter game URL" /></div>
      </div>
      <div class="cf-section-heading cf-section-sub">Highest Win Record</div>
      <div class="cf-row-2">
        <div class="cf-field"><label>Date</label><input v-model="form.topGame.highestWon.date" placeholder="Enter win date" /></div>
        <div class="cf-field"><label>Time</label><input v-model="form.topGame.highestWon.time" placeholder="Enter win time" /></div>
      </div>
      <div class="cf-row-2">
        <div class="cf-field"><label>Bet Amount</label><input type="number" v-model.number="form.topGame.highestWon.betAmount" placeholder="Enter bet amount" /></div>
        <div class="cf-field"><label>Win Amount</label><input type="number" v-model.number="form.topGame.highestWon.winAmount" placeholder="Enter win amount" /></div>
      </div>
      <div class="cf-field"><label>Cover Image URL</label><input v-model="form.topGame.highestWon.image.cover" placeholder="Enter cover image URL" /></div>
      <img v-if="form.topGame.highestWon.image.cover" :src="form.topGame.highestWon.image.cover" class="cf-img-preview" />

      <!-- Top Games List -->
      <div class="cf-section-heading">Additional Top Games</div>
      <div v-for="(tg, i) in form.topGames" :key="i" class="cf-card">
        <div class="cf-card-header">
          <span>Game {{ i + 1 }}</span>
          <button type="button" class="cf-del" @click="removeTopGame(i)">✕ Remove</button>
        </div>
        <div class="cf-row-2">
          <div class="cf-field"><label>Game Name</label><input v-model="tg.gameName" placeholder="Enter game name" /></div>
          <div class="cf-field"><label>Platform</label><input v-model="tg.gamePlatform" placeholder="Enter game platform" /></div>
        </div>
        <div class="cf-row-2">
          <div class="cf-field"><label>RTP</label><input type="number" step="0.0001" v-model.number="tg.rtp" placeholder="Enter RTP value" /></div>
          <div class="cf-field"><label>Game URL</label><input v-model="tg.url" placeholder="Enter game URL" /></div>
        </div>
        <div class="cf-section-heading cf-section-sub">Highest Win Record</div>
        <div class="cf-row-2">
          <div class="cf-field"><label>Date</label><input v-model="tg.highestWon.date" placeholder="Enter win date" /></div>
          <div class="cf-field"><label>Time</label><input v-model="tg.highestWon.time" placeholder="Enter win time" /></div>
        </div>
        <div class="cf-row-2">
          <div class="cf-field"><label>Bet Amount</label><input type="number" v-model.number="tg.highestWon.betAmount" placeholder="Enter bet amount" /></div>
          <div class="cf-field"><label>Win Amount</label><input type="number" v-model.number="tg.highestWon.winAmount" placeholder="Enter win amount" /></div>
        </div>
        <div class="cf-field"><label>Cover Image URL</label><input v-model="tg.highestWon.image.cover" placeholder="Enter cover image URL" /></div>
        <img v-if="tg.highestWon.image.cover" :src="tg.highestWon.image.cover" class="cf-img-sm" />
      </div>
      <button type="button" class="cf-add" @click="addTopGame">+ Add Top Game</button>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         TAB: BIG WIN HISTORY
    ══════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'bigwins'" class="cf-panel">
      <div v-for="(bw, i) in form.bigWinHistory" :key="i" class="cf-card">
        <div class="cf-card-header">
          <span>{{ bw.gameName || `Win #${i + 1}` }}</span>
          <button type="button" class="cf-del" @click="removeBigWin(i)">✕ Remove</button>
        </div>
        <div class="cf-row-2">
          <div class="cf-field"><label>Game Name</label><input v-model="bw.gameName" placeholder="Enter game name" /></div>
          <div class="cf-field"><label>Platform</label><input v-model="bw.gamePlatform" placeholder="Enter game platform" /></div>
        </div>
        <div class="cf-row-2">
          <div class="cf-field"><label>Date</label><input v-model="bw.date" placeholder="Enter win date" /></div>
          <div class="cf-field"><label>Time</label><input v-model="bw.time" placeholder="Enter win time" /></div>
        </div>
        <div class="cf-row-2">
          <div class="cf-field"><label>Bet Amount</label><input type="number" v-model.number="bw.betAmount" placeholder="Enter bet amount" /></div>
          <div class="cf-field"><label>Win Amount</label><input type="number" v-model.number="bw.winAmount" placeholder="Enter win amount" /></div>
        </div>
        <div class="cf-field"><label>Game URL</label><input v-model="bw.url" placeholder="Enter game URL" /></div>
        <div class="cf-field"><label>Cover Image URL</label><input v-model="bw.image.cover" placeholder="Enter cover image URL" /></div>
        <img v-if="bw.image.cover" :src="bw.image.cover" class="cf-img-sm" />
      </div>
      <button type="button" class="cf-add" @click="addBigWin">+ Add Big Win Entry</button>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         TAB: PROMOTIONS
    ══════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'promos'" class="cf-panel">
      <div v-for="(promo, i) in form.promotions" :key="i" class="cf-card">
        <div class="cf-card-header">
          <span>{{ promo.name || `Promotion ${i + 1}` }}</span>
          <button type="button" class="cf-del" @click="removePromotion(i)">✕ Remove</button>
        </div>
        <div class="cf-row-2">
          <div class="cf-field"><label>Name</label><input v-model="promo.name" placeholder="Enter promotion name" /></div>
          <div class="cf-field"><label>Tag</label><input v-model="promo.tag" placeholder="Enter promotion tag" /></div>
        </div>
        <div class="cf-row-2">
          <div class="cf-field"><label>Deposit</label><input v-model="promo.deposit" placeholder="Enter deposit requirement" /></div>
          <div class="cf-field"><label>Bonus</label><input v-model="promo.bonus" placeholder="Enter bonus amount" /></div>
        </div>
        <div class="cf-row-2">
          <div class="cf-field"><label>Turnover</label><input v-model="promo.turnover" placeholder="Enter turnover requirement" /></div>
          <div class="cf-field"><label>Max Withdrawal</label><input v-model="promo.maxWithdrawal" placeholder="Enter max withdrawal" /></div>
        </div>
        <div class="cf-row-2">
          <div class="cf-field"><label>Availability</label><input v-model="promo.availability" placeholder="Enter availability schedule" /></div>
          <div class="cf-field"><label>Promo URL</label><input v-model="promo.url" placeholder="Enter promotion URL" /></div>
        </div>
        <div class="cf-field"><label>Image URL</label><input v-model="promo.image" placeholder="Enter promotion image URL" /></div>
        <img v-if="promo.image" :src="promo.image" class="cf-img-sm" />
        <div class="cf-field">
          <label>Eligible Game Types</label>
          <div class="cf-checks">
            <label v-for="gt in GAME_TYPES" :key="gt" class="cf-check">
              <input type="checkbox" :checked="promo.gameTypes.includes(gt)" @change="toggleGameType(promo.gameTypes, gt)" />
              {{ gt }}
            </label>
          </div>
        </div>
      </div>
      <button type="button" class="cf-add" @click="addPromotion">+ Add Another Promotion</button>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         TAB: CERTIFICATIONS (standalone view)
    ══════════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'certs'" class="cf-panel">
      <div class="cf-section-heading">License & Certification Badges</div>
      <div v-for="(cert, key) in form.certified" :key="key" class="cf-cert-row">
        <label class="cf-cert-label">
          <input type="checkbox" v-model="form.certified[key].status" />
          <strong>{{ cert.name }}</strong>
        </label>
        <input v-model="form.certified[key].name" placeholder="Enter certification name" class="cf-cert-name-input" />
      </div>
    </div>

    <!-- ── Navigation footer ──────────────────────────────────── -->
    <div class="cf-footer">
      <button v-if="!isFirstTab" type="button" class="cf-back" @click="goPrev">← Back</button>
      <div class="cf-footer-spacer" />
      <button v-if="!isLastTab" type="button" class="cf-next" @click="goNext">
        Next <span class="cf-arrow">→</span>
      </button>
      <button v-else type="button" class="cf-save" :disabled="loading" @click="handleSubmit">
        <span v-if="loading">Saving…</span>
        <span v-else>{{ submitLabel }}</span>
      </button>
    </div>

  </div>
</template>

<style scoped>
.cf-wrap { display: flex; flex-direction: column; gap: 20px; }

.cf-draft-banner {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(246,176,33,0.1); border: 1px solid rgba(246,176,33,0.35);
  border-radius: 8px; padding: 10px 14px;
  font-size: 13px; color: var(--ace-gold);
}
.cf-draft-banner button {
  background: none; border: none; color: var(--ace-gold);
  cursor: pointer; font-size: 14px; padding: 0 4px; opacity: 0.7;
}
.cf-draft-banner button:hover { opacity: 1; }

.cf-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 640px) { .cf-row-2 { grid-template-columns: 1fr; } }

.cf-tabs {
  display: flex; gap: 8px; flex-wrap: wrap;
  background: var(--ace-bg-elevated); border: 1px solid var(--ace-border);
  border-radius: 12px; padding: 10px;
}
.cf-tab {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border: 1px solid rgba(246,176,33,.2);
  border-radius: 8px; cursor: pointer;
  font-size: 13px; font-weight: 600; color: rgba(246,176,33,.7);
  background: rgba(246,176,33,.05); transition: all .2s;
}
.cf-tab-step {
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(246,176,33,.15); color: rgba(246,176,33,.8);
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all .2s;
}
.cf-tab-label { line-height: 1.2; text-align: left; }

/* Active step — full bright orange */
.cf-tab.active {
  background: rgba(246,176,33,.14); border-color: var(--ace-gold);
  color: var(--ace-gold); box-shadow: 0 2px 10px rgba(246,176,33,.2);
}
.cf-tab.active .cf-tab-step {
  background: var(--ace-gradient); color: var(--ace-black);
}

/* Visited (completed) steps — orange-tinted but slightly dimmer than active */
.cf-tab.visited {
  background: rgba(246,176,33,.08); border-color: rgba(246,176,33,.35);
  color: rgba(246,176,33,.85);
}
.cf-tab.visited .cf-tab-step {
  background: rgba(246,176,33,.25); color: var(--ace-gold);
}

/* Hover */
.cf-tab:hover:not(.active) {
  background: rgba(246,176,33,.12); border-color: rgba(246,176,33,.5);
  color: var(--ace-gold);
}
.cf-tab:hover:not(.active) .cf-tab-step {
  background: rgba(246,176,33,.3); color: var(--ace-gold);
}

.cf-panel-header {
  background: var(--ace-bg-elevated);
  border: 1px solid var(--ace-border);
  border-left: 3px solid var(--ace-gold);
  border-radius: 12px; padding: 18px 20px; margin-top: 4px;
}
.cf-step-badge {
  display: inline-block; font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: .6px;
  color: var(--ace-gold); margin-bottom: 6px;
}
.cf-panel-title {
  font-size: 18px; font-weight: 600; color: var(--ace-text);
  margin: 0 0 4px; letter-spacing: -0.01em;
}
.cf-panel-desc {
  font-size: 14px; color: var(--ace-text-muted); margin: 0; line-height: 1.5;
}

.cf-panel { display: flex; flex-direction: column; gap: 16px; padding-top: 4px; }

.cf-field { display: flex; flex-direction: column; gap: 6px; }
.cf-field label {
  font-size: 11px; font-weight: 700; color: var(--ace-text-muted);
  text-transform: uppercase; letter-spacing: .6px;
}
.cf-field input, .cf-field select, .cf-field textarea {
  padding: 10px 12px; border: 1px solid var(--ace-border); border-radius: 8px;
  font-size: 14px; font-family: var(--ace-font); outline: none; transition: all .2s;
  background: var(--ace-bg-input); width: 100%; box-sizing: border-box; color: var(--ace-text);
}
.cf-field input::placeholder, .cf-field textarea::placeholder { color: var(--ace-text-light); }
.cf-field input:focus, .cf-field select:focus, .cf-field textarea:focus {
  border-color: var(--ace-gold);
  box-shadow: 0 0 0 3px rgba(246, 176, 33, 0.12);
}
.cf-field select { cursor: pointer; }
.cf-field select option { background: var(--ace-bg-card); color: var(--ace-text); }
.req { color: #f87171; }

.cf-section-heading {
  font-size: 15px; font-weight: 600; color: var(--ace-text);
  padding: 10px 14px; margin-top: 8px;
  background: rgba(246, 176, 33, 0.06);
  border-left: 3px solid var(--ace-gold);
  border-radius: 0 8px 8px 0;
}
.cf-section-sub {
  font-size: 14px; font-weight: 500;
  background: transparent; border-left-width: 3px;
  padding: 6px 12px; margin-top: 4px;
}

.cf-checks { display: flex; flex-wrap: wrap; gap: 10px; padding: 8px 0; }
.cf-check {
  display: flex; align-items: center; gap: 6px; font-size: 13px;
  color: var(--ace-text); cursor: pointer;
  padding: 6px 12px; border-radius: 20px; border: 1px solid var(--ace-border);
  background: var(--ace-bg-input); transition: all .2s;
}
.cf-check:hover { border-color: var(--ace-gold); background: rgba(246,176,33,.08); }
.cf-check input { cursor: pointer; accent-color: var(--ace-gold); }

.cf-card {
  border: 1px solid var(--ace-border); border-radius: 10px; padding: 18px;
  display: flex; flex-direction: column; gap: 12px;
  background: var(--ace-bg-elevated); transition: border-color .2s;
}
.cf-card:hover { border-color: rgba(246, 176, 33, 0.35); }
.cf-card-header {
  display: flex; justify-content: space-between; align-items: center;
  font-weight: 700; font-size: 14px; color: var(--ace-text);
  padding-bottom: 8px; border-bottom: 1px solid var(--ace-border);
}

.cf-add {
  align-self: flex-start; padding: 10px 18px;
  background: rgba(246,176,33,.08); color: var(--ace-gold);
  border: 1px dashed rgba(246, 176, 33, 0.45); border-radius: 8px;
  cursor: pointer; font-size: 13px; font-weight: 500; transition: all .2s;
}
.cf-add:hover { background: rgba(246,176,33,.15); }
.cf-del {
  padding: 6px 12px; background: rgba(220, 38, 38, 0.1); color: #fca5a5;
  border: 1px solid rgba(220, 38, 38, 0.3); border-radius: 6px;
  cursor: pointer; font-size: 12px; font-weight: 500; white-space: nowrap; transition: all .2s;
}
.cf-del:hover { background: rgba(220, 38, 38, 0.18); }
.cf-row-del { display: flex; gap: 8px; align-items: center; }
.cf-row-del input { flex: 1; }

.cf-logo-preview {
  width: 80px; height: 80px; object-fit: contain; border-radius: 10px;
  border: 1px solid var(--ace-border); margin-top: 8px; background: var(--ace-bg-input);
}
.cf-img-preview, .cf-img-sm {
  max-width: 300px; max-height: 150px; object-fit: cover;
  border-radius: 8px; margin-top: 8px; border: 1px solid var(--ace-border);
}
.cf-img-sm { max-width: 180px; max-height: 90px; }

.cf-cert-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.cf-cert-label {
  display: flex; align-items: center; gap: 8px; min-width: 260px;
  font-size: 14px; cursor: pointer; color: var(--ace-text);
}
.cf-cert-label input { accent-color: var(--ace-gold); }
.cf-cert-name-input {
  flex: 1; min-width: 180px; padding: 8px 12px;
  border: 1px solid var(--ace-border); border-radius: 8px; font-size: 13px;
  background: var(--ace-bg-input); color: var(--ace-text);
}
.cf-cert-name-input:focus {
  border-color: var(--ace-gold); outline: none;
  box-shadow: 0 0 0 3px rgba(246, 176, 33, 0.12);
}

.cf-footer {
  display: flex; align-items: center; gap: 12px;
  padding-top: 20px; border-top: 2px solid var(--ace-border); margin-top: 12px;
}
.cf-footer-spacer { flex: 1; }
.cf-back {
  padding: 11px 20px; background: var(--ace-bg-input); color: var(--ace-text-muted);
  border: 1px solid var(--ace-border); border-radius: 10px;
  font-size: 14px; font-weight: 500; cursor: pointer; transition: all .2s;
}
.cf-back:hover { border-color: var(--ace-gold); color: var(--ace-text); }
.cf-next, .cf-save {
  padding: 11px 28px; background: var(--ace-gradient); color: var(--ace-black);
  border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: opacity .2s, transform .15s;
  box-shadow: 0 4px 14px rgba(246,176,33,.3);
}
.cf-next { display: flex; align-items: center; gap: 6px; }
.cf-next:hover, .cf-save:hover { opacity: .92; transform: translateY(-1px); }
.cf-arrow { font-size: 16px; }
.cf-save:disabled { opacity: .5; cursor: not-allowed; transform: none; }
</style>
