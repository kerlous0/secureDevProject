const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  jwt.verify(
    token,
    "27695e7a96e0b07ca2e350272e58c271b85904a23ae86dd35e56b66110350502",
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      req.user = decoded; // Attach the user info to the request object
      next();
    }
  );
}

module.exports = {
  authenticateToken,
};
