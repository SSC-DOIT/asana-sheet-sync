import { ParsedTicket, parseAsanaJSON } from "./asanaJsonParser";

// Lazy load data files
const loadTIEData = async () => {
  const [
    jan, feb, mar, apr, may, jun, jul, aug, sep, oct
  ] = await Promise.all([
    import("@/data/tie-2025-01.json"),
    import("@/data/tie-2025-02.json"),
    import("@/data/tie-2025-03.json"),
    import("@/data/tie-2025-04.json"),
    import("@/data/tie-2025-05.json"),
    import("@/data/tie-2025-06.json"),
    import("@/data/tie-2025-07.json"),
    import("@/data/tie-2025-08.json"),
    import("@/data/tie-2025-09.json"),
    import("@/data/tie-2025-10.json"),
  ]);
  
  return [jan, feb, mar, apr, may, jun, jul, aug, sep, oct];
};

const loadSFDCData = async () => {
  const [
    jan, feb, mar, apr, may, jun, jul, aug, sep, oct
  ] = await Promise.all([
    import("@/data/sfdc-2025-01.json"),
    import("@/data/sfdc-2025-02.json"),
    import("@/data/sfdc-2025-03.json"),
    import("@/data/sfdc-2025-04.json"),
    import("@/data/sfdc-2025-05.json"),
    import("@/data/sfdc-2025-06.json"),
    import("@/data/sfdc-2025-07.json"),
    import("@/data/sfdc-2025-08.json"),
    import("@/data/sfdc-2025-09.json"),
    import("@/data/sfdc-2025-10.json"),
  ]);
  
  return [jan, feb, mar, apr, may, jun, jul, aug, sep, oct];
};

export const loadAndParseData = async (board: "TIE" | "SFDC"): Promise<ParsedTicket[]> => {
  const dataFiles = board === "TIE" ? await loadTIEData() : await loadSFDCData();
  
  const allTickets: ParsedTicket[] = [];
  
  dataFiles.forEach((file) => {
    const parsed = parseAsanaJSON(file.default || file);
    allTickets.push(...parsed);
  });
  
  return allTickets;
};
