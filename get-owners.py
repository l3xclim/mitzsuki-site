import requests, sys, json


url = 'https://api.opensea.io/graphql/'
endCursor = ""
hasNextPage = True
query = {
          'query' : 'query ItemOwnersListQuery($archetype:ArchetypeInputType! $count:Int $cursor:String){archetype(archetype:$archetype){asset{assetOwners(after:$cursor,first:$count){edges{node{quantity owner{address}}cursor}pageInfo{endCursor hasNextPage}}}}}',
          'variables' : '{"archetype":{"assetContractAddress":"0x495f947276749ce646f68ac8c248420045cb7b5e","chain":"ETHEREUM","tokenId":"58657014090862667548655853218032649544374644375505803723305169486351928656372"},"count":100,"cursor": "%s"}'%(endCursor)
        }
headers = {'Content-Type': 'application/json'}
f=open("owners.txt","w")

while hasNextPage == True:
  r = requests.post(url=url, json=query, headers=headers)
  obj=json.loads(r.text)
  for node in obj["data"]["archetype"]["asset"]["assetOwners"]["edges"]:
    f.write("reserve[address(%s)] = %s;\n" %(node["node"]["owner"]["address"],node["node"]["quantity"],))
    sys.stdout.write('.')
  endCursor = obj["data"]["archetype"]["asset"]["assetOwners"]["pageInfo"]["endCursor"]
  query = {
            'query' : 'query ItemOwnersListQuery($archetype:ArchetypeInputType! $count:Int $cursor:String){archetype(archetype:$archetype){asset{assetOwners(after:$cursor,first:$count){edges{node{quantity owner{address}}cursor}pageInfo{endCursor hasNextPage}}}}}',
            'variables' : '{"archetype":{"assetContractAddress":"0x495f947276749ce646f68ac8c248420045cb7b5e","chain":"ETHEREUM","tokenId":"58657014090862667548655853218032649544374644375505803723305169486351928656372"},"count":100,"cursor": "%s"}'%(endCursor)
          }
  hasNextPage = obj["data"]["archetype"]["asset"]["assetOwners"]["pageInfo"]["hasNextPage"]







