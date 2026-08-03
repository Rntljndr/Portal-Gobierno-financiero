export function pickWeightedIdle(weights: number[]): number {
  const cum: number[] = []
  let sum = 0
  for (const w of weights) {
    sum += w
    cum.push(sum)
  }
  const r = Math.random() * sum
  for (let i = 0; i < cum.length; i++) if (r < cum[i]) return i
  return 0
}

export function showFrame(frames: Element[], idx: number) {
  frames.forEach((f, i) => f.classList.toggle('active', i === idx))
}

export function addRipple(btn: HTMLElement, clientX: number, clientY: number) {
  const r = document.createElement('div')
  r.className = 'ia-ripple'
  const rect = btn.getBoundingClientRect()
  const sz = Math.max(rect.width, rect.height)
  r.style.width = `${sz}px`
  r.style.height = `${sz}px`
  r.style.left = `${clientX - rect.left - sz / 2}px`
  r.style.top = `${clientY - rect.top - sz / 2}px`
  btn.appendChild(r)
  r.addEventListener('animationend', () => r.remove())
}

export function showTooltip(btn: HTMLElement) {
  if (document.getElementById('ia-tooltip')) return
  const t = document.createElement('div')
  t.id = 'ia-tooltip'
  t.textContent = 'En que puedo ayudarte'
  const rect = btn.getBoundingClientRect()
  const top = Math.round(rect.top + (rect.height - 28) / 2)
  const right = Math.round(window.innerWidth - rect.left + 8)
  t.style.cssText = `position:fixed;top:${top}px;right:${right}px;background:#0073FF;color:#fff;font-size:12px;font-weight:500;font-family:inherit;padding:6px 12px;border-radius:8px;white-space:nowrap;pointer-events:none;z-index:10000;box-shadow:0 2px 10px rgba(0,115,255,0.35);opacity:0;transition:opacity 0.15s ease;`
  document.body.appendChild(t)
  requestAnimationFrame(() => {
    t.style.opacity = '1'
  })
}

export function hideTooltip() {
  document.getElementById('ia-tooltip')?.remove()
}
