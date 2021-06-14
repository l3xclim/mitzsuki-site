#!/bin/bash
CURSOR="YXJyYXljb25uZWN0aW9uOjE5OQ==" #replace this with the 'endCursor' data until 'hasNextPage' is false. TODO: make a loop to do this automatically
curl 'https://api.opensea.io/graphql/' -H 'Accept-Encoding: gzip, deflate' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'Origin: altair://-' -H 'x-api-key: 0106d29713754b448f4513d7a66d0875' -H 'x-build-id: TAprLKQm6Nc9R0lXDU4id' --data-binary '{"query":"query ItemOwnersListQuery($archetype: ArchetypeInputType!, $count: Int, $cursor: String) {\n  archetype(archetype: $archetype) {\n    asset {\n      assetOwners(after: $cursor, first: $count) {\n        edges {\n          node {\n            quantity\n            owner {\n              address\n            }\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n    }\n  }\n}","variables":{"archetype":{"assetContractAddress":"0x495f947276749ce646f68ac8c248420045cb7b5e","chain":"ETHEREUM","tokenId":"58657014090862667548655853218032649544374644375505803723305169486351928656372"},"count":100,"cursor":"'$CURSOR'"}}' --compressed | \
python3 -c '
import sys, json
obj=json.load(sys.stdin)
for node in obj["data"]["archetype"]["asset"]["assetOwners"]["edges"]:
	print("reserve[address(%s)] = %s" %(node["node"]["owner"]["address"],node["node"]["quantity"],))
print(obj["data"]["archetype"]["asset"]["assetOwners"]["pageInfo"])
'
## TODO: Instead of print out to console, save it to keyholders.txt

