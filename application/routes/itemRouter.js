var express = require('express');
var itemRouter = express.Router();
var sha256 = require('js-sha256');

var itemModel = require('../model/itemModel');
var ccModel = require('../model/ccModel');

//Item DB 및 BlockChain 저장
itemRouter.post('/api/setitem', async (req, res) => {
    try {
        // console.log(req.body)
        //Hashing Function Here
        var imageHash = sha256(req.body.ItemImage);
        var certificateHash = sha256(req.body.ItemCertificate);

        //Browser-> Server 전달받은 Data 분류
        artist = {
            artistName: req.body.ArtistName,
            artistIntro: req.body.ArtistIntro,
        }
        item = {
            itemImage: req.body.ItemImage,
            itemCertificate: req.body.ItemCertificate,
            itemImageUri: req.body.ItemImageUri,
            itemCertificateUri: req.body.ItemCertificateUri,
            itemName: req.body.ItemName,
            itemDetails: req.body.ItemDetails,
        }

        //DB에 Artist 및 Item 정보 Put
        await itemModel.setArtist(artist);
        await itemModel.setItem(item);

        //BlockChain의 Args Call
        artistCode = await itemModel.getArtistCode();
        itemCode = await itemModel.getItemCode();

        // itemImageHash에 Image Hashing한 Data 삽입
        // ItemImage 해상도 문제로 Uri로 대체, 
        bdata = {
            itemCode: JSON.stringify(itemCode),
            artistCode: JSON.stringify(artistCode),
            itemCertificateHash: certificateHash,
            itemImageHash: imageHash,
            itemName: item.itemName,
        }

        await ccModel.addArtwork(bdata);

        //INSERTing Wallet Addr Func Here
        

        res.status(200).end();
    } catch (err) {
        console.log('Setitem Err :', err);
        console.log(err);
    }
});

//Browser-> Server Item list 조회
itemRouter.get('/api/item', async (req, res) => {
    try {
        var responseData = [];
        var history = await ccModel.getHistory();
        var data = JSON.parse(history);

        // console.log(data);

        for(var i = 0; i < data.length; i++) {
            var jsonMaker = new Object();
            

            var artistData = await itemModel.getAllArtist(data[i].artistcode);
            var imageData = await itemModel.getItemData(data[i].itemcode);
            jsonMaker.itemCode = data[i].itemcode;

            var item = {itemName : data[i].itemname, itemImage: imageData.imageuri.toString(), artistName : artistData.artistName};

            jsonMaker.item = item;

            responseData.push(jsonMaker);
        }
        // console.log(JSON.stringify(responseData));
        // console.log('resonseData : ', responseData);
        res.status(200).send(responseData)
    } catch (err) {
        console.log('item Err :', err);
        console.log(err);
    }
});

//Browser-> Server Item Details 조회
itemRouter.post('/api/item/:id', async (req, res) => {
    try {
        // get by id, req.params.id;
        var id = req.params.id;
        var itemcode = id.split(':');
        var data = await ccModel.getArtwork(itemcode[1]);
        var json = JSON.parse(data);
        // console.log(json);
        
        var artistData = await itemModel.getAllArtist(json.artistcode);
        var artworkData = await itemModel.getItemData(json.itemcode);

        //이미지 위변조 확인 시퀀스
        var strImage = artworkData.image.toString();
        var imageHash = sha256(strImage);
        if (imageHash != json.itemimagehash) {
            // console.log('위변조 되었습니다.');
        }

        responseData = {
            itemName: json.itemname,
            itemCertificate: artworkData.certificateuri.toString(),
            itemDate: json.date,
            itemImage: artworkData.imageuri.toString(),
            itemDescription: artworkData.description.toString(),
            artistName: artistData.artistName,
            artistIntro: artistData.artistIntro.toString(),
        }

        // console.log(responseData)
        res.status(200).send(responseData);
    } catch (err) {
        console.log('Item Details Err :', err);
        console.log(err);
    }
});

module.exports = itemRouter;