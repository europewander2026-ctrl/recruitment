export function getCurrencySuffix(countryName: string): string {
    if (!countryName) return '$';
    const normalized = countryName.toLowerCase().trim();
    
    switch (normalized) {
        case 'united arab emirates':
        case 'united arab emirates (uae)':
        case 'uae':
            return 'AED';
        case 'saudi arabia':
            return 'SAR';
        case 'kuwait':
            return 'KWD';
        case 'qatar':
            return 'QAR';
        case 'oman':
            return 'OMR';
        case 'bahrain':
            return 'BHD';
        case 'serbia':
            return 'RSD';
        case 'poland':
            return 'zł';
        case 'czech republic':
            return 'Kč';
        case 'lithuania':
        case 'latvia':
        case 'portugal':
        case 'germany':
            return '€';
        default:
            return '$';
    }
}

export function formatSalary(amount: string, country: string, period: string = 'month'): string {
    if (!amount) return 'Competitive Salary';
    const currency = getCurrencySuffix(country);
    
    let formattedAmount = '';
    // If it's a symbol like €, $, prepend it
    if (['€', '$'].includes(currency)) {
        formattedAmount = `${currency}${amount}`;
    } else {
        // If it's an alphabetical code or trailing symbol, append it with space
        formattedAmount = `${amount} ${currency}`;
    }
    
    return `${formattedAmount} / ${period}`;
}
