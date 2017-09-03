
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var getUserID = "";
var getShopID = "";


exports.validate = functions.database
    .ref('/userPointsTransaction/{attemptKey}').onWrite(event => {
      const message = event.data.val();
      const shopID = message.shopID;
      const userID = message.userID;
      const userName = message.userName;
      const attemptKey = message.attemptKey;
      getUserID = shopID;
      getShopID = getShopID;

        // Retrieved the message values.
        //console.log('Retrieved message content: ', message);

        // Run moderation checks on on the message and moderate if needed.
        //const moderatedMessage = moderateMessage(message.text);

        // Update the Firebase DB if there the unique key generatd by the shop is presented by the usr
        return admin.database().ref(`/shopGivePointAttemp/${attemptKey}`).once('value').then(snapshot => {
    		return snapshot.val();
    	}).then(response => {
    			return admin.database().ref('/fix/' + userID + '/' + shopID).update({
          			shopID: message.shopID,
          			point: message.point,
          			shopName: message.shopName,
          			userID: message.userID,
          			userName: message.userName,
          			timestamp: message.timestamp
        			});
    		});
   		});


 exports.updateUser = functions.database
    .ref('/fix/{userID}/{shopID}').onWrite(event => {
      const message = event.data.val();
      const shopID = message.shopID;
      const point  = message.point;
      const shopName = message.shopName;
      const userID = message.userID;
      const userName = message.userName;
      const timestamp = message.timestamp;


      return admin.database().ref(`/userShopTotalPoints/${userID}/${shopID}/point`).once('value').then(snapshot => {
    		return snapshot.val();
    	}).then(point => {
    		const oldPoints = point;
			return admin.database().ref('/userShopTotalPoints/' + userID + '/' + shopID).update({
					shopID: message.shopID,
					point: message.point + oldPoints,
					shopName: message.shopName,
					userID: message.userID,
					userName: message.userName,
					timestamp: message.timestamp
			});
		});
   });


exports.updateShop = functions.database
    .ref('/fix/{userID}/{shopID}').onWrite(event => {
      const message = event.data.val();
      const shopID = message.shopID;
      const point  = message.point;
      const shopName = message.shopName;
      const userID = message.userID;
      const userName = message.userName;
      const timestamp = message.timestamp;


      return admin.database().ref(`/shopUserTotalPoints/${shopID}/${userID}/point`).once('value').then(snapshot => {
    		return snapshot.val();
    	}).then(point => {
    		const oldPoints = point;
			return admin.database().ref('/shopUserTotalPoints/' + shopID + '/' + userID).update({
					shopID: message.shopID,
					point: message.point + oldPoints,
					shopName: message.shopName,
					userID: message.userID,
					userName: message.userName,
					timestamp: message.timestamp
			});
		});
   });



