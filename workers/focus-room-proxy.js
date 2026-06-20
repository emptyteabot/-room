const origin = "http://43.135.51.214/focus-room";
const blockedUserAgentPattern = /(MicroMessenger|QQ\/|QQBrowser|MQQBrowser|XiaoHongShu|XHS|BytedanceWebview|Aweme|Toutiao|BiliApp|Weibo)/i;

const worker = {
  async fetch(request) {
    const userAgent = request.headers.get("user-agent") ?? "";

    if (blockedUserAgentPattern.test(userAgent)) {
      return new Response(renderGuidePage(request.url), {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }

    const targetUrl = createTargetUrl(request.url);

    const proxyRequest = new Request(targetUrl, request);
    const response = await fetch(proxyRequest);
    const headers = new Headers(response.headers);
    const location = headers.get("location");

    if (location?.startsWith("/focus-room")) {
      headers.set("location", location.replace(/^\/focus-room/, "") || "/");
    }

    headers.set("x-focus-room-proxy", "cloudflare-worker");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;

function createTargetUrl(url) {
  const requestUrl = new URL(url);
  const originUrl = new URL(origin);
  const targetUrl = new URL(origin);
  const originPath = originUrl.pathname.replace(/\/$/, "");

  if (requestUrl.pathname === "/") {
    targetUrl.pathname = originPath;
    targetUrl.search = requestUrl.search;
    return targetUrl;
  }

  if (requestUrl.pathname === originPath || requestUrl.pathname.startsWith(`${originPath}/`)) {
    targetUrl.pathname = requestUrl.pathname;
    targetUrl.search = requestUrl.search;
    return targetUrl;
  }

  targetUrl.pathname = `${originPath}${requestUrl.pathname}`;
  targetUrl.search = requestUrl.search;
  return targetUrl;
}

function renderGuidePage(url) {
  const escapedUrl = escapeHtml(url);

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>专注一隅</title>
  <style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at 20% 15%,rgba(255,255,255,.18),transparent 32%),linear-gradient(135deg,#0f172a,#111827 48%,#2f241b);color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.panel{width:min(92vw,520px);border:1px solid rgba(255,255,255,.14);border-radius:24px;background:rgba(255,255,255,.08);box-shadow:0 24px 80px rgba(0,0,0,.36);backdrop-filter:blur(24px);padding:28px}p{color:rgba(255,255,255,.72);line-height:1.8}.url{margin:18px 0;padding:14px;border-radius:14px;background:rgba(0,0,0,.22);word-break:break-all;color:rgba(255,255,255,.86)}button{width:100%;height:46px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font-size:15px}
  </style>
</head>
<body>
  <main class="panel">
    <h1>请复制链接到浏览器打开</h1>
    <p>当前内置浏览器可能限制音频、视频或登录能力。复制后用系统浏览器打开，可以获得完整沉浸式自习室体验。</p>
    <div class="url" id="url">${escapedUrl}</div>
    <button onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href).then(()=>this.textContent='已复制')">复制链接</button>
  </main>
</body>
</html>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}
