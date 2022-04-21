#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BlogL4ConstructStack } from "../lib/blog-l4-construct-stack";
import { L4Construct } from "../lib/l4-construct";

const app = new cdk.App();
const receiveStack = new BlogL4ConstructStack(
  app,
  "BlogL4ConstructStackReceive",
  {
    namespace: "StackReceive",
  }
);

const transmitStack = new BlogL4ConstructStack(
  app,
  "BlogL4ConstructStackTransmit",
  {
    namespace: "StackTransmit",
  }
);

L4Construct({ receiveStack, transmitStack, source: 'someSource' });
L4Construct({ receiveStack, transmitStack, source: 'anotherSource' });
