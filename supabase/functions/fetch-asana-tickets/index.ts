import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AsanaTask {
  gid: string;
  created_at: string;
  modified_at?: string;
  completed_at?: string | null;
  name?: string;
  assignee?: {
    name: string;
    gid: string;
  } | null;
  custom_fields?: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectGid } = await req.json();
    
    if (!projectGid) {
      return new Response(
        JSON.stringify({ error: 'projectGid is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const ASANA_TOKEN = Deno.env.get('ASANA_ACCESS_TOKEN');
    if (!ASANA_TOKEN) {
      console.error('ASANA_ACCESS_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Fetching tasks for project: ${projectGid}`);

    // Fetch tasks from Asana with all fields
    const response = await fetch(
      `https://app.asana.com/api/1.0/tasks?project=${projectGid}&opt_fields=gid,name,created_at,modified_at,completed,completed_at,assignee,assignee.name,custom_fields,custom_fields.name,custom_fields.enum_value,custom_fields.number_value,custom_fields.date_value,custom_fields.text_value&limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${ASANA_TOKEN}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Asana API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch from Asana',
          details: errorText 
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    console.log(`Fetched ${data.data?.length || 0} tasks`);

    // Fetch additional pages if there are more tasks
    let allTasks: AsanaTask[] = data.data || [];
    let nextPage = data.next_page?.offset;

    while (nextPage) {
      console.log(`Fetching next page with offset: ${nextPage}`);
      const pageResponse = await fetch(
        `https://app.asana.com/api/1.0/tasks?project=${projectGid}&opt_fields=gid,name,created_at,modified_at,completed,completed_at,assignee,assignee.name,custom_fields,custom_fields.name,custom_fields.enum_value,custom_fields.number_value,custom_fields.date_value,custom_fields.text_value&limit=100&offset=${nextPage}`,
        {
          headers: {
            'Authorization': `Bearer ${ASANA_TOKEN}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!pageResponse.ok) break;
      
      const pageData = await pageResponse.json();
      allTasks = [...allTasks, ...(pageData.data || [])];
      nextPage = pageData.next_page?.offset;
    }

    console.log(`Total tasks fetched: ${allTasks.length}`);

    return new Response(
      JSON.stringify({ data: allTasks }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in fetch-asana-tickets:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
