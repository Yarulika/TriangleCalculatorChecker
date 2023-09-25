function isValidVersionString(version) {
    const versionRegex = /^\d+\.\d+\.\d+$/
    return versionRegex.test(version)
}

module.exports = {
    isValidVersionString
}
