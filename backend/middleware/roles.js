// Role-enforcement middleware (must be used after auth.js which sets req.user)

exports.requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Super Admin access required" });
  }
  next();
};

exports.requireOwner = (req, res, next) => {
  if (!req.user || req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner access required" });
  }
  next();
};

// Passes for both superadmin and owner — used on shared read routes
exports.requireAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};
