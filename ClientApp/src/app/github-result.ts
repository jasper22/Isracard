import { GithubResultItem } from "./github-result-item";

export interface GithubResult {
    items: GithubResultItem [];
    total_count: number;
}
