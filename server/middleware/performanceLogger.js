// server/middleware/performanceLogger.js
export default function performanceLogger(req, res, next) {
  const start = process.hrtime();

  // When the response finishes, compute elapsed time and log it
  res.once('finish', () => {
    const [sec, nanosec] = process.hrtime(start);
    const ms = (sec * 1e3 + nanosec / 1e6).toFixed(2);
    console.log(
      `[PERF] ${req.method} ${req.originalUrl} — ${res.statusCode} — ${ms}ms`,
    );
  });

  next();
}
