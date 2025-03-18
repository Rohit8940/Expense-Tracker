import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        console.log("🔹 Incoming Request - Auth Header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("🚨 No Authorization token provided!");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1]; // Extract token
        console.log("✅ Extracted Token:", token);

        if (!token) {
            console.log("🚨 Token extraction failed!");
            return res.status(401).json({ message: "Unauthorized: No token found" });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔹 Decoded Token:", decoded); // Should contain { userId: ..., iat: ..., exp: ... }

        // Fetch user from database
        const user = await User.findById(decoded.userId).select("-password");
        console.log("✅ User Found:", user ? user.email : "Not Found");

        if (!user) {
            console.log("🚨 User not found in database!");
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error("❌ JWT Verification Error:", error.message);

        let errorMessage = "Unauthorized: Invalid token";
        if (error.name === "TokenExpiredError") {
            errorMessage = "Unauthorized: Session expired. Please log in again.";
        } else if (error.name === "JsonWebTokenError") {
            errorMessage = "Unauthorized: Invalid token signature";
        }

        return res.status(401).json({ message: errorMessage });
    }
};

export default authMiddleware;
