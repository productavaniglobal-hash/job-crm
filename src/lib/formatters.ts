export function formatCurrency(value: number | string, currencyCode: string = 'USD') {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return `$0`;

    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            maximumFractionDigits: 0
        }).format(num);
    } catch (e) {
        // Fallback for invalid currency codes
        return `$${num.toLocaleString('en-US')}`;
    }
}

export function formatDateTime(dateString: string | Date | null, timezone?: string) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        
        // Extract exact IANA string if possible, otherwise rely on browser default
        let timeZoneConfig: string | undefined = undefined;
        if (timezone?.includes('Eastern')) timeZoneConfig = 'America/New_York';
        else if (timezone?.includes('Pacific')) timeZoneConfig = 'America/Los_Angeles';
        else if (timezone?.includes('London')) timeZoneConfig = 'Europe/London';
        else if (timezone?.includes('Mumbai')) timeZoneConfig = 'Asia/Kolkata';

        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZone: timeZoneConfig
        }).format(date);
    } catch (e) {
        return new Date(dateString).toLocaleDateString();
    }
}
