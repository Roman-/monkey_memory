export const defaultSettings = {
    difficulty: 3,
    fixedDifficulty: false,
    gridNumRows: 6,
    gridNumCols: 5,
    numNumbers: 3,
    numGames: 0, // 0 means unlimited
    showGifPictures: false,
};

export const gameSettingsKey = 'MonkeyMemory-settings'

export const getInitialSettings = () => {
    const savedSettings = localStorage.getItem(gameSettingsKey);
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
}
