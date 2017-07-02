module.exports = (config, gcs) => (body) => {
    const exchange = body.exchange
    const pair = body.pair
    const uniqueId = exchange + "-" + pair + "-" + body.timestamp

    const path = `${config.GITHUB.BUCKET_BASE_PATH}/${pair}/${exchange}/${uniqueId}.json`
    const bucket = gcs.bucket(config.GOOGLE_STORAGE.BUCKET_NAME)

    bucket.file(path)
        .save(JSON.stringify(body) + "\n")
        .then(() => console.log("Saved: " + uniqueId))
        .catch((err) => console.log(err))
}
