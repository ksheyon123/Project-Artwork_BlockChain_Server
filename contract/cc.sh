docker exec cli peer chaincode install -n cargo -v 1.1 -p github.com/artwork/
docker exec cli peer chaincode upgrade -v 1.1 -C mychannel -n cargo -c '{"Args":["Init"]}' -P 'OR ("Org1MSP.member", "Org2MSP.member")'

docker exec cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n art -c '{"Args":["addArtwork","1","a","a","a","a"]}'
docker exec cli peer chaincode query -C mychannel -n art -c '{"Args":["getArtwork","a"]}'
docker exec cli peer chaincode query -C mychannel -n art -c '{"Args":["getHistory"]}'
