export type HomeScreenProps = {
  title?: string;
};

export function defaultHomeTitle(props: HomeScreenProps = {}): string {
  return props.title ?? "Welcome";
}
