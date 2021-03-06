const coinTicker = require('coin-ticker')
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

loadData = () => {
  const promises = []
  for (i in DATA_TO_LOAD) {
    const ex = DATA_TO_LOAD[i].exchange
    const pair = DATA_TO_LOAD[i].pair
    const p = refresh(ex, pair).then((result) => storeInGcs(result))
    promises.push(p)
  }
  return Promise.all(promises)
}

/**
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.loadCryptocurrencyData = function loadCryptocurrencyData(req, res) {
  loadData()
    .then(() => res.status(200).send('Success!'))
    .catch((err) => res.status(400).send('Error saving data to GCS'))
}
