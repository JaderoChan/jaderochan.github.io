<!doctype html>
<html lang="zh-CN" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JaderoChan | Portfolio</title>
  <meta name="description" content="JaderoChan's bilingual portfolio website." />
  <style>
    :root {
      --bg: #0b1020;
      --bg-soft: #111831;
      --text: #eaf0ff;
      --text-soft: #a7b4d6;
      --brand: #7aa2ff;
      --brand-2: #7ef0c5;
      --card: rgba(255,255,255,0.06);
      --border: rgba(255,255,255,0.12);
      --shadow: 0 10px 30px rgba(0,0,0,.25);
    }
    html[data-theme="light"] {
      --bg: #f7f9ff;
      --bg-soft: #ffffff;
      --text: #1a2440;
      --text-soft: #5a678a;
      --brand: #3a63ff;
      --brand-2: #00a87e;
      --card: rgba(26,36,64,0.04);
      --border: rgba(26,36,64,0.12);
      --shadow: 0 10px 30px rgba(15,35,95,.08);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      background: radial-gradient(1200px 500px at 85% -10%, rgba(122,162,255,.20), transparent 60%),
                  radial-gradient(900px 500px at -10% 20%, rgba(126,240,197,.15), transparent 60%),
                  var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    .container { width: min(1100px, 92vw); margin: 0 auto; }
    header {
      position: sticky; top: 0; z-index: 10;
      backdrop-filter: blur(10px);
      background: color-mix(in srgb, var(--bg) 75%, transparent);
      border-bottom: 1px solid var(--border);
    }
    .nav { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; }
    .brand { font-weight: 700; letter-spacing: .3px; }
    .controls { display: flex; gap: 10px; }
    button {
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text);
      padding: 8px 12px;
      border-radius: 10px;
      cursor: pointer;
    }
    .hero { padding: 72px 0 36px; display: grid; gap: 18px; }
    .title {
      font-size: clamp(30px, 5vw, 52px);
      line-height: 1.15;
      margin: 0;
      letter-spacing: .2px;
    }
    .title .grad {
      background: linear-gradient(90deg, var(--brand), var(--brand-2));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .subtitle { color: var(--text-soft); font-size: clamp(15px, 2vw, 18px); max-width: 780px; }
    .quick-links { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
    .quick-links a {
      color: var(--text); text-decoration: none;
      border: 1px solid var(--border);
      background: var(--card);
      padding: 9px 12px; border-radius: 10px;
    }
    section { padding: 28px 0; }
    h2 { margin: 0 0 14px; font-size: 24px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 14px;
    }
    .card {
      border: 1px solid var(--border);
      background: var(--card);
      border-radius: 14px;
      padding: 14px;
      box-shadow: var(--shadow);
      transition: transform .2s ease, border-color .2s ease;
    }
    .card:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--brand) 40%, var(--border)); }
    .card h3 { margin: 0 0 8px; font-size: 18px; }
    .desc { color: var(--text-soft); font-size: 14px; min-height: 56px; }
    .meta { margin-top: 10px; font-size: 12px; color: var(--text-soft); display: flex; justify-content: space-between; gap: 8px; }
    .badge { border: 1px solid var(--border); border-radius: 999px; padding: 3px 8px; }
    footer { padding: 28px 0 42px; color: var(--text-soft); font-size: 14px; }
    .lang-hidden { display: none !important; }
  </style>
</head>
<body>
  <header>
    <div class="container nav">
      <div class="brand">JaderoChan</div>
      <div class="controls">
        <button id="langBtn">中 / EN</button>
        <button id="themeBtn">🌙 / ☀️</button>
      </div>
    </div>
  </header>

  <main class="container">
    <section class="hero">
      <h1 class="title">
        <span class="zh">你好，我是 <span class="grad">JaderoChan</span></span>
        <span class="en lang-hidden">Hi, I'm <span class="grad">JaderoChan</span></span>
      </h1>
      <p class="subtitle zh">
        我是一名偏好 C/C++ 的开发者，关注跨平台工具、输入设备能力（HID / Hotkey）与桌面效率提升。
        这个网站根据我的公开仓库自动整理出代表项目，持续更新中。
      </p>
      <p class="subtitle en lang-hidden">
        I'm a developer focused on C/C++, cross-platform tooling, HID/Hotkey capabilities,
        and productivity-oriented desktop utilities. This site is generated from my public repositories.
      </p>
      <div class="quick-links">
        <a href="https://github.com/JaderoChan" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </section>

    <section>
      <h2 class="zh">精选项目</h2>
      <h2 class="en lang-hidden">Featured Projects</h2>
      <div class="grid" id="projectGrid"></div>
    </section>
  </main>

  <footer class="container">
    <span class="zh">© <span id="year"></span> JaderoChan · 由 GitHub Pages 部署</span>
    <span class="en lang-hidden">© <span id="year2"></span> JaderoChan · Powered by GitHub Pages</span>
  </footer>

  <script>
    const projects = [
      {
        name: "global_hotkey",
        url: "https://github.com/JaderoChan/global_hotkey",
        lang: "C++",
        zh: "独立跨平台全局快捷键库，含 Hook 实现，可用于任意场景。",
        en: "Independent cross-platform global hotkey library with hook implementation."
      },
      {
        name: "hidtool",
        url: "https://github.com/JaderoChan/hidtool",
        lang: "C++",
        zh: "跨平台 HID 工具（键盘/鼠标），支持监听与模拟输入事件。",
        en: "Cross-platform HID tool for keyboard/mouse event listening and simulation."
      },
      {
        name: "keyboard_tools",
        url: "https://github.com/JaderoChan/keyboard_tools",
        lang: "C++",
        zh: "跨平台键盘事件监听与发送库。",
        en: "Cross-platform keyboard event listening and sending library."
      },
      {
        name: "EasyLinks",
        url: "https://github.com/JaderoChan/EasyLinks",
        lang: "C++",
        zh: "可视化创建符号链接与硬链接，强调易用性与效率。",
        en: "GUI tool for symbolic/hard links with simplicity and productivity."
      },
      {
        name: "OpenCmdAnywhere",
        url: "https://github.com/JaderoChan/OpenCmdAnywhere",
        lang: "C++",
        zh: "通过快捷键在当前上下文目录快速打开命令行。",
        en: "Open terminal quickly in current context directory via hotkey."
      },
      {
        name: "BPNN",
        url: "https://github.com/JaderoChan/BPNN",
        lang: "C",
        zh: "纯 C99 实现的三层全连接 BP 神经网络学习项目。",
        en: "A pure C99 three-layer fully connected BP neural network library."
      },
      {
        name: "ContentAwareImageCrop",
        url: "https://github.com/JaderoChan/ContentAwareImageCrop",
        lang: "C++",
        zh: "基于 Seam Carving 的内容感知图像裁剪工具。",
        en: "Content-aware image cropping tool based on Seam Carving."
      },
      {
        name: "mcnbt",
        url: "https://github.com/JaderoChan/mcnbt",
        lang: "C++",
        zh: "高性能 Header-only MC NBT 读写库，支持压缩与多版本格式。",
        en: "High-performance header-only MC NBT read/write library."
      }
    ];

    const grid = document.getElementById("projectGrid");
    const langBtn = document.getElementById("langBtn");
    const themeBtn = document.getElementById("themeBtn");
    const root = document.documentElement;

    const state = {
      lang: localStorage.getItem("lang") || "zh",
      theme: localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    };

    function renderProjects() {
      grid.innerHTML = projects.map(p => `
        <article class="card">
          <h3><a href="${p.url}" target="_blank" rel="noreferrer" style="color:var(--text);text-decoration:none;">${p.name}</a></h3>
          <p class="desc">${state.lang === "zh" ? p.zh : p.en}</p>
          <div class="meta">
            <span class="badge">${p.lang || "N/A"}</span>
            <a href="${p.url}" target="_blank" rel="noreferrer" style="color:var(--brand);text-decoration:none;">GitHub ↗</a>
          </div>
        </article>
      `).join("");
    }

    function setLang(lang) {
      state.lang = lang;
      localStorage.setItem("lang", lang);
      document.querySelectorAll(".zh").forEach(el => el.classList.toggle("lang-hidden", lang !== "zh"));
      document.querySelectorAll(".en").forEach(el => el.classList.toggle("lang-hidden", lang !== "en"));
      renderProjects();
    }

    function setTheme(theme) {
      state.theme = theme;
      localStorage.setItem("theme", theme);
      root.setAttribute("data-theme", theme);
    }

    langBtn.addEventListener("click", () => setLang(state.lang === "zh" ? "en" : "zh"));
    themeBtn.addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark"));

    setTheme(state.theme);
    setLang(state.lang);
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("year2").textContent = new Date().getFullYear();
  </script>
</body>
</html>
