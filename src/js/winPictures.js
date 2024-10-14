import {shuffle} from "@/js/helpers";

export const numWinPics = 12; // from 1 to 12

const winPictureUrl = (index) => `img/game-over/win${index}.webp`

let winPictureIndexes = shuffle(new Array(numWinPics).fill(0).map((_, i) => i + 1))
let currentWinPictureIndex = 0

export const getWinPictureUrl = () => {
    if (currentWinPictureIndex >= winPictureIndexes.length) {
        winPictureIndexes = shuffle(new Array(numWinPics).fill(0).map((_, i) => i + 1))
        currentWinPictureIndex = 0
    }
    return winPictureUrl(winPictureIndexes[currentWinPictureIndex++])
}
