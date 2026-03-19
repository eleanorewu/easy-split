interface ExchangeRateResponse {
  result: string;
  rates: Record<string, number>;
}

export async function fetchJpyToTwdRate(): Promise<number> {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/JPY');
    if (!response.ok) throw new Error('API fetch failed');
    
    const data: ExchangeRateResponse = await response.json();
    if (data.result === 'success' && data.rates['TWD']) {
      // Return rate rounded to 4 decimals for precision (e.g., 0.2145)
      return Number(data.rates['TWD'].toFixed(4));
    }
    throw new Error('Invalid rate data');
  } catch (error) {
    console.error('Failed to fetch JPY/TWD rate:', error);
    // Fallback to a static approximate rate if API fails (approx 2024 JPY/TWD)
    return 0.21; 
  }
}
