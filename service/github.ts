import { Octokit } from "@octokit/rest";
import { Repository } from "types";

const octokit = new Octokit({});

export const fetchMostPopularRepositories = async () => {
  const repositories: Repository[] = [];
  const numPages = 2;

  for (let i = 0; i < numPages; i++) {
    const { data } = await octokit.rest.search.repos({
      per_page: 100,
      q: "stars:>=500",
      page: i + 1,
      sort: "stars",
    });
    repositories.push(
      ...data.items.map((item) => ({
        id: item.id.toString(),
        fullName: item.full_name,
        owner: item.owner?.login,
        name: item.name,
      }))
    );
  }

  return repositories;
};
