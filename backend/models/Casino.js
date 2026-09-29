const mongoose = require("mongoose");

// ─── Sub-schemas (all with _id: false to avoid extra ObjectIds) ────────────

const winImageSchema = new mongoose.Schema({
  cover: { type: String, default: "" },
  winLists: { type: [String], default: [] }
}, { _id: false });

const highestWonSchema = new mongoose.Schema({
  date:       { type: String, default: "" },
  time:       { type: String, default: "" },
  betAmount:  { type: mongoose.Schema.Types.Mixed, default: "" },
  winAmount:  { type: mongoose.Schema.Types.Mixed, default: "" },
  image:      { type: winImageSchema, default: () => ({}) }
}, { _id: false });

const gameUrlSchema = new mongoose.Schema({
  slot:         { type: String, default: "" },
  fishing:      { type: String, default: "" },
  crash:        { type: String, default: "" },
  live:         { type: String, default: "" },
  sports:       { type: String, default: "" },
  bingo:        { type: String, default: "" },
  cockFighting: { type: String, default: "" },
  lottery:      { type: String, default: "" },
  others:       { type: String, default: "" }
}, { _id: false });

const socialMediaSchema = new mongoose.Schema({
  line:       { type: String, default: "" },
  telegram:   { type: String, default: "" },
  facebook:   { type: String, default: "" },
  instragram: { type: String, default: "" },
  x:          { type: String, default: "" }
}, { _id: false });

const urlSchema = new mongoose.Schema({
  main:        { type: String, default: "" },
  referral:    { type: String, default: "" },
  query:       { type: String, default: "" },
  backup:      { type: [String], default: [] },
  promotion:   { type: String, default: "" },
  logo:        { type: String, default: "" },
  game:        { type: gameUrlSchema, default: () => ({}) },
  socialMedia: { type: socialMediaSchema, default: () => ({}) }
}, { _id: false });

const casinoInfoSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  currency:    { type: String, default: "" },
  system:      { type: String, default: "" },
  description: { type: String, default: "" },
  launchYear:  { type: String, default: "" },
  language:    { type: [String], default: [] },
  url:         { type: urlSchema, default: () => ({}) }
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  minDepositPerTime:    { type: Number, default: 0 },
  maxDepositPerTime:    { type: Number, default: 0 },
  maxDepositPerDay:     { type: mongoose.Schema.Types.Mixed, default: "" },
  minWithdrawalPerTime: { type: Number, default: 0 },
  maxWithdrawalPerTime: { type: Number, default: 0 },
  maxWithdrawalPerDay:  { type: mongoose.Schema.Types.Mixed, default: "" },
  channel:              { type: [String], default: [] }
}, { _id: false });

const welcomeBonusSchema = new mongoose.Schema({
  title:         { type: String, default: "" },
  subTitle:      { type: String, default: "" },
  description:   { type: String, default: "" },
  deposit:       { type: Number, default: 0 },
  bonus:         { type: Number, default: 0 },
  turnover:      { type: mongoose.Schema.Types.Mixed, default: "" },
  netwin:        { type: Number, default: 0 },
  maxWithdrawal: { type: Number, default: 0 },
  gameTypes:     { type: [String], default: [] },
  url:           { type: String, default: "" },
  image:         { type: String, default: "" }
}, { _id: false });

const topGameItemSchema = new mongoose.Schema({
  gameName:     { type: String, default: "" },
  gamePlatform: { type: String, default: "" },
  rtp:          { type: Number, default: 0 },
  url:          { type: String, default: "" },
  highestWon:   { type: highestWonSchema, default: () => ({}) }
}, { _id: false });

const bigWinEntrySchema = new mongoose.Schema({
  date:         { type: String, default: "" },
  time:         { type: String, default: "" },
  gameName:     { type: String, default: "" },
  gamePlatform: { type: String, default: "" },
  betAmount:    { type: Number, default: 0 },
  winAmount:    { type: Number, default: 0 },
  url:          { type: String, default: "" },
  image:        { type: winImageSchema, default: () => ({}) }
}, { _id: false });

const promotionEntrySchema = new mongoose.Schema({
  name:          { type: String, default: "" },
  tag:           { type: String, default: "" },
  image:         { type: String, default: "" },
  deposit:       { type: mongoose.Schema.Types.Mixed, default: 0 },
  bonus:         { type: mongoose.Schema.Types.Mixed, default: 0 },
  turnover:      { type: mongoose.Schema.Types.Mixed, default: 0 },
  netwin:        { type: Number, default: 0 },
  gameTypes:     { type: [String], default: [] },
  maxWithdrawal: { type: mongoose.Schema.Types.Mixed, default: 0 },
  availability:  { type: String, default: "" },
  url:           { type: String, default: "" }
}, { _id: false });

const certItemSchema = new mongoose.Schema({
  name:   { type: String, default: "" },
  status: { type: Boolean, default: false }
}, { _id: false });

const certifiedSchema = new mongoose.Schema({
  gc:    { type: certItemSchema, default: () => ({ name: "Gaming Curacao", status: false }) },
  gli:   { type: certItemSchema, default: () => ({ name: "Gaming Laboratories International", status: false }) },
  iTech: { type: certItemSchema, default: () => ({ name: "iTech Labs", status: false }) }
}, { _id: false });

// ─── Top-level data schema ─────────────────────────────────────────────────

const casinoDataSchema = new mongoose.Schema({
  casino:         { type: casinoInfoSchema, required: true },
  keyFeatures:    { type: [String], default: [] },
  payment:        { type: paymentSchema, default: () => ({}) },
  welcomeBonus:   { type: welcomeBonusSchema, default: () => ({}) },
  topGame:        { type: topGameItemSchema, default: () => ({}) },
  bigWinHistory:  { type: [bigWinEntrySchema], default: [] },
  topGames:       { type: [topGameItemSchema], default: [] },
  promotions:     { type: [promotionEntrySchema], default: [] },
  certified:      { type: certifiedSchema, default: () => ({}) }
}, { _id: false });

// ─── Main casino schema ────────────────────────────────────────────────────

const casinoSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  ownerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  country:   { type: String, required: true },
  slug:      { type: String, required: true },
  data:      { type: casinoDataSchema, required: true }
}, { timestamps: true });

casinoSchema.index({ companyId: 1, country: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("Casino", casinoSchema);
