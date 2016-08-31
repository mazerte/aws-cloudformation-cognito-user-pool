var AWS = require('aws-sdk');
var CfnLambda = require('cfn-lambda');

var cognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

var toBoolean = function(obj, prop) {
  if (obj[prop] != undefined) obj[prop] = obj[prop] == "true";
}
var toInteger = function(obj, prop) {
  if (obj[prop] != undefined) obj[prop] = parseInt(obj[prop]);
}

var resolveParamsType = function(params) {
  if (params.DeviceConfiguration) {
    toBoolean(params.DeviceConfiguration, "ChallengeRequiredOnNewDevice");
    toBoolean(params.DeviceConfiguration, "DeviceOnlyRememberedOnUserPrompt");
  }
  if (params.Policies && params.Policies.PasswordPolicy) {
    toInteger(params.Policies.PasswordPolicy, "MinimumLength");
    toBoolean(params.Policies.PasswordPolicy, "RequireLowercase");
    toBoolean(params.Policies.PasswordPolicy, "RequireNumbers");
    toBoolean(params.Policies.PasswordPolicy, "RequireSymbols");
    toBoolean(params.Policies.PasswordPolicy, "RequireUppercase");
  }
  return params;
}

var Create = function(params, reply) {
  params = resolveParamsType(params);
  cognito.createUserPool(params, function(err, data) {
    if (err) {
      console.error(err);
      reply(err);
    } else  {
      reply(null, data.UserPool.Id, {
        Arn: [
          "arn:aws:cognito-idp:",
          CfnLambda.Environment.Region,
          ":",
          CfnLambda.Environment.AccountId,
          ":userpool/",
          data.UserPool.Id
        ].join('')
      });
    }
  });
};

var Update = function(physicalId, params, oldParams, reply) {
  params.UserPoolId = physicalId;

  if (params.PoolName != oldParams.PoolName) return reply("You can't update the PoolName !");
  if (params.AutoVerifiedAttributes != oldParams.AutoVerifiedAttributes) return reply("You can't update the AutoVerifiedAttributes !");
  if (params.AliasAttributes != oldParams.AliasAttributes) return reply("You can't update the AliasAttributes !");

  delete params.PoolName;
  delete params.AutoVerifiedAttributes;
  delete params.AliasAttributes;

  cognito.updateUserPool(resolveParamsType(params), function(err, data) {
    if (err) {
      console.error(err);
      reply(err);
    } else {
      reply(null, physicalId, {
        Arn: [
          "arn:aws:cognito-idp:",
          CfnLambda.Environment.Region,
          ":",
          CfnLambda.Environment.AccountId,
          ":userpool/",
          physicalId
        ].join('')
      });
    }
  });
};

var Delete = function(physicalId, params, reply) {
  var p = {
    UserPoolId: physicalId
  };
  cognito.deleteUserPool(p, function(err, data) {
    if (err) console.error(err)
    reply(err, physicalId);
  });
};

exports.Create = Create;
exports.Update = Update;
exports.Delete = Delete;
