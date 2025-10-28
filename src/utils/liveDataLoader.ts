import { EnhancedParsedTicket } from "./enhancedDataLoader";
import { parseEnhancedAsanaJSON } from "./enhancedDataLoader";
import { ASANA_PROJECTS } from "@/config/asanaProjects";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface AsanaResponse {
  data: any[];
}

export const fetchLiveAsanaData = async (
  board: "TIE" | "SFDC",
  includeArchive: boolean = true
): Promise<EnhancedParsedTicket[]> => {
  const projectGid = ASANA_PROJECTS[board];
  const archiveGid = ASANA_PROJECTS[`${board}_ARCHIVE` as keyof typeof ASANA_PROJECTS];

  if (!projectGid || projectGid.includes("YOUR_")) {
    throw new Error(
      `Please configure the ${board} project GID in src/config/asanaProjects.ts`
    );
  }

  try {
    // Fetch main board data
    const mainResponse = await fetch(
      `${SUPABASE_URL}/functions/v1/fetch-asana-tickets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectGid }),
      }
    );

    if (!mainResponse.ok) {
      const errorData = await mainResponse.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch live data: ${mainResponse.status} ${
          errorData.error || mainResponse.statusText
        }`
      );
    }

    const mainData: AsanaResponse = await mainResponse.json();
    let allTickets = parseEnhancedAsanaJSON(mainData);

    // Fetch archive data if requested and configured
    if (includeArchive && archiveGid && !archiveGid.includes("YOUR_")) {
      try {
        const archiveResponse = await fetch(
          `${SUPABASE_URL}/functions/v1/fetch-asana-tickets`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ projectGid: archiveGid }),
          }
        );

        if (archiveResponse.ok) {
          const archiveData: AsanaResponse = await archiveResponse.json();
          const archiveTickets = parseEnhancedAsanaJSON(archiveData);
          allTickets = [...allTickets, ...archiveTickets];
        }
      } catch (archiveError) {
        console.warn(`Could not fetch archive data for ${board}:`, archiveError);
        // Continue with main board data only
      }
    }

    return allTickets;
  } catch (error) {
    console.error(`Error fetching live ${board} data:`, error);
    throw error;
  }
};

// Wrapper to maintain compatibility with existing code
export const loadLiveData = async (
  board: "TIE" | "SFDC",
  includeArchive: boolean = true
): Promise<EnhancedParsedTicket[]> => {
  return fetchLiveAsanaData(board, includeArchive);
};
