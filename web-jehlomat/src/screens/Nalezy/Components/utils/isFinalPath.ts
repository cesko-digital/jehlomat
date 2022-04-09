const isFinalPath = (value: string): boolean => {
    const { pathname } = window.location;
    const parts = pathname.split('/');
    const last = parts[Math.max(parts.length - 1, 0)];

    return last.toLocaleLowerCase() === value.toLocaleLowerCase();
};

export default isFinalPath;
