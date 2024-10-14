export const defaultSettings = {
    difficulty: 3,
    suggestIncreaseDifficulty: true,
    gridNumRows: 6,
    gridNumCols: 5,
    numNumbers: 3,
    fontSize: 5, // {fontSize}xl in tailwind
    cellsDisappearOnClick: false,
    showGifPictures: false,
};

export const gameSettingsKey = 'MonkeyMemory-settings'

export const getInitialSettings = () => {
    const savedSettings = localStorage.getItem(gameSettingsKey);
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
}
