<script setup>
import { ref, reactive, onMounted } from 'vue';

const gridNumRows = 8;
const gridNumCols = 8;
const numNumbers = 3; // Numbers from 1 to K
const cellSize = ref(10); // Cell size in pixels
const totalCells = gridNumRows * gridNumCols

const adjustCellSize = () => {
  // set cellSize depending on monitor size so that the grid fits in the display perfectly
  const screenMinSize = Math.min(window.innerWidth, window.innerHeight);
  const gridMaxCells = Math.max(gridNumRows, gridNumCols);
  cellSize.value = Math.floor(screenMinSize / gridMaxCells) * 0.8;
  console.log("cellSize.value", cellSize.value);
}

onMounted(() => {
  adjustCellSize()
  generateGrid()
})

const currentNumber = ref(1);
const gameOver = ref(false);
const message = ref('');

const grid = reactive([]);

function generateGrid() {
  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    cells.push({
      id: i,
      hasNumber: false,
      number: null,
      isRevealed: false,
    });
  }

  const indices = Array.from({ length: totalCells }, (_, i) => i);
  shuffleArray(indices);
  const selectedIndices = indices.slice(0, numNumbers);

  for (let i = 0; i < numNumbers; i++) {
    const index = selectedIndices[i];
    cells[index].hasNumber = true;
    cells[index].number = i + 1;
    cells[index].isRevealed = true;
  }

  grid.splice(0, grid.length, ...cells);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function handleCellClick(cell) {
  if (gameOver.value || !cell.hasNumber) {
    return;
  }

  if (cell.number === currentNumber.value) {
    cell.isRevealed = true;
    if (currentNumber.value === 1) {
      grid.forEach((c) => {
        if (c.number !== 1) {
          c.isRevealed = false;
        }
      });
    }
    currentNumber.value++;
    if (currentNumber.value > numNumbers) {
      message.value = 'Congratulations! You completed the game.';
      gameOver.value = true;
    }
  } else {
    message.value = `Wrong cell! You should click on number ${currentNumber.value}.`;
    gameOver.value = true;
  }
}

function resetGame() {
  currentNumber.value = 1;
  message.value = '';
  gameOver.value = false;
  generateGrid();
}

</script>

<template>
  <div class="flex items-start justify-center min-h-screen" @resize="adjustCellSize">
    <div class="flex flex-col items-center">
      <div
          class="grid gap-3"
          :style="{ gridTemplateColumns: 'repeat(' + gridNumCols + ', ' + cellSize + 'px)' }"
      >
        <div
            v-for="cell in grid"
            :key="cell.id"
            @click="handleCellClick(cell)"
            class="flex items-center justify-center cursor-pointer text-xl font-bold rounded"
            :class="cell.hasNumber ? (cell.isRevealed ? 'bg-white border border-black' : 'bg-gray-300 border border-black') : 'bg-none'"
            :style="{ width: cellSize + 'px', height: cellSize + 'px' }"
        >
          <span v-if="cell.isRevealed && cell.hasNumber">{{ cell.number }}</span>
        </div>
      </div>
      <p v-if="message" class="mt-2">{{ message }}</p>
      <button class="btn btn-primary mt-4" @click="resetGame">Reset Game</button>
    </div>
  </div>
</template>
