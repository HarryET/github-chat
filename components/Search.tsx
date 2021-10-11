import { Octokit } from "@octokit/rest";
import { ThemeConfig } from "react-select";
import primitives from "@primer/primitives";
import pDebounce from "p-debounce";
import AsyncSelect from "react-select/async";
import leven from "leven";
import { Repository } from "types";

type Props = {
  repositories: Repository[];
  onSelect: (option: string) => void;
};

const { colors } = primitives;
const theme: ThemeConfig = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    neutral0: colors.dark.bg.secondary,
    neutral20: colors.dark.fg.subtle,
    neutral30: colors.dark.fg.muted,
    neutral50: colors.dark.fg.muted,
    primary25: "#222933",
    neutral80: colors.dark.fg.default,
  },
});

const octokit = new Octokit();

type Option = { value: string; label: string };

export const Search = ({ repositories, onSelect }: Props) => {
  const loadOptions = async (inputValue: string, callback: (options: Option[]) => void) => {
    const results = repositories
      .filter((repository) => repository.fullName.includes(inputValue))
      .sort((a, b) => leven(a.fullName, inputValue) - leven(b.fullName, inputValue));

    // First we try searching among the statically pre-fetched 500 most popular repositories
    if (results.length > 0) {
      callback(results.map((r) => ({ label: r.fullName, value: r.fullName })));
    }

    const { data } = await octokit.rest.search.repos({
      per_page: 20,
      q: `${inputValue} in:name`,
      sort: "stars",
    });

    // If not found, we use GitHub search API
    const remoteResults = data.items
      .map((item) => ({
        id: item.id.toString(),
        fullName: item.full_name,
        owner: item.owner?.login,
        name: item.name,
      }))
      .filter((repository) => repository.fullName.includes(inputValue))
      .sort((a, b) => leven(a.fullName, inputValue) - leven(b.fullName, inputValue));

    callback(remoteResults.map((r) => ({ label: r.fullName, value: r.fullName })));
  };
  return (
    <AsyncSelect<Option>
      placeholder="Search GitHub repository"
      isSearchable={true}
      loadOptions={pDebounce(loadOptions, 500)}
      styles={{
        container: (css) => ({ ...css, flex: 1 }),
        control: (css) => ({
          ...css,
          height: "48px",
          flex: 1,
          flexGrow: 1,
          width: "100%",
        }),
        menu: (css) => ({ ...css, border: `1px solid ${colors.dark.border.default}` }),
      }}
      theme={theme}
      onChange={(option) => option && onSelect(option?.value)}
    />
  );
};
