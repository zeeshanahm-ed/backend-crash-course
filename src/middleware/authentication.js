const jwt = require("jsonwebtoken");

const authenticationToken = (req, res, next) => {
    const tokken = req.headers['authorization']?.split(' ')[1];
    if (!tokken) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(tokken, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = authenticationToken;