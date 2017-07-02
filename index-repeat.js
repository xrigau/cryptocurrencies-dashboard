const coinTicker = require('coin-ticker')
const INTERVAL = 10000 // 60 * 60 * 1000
const DATA_TO_LOAD = [
  {exchange: "poloniex", pair: "BTC_USD"},
  {exchange: "poloniex", pair: "ETH_USD"},
  {exchange: "poloniex", pair: "DASH_USD"},
  {exchange: "poloniex", pair: "XRP_USD"},
  {exchange: "poloniex", pair: "XMR_USD"},
  {exchange: "poloniex", pair: "ETC_USD"},
  {exchange: "poloniex", pair: "ZEC_USD"},
  {exchange: "poloniex", pair: "LTC_USD"}
]
const config = require('./config.json')
const gcs = require('@google-cloud/storage')({
    projectId: config.GOOGLE_STORAGE.PROJECT_ID,
    keyFilename: config.GOOGLE_STORAGE.CREDENTIALS_FILE
})
const storeInGcs = require('./store-gcs')(config, gcs)

refresh = (exchange, pair) => coinTicker(exchange, pair)
repeat = () => setTimeout(() => loadData(), INTERVAL)

loadData = () => {
  for (i in DATA_TO_LOAD) {
    refresh(DATA_TO_LOAD[i].exchange, DATA_TO_LOAD[i].pair).then((result) => storeInGcs(result))
  }
  repeat()
}

loadData()
