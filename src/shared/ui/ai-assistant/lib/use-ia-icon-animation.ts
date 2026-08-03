import { useEffect } from 'react'
import { addRipple, hideTooltip, pickWeightedIdle, showFrame, showTooltip } from './ia-icon-dom'

const IDLE_WEIGHTS = [3, 2, 1, 2, 1, 1, 2, 1, 2, 3]

interface IconRefs {
  framesRef: React.RefObject<HTMLDivElement | null>
  btnRef: React.RefObject<HTMLButtonElement | null>
}

function createCycles(agentEl: Element, idleFrames: Element[], hoverFrames: Element[]) {
  const state = { idleTimer: null as ReturnType<typeof setTimeout> | null, hoverTimer: null as ReturnType<typeof setTimeout> | null, curIdle: 0, curHover: 0, isHov: false }

  const stopIdle = () => {
    if (state.idleTimer) clearTimeout(state.idleTimer)
    state.idleTimer = null
  }
  const stopHover = () => {
    if (state.hoverTimer) clearTimeout(state.hoverTimer)
    state.hoverTimer = null
    agentEl.classList.remove('ia-hovered')
    hoverFrames.forEach((f) => f.classList.remove('active'))
  }
  const startIdle = () => {
    stopIdle()
    stopHover()
    state.curIdle = pickWeightedIdle(IDLE_WEIGHTS)
    showFrame(idleFrames, state.curIdle)
    const tick = () => {
      const hold = 1500 + Math.random() * 2500
      state.idleTimer = setTimeout(() => {
        if (state.isHov) return
        let next: number
        do {
          next = pickWeightedIdle(IDLE_WEIGHTS)
        } while (next === state.curIdle && Math.random() < 0.7)
        state.curIdle = next
        showFrame(idleFrames, state.curIdle)
        tick()
      }, hold)
    }
    tick()
  }
  const startHover = () => {
    stopIdle()
    stopHover()
    idleFrames.forEach((f) => f.classList.remove('active'))
    state.curHover = 0
    showFrame(hoverFrames, state.curHover)
    agentEl.classList.add('ia-hovered')
    const tick = () => {
      state.hoverTimer = setTimeout(() => {
        if (!state.isHov) return
        state.curHover = (state.curHover + 1) % hoverFrames.length
        showFrame(hoverFrames, state.curHover)
        tick()
      }, 110)
    }
    tick()
  }

  return { state, stopIdle, stopHover, startIdle, startHover }
}

export function useIaIconAnimation({ framesRef, btnRef }: IconRefs) {
  useEffect(() => {
    const div = framesRef.current
    const btn = btnRef.current
    const agentEl = div?.querySelector('.ia-agent-btn')
    if (!div || !btn || !agentEl) return

    const idleFrames = Array.from(div.querySelectorAll('.ia-idle'))
    const hoverFrames = Array.from(div.querySelectorAll('.ia-hover'))
    const { state, stopIdle, stopHover, startIdle, startHover } = createCycles(agentEl, idleFrames, hoverFrames)

    const onEnter = () => {
      state.isHov = true
      startHover()
      showTooltip(btn)
    }
    const onLeave = () => {
      state.isHov = false
      stopHover()
      startIdle()
      hideTooltip()
    }
    const onClick = (e: MouseEvent) => {
      addRipple(btn, e.clientX, e.clientY)
      hideTooltip()
    }
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      state.isHov = true
      startHover()
      showTooltip(btn)
    }
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      state.isHov = false
      stopHover()
      startIdle()
      hideTooltip()
      const t = e.changedTouches[0]
      if (t) addRipple(btn, t.clientX, t.clientY)
    }

    btn.addEventListener('mouseenter', onEnter)
    btn.addEventListener('mouseleave', onLeave)
    btn.addEventListener('click', onClick)
    btn.addEventListener('touchstart', onTouchStart, { passive: false })
    btn.addEventListener('touchend', onTouchEnd, { passive: false })
    startIdle()

    return () => {
      stopIdle()
      stopHover()
      hideTooltip()
      btn.removeEventListener('mouseenter', onEnter)
      btn.removeEventListener('mouseleave', onLeave)
      btn.removeEventListener('click', onClick)
      btn.removeEventListener('touchstart', onTouchStart)
      btn.removeEventListener('touchend', onTouchEnd)
    }
  }, [framesRef, btnRef])
}
