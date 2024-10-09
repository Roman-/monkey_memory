<script setup>
import { ref, reactive, onMounted } from 'vue';

const N = 4; // Number of rows
const M = 4; // Number of columns
const K = 3; // Numbers from 1 to K

const totalCells = N * M;

// Initialize the grid
const grid = reactive([]);

// Function to generate the grid
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

  // Randomly select K cells to assign numbers 1..K
  const indices = Array.from({ length: totalCells }, (_, i) => i);
  shuffleArray(indices);
  const selectedIndices = indices.slice(0, K);

  for (let i = 0; i < K; i++) {
    const index = selectedIndices[i];
    cells[index].hasNumber = true;
    cells[index].number = i + 1;
    cells[index].isRevealed = true; // Initially, numbers are shown
  }

  grid.splice(0, grid.length, ...cells);
}

// Utility function to shuffle an array
function shuffleArray(array) {
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Game state
const currentNumber = ref(1);
const gameOver = ref(false);
const message = ref('');

// On component mounted
onMounted(() => {
  generateGrid();
});

// Function to handle cell click
function handleCellClick(cell) {
  if (gameOver.value || !cell.hasNumber) {
    return;
  }

  if (cell.number === currentNumber.value) {
    // Correct cell clicked
    cell.isRevealed = true;
    if (currentNumber.value === 1) {
      // When 1 is clicked, mask all other numbers
      grid.forEach((c) => {
        if (c.number !== 1) {
          c.isRevealed = false;
        }
      });
    }
    currentNumber.value++;
    if (currentNumber.value > K) {
      // Game over, player won
      message.value = 'Congratulations! You completed the game.';
      gameOver.value = true;
    }
  } else {
    // Wrong cell clicked
    message.value = `Wrong cell! You should click on number ${currentNumber.value}.`;
    gameOver.value = true;
  }
}

// Function to reset the game
function resetGame() {
  currentNumber.value = 1;
  message.value = '';
  gameOver.value = false;
  generateGrid();
}
</script>

<template>
  <div>
    <h2>Monkey Memory Game</h2>
    <p v-if="message">{{ message }}</p>
    <div
        :style="{
        display: 'grid',
        gridTemplateColumns: 'repeat(' + M + ', 60px)',
        gridGap: '5px',
      }"
    >
      <div
          v-for="cell in grid"
          :key="cell.id"
          @click="handleCellClick(cell)"
          :style="{
          width: '60px',
          height: '60px',
          border: '1px solid black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: cell.isRevealed ? '#fff' : '#ccc',
          fontSize: '20px',
          fontWeight: 'bold',
        }"
      >
        <span v-if="cell.isRevealed && cell.hasNumber">{{ cell.number }}</span>
      </div>
    </div>
    <button @click="resetGame" style="margin-top: 20px;">Reset Game</button>
  </div>
</template>
