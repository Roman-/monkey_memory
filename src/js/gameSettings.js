export const defaultSettings = {
    difficulty: 3,
    fixedDifficulty: false,
    gridNumRows: 6,
    gridNumCols: 5,
    numNumbers: 3,
    numGames: 0, // 0 means unlimited
    loosePenaltySec: 0,
    showGifPictures: false,
};

export const gameSettingsKey = 'MonkeyMemory-settings'

export const getInitialSettings = () => {
    const savedSettings = localStorage.getItem(gameSettingsKey);
    let result = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    // for each key, if it's not in the saved settings, set it to the default value
    for (const key in defaultSettings) {
        if (result[key] === undefined) {
            result[key] = defaultSettings[key];
        }
    }
    return result;
}
