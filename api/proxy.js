// Vercel Serverless Function - API Proxy untuk handle HTTP backend dari HTTPS frontend
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Extract path and query from URL - remove /api/ prefix
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname.replace("/api/", "");
    const queryString = url.search; // includes the '?' if present

    // Backend API URL with query parameters
    const backendUrl = `http://spk-blt-topsis-api.runasp.net/api/${path}${queryString}`;

    console.log("Proxying:", req.method, backendUrl);

    // Prepare request options
    const options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization && {
          Authorization: req.headers.authorization,
        }),
      },
    };

    // Add body for POST, PUT, PATCH
    if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
      options.body = JSON.stringify(req.body);
    }

    // Forward request ke backend
    const response = await fetch(backendUrl, options);

    // Check content type to handle different response types
    const contentType = response.headers.get("content-type");

    // Handle PDF/binary responses
    if (contentType && contentType.includes("application/pdf")) {
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        response.headers.get("content-disposition") || "attachment",
      );
      return res.status(response.status).send(Buffer.from(buffer));
    }

    // Handle other binary/octet-stream responses
    if (
      contentType &&
      (contentType.includes("application/octet-stream") ||
        contentType.includes("image/"))
    ) {
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", contentType);
      return res.status(response.status).send(Buffer.from(buffer));
    }

    // Default: handle as JSON
    const data = await response.json();

    // Return response dari backend
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({
      success: false,
      message: "Proxy error",
      error: error.message,
    });
  }
}
