export const toTime = (time?: string | null) => {
    if (!time) return null;

    return new Date(`1970-01-01T${time}:00.000Z`);
};