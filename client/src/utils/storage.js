function canUseStorage(storage) {
  try {
    const key = "__quiz_storage_test__";
    storage.setItem(key, "1");
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getLocalItem(key) {
  if (typeof window === "undefined" || !canUseStorage(window.localStorage)) {
    return "";
  }
  return window.localStorage.getItem(key) || "";
}

export function setLocalItem(key, value) {
  if (typeof window === "undefined" || !canUseStorage(window.localStorage)) {
    return false;
  }
  window.localStorage.setItem(key, value);
  return true;
}

export function removeSessionItem(key) {
  if (typeof window === "undefined" || !canUseStorage(window.sessionStorage)) {
    return false;
  }
  window.sessionStorage.removeItem(key);
  return true;
}

export function getSessionItem(key) {
  if (typeof window === "undefined" || !canUseStorage(window.sessionStorage)) {
    return "";
  }
  return window.sessionStorage.getItem(key) || "";
}

export function setSessionItem(key, value) {
  if (typeof window === "undefined" || !canUseStorage(window.sessionStorage)) {
    return false;
  }
  window.sessionStorage.setItem(key, value);
  return true;
}

export function getOrCreateLocalItem(key, createValue) {
  const existing = getLocalItem(key);
  if (existing) {
    return existing;
  }

  const nextValue = createValue();
  setLocalItem(key, nextValue);
  return nextValue;
}
