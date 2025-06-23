const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("Auth middleware triggered");
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
}; // <-- This closes the function

// <-- No extra brace needed, your code is correct as shown above!
