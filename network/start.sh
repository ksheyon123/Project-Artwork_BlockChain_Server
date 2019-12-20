#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

function checkPrereqs() {
    # check config dir
    if [! -d "crypto-config"]; then
        echo "crypto-config dir missing"
        exit 1
    fi

    # check crypto-config dir
    if [! -d "config"]; then
        echo "config dir missing"
        exit 1
    fi
}

function replacePrivateKey() {
    echo "ca key file exchange"
    cp docker-compose-template.yml docker-compose.yml
    PRIV_KEY=$(ls crypto-config/peerOrganizations/org1.artist.com/ca/ | grep _sk)
    sed -it "s/CA_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose.yml
}

checkPrereqs
replacePrivateKey

# Exit on first error, print all commands.
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up -d ca.example.com orderer.example.com peer0.org1.artist.com peer0.org2.company.com peer0.org3.client.com couchdb1 couchdb2 couchdb3 cli
docker ps -a

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
# -e: 환경 변수 지정
# docker exec -e "CORE_PEER_LOCALMSPID=ArtistMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.artist.com/msp" peer0.org1.artist.com peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx

# Create the channel
docker exec cli peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx

# Join peer0.org1.artist.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=ArtistMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.artist.com/msp" peer0.org1.artist.com peer channel join -b /etc/hyperledger/configtx/mychannel.block
sleep 5

# Join peer0.org2.company.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=CompanyMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.company.com/msp" peer0.org2.company.com peer channel join -b /etc/hyperledger/configtx/mychannel.block
sleep 5

# Join peer0.org3.client.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=ClientMSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org3.client.com/msp" peer0.org3.client.com peer channel join -b /etc/hyperledger/configtx/mychannel.block
sleep 5

docker exec cli peer chaincode install -n art -v 1.1 -p github.com/artwork/
docker exec cli peer chaincode instantiate -v 1.1 -C mychannel -n art -c '{"Args":["Init"]}' -P 'OR ("ArtistMSP.member", "CompanyMSP.member", "ClientMSP.member")'