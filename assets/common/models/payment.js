'use strict';

module.exports = function(Payment) {

  //Payment.disableRemoteMethod("create", true);
  Payment.disableRemoteMethod("upsert", true);
  Payment.disableRemoteMethod("updateAll", true);
  Payment.disableRemoteMethod("updateAttributes", false);
  Payment.disableRemoteMethod("find", true);
  Payment.disableRemoteMethod("findById", true);
  Payment.disableRemoteMethod("findOne", true);
  Payment.disableRemoteMethod("exists", true);
  Payment.disableRemoteMethod("count", true);
  Payment.disableRemoteMethod("createChangeStream", true);
  Payment.disableRemoteMethod("deleteById", true);
  Payment.disableRemoteMethod("replaceOrCreate",true);
  Payment.disableRemoteMethod("upsertWithWhere",true);
  Payment.disableRemoteMethod("replaceById",true);


  Payment.beforeRemote("create", function(ctx, unused, next) {
    ctx.req.body.state = 'pending';
    next();
    console.log("this has been added");
    console.log(JSON.stringify(ctx.req.body));
  });


  /**
   *
   * @param {Function(Error, object)} callback
   */

  Payment.prototype.execute_payment = function(id, callback) {

    console.log("payment execution start");
    //var idName = Payment.prototype.getIdName();
    console.log("payment id is: " +  id);
    //console.log("payment idName is: " +  idName);
    Payment.findById(id,function(err, instance){
      if (err){
        callback(err);
      }else{
        console.log("instance before state change: " + JSON.stringify(instance));
        instance.state = 'executed';
        console.log("instance before upsert: " + JSON.stringify(instance));
        Payment.upsert(instance, function (err, result){
          if (err){
            callback(err);
          } else{
            callback(null,result);
          }
        });
      }
    });



  };




};
