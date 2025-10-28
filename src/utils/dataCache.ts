import { EnhancedParsedTicket } from "./enhancedDataLoader";

interface CacheData {
  data: EnhancedParsedTicket[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedData = (key: string): EnhancedParsedTicket[] | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp }: CacheData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }

    // Cache expired, remove it
    localStorage.removeItem(key);
    return null;
  } catch (error) {
    console.error("Error reading cache:", error);
    return null;
  }
};

export const setCachedData = (key: string, data: EnhancedParsedTicket[]): void => {
  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error setting cache:", error);
  }
};

export const clearCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("asana-data-")) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

// Filter tickets to rolling 12 months
export const filterLast12Months = (tickets: EnhancedParsedTicket[]): EnhancedParsedTicket[] => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  return tickets.filter((ticket) => {
    const createdDate = new Date(ticket.createdAt);
    return createdDate >= twelveMonthsAgo;
  });
};
