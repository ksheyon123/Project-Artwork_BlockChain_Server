var myConnection = require('../dbConfig');

class itemModel {

    //DB에 넣을 Artist Data의 Data 삽입
    setArtist(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    // var sql = 'INSERT INTO artist (artistName, artistRef, artistBirth, artistIntro) values (? ,? ,? ,?)';
                    var sql = 'INSERT INTO artist (artistName, artistIntro) values (? , ?)';

                    // myConnection.query(sql, [data.artistName, data.artistBirth, data.artistRef, data.artistIntro]);
                    myConnection.query(sql, [data.artistName, data.artistIntro]);
                    resolve(true);
                } catch (err) {
                    console.log('setArtist Err', err)
                    reject(err);
                }
            }
        )
    }

    //DB에 넣을 Image Data의 Base64 Data 삽입
    setItem(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO artwork (image, certification, description, imageuri, certificateuri) values (?, ?, ?, ?, ?)';
                    await myConnection.query(sql, [data.itemImage, data.itemCertificate, data.itemDetails, data.itemImageUri, data.itemCertificateUri]);
                    resolve(true);
                } catch (err) {
                    console.log('Set Item Err', err);
                    reject(err);
                }
            }
        )
    }

    //Block Chain 에 넣을 Artist Data의 args 생성
    getItemCode() {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT MAX(id) AS itemCode FROM artwork';
                    var result = await myConnection.query(sql);
                    console.log(result[0][0].itemCode)
                    var returnValue = result[0][0].itemCode
                    resolve(returnValue);
                } catch (err) {
                    console.log('Get Artist Code Err', err);
                    reject(err);
                }
            }
        )
    }

    getArtistCode() {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT MAX(id) AS artistCode FROM artist';
                    var result = await myConnection.query(sql);
                    console.log(result[0][0].artistCode)
                    var returnValue = result[0][0].artistCode
                    resolve(returnValue);
                } catch (err) {
                    console.log('Get Artist Code Err', err);
                    reject(err);
                }
            }
        )
    }
    getAllArtist(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM artist WHERE id = ?';
                    var result = await myConnection.query(sql, [parseInt(data)]);
                    resolve(result[0][0]);
                } catch (err) {
                    console.log('getAllArtist Err', err);
                    reject(err)
                }
            }
        )
    }

    getItemData(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM artwork WHERE id = ?';
                    var result = await myConnection.query(sql, [parseInt(data)]);
                    resolve(result[0][0]);
                } catch (err) {
                    console.log('getItemData Err', err);
                    reject(err)
                }
            }
        )
    }
}

module.exports = new itemModel();