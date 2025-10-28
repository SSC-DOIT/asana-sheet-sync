import { EnhancedParsedTicket } from "./enhancedDataLoader";
import { parseEnhancedAsanaJSON } from "./enhancedDataLoader";
import { ASANA_PROJECTS } from "@/config/asanaProjects";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface AsanaResponse {
  data: any[];
}

export const fetchLiveAsanaData = async (
  board: "TIE" | "SFDC"
): Promise<EnhancedParsedTicket[]> => {
  const projectGid = ASANA_PROJECTS[board];

  if (!projectGid || projectGid.includes("YOUR_")) {
    throw new Error(
      `Please configure the ${board} project GID in src/config/asanaProjects.ts`
    );
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/fetch-asana-tickets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectGid }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch live data: ${response.status} ${
          errorData.error || response.statusText
        }`
      );
    }

    const data: AsanaResponse = await response.json();
    return parseEnhancedAsanaJSON(data);
  } catch (error) {
    console.error(`Error fetching live ${board} data:`, error);
    throw error;
  }
};

// Wrapper to maintain compatibility with existing code
export const loadLiveData = async (
  board: "TIE" | "SFDC"
): Promise<EnhancedParsedTicket[]> => {
  return fetchLiveAsanaData(board);
};
