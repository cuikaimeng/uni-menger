<template>
	<view class="page" :style="{ height: pageHeightPx ? pageHeightPx + 'px' : '100vh' }">
		<view class="game-container" :style="{ height: pageHeightPx ? pageHeightPx + 'px' : '100vh' }">
			<view id="top-panel" class="top-panel">
				<view class="title-bar">
					<text class="snake-icon">🐍</text>
					<text class="title">萌二贪吃蛇</text>
				</view>
				<view class="game-controls">
					<view class="controls">
						<button class="control-btn" :disabled="isPlaying" @click="startGame">开始游戏</button>
						<button class="control-btn" :disabled="!isPlaying" @click="togglePause">
							{{ isPaused ? '继续游戏' : '暂停游戏' }}
						</button>
					</view>
					<view class="score-board">
						<text class="score-item">最高分: {{ bestScore }}</text>
						<text class="score-item">当前得分: {{ score }}</text>
					</view>
				</view>
			</view>

			<view id="game-area" class="game-area">
				<canvas
					id="game-canvas"
					canvas-id="game-canvas"
					:width="canvasPx"
					:height="canvasPx"
					:style="{ width: canvasPx + 'px', height: canvasPx + 'px' }"
					class="game-canvas"
				/>

				<view v-show="showOverlay" class="game-over-overlay">
					<text class="game-over-title">游戏结束</text>
					<text class="game-over-score">最终得分: {{ finalScore }}</text>
					<button class="restart-btn" @click="restart">再玩一次</button>
				</view>
			</view>

			<view id="bottom-panel" class="bottom-panel">
				<view class="d-pad">
					<view class="d-pad-row">
						<button class="d-pad-btn up" @touchstart.stop.prevent="setDirection('UP')" @mousedown.stop.prevent="setDirection('UP')">↑</button>
					</view>
					<view class="d-pad-row">
						<button class="d-pad-btn left" @touchstart.stop.prevent="setDirection('LEFT')" @mousedown.stop.prevent="setDirection('LEFT')">←</button>
						<button class="d-pad-btn down" @touchstart.stop.prevent="setDirection('DOWN')" @mousedown.stop.prevent="setDirection('DOWN')">↓</button>
						<button class="d-pad-btn right" @touchstart.stop.prevent="setDirection('RIGHT')" @mousedown.stop.prevent="setDirection('RIGHT')">→</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue'

const gridSize = 25
const maxFoodCount = 2

const bestScore = ref(Number(uni.getStorageSync('snake-best-score') || 0))
const score = ref(0)
const finalScore = ref(0)
const isPlaying = ref(false)
const isPaused = ref(false)
const showOverlay = ref(false)

const pageHeightPx = ref(0)
const canvasPx = ref(320)
const squareSize = computed(() => canvasPx.value / gridSize)

const snake = ref([])
const foods = ref([])
const traps = ref([])
const direction = ref('RIGHT')
const nextDirection = ref('RIGHT')
const speed = ref(500)

let ctx = null
let loopTimer = null
let keydownHandler = null

const instance = getCurrentInstance()

const clearLoop = () => {
	if (loopTimer) {
		clearTimeout(loopTimer)
		loopTimer = null
	}
}

const updateBestScore = () => {
	uni.setStorageSync('snake-best-score', bestScore.value)
}

const updateScore = () => {
	if (score.value > bestScore.value) {
		bestScore.value = score.value
		updateBestScore()
	}
}

const spawnFood = () => {
	if (foods.value.length >= maxFoodCount) return

	let newFood = null
	let collision = true

	while (collision) {
		newFood = {
			x: Math.floor(Math.random() * gridSize),
			y: Math.floor(Math.random() * gridSize),
		}

		collision = snake.value.some((seg) => seg.x === newFood.x && seg.y === newFood.y)
		if (!collision) collision = foods.value.some((f) => f.x === newFood.x && f.y === newFood.y)
		if (!collision) collision = traps.value.some((t) => t.x === newFood.x && t.y === newFood.y)
	}

	foods.value.push(newFood)
}

const spawnTrap = () => {
	let newTrap = null
	let collision = true

	while (collision) {
		newTrap = {
			x: Math.floor(Math.random() * gridSize),
			y: Math.floor(Math.random() * gridSize),
		}

		collision = snake.value.some((seg) => seg.x === newTrap.x && seg.y === newTrap.y)
		if (!collision) collision = foods.value.some((f) => f.x === newTrap.x && f.y === newTrap.y)
		if (!collision) collision = traps.value.some((t) => t.x === newTrap.x && t.y === newTrap.y)
	}

	traps.value.push(newTrap)
}

const reset = () => {
	const mid = Math.floor(gridSize / 2)
	snake.value = [
		{ x: mid, y: mid },
		{ x: mid - 1, y: mid },
		{ x: mid - 2, y: mid },
	]
	direction.value = 'RIGHT'
	nextDirection.value = 'RIGHT'
	score.value = 0
	speed.value = 100
	foods.value = []
	traps.value = []
	spawnFood()
	spawnFood()
	spawnTrap()
	finalScore.value = 0
	showOverlay.value = false
	draw()
}

const setDirection = (dir) => {
	if (!isPlaying.value || isPaused.value) return

	const opposites = {
		UP: 'DOWN',
		DOWN: 'UP',
		LEFT: 'RIGHT',
		RIGHT: 'LEFT',
	}

	if (dir !== opposites[direction.value]) {
		nextDirection.value = dir
	}
}

const gameOver = () => {
	isPlaying.value = false
	isPaused.value = false
	clearLoop()
	finalScore.value = score.value
	showOverlay.value = true
}

const update = () => {
	direction.value = nextDirection.value

	const head = { ...snake.value[0] }
	switch (direction.value) {
		case 'UP':
			head.y--
			break
		case 'DOWN':
			head.y++
			break
		case 'LEFT':
			head.x--
			break
		case 'RIGHT':
			head.x++
			break
		default:
			break
	}

	if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
		gameOver()
		return
	}

	if (snake.value.some((seg) => seg.x === head.x && seg.y === head.y)) {
		gameOver()
		return
	}

	if (traps.value.some((t) => t.x === head.x && t.y === head.y)) {
		gameOver()
		return
	}

	snake.value.unshift(head)

	const foodIndex = foods.value.findIndex((f) => f.x === head.x && f.y === head.y)
	if (foodIndex !== -1) {
		const oldScore = score.value
		score.value += 10
		updateScore()
		foods.value.splice(foodIndex, 1)
		spawnFood()

		if (Math.floor(score.value / 50) > Math.floor(oldScore / 50)) {
			spawnTrap()
		}

		if (speed.value > 50) speed.value -= 1
	} else {
		snake.value.pop()
	}
}

const draw = () => {
	if (!ctx) return

	const size = canvasPx.value
	ctx.setFillStyle('#000')
	ctx.fillRect(0, 0, size, size)

	snake.value.forEach((seg, index) => {
		ctx.setFillStyle(index === 0 ? '#4caf50' : '#8bc34a')
		ctx.fillRect(seg.x * squareSize.value + 1, seg.y * squareSize.value + 1, squareSize.value - 2, squareSize.value - 2)
	})

	ctx.setFillStyle('#8bc34a')
	foods.value.forEach((food) => {
		const centerX = food.x * squareSize.value + squareSize.value / 2
		const centerY = food.y * squareSize.value + squareSize.value / 2
		ctx.beginPath()
		ctx.arc(centerX, centerY, squareSize.value / 2 - 1, 0, Math.PI * 2)
		ctx.fill()
	})

	ctx.setFillStyle('#e74c3c')
	traps.value.forEach((trap) => {
		ctx.fillRect(trap.x * squareSize.value + 1, trap.y * squareSize.value + 1, squareSize.value - 2, squareSize.value - 2)
	})

	ctx.draw()
}

const run = () => {
	if (!isPlaying.value || isPaused.value) return
	update()
	draw()
	loopTimer = setTimeout(() => run(), speed.value)
}

const startGame = () => {
	if (isPlaying.value) return
	reset()
	isPlaying.value = true
	isPaused.value = false
	run()
}

const togglePause = () => {
	if (!isPlaying.value) return
	isPaused.value = !isPaused.value
	if (isPaused.value) {
		clearLoop()
	} else {
		run()
	}
}

const restart = () => {
	showOverlay.value = false
	isPlaying.value = false
	isPaused.value = false
	startGame()
}

const updateCanvasSize = () => {
	return new Promise((resolve) => {
		const query = uni.createSelectorQuery().in(instance)
		query
			.select('#game-area')
			.boundingClientRect((rect) => {
				const size = Math.floor(Math.min(rect.width, rect.height) - 20)
				canvasPx.value = Math.max(80, size)
				resolve()
			})
			.exec()
	})
}

const updateLayout = async () => {
	const sys = uni.getSystemInfoSync()
	pageHeightPx.value = sys.windowHeight || 0
	await nextTick()
	await updateCanvasSize()
	draw()
}

onMounted(async () => {
	await updateLayout()
	ctx = uni.createCanvasContext('game-canvas', instance)
	reset()

	if (typeof document !== 'undefined' && typeof window !== 'undefined') {
		keydownHandler = (e) => {
			switch (e.key) {
				case 'ArrowUp':
				case 'w':
				case 'W':
					setDirection('UP')
					break
				case 'ArrowDown':
				case 's':
				case 'S':
					setDirection('DOWN')
					break
				case 'ArrowLeft':
				case 'a':
				case 'A':
					setDirection('LEFT')
					break
				case 'ArrowRight':
				case 'd':
				case 'D':
					setDirection('RIGHT')
					break
				default:
					break
			}
		}
		document.addEventListener('keydown', keydownHandler)
	}

	uni.onWindowResize(async () => {
		const wasPlaying = isPlaying.value
		const wasPaused = isPaused.value
		clearLoop()
		await updateLayout()
		if (wasPlaying && !wasPaused) {
			run()
		}
	})
})

onUnmounted(() => {
	clearLoop()
	if (keydownHandler && typeof document !== 'undefined') {
		document.removeEventListener('keydown', keydownHandler)
	}
})
</script>

<style scoped lang="scss">
.page {
	background-color: #2c3e50;
	width: 100%;
	display: flex;
	justify-content: center;
}

.game-container {
	width: 100%;
	max-width: 500px;
	display: flex;
	flex-direction: column;
	background-color: #ecf0f1;
}

.top-panel {
	padding: clamp(10px, 3.5vw, 15px);
	padding-top: calc(clamp(10px, 3.5vw, 15px) + constant(safe-area-inset-top));
	padding-top: calc(clamp(10px, 3.5vw, 15px) + env(safe-area-inset-top));
	background-color: #34495e;
	color: #fff;
	text-align: center;
	border-bottom: 3px solid #2c3e50;
}

.title-bar {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 15px;
}

.snake-icon {
	font-size: 24px;
	margin-right: 10px;
}

.title {
	font-size: clamp(18px, 4.5vw, 20px);
	font-weight: bold;
	color: #4caf50;
}

.game-controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.controls {
	display: flex;
}

.control-btn {
	padding: clamp(8px, 2.5vw, 10px) clamp(10px, 3vw, 14px);
	font-size: clamp(12px, 3.2vw, 14px);
	margin-right: 10px;
	border: none;
	border-radius: 5px;
	background-color: #4caf50;
	color: #fff;
	line-height: 1;
}

.control-btn[disabled] {
	opacity: 0.5;
}

.score-board {
	font-size: clamp(12px, 3vw, 13px);
	text-align: right;
	display: flex;
	gap: 12px;
}

.score-item {
	white-space: nowrap;
}

.game-area {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #34495e;
	overflow: hidden;
	padding: clamp(8px, 2.5vw, 10px);
	position: relative;
}

.game-canvas {
	background-color: #bdc3c7;
	border-radius: 4px;
}

.game-over-overlay {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: rgba(44, 62, 80, 0.9);
	color: #fff;
	padding: 30px;
	border-radius: 10px;
	text-align: center;
	z-index: 10;
	width: 80%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.game-over-title {
	font-size: 22px;
	margin-bottom: 12px;
	color: #e74c3c;
}

.game-over-score {
	font-size: 16px;
	margin-bottom: 18px;
}

.restart-btn {
	padding: 12px 20px;
	font-size: 16px;
	background-color: #2ecc71;
	color: #fff;
	border: none;
	border-radius: 6px;
	line-height: 1;
}

.bottom-panel {
	padding: clamp(12px, 3.8vw, 20px);
	padding-bottom: calc(clamp(12px, 3.8vw, 20px) + constant(safe-area-inset-bottom));
	padding-bottom: calc(clamp(12px, 3.8vw, 20px) + env(safe-area-inset-bottom));
	background-color: #34495e;
	display: flex;
	justify-content: center;
	align-items: center;
	border-top: 3px solid #2c3e50;
}

.d-pad {
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
}

.d-pad-row {
	display: flex;
	gap: 10px;
	justify-content: center;
}

.d-pad-btn {
	width: clamp(44px, 12vw, 60px);
	height: clamp(44px, 12vw, 60px);
	font-size: clamp(20px, 6vw, 28px);
	font-weight: bold;
	background-color: #555;
	color: #fff;
	border: none;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.d-pad-btn:active {
	background-color: #777;
}

.d-pad-btn.up {
	background-color: #ff9800;
}

.d-pad-btn.down {
	background-color: #2196f3;
}

.d-pad-btn.left {
	background-color: #f44336;
}

.d-pad-btn.right {
	background-color: #4caf50;
}
</style>
