const { Client }      = require('pg');
const uuid            = require('uuid/v1');


var database = function() {

  this.client          =  new Client('webapp');
  this.name = "webapp database";
  this.client.connect();

  // Creates a new user
  this.newUser = (firstName, lastName, email ) => {
    var newUID = uuid(); 
    this.client.query("INSERT INTO \"USER\" \n \
    VALUES ( $1, $2, $3, $4, $5, $6)\;", [newUID, firstName, lastName, email, 0, null]);
  };

  // Created a new group with group name
  this.newGroup = (groupName) => {
    var newUID = uuid(); 
    var dateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.client.query("INSERT INTO \"GROUP\" \n \
      VALUES ( $1, $2, $3 )\;", [newUID, groupName, dateCreated]);
  };

  // Adds USER with uid to GROUP with gid
  this.groupAddMember = (uid, gid) => {
    // Check if user is already in group or not
    // if user not in group, then add to group
    this.checkGroupMembership(uid, gid).then(res => {
      if (res) {
        console.log('Adding user into group');
        this.client.query("INSERT INTO \"GROUP_MEMBERSHIP\" \n \
        VALUES ($1, $2)\;", [gid, uid]);
      } else {
        console.log('User already in group');
      }
    });
  };

  // A PROMISE that returns true if USER with uid is NOT in group with GID
  this.checkGroupMembership = (uid, gid) => {
    return this.client.query("SELECT * FROM \"GROUP_MEMBERSHIP\" \n \
      WHERE UID = $1 \n \
      AND GID = $2\;", [uid, gid]).then(result => result.rowCount === 0);
  };

  this.newTX = (to, from, howMuch, currency, groupID) => {
    this.client.query("INSERT INTO \"TRANSACTION\" \n \
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)\;")
  };

};

module.exports = {
  Database : database
};

//var db = new Database();
// db.newUser("Zicong", "Ma", "mazicong@gmail.com");
// db.newGroup("Peng you men");
//db.groupAddMember("33807240-5dc0-11e8-b06f-c346f6c59a8a", "e3ccbd70-5dc0-11e8-a74e-176fbf353fa6");
//db.checkGroupMembership("33807240-5dc0-11e8-b06f-c346f6c59a8a", "e3ccbd70-5dc0-11e8-a74e-176fbf353fa6").then(res => console.log(res));
