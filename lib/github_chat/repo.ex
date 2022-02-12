defmodule GithubChat.Repo do
  use Ecto.Repo,
    otp_app: :github_chat,
    adapter: Ecto.Adapters.Postgres
end
