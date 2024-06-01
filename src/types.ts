export interface Dep {
  name: string;
  fanIn: number;
  fanOut: number;
  stability: number;
  label: string;
}
export interface NpmDependency {
  name: string;
  version: string;
}
