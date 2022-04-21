import { Stack, StackProps } from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

export interface BlogL4ConstructStackProps extends StackProps {
  namespace: string;
}
export class BlogL4ConstructStack extends Stack {
  bus: EventBus;
  constructor(scope: Construct, id: string, props: BlogL4ConstructStackProps) {
    super(scope, id, props);

    // could also be a lookup
    this.bus = new EventBus(this, 'Bus', {
      eventBusName: `${props.namespace}-bus`
    });
  }
}
