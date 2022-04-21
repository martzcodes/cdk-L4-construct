import { Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { AccountPrincipal, Role } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { BlogL4ConstructStack } from "./blog-l4-construct-stack";

export interface L4ConstructProps {
  receiveEntry?: string;
  receiveStack: BlogL4ConstructStack;
  source: string;
  transmitEntry?: string;
  transmitStack: BlogL4ConstructStack;
}

export const L4Construct = (props: L4ConstructProps) => {
  const {
    transmitStack,
    receiveStack,
    source,
    receiveEntry = `${__dirname}/lambda/receive.ts`,
    transmitEntry = `${__dirname}/lambda/transmit.ts`,
  } = props;

  const transmitFn = new NodejsFunction(transmitStack, "transmitFn", {
    functionName: `transmitFn`,
    entry: transmitEntry,
    runtime: Runtime.NODEJS_14_X,
    environment: {
      EVENT_SOURCE: source,
      EVENT_BUS: transmitStack.bus.eventBusName,
    },
  });

  // allow transmitFn to put events to transmit bus
  transmitStack.bus.grantPutEventsTo(transmitFn);

  // allow transmit bus to send events to receive bus
  const demoRole = new Role(receiveStack, "demoRole", {
    assumedBy: new AccountPrincipal(transmitStack.account),
  });
  receiveStack.bus.grantPutEventsTo(demoRole);

  const receiveFn = new NodejsFunction(receiveStack, "receiveFn", {
    functionName: `receiveFn`,
    entry: receiveEntry,
    runtime: Runtime.NODEJS_14_X,
  });
  // invoke receiveFn from same source as transmit
  const rule = new Rule(receiveStack, "demoRule", {
    description: "this is some rule for the eventbus...",
    eventPattern: {
      source: [source],
    },
    eventBus: receiveStack.bus,
  });
  rule.addTarget(new LambdaFunction(receiveFn));
};
