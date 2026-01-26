import { Button } from "./button";
import { Heading } from "./heading";
import { Text } from "./text";

export interface Error {
  message: string;
  statusCode: number;
  error: string;
}

export function ErrorScreen({
  error: { message, statusCode, error },
  refetch,
}: {
  error: Error;
  refetch: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <Heading className="space-x-2">
          <span>{statusCode}</span>
          <span>{error}</span>
        </Heading>
        <Text>{message}</Text>
        <Button color="red" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    </div>
  );
}

export function AccessDeniedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <Heading>Access Denied</Heading>
        <Text>You don't have permission to view this page.</Text>
      </div>
    </div>
  );
}
