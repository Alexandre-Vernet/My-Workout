export const removeAccents = (str: string) => {
    return str.toLowerCase()
        .normalize('NFD')                // Decomposes accented characters into base characters + diacritics
        .replace(/[\u0300-\u036f]/g, '') // Removes diacritical marks (accents)
        .trim();                         // Removes leading and trailing whitespace
};

export const replaceSpaces = (str: string) => {
    return removeAccents(str).replace(' ', '-');
}
