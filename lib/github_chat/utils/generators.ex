defmodule GithubChat.Utils.Generators do
  @spec gen_id :: String.t()
  def gen_id() do
    {:ok, id} = Snowflake.next_id()
    to_string(id)
  end
end
