const invoke = window.__TAURI__?.core?.invoke || window.__TAURI__?.invoke;
const tauriWindow = window.__TAURI__?.window;

document.getElementById("win-minimize")?.addEventListener("click", async () => {
  try {
    if (tauriWindow && typeof tauriWindow.getCurrentWindow === "function") {
      await tauriWindow.getCurrentWindow().minimize();
    } else if (window.__TAURI__?.getCurrentWindow) {
      await window.__TAURI__.getCurrentWindow().minimize();
    }
  } catch (e) {
    console.error("Failed To Minimize Window:", e);
  }
});

document.getElementById("win-maximize")?.addEventListener("click", async () => {
  try {
    if (tauriWindow && typeof tauriWindow.getCurrentWindow === "function") {
      await tauriWindow.getCurrentWindow().toggleMaximize();
    } else if (window.__TAURI__?.getCurrentWindow) {
      await window.__TAURI__.getCurrentWindow().toggleMaximize();
    }
  } catch (e) {
    console.error("Failed To Toggle Window Size:", e);
  }
});

document.getElementById("win-close")?.addEventListener("click", async () => {
  try {
    if (tauriWindow && typeof tauriWindow.getCurrentWindow === "function") {
      await tauriWindow.getCurrentWindow().close();
    } else if (window.__TAURI__?.getCurrentWindow) {
      await window.__TAURI__.getCurrentWindow().close();
    } else {
      window.close();
    }
  } catch (e) {
    console.error("Failed To Close Window:", e);
  }
});

const navTabs = document.querySelectorAll(".nav-tab");
const tabPanes = document.querySelectorAll(".tab-pane");

navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetTab = tab.getAttribute("data-tab");

    navTabs.forEach((t) => {
      t.classList.remove(
        "bg-accent",
        "text-white",
        "shadow-lg",
        "shadow-accent/25",
        "border-accent-border",
      );
      t.classList.add(
        "text-slate-400",
        "hover:text-slate-100",
        "hover:bg-slate-900/80",
      );
    });
    tab.classList.add(
      "bg-accent",
      "text-white",
      "shadow-lg",
      "shadow-accent/25",
      "border-accent-border",
    );
    tab.classList.remove(
      "text-slate-400",
      "hover:text-slate-100",
      "hover:bg-slate-900/80",
    );

    tabPanes.forEach((pane) => {
      pane.classList.add("hidden");
    });
    const activePane = document.getElementById(`tab-content-${targetTab}`);
    if (activePane) {
      activePane.classList.remove("hidden");
      activePane.classList.add("animate-fade-in");
    }
  });
});

const themes = {
  purple: {
    primary: "#a855f7",
    glow: "rgba(168, 85, 247, 0.25)",
    border: "rgba(168, 85, 247, 0.4)",
    subtle: "rgba(168, 85, 247, 0.1)",
  },
  green: {
    primary: "#22c55e",
    glow: "rgba(34, 197, 94, 0.25)",
    border: "rgba(34, 197, 94, 0.4)",
    subtle: "rgba(34, 197, 94, 0.1)",
  },
  red: {
    primary: "#ef4444",
    glow: "rgba(239, 68, 68, 0.25)",
    border: "rgba(239, 68, 68, 0.4)",
    subtle: "rgba(239, 68, 68, 0.1)",
  },
  cyan: {
    primary: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.25)",
    border: "rgba(6, 182, 212, 0.4)",
    subtle: "rgba(6, 182, 212, 0.1)",
  },
};

function applyTheme(themeName) {
  const t = themes[themeName];
  if (!t) return;
  const root = document.documentElement;
  root.style.setProperty("--accent-primary", t.primary);
  root.style.setProperty("--accent-glow", t.glow);
  root.style.setProperty("--accent-border", t.border);
  root.style.setProperty("--accent-subtle", t.subtle);
  localStorage.setItem("jokerx_theme", themeName);

  updateToggleVisual();
}

const themeBtn = document.getElementById("theme-menu-btn");
const themeDropdown = document.getElementById("theme-dropdown");

if (themeBtn && themeDropdown) {
  themeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!themeBtn.contains(e.target) && !themeDropdown.contains(e.target)) {
      themeDropdown.classList.add("hidden");
    }
  });

  themeDropdown.querySelectorAll("button[data-theme]").forEach((item) => {
    item.addEventListener("click", () => {
      const selectedTheme = item.getAttribute("data-theme");
      applyTheme(selectedTheme);
      const themeDisplayName = item.textContent.trim();
      tampilkanPemberitahuan(
        `Accent Theme Changed To ${themeDisplayName}`,
        "success",
      );
      catatLog(`Theme Changed To ${themeDisplayName}`, "success");
      themeDropdown.classList.add("hidden");
    });
  });
}

document.getElementById("theme-selector")?.addEventListener("change", (e) => {
  applyTheme(e.target.value);
  tampilkanPemberitahuan(
    `Accent Theme Changed To ${e.target.options[e.target.selectedIndex].text}`,
    "success",
  );
  catatLog(`Accent Theme Updated To ${e.target.value.toUpperCase()}.`, "info");
});

function tampilkanPemberitahuan(pesan, jenis = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const currentAccent =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-primary")
      .trim() || "#a855f7";

  let borderStyle = `border-color: ${currentAccent}66; background-color: rgba(3, 7, 18, 0.95); color: #f8fafc; box-shadow: 0 20px 25px -5px ${currentAccent}1a;`;
  let iconName = "check-circle";
  let iconColor = `color: ${currentAccent};`;

  if (jenis === "error") {
    borderStyle =
      "border-color: rgba(248, 113, 113, 0.4); background-color: rgba(20, 5, 5, 0.95); color: #fca5a5; box-shadow: 0 20px 25px -5px rgba(248, 113, 113, 0.1);";
    iconColor = "color: #f87171;";
    iconName = "alert-triangle";
  } else if (jenis === "warn") {
    borderStyle = `border-color: ${currentAccent}66; background-color: rgba(3, 7, 18, 0.95); color: #f8fafc; box-shadow: 0 20px 25px -5px ${currentAccent}1a;`;
    iconColor = `color: ${currentAccent};`;
    iconName = "info";
  }

  toast.className = `pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl animate-fade-in text-xs font-semibold`;
  toast.style.cssText = borderStyle;
  toast.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 shrink-0" style="${iconColor}"></i><span>${pesan}</span>`;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function catatLog(pesan, jenis = "info") {
  const consoleBox = document.getElementById("console-log");
  if (!consoleBox) return;

  const waktu = new Date().toLocaleTimeString();
  const div = document.createElement("div");
  const currentAccent =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-primary")
      .trim() || "#a855f7";

  let colorStyle = `color: ${currentAccent};`;
  if (jenis === "error") {
    colorStyle = "color: #f87171;";
  } else if (jenis === "warn") {
    colorStyle = `color: ${currentAccent};`;
  }

  div.className = `flex items-start space-x-2 leading-relaxed`;
  div.style.cssText = colorStyle;
  div.innerHTML = `<span class="text-slate-600 select-none">[${waktu}]</span> <span class="break-all">${pesan}</span>`;

  consoleBox.appendChild(div);
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

document
  .getElementById("btn-scan-junk")
  ?.addEventListener("click", async () => {
    const btnScan = document.getElementById("btn-scan-junk");
    if (!btnScan) return;

    btnScan.disabled = true;
    catatLog("Scanning System For Junk Files...", "info");

    try {
      if (typeof invoke !== "undefined") {
        const scanResult = await invoke("scan_system_junk");
        document.getElementById("junk-size-1").innerText = scanResult.temp_size;
        document.getElementById("junk-size-2").innerText =
          scanResult.browser_size;
        document.getElementById("total-junk-size").innerText =
          scanResult.total_size;
        catatLog("Scan Completed Successfully.", "success");
        tampilkanPemberitahuan(
          "Junk Files Scan Completed Successfully",
          "success",
        );
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        document.getElementById("junk-size-1").innerText = "1.24 GB";
        document.getElementById("junk-size-2").innerText = "850 MB";
        document.getElementById("total-junk-size").innerText = "2.09 GB";
        catatLog(
          "Development Mode: Scan Completed (2.09 GB Detected).",
          "success",
        );
        tampilkanPemberitahuan("Scan Completed: 2.09 GB Detected", "success");
      }
    } catch (err) {
      catatLog(`Scan Failed: ${err}`, "error");
      tampilkanPemberitahuan("Failed To Scan Junk Files", "error");
    } finally {
      btnScan.disabled = false;
    }
  });

document
  .getElementById("btn-quick-scan")
  ?.addEventListener("click", async () => {
    const btn = document.getElementById("btn-quick-scan");
    if (!btn) return;

    btn.disabled = true;
    catatLog("Running Quick System Scan...", "success");

    try {
      if (typeof invoke !== "undefined") {
        const res = await invoke("quick_scan_system");
        catatLog(res, "success");
        tampilkanPemberitahuan(res, "success");
      } else {
        await new Promise((r) => setTimeout(r, 1500));
        catatLog(
          "Quick Scan Completed (Development Mode): System Is Secure.",
          "success",
        );
        tampilkanPemberitahuan("Quick Scan Completed Successfully", "success");
      }
    } catch (err) {
      catatLog(`Quick Scan Failed: ${err}`, "error");
      tampilkanPemberitahuan("Quick Scan Failed", "error");
    } finally {
      btn.disabled = false;
    }
  });

async function muatUkuranJunk() {
  try {
    const junk1 = document.getElementById("junk-size-1");
    const junk2 = document.getElementById("junk-size-2");
    const totalJunk = document.getElementById("total-junk-size");

    if (invoke) {
      const res = await invoke("scan_system_junk");
      if (junk1) junk1.innerText = res.temp_size;
      if (junk2) junk2.innerText = res.browser_size;
      if (totalJunk) totalJunk.innerText = res.total_size;
    } else {
      if (junk1) junk1.innerText = "1.24 GB";
      if (junk2) junk2.innerText = "850 MB";
      if (totalJunk) totalJunk.innerText = "2.09 GB";
    }
  } catch (err) {
    console.error("Failed To Scan System Junk:", err);
  }
}

const toggleBtn = document.getElementById("toggle-guard");
let isShieldActive = true;

function updateToggleVisual() {
  if (!toggleBtn) return;
  const thumb = toggleBtn.querySelector("div");
  const currentAccent =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-primary")
      .trim() || "#a855f7";

  if (isShieldActive) {
    toggleBtn.classList.remove("bg-slate-800", "border-slate-700");
    toggleBtn.style.backgroundColor = currentAccent;
    toggleBtn.style.borderColor = "transparent";
    if (thumb) {
      thumb.classList.remove("translate-x-0");
      thumb.classList.add("translate-x-4");
    }
  } else {
    toggleBtn.style.backgroundColor = "";
    toggleBtn.style.borderColor = "";
    toggleBtn.classList.remove("border-transparent");
    toggleBtn.classList.add("bg-slate-800", "border-slate-700");
    if (thumb) {
      thumb.classList.remove("translate-x-4");
      thumb.classList.add("translate-x-0");
    }
  }
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    isShieldActive = !isShieldActive;
    updateToggleVisual();

    if (isShieldActive) {
      tampilkanPemberitahuan("Real-Time Protection Enabled", "success");
      catatLog("Real-Time System Shield Activated.", "success");
    } else {
      tampilkanPemberitahuan("Real-Time Protection Disabled", "warn");
      catatLog("Real-Time System Shield Deactivated.", "warn");
    }
  });
}

function updateStorageStats(freeStr, usagePercentNum) {
  const sidebarFreeText = document.getElementById("storage-free-text");
  const sidebarProgressBar = document.getElementById("storage-progress-bar");

  if (sidebarFreeText) sidebarFreeText.textContent = freeStr;
  if (sidebarProgressBar)
    sidebarProgressBar.style.width = `${usagePercentNum}%`;

  const diskTextEl = document.getElementById("disk-text");
  const diskPercentEl = document.getElementById("disk-percent");
  const diskBarEl = document.getElementById("disk-bar");

  if (diskTextEl) diskTextEl.textContent = freeStr;
  if (diskPercentEl)
    diskPercentEl.textContent = `${usagePercentNum.toFixed(1)}% Used`;
  if (diskBarEl) diskBarEl.style.width = `${usagePercentNum}%`;
}

async function muatSpesifikasiSistem() {
  try {
    if (invoke) {
      const specs = await invoke("get_system_specs");
      const cpuEl = document.getElementById("cpu-name");
      if (cpuEl) cpuEl.innerText = specs.cpu;

      const cpuUsageEl = document.getElementById("cpu-usage-text");
      if (cpuUsageEl) cpuUsageEl.innerText = `${specs.cpu_usage}%`;

      const cpuBarEl = document.getElementById("cpu-bar");
      if (cpuBarEl) cpuBarEl.style.width = `${specs.cpu_usage}%`;

      const usedRamNum = parseFloat(specs.used_ram);
      const totalRamNum = parseFloat(specs.total_ram);
      const ramPercent = totalRamNum > 0 ? (usedRamNum / totalRamNum) * 100 : 0;

      const ramTextEl = document.getElementById("ram-text");
      if (ramTextEl)
        ramTextEl.innerText = `${specs.used_ram} / ${specs.total_ram}`;

      const ramPercentEl = document.getElementById("ram-percent");
      if (ramPercentEl) ramPercentEl.innerText = `${ramPercent.toFixed(1)}%`;

      const ramBarEl = document.getElementById("ram-bar");
      if (ramBarEl) ramBarEl.style.width = `${ramPercent}%`;

      const freeDiskNum = parseFloat(specs.free_disk);
      const totalDiskNum = parseFloat(specs.total_disk);
      const usedDiskNum = totalDiskNum - freeDiskNum;
      const diskPercent =
        totalDiskNum > 0 ? (usedDiskNum / totalDiskNum) * 100 : 0;

      updateStorageStats(`${specs.free_disk} Free`, diskPercent);
    } else {
      const cpuEl = document.getElementById("cpu-name");
      if (cpuEl) cpuEl.innerText = "AMD Ryzen 7 5800H (Development Mode)";

      const cpuUsageEl = document.getElementById("cpu-usage-text");
      if (cpuUsageEl) cpuUsageEl.innerText = "18.5%";
      const cpuBarEl = document.getElementById("cpu-bar");
      if (cpuBarEl) cpuBarEl.style.width = "18.5%";

      const randomRam = (4.5 + Math.random() * 0.5).toFixed(2);
      const ramPercent = ((randomRam / 16.0) * 100).toFixed(1);

      const ramTextEl = document.getElementById("ram-text");
      if (ramTextEl) ramTextEl.innerText = `${randomRam} GB / 16.00 GB`;

      const ramPercentEl = document.getElementById("ram-percent");
      if (ramPercentEl) ramPercentEl.innerText = `${ramPercent}%`;

      const ramBarEl = document.getElementById("ram-bar");
      if (ramBarEl) ramBarEl.style.width = `${ramPercent}%`;

      updateStorageStats("412.50 GB Free", 54.2);
    }
  } catch (error) {
    console.error("Failed To Load System Specs:", error);
  }
}

let pengaturWaktu = setInterval(muatSpesifikasiSistem, 5000);

document
  .getElementById("setting-ticker-toggle")
  ?.addEventListener("change", (e) => {
    if (e.target.checked) {
      pengaturWaktu = setInterval(muatSpesifikasiSistem, 5000);
      catatLog("Hardware Auto-Refresher Enabled.", "success");
      tampilkanPemberitahuan("Automatic Hardware Refresh Enabled", "success");
    } else {
      clearInterval(pengaturWaktu);
      catatLog("Hardware Auto-Refresher Disabled.", "warn");
      tampilkanPemberitahuan("Automatic Hardware Refresh Disabled", "warn");
    }
  });

document.getElementById("btn-clean")?.addEventListener("click", async () => {
  const btn = document.getElementById("btn-clean");
  const titleEl = document.getElementById("clean-title");
  const iconBox = document.getElementById("clean-icon-box");

  if (!btn) return;

  btn.disabled = true;
  if (titleEl) titleEl.innerText = "Cleaning System...";
  if (iconBox)
    iconBox.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin text-accent"></i>`;
  lucide.createIcons();

  catatLog("Initiating Deep System Junk Cleanup...", "warn");
  try {
    if (invoke) {
      const res = await invoke("clean_system");
      catatLog(res, "success");
      tampilkanPemberitahuan(res, "success");

      document.getElementById("junk-size-1").innerText = "0 KB";
      document.getElementById("junk-size-2").innerText = "0 KB";
      document.getElementById("total-junk-size").innerText = "0 KB";
    } else {
      await new Promise((r) => setTimeout(r, 1800));
      catatLog("Successfully Cleaned Temporary Files And Cache!", "success");
      tampilkanPemberitahuan(
        "Deep Cleaning Successful: 2.09 GB Recovered",
        "success",
      );

      document.getElementById("junk-size-1").innerText = "0 KB";
      document.getElementById("junk-size-2").innerText = "0 KB";
      document.getElementById("total-junk-size").innerText = "0 KB";
    }
  } catch (err) {
    catatLog(`Failed To Clean System: ${err}`, "error");
    tampilkanPemberitahuan("System Cleaning Failed", "error");
  } finally {
    btn.disabled = false;
    if (titleEl) titleEl.innerText = "Run Deep System Clean Now";
    if (iconBox)
      iconBox.innerHTML = `<i data-lucide="trash-2" class="w-4 h-4 text-accent"></i>`;
    lucide.createIcons();
  }
});

const handleNetworkReset = async () => {
  catatLog("Executing DNS Cache Flush And Network Stack Reset...", "warn");
  try {
    if (invoke) {
      const result = await invoke("reset_network");
      catatLog(result, "success");
      tampilkanPemberitahuan(result, "success");
    } else {
      await new Promise((r) => setTimeout(r, 1000));
      catatLog("DNS Cache Successfully Flushed (Development Mode)!", "success");
      tampilkanPemberitahuan("Network Reset Successfully", "success");
    }
  } catch (error) {
    catatLog(`Failed To Reset Network: ${error}`, "error");
    tampilkanPemberitahuan("Network Reset Failed", "error");
  }
};

document
  .getElementById("btn-reset-network")
  ?.addEventListener("click", handleNetworkReset);
document
  .getElementById("btn-network")
  ?.addEventListener("click", handleNetworkReset);

document.getElementById("btn-export-log")?.addEventListener("click", () => {
  const consoleBox = document.getElementById("console-log");
  if (!consoleBox) return;

  const textContent = consoleBox.innerText;
  const blob = new Blob([textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jokerx-optimizer-log-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  catatLog("Activity Logs Successfully Exported To Text File.", "success");
  tampilkanPemberitahuan("Logs Exported Successfully", "success");
});

document.getElementById("btn-clear-log")?.addEventListener("click", () => {
  const consoleBox = document.getElementById("console-log");
  if (consoleBox) {
    consoleBox.innerHTML = `<div class="text-slate-500">[System Ready] Console Cleared.</div>`;
  }
  tampilkanPemberitahuan("Console Log Cleared", "success");
});

const aboutModal = document.getElementById("about-modal");
const aboutContent = document.getElementById("about-modal-content");

function bukaTentang() {
  if (aboutModal && aboutContent) {
    aboutModal.classList.remove("opacity-0", "pointer-events-none");
    aboutContent.classList.remove("scale-95");
    aboutContent.classList.add("scale-100");
  }
}

function tutupTentang() {
  if (aboutModal && aboutContent) {
    aboutModal.classList.add("opacity-0", "pointer-events-none");
    aboutContent.classList.remove("scale-100");
    aboutContent.classList.add("scale-95");
  }
}

document
  .getElementById("btn-open-about")
  ?.addEventListener("click", bukaTentang);
document.getElementById("close-about")?.addEventListener("click", tutupTentang);
document
  .getElementById("btn-close-about-action")
  ?.addEventListener("click", tutupTentang);

if (aboutModal) {
  aboutModal.addEventListener("click", (e) => {
    if (e.target === aboutModal) {
      tutupTentang();
    }
  });
}

document
  .getElementById("btn-portfolio")
  ?.addEventListener("click", async () => {
    try {
      const tauriShell = window.__TAURI__?.shell;
      if (tauriShell && typeof tauriShell.open === "function") {
        await tauriShell.open("https://iqbalfadillah.vercel.app/");
      } else {
        window.open("https://iqbalfadillah.vercel.app/", "_blank");
      }
    } catch (error) {
      console.error("Failed To Open Link Via Tauri Shell:", error);
      window.open("https://iqbalfadillah.vercel.app/", "_blank");
    }
  });

window.addEventListener("DOMContentLoaded", () => {
  muatSpesifikasiSistem();
  muatUkuranJunk();
  lucide.createIcons();
  updateToggleVisual();
});
