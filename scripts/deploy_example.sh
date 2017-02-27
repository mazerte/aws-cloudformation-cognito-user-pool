#!/bin/bash -e

if [ $# -ne 2 ] ; then
  echo "usage: $0 StackName S3bucket"
  echo "example:"
  echo "  $0 CognitoUserCFn cf-templates-bucket-us-east-1"
  echo "  $0 CognitoUserCFnWithExamplePool cf-templates-bucket-us-east-1"
  echo
  exit 1
fi

STACK=$1
TEMPLATE="example/$STACK.cform"
UPLOAD_BUCKET=$2
UPLOAD_PREFIX=$(date +"$STACK-%Y%m%d-%H%M%S")

echo "Validating templates"
for f in example/*.cform
do
  echo "Validating $f"
  aws cloudformation validate-template --template-body file://$f
done

echo "Packaging"
aws cloudformation package \
    --template-file $TEMPLATE \
    --output-template-file deploy/cloudformation-out.yaml \
    --s3-bucket $UPLOAD_BUCKET \
    --s3-prefix $UPLOAD_PREFIX

aws cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --template-file deploy/cloudformation-out.yaml \
    --stack-name $STACK

echo "Cleaning up"
aws s3 rm --recursive "s3://$UPLOAD_BUCKET/$UPLOAD_PREFIX"

echo "finished."
