const con = require('./connection_to_customer');
var express = require("express");
const path=require("path");
var bodyParser=require("body-parser");
const { get } = require('http');
const { error } = require('console');

var app=express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

app.engine('html', require('ejs').renderFile);
app.set('view engine','ejs');

const publicPath=path.join(__dirname,"public");
app.use(express.static(publicPath));

// _______________________________This code for customer details________________________-->

app.get("/customer",function(req,res){
    con.connect(function(err){
        if(err) console.log(err);

        var sql="select * from customer";

        con.query(sql,function(err,result){
            if(err)  console.log(err);
            res.render(__dirname+"/customer",{customer:result});
           
        });
        
    });
})

// _______________________________This code for payment details________________________-->

app.get("/payment",function(req,res){

        con.connect(function(err){
            if(err) console.log(err);
            var id=req.query.id;

            var sql="select * from customer where cust_id=?";
            con.query(sql,[id],function(err,result1){
                if(err)  console.log(err);

                if(result1.length>0){

                    var sql2="select c_id,s_name from senderinfo";
                     con.query(sql2,function(err,result2){
                      if(err)  console.log(err);  
                      
                      if(result2.length>0){
                        res.render(__dirname+'/payment',{customer:result1,senderinfo:result2 });
                      }

                      else{
                         console.log("rsult is empty ");
                      }
                     });

                     
                }
                else{
                    console.log("rsult is empty ");
                }    
            });

            


             
        });   
})


  
        app.post("/payment",function(req,res){
            var amount=parseInt(req.body.amount);
            var sid=req.body.id;
            var rid=req.body.reciver;
            var sbalance=parseInt(req.body.balance);
             var sender_name;
             var reciver_name;
            
                con.connect(function(err){
                    if(err) console.log(err);
                    
                    if(sbalance<amount)  {
                        
                        console.log("Balance is insufficent for this txn.");
                        console.log(sbalance,amount);
                        res.redirect('/customer');
                      }

                   else{
                            var sql= "update customer SET balance = balance + ? WHERE cust_id = ?";                                       
                            con.query(sql,[amount,rid],function(err,result){
                                if(err)  console.log(err);                        
                            });
                            
                            var sql2="update customer SET balance = balance -? WHERE cust_id = ? && balance > ?";
                            con.query(sql2,[amount,sid,amount],function(err,result){
                                if(err)  console.log(err);                     
                            });
                            
                           

                            var sql3="select cust_name from customer where cust_id=?";
                            con.query(sql3,[sid],function(err,result){
                                if(err)  console.log(err);
                                
                                if (result.length > 0) {
                                    var sender_name = result[0].cust_name; // store the value of the 'cust_name' field of the first row in the 'result' array
                                    console.log(sender_name);
                                    // use the customerName variable here

                                    var sql4="select cust_name from customer where cust_id=?";
                                    con.query(sql4,[rid],function(err,result){
                                        if(err)  console.log(err);
                                        
                                        if (result.length > 0) {
                                            var reciver_name = result[0].cust_name; // store the value of the 'cust_name' field of the first row in the 'result' array
                                            console.log(reciver_name);
                                            // use the customerName variable here

                                            var sql5="insert into transaction(sender,reciver,amount) values('"+sender_name+"','"+reciver_name+"','"+amount+"')";              
                                            con.query(sql5,function(err,result){
                                                if(err)  console.log(err);
                                                res.redirect('/customer'); 
                                            });

                                          } else {
                                            
                                            console.log("No results found for customer ID " + sid);
                                          }
                                                                               
                                    });

                                  } else {
                                    console.log("No results found for customer ID " + sid);
                                  }
                            });      
                   }                 
                });
        })

// _______________________________This code for adding customer details________________________-->

        app.get("/AddNewUser",function(req,res){
            res.sendFile("C:/Users/toshiba/Documents/Banking system/AddNewUser.html")
        })
        app.post("/AddNewUser",function(req,res){
            
            var id=req.body.id;
            var name=req.body.name;
            var email=req.body.email;
            var address=req.body.address;
            var balance=req.body.balance;
            

            console.log(id,name,email,address,balance);
            con.connect(function(err){
                if(err) console.log(err);
    
                var sql="insert into customer(cust_id,cust_name,cust_address,cust_emailID,balance) values('"+id+"','"+name+"','"+address+"','"+email+"','"+balance+"')";                
                con.query(sql,function(err,result){
                    if(err)  console.log(err);
                    
                   
                });

                var sql2="insert into senderinfo(s_id,s_name,c_id) values('"+id+"','"+name+"','"+id+"')";                
                con.query(sql2,function(err,result){
                    if(err)  console.log(err);
                    res.redirect("/customer");
                   
                });
            });   
    })

// _______________________________This code for delete customer details________________________-->

    app.get("/delete-customer",function(req,res){
        
        con.connect(function(err){
            if(err) console.log(err);
            
            var sql="delete from customer where cust_id=?";
            var id=req.query.id;
            con.query(sql,[id],function(err,result){
                if(err)  console.log(err);
                res.redirect("/customer");
               
            });
        });   
})

// _______________________________This code for Transaction customer details________________________-->
    

app.get("/Transactionlist",function(req,res){
    con.connect(function(err){
        if(err) console.log(err);

        var sql="select * from transaction";

        con.query(sql,function(err,result){
            if(err)  console.log(err);
            res.render(__dirname+"/Transactionlist",{transaction:result});
           
        });
        
    });
})


app.get("/delete-transaction",function(req,res){
        
    con.connect(function(err){
        if(err) console.log(err);
        
        var sql="delete from Transaction where txn_id=?";
        var id=req.query.txn_id;
        con.query(sql,[id],function(err,result){
            if(err)  console.log(err);
            res.redirect("/TransactionList");
           
        });
    });   
})














app.listen(7000);


  