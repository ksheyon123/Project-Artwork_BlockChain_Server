const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const ccpPath = path.resolve(__dirname, '..','..', 'network' ,'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

class ccModel {

    addArtwork(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    console.log('addArtwork', data)
                    // Create a new file system based wallet for managing identities.
                    const walletPath = path.join(process.cwd(), 'wallet');
                    const wallet = new FileSystemWallet(walletPath);
                    console.log(`Wallet path: ${walletPath}`);
                    // Check to see if we've already enrolled the user.
                    const userExists = await wallet.exists('user1');

                    if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                    }
                    // Create a new gateway for connecting to our peer node.
                    const gateway = new Gateway();
                    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } }); 
                    console.log('1');
                    // Get the network (channel) our contract is deployed to.
                    const network = await gateway.getNetwork('mychannel');
                    console.log('2');
                    
                    // Get the contract from the network.
                    const contract = network.getContract('art');
                    console.log('3');

                    //  Submit the specified transaction.
                    //  createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                    //  changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                    //  await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
                    await contract.submitTransaction('addArtwork', data.itemCode, data.artistCode, data.itemCertificateHash, data.itemImageHash, data.itemName);
                    console.log('Transaction has been submitted');
                    // Disconnect from the gateway.
                    await gateway.disconnect();
                    resolve(true);
                } catch (err) {
                    console.log('addArtwork Err :', err);
                    reject(err)
                }
            }
        )
    }

    // Get All txData
    getHistory() {
        return new Promise (
            async (resolve, reject) => {
                try {
                    // Create a new file system based wallet for managing identities.
                    const walletPath = path.join(process.cwd(), 'wallet');
                    const wallet = new FileSystemWallet(walletPath);
                    console.log(`Wallet path: ${walletPath}`);
                    // Check to see if we've already enrolled the user.
                    const userExists = await wallet.exists('user1');

                    if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                    }
                    // Create a new gateway for connecting to our peer node.
                    const gateway = new Gateway();
                    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } }); 
                    // Get the network (channel) our contract is deployed to.
                    const network = await gateway.getNetwork('mychannel');
                    // Get the contract from the network.
                    const contract = network.getContract('art');
                    //  Submit the specified transaction.
                    //  createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                    //  changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                    //  await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
                    var rawData = await contract.submitTransaction('getHistory');
                    var json = rawData.toString();
                    console.log('Transaction has been submitted');
                    // Disconnect from the gateway.
                    await gateway.disconnect();
                    resolve(json);
                } catch (err) {
                    console.log('Get All History Err :', err);
                    reject(err)
                }   
            }
        )
    }

    getArtwork(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    // Create a new file system based wallet for managing identities.
                    const walletPath = path.join(process.cwd(), 'wallet');
                    const wallet = new FileSystemWallet(walletPath);
                    console.log(`Wallet path: ${walletPath}`);
                    // Check to see if we've already enrolled the user.
                    const userExists = await wallet.exists('user1');

                    if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                    }
                    // Create a new gateway for connecting to our peer node.
                    const gateway = new Gateway();
                    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } }); 
                    // Get the network (channel) our contract is deployed to.
                    const network = await gateway.getNetwork('mychannel');
                    // Get the contract from the network.
                    const contract = network.getContract('art');
                    //  Submit the specified transaction.
                    //  createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                    //  changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                    //  await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
                    var rawData = await contract.submitTransaction('getArtwork', data);
                    var json = rawData.toString();
                    console.log('Transaction has been submitted');
                    // Disconnect from the gateway.
                    await gateway.disconnect();
                    resolve(json);
                } catch (err) {
                    
                }
            }
        )
    }
}

module.exports = new ccModel();