# AWS CloudFormation Custom Resource for AWS Cognito UserPool

This custom resource is based on [cfn-lambda](https://github.com/andrew-templeton/cfn-lambda), you can see this project for more advanced configuration.

## Install

Clone the repository on laptop and build function. Inside the root folder:

```
$ npm install
$ npm build
```

Deploy to the specified region (us-east-1) using Lambda function cloudformation template with transformations `example/CognitoUserCFn.cform`. Please ensure that bucket is in the same region in order for deploy to work.

```
$ export AWS_DEFAULT_REGION=us-east-1
$ ./scripts/deploy_example.sh CognitoUserCFn cf-templates-bucket-us-east-1
```

## Example

You can test the custom resource by running `example/user-pool.cform`. This only parameter is the name of the lambda function created during the installation.

You can also use all in one deploy, which creates lambda functions and at the same time it deploys the
userpool from `example/CognitoUserCFnWithExamplePool.cform`

```
$ export AWS_DEFAULT_REGION=us-east-1
$ ./scripts/deploy_example.sh CognitoUserCFnWithExamplePool cf-templates-bucket-us-east-1
```

## Docs

All parameters usable is the same of the parameters use by aws-sdk to [create a user-pool](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPool-property)
