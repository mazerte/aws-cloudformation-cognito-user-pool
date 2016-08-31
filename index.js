var CfnLambda = require('cfn-lambda');
var AWS = require('aws-sdk');

var UserPool = require('./lib/user-pool');

function CognitoUserPoolHandler(event, context) {
  var CognitoUserPool = CfnLambda({
    Create: UserPool.Create,
    Update: UserPool.Update,
    Delete: UserPool.Delete,
    SchemaPath: [__dirname, 'src', 'schema.json']
  });
  // Not sure if there's a better way to do this...
  AWS.config.region = currentRegion(context);

  return CognitoUserPool(event, context);
}

function currentRegion(context) {
  return context.invokedFunctionArn.match(/^arn:aws:lambda:(\w+-\w+-\d+):/)[1];
}

exports.handler = CognitoUserPoolHandler;
