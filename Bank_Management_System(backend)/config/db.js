const mysql=require('mysql2/promise');

const mySqlPool=mysql.createPool({
  host: 'localhost',
    user: 'root',      
    password: 'fast123',  
    database: 'bank-management-system-3' ,
    
  });
  module.exports=mySqlPool;
  


