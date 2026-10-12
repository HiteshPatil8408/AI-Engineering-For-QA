import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from mcp.server.fastmcp import FastMCP
from quality.data import incidents
mcp=FastMCP('synthetic-ci-readonly')
@mcp.tool()
def read_failure(failure_id:str)->dict:
 """Read one approved alpha-tenant synthetic CI failure by stable ID."""
 row=next((r for r in incidents() if r['id']==failure_id and r['tenant']=='alpha'),None)
 if not row:raise ValueError('Unknown or unauthorized fixture')
 return row
@mcp.tool()
def search_history(query:str)->list[dict]:
 """Search alpha fixture history. No filesystem or network access."""
 if len(query)>1000:raise ValueError('query too long')
 return [r for r in incidents() if r['tenant']=='alpha' and query.lower() in r['log'].lower()][:5]
@mcp.resource('fixture://ci/schema')
def fixture_schema()->str:return 'Synthetic CI: id, tenant, group, module, category, log, duration_ms'
if __name__=='__main__':mcp.run(transport='stdio')
