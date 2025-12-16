const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    // 1. Get the header
    const authHeader = req.headers['authorization'];
    
    // 2. Check if header exists AND starts with "Bearer "
    // The format should be: "Bearer <TOKEN_STRING>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("❌ Auth Failed: No token found in header");
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. Valid token not provided.' 
        });
    }

    try {
        // 3. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request
        next(); // Pass to the next controller
    } catch (error) {
        console.log("❌ Auth Failed: Invalid Token", error.message);
        return res.status(403).json({ 
            success: false, 
            message: 'Invalid token.' 
        });
    }
};