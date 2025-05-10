// server/middleware/authorize.js
export default function authorize(...allowedRoles) {
  return (req, res, next) => {
    const { role } = req.user; // assume req.user set by verifyToken
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
