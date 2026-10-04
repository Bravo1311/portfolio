// Copy text, trying the modern API first and an older fallback second. Resolves to true or false.
export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // fall through to the older method
  }
  try {
    const box = document.createElement('textarea')
    box.value = text
    box.setAttribute('readonly', '')
    box.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
    document.body.appendChild(box)
    box.select()
    const ok = document.execCommand('copy')
    box.remove()
    return ok
  } catch {
    return false
  }
}
