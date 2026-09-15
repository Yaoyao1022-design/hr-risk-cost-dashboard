<template>
  <div v-show="visible" class="novice-guide" aria-live="polite">
    <div class="novice-guide__blocker" />
    <div
      v-for="(rect, idx) in spotlightRects"
      :key="idx"
      v-show="spotlightIndex === idx"
      class="novice-guide__hole"
      :style="holeStyleForRect(rect)"
    />

    <div class="novice-guide__tip" :style="tipStyle">
      <p class="novice-guide__text">可以点击卡片进行同看板切换哦~</p>
      <button type="button" class="novice-guide__btn" @click="dismiss">知道了</button>
    </div>

    <div
      class="novice-guide__hand-wrap"
      :class="{ 'is-clicking': clicking }"
      :style="handStyle"
    >
      <span class="novice-guide__ripple" :class="{ 'is-active': clicking }" />
      <img class="novice-guide__hand" :src="handIcon" alt="" />
    </div>
  </div>
</template>

<script>
import handIcon from '@/assets/images/手势.png'

const STORAGE_KEY = 'hr-cost-diag-novice-guide-v1'
const HOLE_PAD = 6
/** 每轮演示顺序：先点右侧卡片，再点左侧（初始固定左亮右暗） */
const GUIDE_CLICK_ORDER = [1, 0]
const GUIDE_INITIAL_HOLD_MS = 420
const GUIDE_MAX_CLICKS = 6

export default {
  name: 'NoviceGuide',
  props: {
    getTargets: {
      type: Function,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      handIcon,
      visible: false,
      clicking: false,
      handMoving: false,
      handMoveDuration: 0.72,
      handPos: { x: 0, y: 0, opacity: 0 },
      tipPos: { left: 0, top: 0 },
      spotlightRects: [],
      spotlightIndex: 0,
      clickCount: 0,
      timers: [],
      rafId: 0,
      running: false
    }
  },
  computed: {
    handStyle() {
      const scale = this.clicking ? 0.94 : 1
      let transition = 'none'
      if (this.handMoving) {
        transition = `transform ${this.handMoveDuration}s cubic-bezier(0.22, 1, 0.36, 1)`
      } else if (this.clicking) {
        transition = 'transform 0.14s cubic-bezier(0.33, 1, 0.68, 1)'
      }
      return {
        transform: `translate3d(${this.handPos.x}px, ${this.handPos.y}px, 0) translate(-18%, -12%) scale(${scale})`,
        opacity: this.handPos.opacity,
        transition
      }
    },
    tipStyle() {
      return {
        left: `${this.tipPos.left}px`,
        top: `${this.tipPos.top}px`
      }
    },
  },
  watch: {
    active: {
      immediate: true,
      handler(val) {
        if (val) this.tryStart()
        else this.stop(false)
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
    this.stop(false)
  },
  methods: {
    shouldForceShow() {
      try {
        const params = new URLSearchParams(location.search)
        return params.get('guide') === '1'
      } catch (e) {
        return false
      }
    },
    isDismissed() {
      try {
        return localStorage.getItem(STORAGE_KEY) === '1'
      } catch (e) {
        return false
      }
    },
    tryStart() {
      if (!this.active || this.running || this.visible) return
      if (!this.shouldForceShow() && this.isDismissed()) return
      this.$nextTick(() => {
        if (this.running || this.visible) return
        const targets = this.getTargets() || []
        if (!targets.length) {
          this.delay(this.tryStart, 120)
          return
        }
        this.visible = true
        this.$emit('show')
        this.syncSpotlightRects()
        this.updateTip(this.spotlightRects)
        this.spotlightIndex = 0
        this.clickCount = 0
        this.startLoop()
      })
    },
    onResize() {
      if (!this.visible) return
      this.syncSpotlightRects()
      if (this.spotlightRects.length) this.updateTip(this.spotlightRects)
    },
    syncSpotlightRects() {
      this.spotlightRects = this.getTargets() || []
    },
    holeStyleForRect(rect) {
      if (!rect || !rect.width) return {}
      return {
        left: `${Math.round(rect.left - HOLE_PAD)}px`,
        top: `${Math.round(rect.top - HOLE_PAD)}px`,
        width: `${Math.round(rect.width + HOLE_PAD * 2)}px`,
        height: `${Math.round(rect.height + HOLE_PAD * 2)}px`
      }
    },
    showSpotlight(index) {
      this.syncSpotlightRects()
      this.spotlightIndex = index
    },
    updateTip(targets) {
      const first = targets[0]
      const last = targets[targets.length - 1]
      const midX = (first.left + last.right) / 2
      const bottom = Math.max(...targets.map((t) => t.bottom))
      this.tipPos = {
        left: midX,
        top: bottom + 28
      }
    },
    async startLoop() {
      if (this.running) return
      this.running = true
      await this.wait(GUIDE_INITIAL_HOLD_MS)
      if (this.running) this.runCycle()
    },
    async runCycle() {
      if (!this.running) return
      const targets = this.getTargets() || []
      if (targets.length < 2) {
        this.delay(() => this.runCycle(), 200)
        return
      }
      this.updateTip(targets)

      for (let step = 0; step < GUIDE_CLICK_ORDER.length; step += 1) {
        if (!this.running) return
        const index = GUIDE_CLICK_ORDER[step]
        const fresh = this.getTargets() || []
        const rect = fresh[index]
        if (!rect) continue
        await this.moveHandTo(rect)
        if (!this.running) return
        await this.performClick(index)
        if (!this.running) return
        this.clickCount += 1
        if (this.clickCount >= GUIDE_MAX_CLICKS) {
          await this.wait(500)
          this.dismiss()
          return
        }
        await this.wait(1100)
      }
      if (this.running) this.runCycle()
    },
    moveHandTo(rect) {
      const targetX = rect.left + rect.width * 0.55
      const targetY = rect.top + rect.height * 0.55
      const isIntro = !this.handPos.opacity
      if (isIntro) {
        this.handMoving = false
        this.handPos = { x: targetX, y: targetY, opacity: 1 }
        return this.wait(80)
      }
      const moveMs = 460
      this.handMoveDuration = moveMs / 1000
      this.handMoving = true
      this.handPos = { x: targetX, y: targetY, opacity: 1 }
      return this.wait(moveMs).then(() => {
        this.handMoving = false
      })
    },
    async performClick(index) {
      this.clicking = true
      await this.wait(240)
      if (!this.running) return
      this.clicking = false
      await this.nextFrames(1)
      this.$emit('highlight', index)
      await this.nextFrames(2)
      this.showSpotlight(index)
      await this.wait(16)
    },
    nextFrames(count = 1) {
      return new Promise((resolve) => {
        let left = count
        const tick = () => {
          left -= 1
          if (left <= 0) resolve()
          else requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
    },
    wait(ms) {
      return new Promise((resolve) => {
        if (!ms) {
          resolve()
          return
        }
        this.delay(resolve, ms)
      })
    },
    delay(fn, ms) {
      const id = setTimeout(() => {
        this.timers = this.timers.filter((item) => item !== id)
        fn()
      }, ms)
      this.timers.push(id)
      return id
    },
    clearTimers() {
      this.timers.forEach((id) => clearTimeout(id))
      this.timers = []
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    },
    stop(emitHide) {
      this.running = false
      this.clicking = false
      this.clearTimers()
      this.visible = false
      this.clickCount = 0
      this.handPos = { x: 0, y: 0, opacity: 0 }
      if (emitHide) this.$emit('hide')
    },
    dismiss() {
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch (e) {
        /* ignore */
      }
      this.stop(true)
      this.$emit('dismiss')
    }
  }
}
</script>

<style scoped>
.novice-guide {
  position: fixed;
  inset: 0;
  z-index: 4000;
  pointer-events: none;
}
.novice-guide__blocker {
  position: absolute;
  inset: 0;
  pointer-events: auto;
}
.novice-guide__hole {
  position: fixed;
  z-index: 1201;
  border-radius: 10px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.52);
  pointer-events: none;
  transform: translateZ(0);
  backface-visibility: hidden;
}
.novice-guide__tip {
  position: fixed;
  z-index: 1202;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
  text-align: center;
}
.novice-guide__text {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  white-space: nowrap;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.novice-guide__btn {
  min-width: 72px;
  height: 32px;
  padding: 5px 16px;
  border-radius: 24px;
  border: 1px solid #fff;
  background: rgba(46, 45, 45, 0.2);
  color: #fff;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.novice-guide__btn:hover {
  background: rgba(255, 255, 255, 0.12);
}
.novice-guide__hand-wrap {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1203;
  width: 224px;
  height: 224px;
  pointer-events: none;
  will-change: transform;
  backface-visibility: hidden;
}
.novice-guide__hand {
  display: block;
  width: 224px;
  height: 224px;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
}
.novice-guide__ripple {
  position: absolute;
  left: 40px;
  top: 28px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.95);
  opacity: 0;
  transform: scale(0.4);
  pointer-events: none;
}
.novice-guide__ripple.is-active {
  animation: novice-guide-ripple 0.3s cubic-bezier(0.33, 1, 0.68, 1);
}
@keyframes novice-guide-ripple {
  0% {
    opacity: 0.85;
    transform: scale(0.4);
  }
  100% {
    opacity: 0;
    transform: scale(2);
  }
}
</style>
