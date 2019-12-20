package main

import (
	"encoding/json"
	"fmt"
	// "bytes"
	"time"
	// "strconv"
	// "strings"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type ChainCode struct {

}

type Artwork struct {
	ObjectType	string `json:"artworkType"`
	ItemCode string `json:"itemcode"`
	ArtistCode string `json:"artistcode"`
	ItemImageHash string `json:"itemimagehash"` // 이미지 해시
	ItemCertificate string `json:"itemcertificate"` // 인증서
	ItemName string `json:"itemname"`   // 작품 명
	Date string `json:"date"` // 등록 날짜
}

func (s *ChainCode) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *ChainCode) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	function, args := APIstub.GetFunctionAndParameters()

	// if function == "addUser" {
	// 	return s.addUser(APIstub, args)
	// } 
	if function == "addArtwork" {
		return s.addArtwork(APIstub, args)
	} else if function == "getArtwork" {
		return s.getArtwork(APIstub, args)
	} else if function == "getHistory" {
		return s.getHistory(APIstub)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *ChainCode) addArtwork(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	var data = Artwork{ObjectType: "Picture", ItemCode:args[0], ArtistCode:args[1], ItemImageHash:args[2], ItemCertificate:args[3], ItemName:args[4], Date:time.Now().Format("20060102150405") }
	artworkAsBytes,_:=json.Marshal(data)

	// // 월드스테이드 업데이트 
	// geo_cut := strings.Fields(args[1])

	// // s.addAverage(APIstub, []string{geo_cut[0], args[6]})
   	// s.addAverage_dis(APIstub, []string{geo_cut[0], args[6],args[7]})
	   
	APIstub.PutState(args[0], artworkAsBytes)

	// indexName := "startpoint~id"
	// startpointidIndexKey, err := APIstub.CreateCompositeKey(indexName, []string{data.StartPoint, data.Key})
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }
	//  Save index entry to state. Only the key name is needed, no need to store a duplicate copy of the marble.
	//  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
	// value := []byte{0x00}
	// APIstub.PutState(startpointidIndexKey, value)
	// return shim.Success([]byte("rating is updated"))

	return shim.Success(nil)

}

func (s *ChainCode) getArtwork(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	artworkAsBytes, err := APIstub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get Battery")
	}
	if artworkAsBytes == nil {
		return shim.Error("artworkAsBytes not found")
	}
	return shim.Success(artworkAsBytes)
}

func (s *ChainCode) getHistory(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "00000000000"
	endKey := "999999999999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	var buffer string
	buffer ="["

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		if bArrayMemberAlreadyWritten == true {
			buffer += ","
		}

		buffer += string(response.Value)

		bArrayMemberAlreadyWritten = true
	}
	buffer += "]"
	return shim.Success([]byte(buffer))
}

func main() {
	if err := shim.Start(new(ChainCode)); err != nil {
		fmt.Printf("Error starting ChainCode chaincode: %s", err)
	}
}