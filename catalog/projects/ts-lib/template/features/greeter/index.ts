export type GreeterOptions = {
  name: string;
};

export function greet(options: GreeterOptions): string {
  return `Hello, ${options.name}`;
}
