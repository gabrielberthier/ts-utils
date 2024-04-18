export function ExcelDateToJSDate(serial: number) {
    return new Date((serial - (25567 + 1)) * 86400 * 1000);
}