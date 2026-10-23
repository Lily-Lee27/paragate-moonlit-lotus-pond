(() => {
  "use strict";

  const STORAGE_KEY = "paragate.lotusPond.v1";
  const LANGUAGE_KEY = "paragate.language";
  const SCHEMA_VERSION = 1;
  const MAX_TEXT_LENGTH = 500;
  const MAX_IMPORT_BYTES = 2 * 1024 * 1024;
  const MAX_IMPORT_ENTRIES = 2000;
  const MAX_VISIBLE_LANTERNS = 140;
  const DRAG_THRESHOLD = 7;
  const BACKGROUND_SIZE = { width: 1672, height: 941 };
  const WATER_POLYGON = [
    [.34, .375], [.67, .375], [.73, .41], [.77, .50], [.76, .61],
    [.72, .70], [.68, .78], [.63, .86], [.53, .92], [.44, .88],
    [.37, .82], [.31, .73], [.27, .63], [.25, .53], [.28, .43]
  ];

  const translations = {
    zh: {
      skip: "跳至放灯", siteTitle: "月下莲池", tagline: "一念起，一灯明。",
      releaseCta: "放下一盏莲花灯", principleShort: "莲池只负责承载，不负责评判。",
      writeTitle: "此刻，你想放下什么？", writeNote: "可以是一份心愿，一段回忆，或一个暂时无解的烦恼。",
      entryLabel: "莲灯中的文字", placeholder: "一份心愿，一段回忆，或一个暂时无解的烦恼……",
      plainText: "仅保存原文", back: "返回", releaseConfirm: "放下莲灯", aLantern: "一盏莲灯",
      memoryTitle: "莲灯记忆", close: "合上", menuTitle: "月下莲池", myPond: "我的莲池",
      export: "导出我的莲池", import: "导入莲池", about: "关于", language: "语言",
      privacyShort: "文字只保存在此浏览器。清除浏览数据或更换设备可能会使它们消失。",
      archiveTitle: "灯影簿", archiveIntro: "每一盏灯都保留着写下时的原文与时刻。",
      aboutTitle: "关于月下莲池",
      aboutOne: "这里是一方安静的私人莲池。",
      aboutAction: "写下心愿、回忆、念头，或暂时无解的烦恼，然后让一盏灯替你承载。",
      principle: "莲池只负责承载，不负责评判。",
      privacyDetails: "关于记录与隐私",
      aboutTwo: "没有账号，没有云端同步，也不会分析、上传或改变你的文字。",
      storageCaveat: "记录保存在当前浏览器的 localStorage 中。它不是永久存储：清除浏览数据、使用无痕模式、更换浏览器或设备，都可能令记录消失。你可以定期导出备份。",
      finalLine: "不必急于释怀，亦不必急于抵达。", importConfirmTitle: "确认合入莲池",
      importSafety: "现有莲灯不会被覆盖；相同 ID 的记录将被安全跳过。", confirmImport: "确认导入",
      noText: "这盏灯没有留下文字。", noEntries: "此刻，莲池中还没有灯。",
      oneLantern: "莲池中有 1 盏灯", manyLanterns: n => `莲池中有 ${n} 盏灯`,
      lanternLabel: n => `第 ${n} 盏莲灯。点击阅读，拖动可重新摆放。`, moved: "莲灯已安放。",
      storageError: "未能写入浏览器存储，本次记录仅保留在当前页面中。",
      corrupted: "本地记录无法读取，已暂时展示为空莲池。原数据未被上传。",
      exported: "已导出。文件可能包含私人内容，请妥善保存。", exportEmpty: "莲池尚空，仍已为你导出一份备份。",
      fileTooLarge: "文件过大，无法导入。", invalidFile: "无法导入：文件格式不符合莲池记录。",
      tooManyEntries: "无法导入：文件中的莲灯数量超过安全上限。",
      importPreview: (fresh, duplicates, conflicts) => `将新增 ${fresh} 盏莲灯。\n${duplicates} 条重复记录会被跳过。${conflicts ? `\n${conflicts} 条 ID 冲突记录不会覆盖现有内容。` : ""}`,
      importDone: (fresh, duplicates, conflicts) => `已导入 ${fresh} 盏；跳过 ${duplicates} 条重复${conflicts ? `，另有 ${conflicts} 条冲突未覆盖` : ""}。`,
      nothingToImport: "没有可新增的莲灯；重复或冲突记录均已安全跳过。", invalidDate: "时间未知",
      shownLimit: n => `水面展示最近 ${n} 盏；所有记录仍可在「我的莲池」中查看。`
    },
    en: {
      skip: "Skip to release", siteTitle: "Moonlit Lotus Pond", tagline: "A thought rises. A lantern glows.",
      releaseCta: "Release a Lotus Lantern", principleShort: "The pond holds. It does not judge.",
      writeTitle: "What would you like to release?", writeNote: "A wish, a memory, or something still unresolved.",
      entryLabel: "Words carried by the lantern", placeholder: "A wish, a memory, or something still unresolved…",
      plainText: "Your words stay unchanged", back: "Back", releaseConfirm: "Release Lantern", aLantern: "A lotus lantern",
      memoryTitle: "Lantern memory", close: "Close", menuTitle: "Moonlit Lotus Pond", myPond: "My Pond",
      export: "Export My Pond", import: "Import Pond", about: "About", language: "Language",
      privacyShort: "Your words stay in this browser. Clearing browser data or changing devices may make them disappear.",
      archiveTitle: "Lantern Record", archiveIntro: "Each lantern keeps the original words and moment exactly as they were.",
      aboutTitle: "About Moonlit Lotus Pond",
      aboutOne: "This is a quiet, private lotus pond.",
      aboutAction: "Write a wish, a memory, a passing thought, or something still unresolved, and let a lantern hold it for you.",
      principle: "The pond holds what you place in it. It does not judge.",
      privacyDetails: "About records and privacy",
      aboutTwo: "There are no accounts and no cloud sync. Your words are never analysed, uploaded, or changed.",
      storageCaveat: "Records are kept in this browser's localStorage. This is not permanent storage: clearing browser data, private browsing, changing browsers, or changing devices may make them disappear. Export a backup from time to time.",
      finalLine: "There is no need to let go, or arrive, in a hurry.", importConfirmTitle: "Merge this pond?",
      importSafety: "Existing lanterns will not be overwritten. Matching IDs are safely skipped.", confirmImport: "Import",
      noText: "No words were written for this lantern.", noEntries: "The pond has no lanterns yet.",
      oneLantern: "There is 1 lantern in the pond", manyLanterns: n => `There are ${n} lanterns in the pond`,
      lanternLabel: n => `Lotus lantern ${n}. Tap to read or drag to reposition.`, moved: "The lantern has settled.",
      storageError: "Browser storage was unavailable. This entry will remain only on this page.",
      corrupted: "Local records could not be read, so the pond is shown empty for now. Nothing was uploaded.",
      exported: "Exported. This file may contain personal information; please keep it safely.", exportEmpty: "The pond is empty, but a backup file was still exported.",
      fileTooLarge: "This file is too large to import.", invalidFile: "Import failed: this is not a valid pond record.",
      tooManyEntries: "Import failed: this file contains too many lanterns.",
      importPreview: (fresh, duplicates, conflicts) => `${fresh} new lanterns will be added.\n${duplicates} duplicate records will be skipped.${conflicts ? `\n${conflicts} ID conflicts will not replace existing content.` : ""}`,
      importDone: (fresh, duplicates, conflicts) => `Imported ${fresh}; skipped ${duplicates} duplicates${conflicts ? ` and left ${conflicts} conflicts unchanged` : ""}.`,
      nothingToImport: "There are no new lanterns to add. Duplicates and conflicts were safely skipped.", invalidDate: "Time unknown",
      shownLimit: n => `The water shows the newest ${n}; every record remains available in My Pond.`
    }
  };

  const elements = {
    pond: document.querySelector("#pond"), lanternLayer: document.querySelector("#lantern-layer"),
    rippleLayer: document.querySelector("#ripple-layer"),
    releaseButton: document.querySelector("#release-button"), menuButton: document.querySelector("#menu-button"),
    writeDialog: document.querySelector("#write-dialog"), writeForm: document.querySelector("#write-form"),
    entryText: document.querySelector("#entry-text"), charCount: document.querySelector("#character-count"),
    memoryDialog: document.querySelector("#memory-dialog"), memoryDate: document.querySelector("#memory-date"),
    memoryText: document.querySelector("#memory-text"), menuDialog: document.querySelector("#menu-dialog"),
    menuCount: document.querySelector("#menu-count"), archiveDialog: document.querySelector("#archive-dialog"),
    archiveList: document.querySelector("#archive-list"), aboutDialog: document.querySelector("#about-dialog"),
    importDialog: document.querySelector("#import-dialog"), importSummary: document.querySelector("#import-summary"),
    fileInput: document.querySelector("#file-input"), toast: document.querySelector("#toast")
  };

  let language = loadLanguage();
  let entries = loadEntries();
  let pendingImport = null;
  let toastTimer = null;
  let newlyReleasedId = null;
  let waterGridCache = null;

  function t(key, ...args) {
    const value = translations[language][key];
    return typeof value === "function" ? value(...args) : value;
  }

  function loadLanguage() {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      return saved === "en" ? "en" : "zh";
    } catch { return "zh"; }
  }

  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function isValidEntry(item) {
    return isPlainObject(item) && typeof item.id === "string" && item.id.length > 0 && item.id.length <= 200 &&
      typeof item.text === "string" && Array.from(item.text).length <= MAX_TEXT_LENGTH &&
      typeof item.createdAt === "string" && Number.isFinite(Date.parse(item.createdAt)) &&
      isPlainObject(item.position) && Number.isFinite(item.position.x) && Number.isFinite(item.position.y) &&
      item.position.x >= 0 && item.position.x <= 1 && item.position.y >= 0 && item.position.y <= 1;
  }

  function validatePondData(data, maxEntries = Infinity) {
    if (!isPlainObject(data) || data.schemaVersion !== SCHEMA_VERSION || !Array.isArray(data.entries)) return null;
    if (data.entries.length > maxEntries || !data.entries.every(isValidEntry)) return null;
    const seen = new Set();
    if (data.entries.some(item => seen.has(item.id) || !seen.add(item.id))) return null;
    return data.entries.map(item => ({ id: item.id, text: item.text, createdAt: item.createdAt, position: { x: item.position.x, y: item.position.y } }));
  }

  function loadEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const valid = validatePondData(parsed);
      if (!valid) throw new Error("Invalid local data");
      return valid;
    } catch {
      window.setTimeout(() => showToast(t("corrupted")), 200);
      return [];
    }
  }

  function saveEntries() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, entries }));
      return true;
    } catch {
      showToast(t("storageError"), 5200);
      return false;
    }
  }

  function toLocalIso(date) {
    const pad = (value, width = 2) => String(value).padStart(width, "0");
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const hours = pad(Math.floor(Math.abs(offset) / 60));
    const minutes = pad(Math.abs(offset) % 60);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}${sign}${hours}:${minutes}`;
  }

  function makeId() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, value => value.toString(16).padStart(2, "0")).join("");
  }

  function findPosition() {
    const candidates = [
      [.18,.27],[.79,.24],[.36,.42],[.64,.45],[.16,.59],[.84,.57],[.48,.65],[.29,.76],[.71,.77],
      [.51,.25],[.27,.34],[.73,.36],[.42,.54],[.59,.58],[.12,.45],[.89,.42],[.20,.70],[.82,.69],
      [.38,.82],[.63,.84],[.50,.38],[.32,.62],[.68,.65],[.10,.78],[.90,.79]
    ];
    const visible = entries.slice(-MAX_VISIBLE_LANTERNS);
    let best = candidates[0];
    let bestDistance = -1;
    for (const candidate of candidates) {
      const distance = visible.length ? Math.min(...visible.map(entry => Math.hypot(candidate[0] - entry.position.x, (candidate[1] - entry.position.y) * .76))) : 1;
      if (distance > bestDistance) { bestDistance = distance; best = candidate; }
    }
    const jitter = () => (Math.random() - .5) * .045;
    return { x: Math.min(.92, Math.max(.08, best[0] + jitter())), y: Math.min(.84, Math.max(.2, best[1] + jitter())) };
  }

  function formatDate(iso, compact = false) {
    const date = new Date(iso);
    if (!Number.isFinite(date.getTime())) return t("invalidDate");
    const locale = language === "zh" ? "zh-CN" : "en-GB";
    if (compact) return new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
    const datePart = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(date);
    const timePart = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
    return `${datePart} · ${timePart}`;
  }

  function createLantern(entry, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lantern";
    if (entry.id === newlyReleasedId) button.classList.add("newly-released");
    button.dataset.id = entry.id;
    button.setAttribute("aria-label", t("lanternLabel", index + 1));
    button.style.left = `${entry.position.x * 100}%`;
    button.style.top = `${entry.position.y * 100}%`;
    button.style.setProperty("--float-duration", `${6.2 + (index % 5) * .7}s`);
    button.style.setProperty("--float-delay", `${-(index % 7) * .61}s`);
    const image = document.createElement("img");
    image.className = "lantern-art";
    image.src = "assets/images/lotus- lantern.png";
    image.alt = "";
    image.draggable = false;
    image.decoding = "async";
    const reflection = document.createElement("span");
    reflection.className = "lantern-reflection";
    reflection.setAttribute("aria-hidden", "true");
    button.append(image, reflection);
    bindLanternInteraction(button, entry);
    return button;
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function lanternBounds(button) {
    const pondRect = elements.pond.getBoundingClientRect();
    const width = button.offsetWidth || button.getBoundingClientRect().width;
    const height = button.offsetHeight || button.getBoundingClientRect().height;
    const releaseDock = document.querySelector(".release-dock").getBoundingClientRect();
    const horizontalMargin = Math.min(.46, (width / 2 + 8) / pondRect.width);
    const topMargin = Math.min(.46, (height / 2 + 8) / pondRect.height);
    const bottomMargin = Math.min(.7, (pondRect.bottom - releaseDock.top + height / 2 + 18) / pondRect.height);
    return {
      pondRect, width, height,
      minimumX: horizontalMargin, maximumX: 1 - horizontalMargin,
      minimumY: topMargin, maximumY: 1 - bottomMargin
    };
  }

  function rectSafeLanternPosition(position, button) {
    const bounds = lanternBounds(button);
    if (!bounds.pondRect.width || !bounds.pondRect.height) return position;
    return {
      x: clamp(position.x, bounds.minimumX, bounds.maximumX),
      y: clamp(position.y, bounds.minimumY, bounds.maximumY)
    };
  }

  function backgroundMetrics() {
    const rect = document.querySelector("#experience").getBoundingClientRect();
    const scale = Math.max(rect.width / BACKGROUND_SIZE.width, rect.height / BACKGROUND_SIZE.height);
    const renderedWidth = BACKGROUND_SIZE.width * scale;
    const renderedHeight = BACKGROUND_SIZE.height * scale;
    const horizontalFocus = window.matchMedia("(min-width: 700px)").matches ? .5 : .8;
    return {
      left: rect.left + (rect.width - renderedWidth) * horizontalFocus,
      top: rect.top + (rect.height - renderedHeight) * .5,
      width: renderedWidth,
      height: renderedHeight
    };
  }

  function pointInWaterPolygon(point) {
    let inside = false;
    for (let current = 0, previous = WATER_POLYGON.length - 1; current < WATER_POLYGON.length; previous = current++) {
      const [currentX, currentY] = WATER_POLYGON[current];
      const [previousX, previousY] = WATER_POLYGON[previous];
      const crosses = (currentY > point.y) !== (previousY > point.y) &&
        point.x < (previousX - currentX) * (point.y - currentY) / (previousY - currentY) + currentX;
      if (crosses) inside = !inside;
    }
    return inside;
  }

  function screenPointToBackground(x, y, metrics) {
    return { x: (x - metrics.left) / metrics.width, y: (y - metrics.top) / metrics.height };
  }

  function waterSafetyContext(button, bounds = lanternBounds(button)) {
    return {
      bounds,
      halfWidth: bounds.width / 2 + 8,
      halfHeight: bounds.height / 2 + 7,
      metrics: backgroundMetrics()
    };
  }

  function isWaterSafePosition(position, button, context = waterSafetyContext(button)) {
    const { pondRect } = context.bounds;
    if (!pondRect.width || !pondRect.height) return false;
    const centerX = pondRect.left + position.x * pondRect.width;
    const centerY = pondRect.top + position.y * pondRect.height;
    const samples = [
      [0, 0], [-1, 0], [1, 0], [0, -.9], [0, .82],
      [-.78, -.7], [.78, -.7], [-.78, .7], [.78, .7]
    ];
    return samples.every(([factorX, factorY]) => pointInWaterPolygon(screenPointToBackground(
      centerX + context.halfWidth * factorX,
      centerY + context.halfHeight * factorY,
      context.metrics
    )));
  }

  function waterSafeCandidates(button) {
    const bounds = lanternBounds(button);
    const cacheKey = [
      Math.round(bounds.pondRect.width), Math.round(bounds.pondRect.height),
      Math.round(bounds.width), Math.round(bounds.height),
      Math.round(bounds.minimumX * 1000), Math.round(bounds.maximumY * 1000),
      window.matchMedia("(min-width: 700px)").matches ? "wide" : "narrow"
    ].join(":");
    if (waterGridCache?.key === cacheKey) return waterGridCache.points;

    const points = [];
    const context = waterSafetyContext(button, bounds);
    const stepX = 11 / bounds.pondRect.width;
    const stepY = 11 / bounds.pondRect.height;
    for (let y = bounds.minimumY; y <= bounds.maximumY + .0001; y += stepY) {
      for (let x = bounds.minimumX; x <= bounds.maximumX + .0001; x += stepX) {
        const candidate = { x: Math.min(x, bounds.maximumX), y: Math.min(y, bounds.maximumY) };
        if (isWaterSafePosition(candidate, button, context)) points.push(candidate);
      }
    }
    waterGridCache = { key: cacheKey, points };
    return points;
  }

  function safeLanternPosition(position, button) {
    const bounded = rectSafeLanternPosition(position, button);
    if (isWaterSafePosition(bounded, button)) return bounded;
    const { pondRect } = lanternBounds(button);
    const candidates = waterSafeCandidates(button);
    if (!candidates.length) return bounded;
    let nearest = candidates[0];
    let nearestDistance = Infinity;
    for (const candidate of candidates) {
      const distance = Math.hypot(
        (candidate.x - bounded.x) * pondRect.width,
        (candidate.y - bounded.y) * pondRect.height
      );
      if (distance < nearestDistance) {
        nearest = candidate;
        nearestDistance = distance;
      }
    }
    return { x: nearest.x, y: nearest.y };
  }

  function availableWaterPosition(button, preferred) {
    const pondRect = elements.pond.getBoundingClientRect();
    const occupied = Array.from(elements.lanternLayer.querySelectorAll(".lantern"))
      .filter(item => item !== button)
      .map(item => ({
        x: Number.parseFloat(item.style.left) / 100,
        y: Number.parseFloat(item.style.top) / 100
      }))
      .filter(position => Number.isFinite(position.x) && Number.isFinite(position.y));
    if (!occupied.length) return safeLanternPosition(preferred, button);

    const candidates = waterSafeCandidates(button);
    let best = safeLanternPosition(preferred, button);
    let bestScore = -Infinity;
    for (const candidate of candidates) {
      const nearestLantern = Math.min(...occupied.map(position => Math.hypot(
        (candidate.x - position.x) * pondRect.width,
        (candidate.y - position.y) * pondRect.height
      )));
      const distanceFromPreferred = Math.hypot(
        (candidate.x - preferred.x) * pondRect.width,
        (candidate.y - preferred.y) * pondRect.height
      );
      const score = nearestLantern - distanceFromPreferred * .22;
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    return { x: best.x, y: best.y };
  }

  function applyLanternDisplayPosition(button, position) {
    const safe = safeLanternPosition(position, button);
    button.style.left = `${safe.x * 100}%`;
    button.style.top = `${safe.y * 100}%`;
    return safe;
  }

  function positionFromPointer(event, button, dragState) {
    const pondRect = elements.pond.getBoundingClientRect();
    const centerX = event.clientX - dragState.offsetX;
    const centerY = event.clientY - dragState.offsetY;
    return safeLanternPosition({
      x: (centerX - pondRect.left) / pondRect.width,
      y: (centerY - pondRect.top) / pondRect.height
    }, button);
  }

  function bindLanternInteraction(button, entry) {
    let dragState = null;
    let suppressClick = false;

    button.addEventListener("pointerdown", event => {
      if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      const rect = button.getBoundingClientRect();
      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - (rect.left + rect.width / 2),
        offsetY: event.clientY - (rect.top + rect.height / 2),
        origin: { x: entry.position.x, y: entry.position.y },
        latest: { x: entry.position.x, y: entry.position.y },
        dragging: false
      };
      button.setPointerCapture(event.pointerId);
    });

    button.addEventListener("pointermove", event => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
      if (!dragState.dragging && distance >= DRAG_THRESHOLD) {
        dragState.dragging = true;
        button.classList.add("is-dragging");
        button.setAttribute("aria-grabbed", "true");
      }
      if (!dragState.dragging) return;
      event.preventDefault();
      dragState.latest = positionFromPointer(event, button, dragState);
      button.style.left = `${dragState.latest.x * 100}%`;
      button.style.top = `${dragState.latest.y * 100}%`;
    });

    button.addEventListener("pointerup", event => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      if (dragState.dragging) {
        entry.position = { x: dragState.latest.x, y: dragState.latest.y };
        saveEntries();
        createRipple(entry.position);
        showToast(t("moved"), 1800);
        suppressClick = true;
      }
      button.classList.remove("is-dragging");
      button.removeAttribute("aria-grabbed");
      if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
      dragState = null;
    });

    button.addEventListener("pointercancel", event => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      if (dragState.dragging) {
        applyLanternDisplayPosition(button, dragState.origin);
        suppressClick = true;
      }
      button.classList.remove("is-dragging");
      button.removeAttribute("aria-grabbed");
      dragState = null;
    });

    button.addEventListener("dragstart", event => event.preventDefault());
    button.addEventListener("click", event => {
      if (suppressClick) {
        suppressClick = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      openMemory(entry.id);
    });
  }

  function renderPond() {
    elements.lanternLayer.replaceChildren();
    const visible = entries.slice(-MAX_VISIBLE_LANTERNS);
    visible.forEach((entry, index) => {
      const button = createLantern(entry, entries.length - visible.length + index);
      elements.lanternLayer.appendChild(button);
      applyLanternDisplayPosition(button, entry.position);
    });
    elements.menuCount.textContent = entries.length === 1 ? t("oneLantern") : t("manyLanterns", entries.length);
    if (entries.length > MAX_VISIBLE_LANTERNS) elements.menuCount.textContent += ` · ${t("shownLimit", MAX_VISIBLE_LANTERNS)}`;
    renderArchive();
    window.setTimeout(() => { newlyReleasedId = null; }, 2100);
  }

  function renderArchive() {
    elements.archiveList.replaceChildren();
    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "archive-empty";
      empty.textContent = t("noEntries");
      elements.archiveList.appendChild(empty);
      return;
    }
    [...entries].reverse().forEach(entry => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "archive-item";
      const time = document.createElement("time");
      time.dateTime = entry.createdAt;
      time.textContent = formatDate(entry.createdAt, true);
      const text = document.createElement("p");
      text.textContent = entry.text || t("noText");
      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "›";
      button.append(time, text, arrow);
      button.addEventListener("click", () => { elements.archiveDialog.close(); openMemory(entry.id); });
      elements.archiveList.appendChild(button);
    });
  }

  function releaseLantern() {
    const text = Array.from(elements.entryText.value).slice(0, MAX_TEXT_LENGTH).join("");
    const entry = { id: makeId(), text, createdAt: toLocalIso(new Date()), position: findPosition() };
    entries.push(entry);
    newlyReleasedId = entry.id;
    renderPond();
    const button = elements.lanternLayer.querySelector(`[data-id="${CSS.escape(entry.id)}"]`);
    if (button) {
      entry.position = availableWaterPosition(button, entry.position);
      applyLanternDisplayPosition(button, entry.position);
    }
    saveEntries();
    elements.writeDialog.close();
    elements.entryText.value = "";
    updateCharacterCount();
    window.setTimeout(() => createRipple(entry.position), 820);
  }

  function createRipple(position) {
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${position.x * 100}%`;
    ripple.style.top = `${Math.min(96, position.y * 100 + 5)}%`;
    ripple.append(document.createElement("span"), document.createElement("span"), document.createElement("span"));
    elements.rippleLayer.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 3000);
  }

  function openMemory(id) {
    const entry = entries.find(item => item.id === id);
    if (!entry) return;
    elements.memoryDate.dateTime = entry.createdAt;
    elements.memoryDate.textContent = formatDate(entry.createdAt);
    elements.memoryText.textContent = entry.text || t("noText");
    elements.memoryText.classList.toggle("is-empty", !entry.text);
    elements.memoryDialog.showModal();
  }

  function updateCharacterCount() {
    elements.charCount.textContent = `${Array.from(elements.entryText.value).length} / ${MAX_TEXT_LENGTH}`;
  }

  function applyLanguage(nextLanguage) {
    language = nextLanguage === "en" ? "en" : "zh";
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = language === "zh" ? "Paragate · 月下莲池" : "Paragate · Moonlit Lotus Pond";
    document.querySelectorAll("[data-i18n]").forEach(node => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(node => { node.placeholder = t(node.dataset.i18nPlaceholder); });
    document.querySelectorAll("[data-language]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.language === language)));
    document.querySelector("#menu-button").setAttribute("aria-label", language === "zh" ? "打开菜单" : "Open menu");
    document.querySelectorAll(".panel-close").forEach(button => button.setAttribute("aria-label", language === "zh" ? "关闭" : "Close"));
    elements.pond.setAttribute("aria-label", t("myPond"));
    try { localStorage.setItem(LANGUAGE_KEY, language); } catch { /* language preference is optional */ }
    renderPond();
  }

  function showToast(message, duration = 3800) {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    toastTimer = window.setTimeout(() => elements.toast.classList.remove("show"), duration);
  }

  function exportPond() {
    const payload = { schemaVersion: SCHEMA_VERSION, exportedAt: toLocalIso(new Date()), entries };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date();
    const day = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    link.href = url;
    link.download = `paragate-lotus-pond-${day}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    elements.menuDialog.close();
    showToast(entries.length ? t("exported") : t("exportEmpty"), 5200);
  }

  function sameEntry(a, b) {
    return a.id === b.id && a.text === b.text && a.createdAt === b.createdAt && a.position.x === b.position.x && a.position.y === b.position.y;
  }

  async function prepareImport(file) {
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) { showToast(t("fileTooLarge")); return; }
    try {
      const parsed = JSON.parse(await file.text());
      if (isPlainObject(parsed) && Array.isArray(parsed.entries) && parsed.entries.length > MAX_IMPORT_ENTRIES) {
        showToast(t("tooManyEntries")); return;
      }
      const incoming = validatePondData(parsed, MAX_IMPORT_ENTRIES);
      if (!incoming) throw new Error("Invalid import");
      const currentById = new Map(entries.map(entry => [entry.id, entry]));
      const fresh = [];
      let duplicates = 0;
      let conflicts = 0;
      for (const entry of incoming) {
        const current = currentById.get(entry.id);
        if (!current) fresh.push(entry);
        else if (sameEntry(current, entry)) duplicates += 1;
        else conflicts += 1;
      }
      pendingImport = { fresh, duplicates, conflicts };
      elements.importSummary.textContent = t("importPreview", fresh.length, duplicates, conflicts);
      elements.importDialog.showModal();
    } catch {
      showToast(t("invalidFile"));
    } finally {
      elements.fileInput.value = "";
    }
  }

  function commitImport() {
    if (!pendingImport) return;
    const { fresh, duplicates, conflicts } = pendingImport;
    if (fresh.length) {
      entries = entries.concat(fresh);
      saveEntries();
      renderPond();
    }
    elements.importDialog.close();
    elements.menuDialog.close();
    showToast(fresh.length ? t("importDone", fresh.length, duplicates, conflicts) : t("nothingToImport"), 5200);
    pendingImport = null;
  }

  function bindEvents() {
    elements.releaseButton.addEventListener("click", () => elements.writeDialog.showModal());
    elements.menuButton.addEventListener("click", () => elements.menuDialog.showModal());
    elements.entryText.addEventListener("input", updateCharacterCount);
    elements.writeForm.addEventListener("submit", event => {
      if (event.submitter?.id === "confirm-release") { event.preventDefault(); releaseLantern(); }
    });
    document.querySelector("#memory-close").addEventListener("click", () => elements.memoryDialog.close());
    document.querySelector("#memory-close-secondary").addEventListener("click", () => elements.memoryDialog.close());
    document.querySelector("#menu-close").addEventListener("click", () => elements.menuDialog.close());
    document.querySelector("#archive-close").addEventListener("click", () => elements.archiveDialog.close());
    document.querySelector("#about-close").addEventListener("click", () => elements.aboutDialog.close());
    document.querySelector("#my-pond-button").addEventListener("click", () => { elements.menuDialog.close(); elements.archiveDialog.showModal(); });
    document.querySelector("#about-button").addEventListener("click", () => { elements.menuDialog.close(); elements.aboutDialog.showModal(); });
    document.querySelector("#export-button").addEventListener("click", exportPond);
    document.querySelector("#import-button").addEventListener("click", () => elements.fileInput.click());
    elements.fileInput.addEventListener("change", () => prepareImport(elements.fileInput.files?.[0]));
    document.querySelector("#import-form").addEventListener("submit", event => {
      if (event.submitter?.id === "confirm-import") { event.preventDefault(); commitImport(); }
      else pendingImport = null;
    });
    document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => applyLanguage(button.dataset.language)));
    document.querySelectorAll("dialog").forEach(dialog => {
      dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
      });
    });
  }

  bindEvents();
  applyLanguage(language);
  updateCharacterCount();

  let resizeFrame = 0;
  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      waterGridCache = null;
      elements.lanternLayer.querySelectorAll(".lantern").forEach(button => {
        const entry = entries.find(item => item.id === button.dataset.id);
        if (entry) applyLanternDisplayPosition(button, entry.position);
      });
    });
  });

  window.__PARAGATE_TEST__ = Object.freeze({
    validatePondData, isValidEntry, toLocalIso, sameEntry,
    constants: { STORAGE_KEY, SCHEMA_VERSION, MAX_TEXT_LENGTH, MAX_IMPORT_BYTES, MAX_IMPORT_ENTRIES, MAX_VISIBLE_LANTERNS, DRAG_THRESHOLD }
  });
})();
