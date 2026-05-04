type DateFormatOptions = {
    withTime?: boolean;
    format?: "long" | "short" | "iso"; // 'long': "01 Jan 2026", 'short': "01/01/2026", 'iso': "2026-01-01"
};

const monthsId = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const monthsIdLong = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const padZero = (n: number): string => String(n).padStart(2, "0");

export const formatDate = (dateStr: string, options: DateFormatOptions = {}) => {
    if (!dateStr) return "-";
    const { withTime = false, format = "long" } = options;

    const date = new Date(dateStr);
    const day = padZero(date.getDate());
    const month = date.getMonth();
    const year = date.getFullYear();

    let datePart = "";
    switch (format) {
        case "short":
            datePart = `${day}/${padZero(month + 1)}/${year}`;
            break;
        case "iso":
            datePart = `${year}-${padZero(month + 1)}-${day}`;
            break;
        case "long":
        default:
            datePart = date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
    }

    if (!withTime) return datePart;

    const timePart = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    return `${datePart} ${timePart}`;
};

export const formatDateShort = (dateStr: string): string => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = padZero(date.getDate());
    const month = monthsId[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};

export const formatDateTimeShort = (dateStr: string): string => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = padZero(date.getDate());
    const month = monthsId[date.getMonth()];
    const year = date.getFullYear();
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
};