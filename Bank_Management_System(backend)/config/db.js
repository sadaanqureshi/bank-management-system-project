const mysql=require('mysql2/promise');

const mySqlPool=mysql.createPool({
  host: 'localhost',
    user: 'root',      
    password: 'fast',  
    database: 'bank-management' ,
    
  });
  module.exports=mySqlPool;
  


