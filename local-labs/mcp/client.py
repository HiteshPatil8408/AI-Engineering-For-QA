import asyncio,sys,json
from pathlib import Path
from mcp import ClientSession,StdioServerParameters
from mcp.client.stdio import stdio_client
async def smoke():
 params=StdioServerParameters(command=sys.executable,args=[str(Path(__file__).with_name('server.py'))])
 async with stdio_client(params) as (read,write):
  async with ClientSession(read,write) as session:
   initialized=await session.initialize();tools=await session.list_tools()
   assert {t.name for t in tools.tools}=={'read_failure','search_history'}
   result=await session.call_tool('read_failure',{'failure_id':'F001'})
   assert not result.isError
   denied=await session.call_tool('read_failure',{'failure_id':'../secret'})
   assert denied.isError
   return {'initialized':True,'protocol_version':initialized.protocolVersion,'tools':[t.name for t in tools.tools],'result':[c.text for c in result.content if hasattr(c,'text')],'path_traversal_denied':denied.isError}
if __name__=='__main__':print(json.dumps(asyncio.run(smoke()),indent=2))
