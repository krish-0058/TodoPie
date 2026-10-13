
const jwt = require("jsonwebtoken")
const secret = "todopie1234//"

function checkForToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ valid: false })
    }

    const token = authHeader.split(" ")[1]

    try {
        const userPayload = jwt.verify(token, secret)
        req.user = userPayload
        next()
    }
    catch (err) {
        return res.status(401).json({ valid: false })
    }
}

module.exports = { checkForToken }
