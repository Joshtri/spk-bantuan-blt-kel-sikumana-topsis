const BACKEND_BASE = process.env.BACKEND_URL;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, `https://${req.headers.host}`);

    // Strip the leading /api/ prefix to get the actual resource path
    const resourcePath = url.pathname.replace(/^\/api\//, "");
    const backendUrl = `${BACKEND_BASE}/${resourcePath}${url.search}`;

    // console.log("Proxy →", req.method, backendUrl);

    const fetchOptions = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization && {
          Authorization: req.headers.authorization,
        }),
      },
    };

    if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const upstream = await fetch(backendUrl, fetchOptions);
    const contentType = upstream.headers.get("content-type") ?? "";

    // Binary responses (PDF, images, etc.)
    if (
      contentType.includes("application/pdf") ||
      contentType.includes("application/octet-stream") ||
      contentType.includes("image/")
    ) {
      const buffer = await upstream.arrayBuffer();
      res.setHeader("Content-Type", contentType);
      if (contentType.includes("application/pdf")) {
        res.setHeader(
          "Content-Disposition",
          upstream.headers.get("content-disposition") || "attachment",
        );
      }
      return res.status(upstream.status).send(Buffer.from(buffer));
    }

    // JSON (default)
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    // console.error("Proxy error:", err);
    return res.status(500).json({
      success: false,
      message: "Proxy error",
      error: err.message,
    });
  }
}
