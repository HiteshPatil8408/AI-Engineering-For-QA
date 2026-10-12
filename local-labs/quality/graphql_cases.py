"""Real GraphQL schema/AST validation and executable candidate cases."""
from graphql import build_schema,parse,validate,graphql_sync
SCHEMA='''enum Role { VIEWER EDITOR }
type Item { id: ID!, quantity: Int!, role: Role! }
type Query { item(id: ID!): Item }
type Mutation { createItem(quantity: Int!, role: Role!): Item! }'''
def schema(principal='editor'):
 s=build_schema(SCHEMA)
 def create(_root,info,quantity,role):
  if principal!='editor':raise PermissionError('Unauthorized')
  if not 1<=quantity<=100:raise ValueError('quantity must be 1..100')
  return {'id':'I1','quantity':quantity,'role':role}
 s.get_type('Mutation').fields['createItem'].resolve=create
 s.get_type('Query').fields['item'].resolve=lambda _root,info,id:{'id':id,'quantity':1,'role':'VIEWER'}
 return s
CASES=[
 {'id':'positive','requirement':'quantity-valid','query':'mutation { createItem(quantity: 1, role: EDITOR) { id quantity } }','principal':'editor','error':False},
 {'id':'missing-required','requirement':'quantity-required','query':'mutation { createItem(role: EDITOR) { id } }','principal':'editor','error':True},
 {'id':'invalid-enum','requirement':'role-enum','query':'mutation { createItem(quantity: 1, role: ADMIN) { id } }','principal':'editor','error':True},
 {'id':'lower-boundary','requirement':'quantity-min','query':'mutation { createItem(quantity: 0, role: EDITOR) { id } }','principal':'editor','error':True},
 {'id':'upper-boundary','requirement':'quantity-max','query':'mutation { createItem(quantity: 101, role: EDITOR) { id } }','principal':'editor','error':True},
 {'id':'authorization','requirement':'editor-only','query':'mutation { createItem(quantity: 1, role: EDITOR) { id } }','principal':'viewer','error':True},
 {'id':'unknown-field','requirement':'schema-fields','query':'{ item(id: "I1") { password } }','principal':'editor','error':True}]
def export_pytest(cases=None):
 data='from quality.graphql_cases import CASES, execute\n' if cases is None else 'from quality.graphql_cases import execute\nCASES='+repr(cases)+'\n'
 return data+ 'import pytest\n@pytest.mark.parametrize("case", CASES, ids=lambda c:c["id"])\ndef test_candidate(case):\n    assert execute(case)["passed"]\n'

# Replace the initial fixed-case generator with operation-derived candidates.
# The fixed CASES above remain an independent acceptance suite for the resolver.
def candidates(operation,variables=None):
 from dataclasses import replace
 from graphql import print_ast,visit,Visitor
 from graphql.language import ast
 document=parse(operation);errors=validate(schema(),document)
 if errors:raise ValueError('; '.join(e.message for e in errors))
 operations=[d for d in document.definitions if isinstance(d,ast.OperationDefinitionNode)]
 if len(operations)!=1 or len(operations[0].selection_set.selections)!=1:raise ValueError('Teaching generator supports one operation with one root field')
 op=operations[0];var_types={v.variable.name.value:print_ast(v.type).replace('!','') for v in op.variable_definitions or ()}
 vars=variables or {}
 def value_node(name):
  if name not in vars:raise ValueError('Missing variable '+name)
  value=vars[name];kind=var_types[name]
  if value is None:return ast.NullValueNode()
  if kind=='Role':return ast.EnumValueNode(value=str(value))
  if kind=='Int':return ast.IntValueNode(value=str(value))
  return ast.StringValueNode(value=str(value))
 expanded=replace(document,definitions=(replace(op,variable_definitions=()),))
 class Inline(Visitor):
  def enter_variable(self,node,*_):return value_node(node.name.value)
 expanded=visit(expanded,Inline());field=expanded.definitions[0].selection_set.selections[0]
 if not isinstance(field,ast.FieldNode) or field.name.value not in {'item','createItem'}:raise ValueError('Unsupported fixture operation')
 name=field.name.value
 def altered(arg=None,node=None,remove=False,unknown=False):
  f=field
  if arg:
   args=tuple(a for a in f.arguments if not(remove and a.name.value==arg))
   if not remove:args=tuple(replace(a,value=node) if a.name.value==arg else a for a in args)
   f=replace(f,arguments=args)
  if unknown:f=replace(f,selection_set=replace(f.selection_set,selections=(*f.selection_set.selections,ast.FieldNode(name=ast.NameNode(value='password')))))
  changed_op=replace(expanded.definitions[0],selection_set=replace(expanded.definitions[0].selection_set,selections=(f,)))
  doc=replace(expanded,definitions=(changed_op,))
  return print_ast(doc)
 values={a.name.value:getattr(a.value,'value',None) for a in field.arguments}
 if name=='createItem':
  quantity=int(values['quantity']);role=values['role']
  if not 1<=quantity<=100:raise ValueError('Provide a valid operation as the positive seed')
  obj={'id':'I1','quantity':quantity,'role':role}
 else:obj={'id':values['id'],'quantity':1,'role':'VIEWER'}
 expected={s.alias.value if s.alias else s.name.value:obj[s.name.value] for s in field.selection_set.selections}
 root=field.alias.value if field.alias else name
 cases=[{'id':'positive','requirement':'operation-contract','query':print_ast(expanded),'principal':'editor','error':False,'expected':{root:expected}}]
 required='quantity' if name=='createItem' else 'id'
 cases.append({'id':'missing-required','requirement':required+'-required','query':altered(required,remove=True),'principal':'editor','error':True})
 cases.append({'id':'null-required','requirement':required+'-non-null','query':altered(required,ast.NullValueNode()),'principal':'editor','error':True})
 cases.append({'id':'unknown-field','requirement':'schema-fields','query':altered(unknown=True),'principal':'editor','error':True})
 if name=='createItem':
  for id_,arg,node,req in [('invalid-enum','role',ast.EnumValueNode(value='ADMIN'),'role-enum'),('lower-boundary','quantity',ast.IntValueNode(value='0'),'quantity-min'),('upper-boundary','quantity',ast.IntValueNode(value='101'),'quantity-max')]:
   cases.append({'id':id_,'requirement':req,'query':altered(arg,node),'principal':'editor','error':True})
  cases.append({'id':'authorization','requirement':'editor-only','query':print_ast(expanded),'principal':'viewer','error':True})
 return {'mode':'schema-rule-baseline','cases':cases,'operation':operation,'status':'candidate','pytest_source':export_pytest(cases)}

def execute(case):
 result=graphql_sync(schema(case['principal']),case['query'])
 passed=bool(result.errors)==case['error']
 if not case['error']:passed=passed and result.data==case.get('expected',{'createItem':{'id':'I1','quantity':1}})
 return {'id':case['id'],'requirement':case['requirement'],'passed':bool(passed),'data':result.data,'errors':[e.message for e in result.errors or []]}
