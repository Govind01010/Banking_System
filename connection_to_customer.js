var mysql=require("mysql");

var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Govinda@123",
    database:"bank_system"
});




module.exports=con;