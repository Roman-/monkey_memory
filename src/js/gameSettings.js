export const defaultSettings = {
    gridNumRows: 6,
    gridNumCols: 5,
    numNumbers: 3,
    cellsDisappear: false,
};

export const gameSettingsKey = 'MonkeyMemory-settings'

export const getInitialSettings = () => {
    const savedSettings = localStorage.getItem(gameSettingsKey);
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
}
