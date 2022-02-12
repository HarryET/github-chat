defmodule GithubChatWeb.AuthController do
  use GithubChatWeb, :controller

  @doc """
  `callback/2` handles the callback from GitHub Auth API redirect.
  """
  def callback(conn, %{"code" => code}) do
    {:ok, profile} = ElixirAuthGithub.github_auth(code)
    conn
    |> put_session(:user, profile)
    |> put_view(GithubChatWeb.PageView)
    |> render(:welcome, profile: profile)
  end

  def index(conn, _) do
    oauth_github_url = ElixirAuthGithub.login_url(%{scopes: ["user:email"]})
    conn
    |> redirect(external: oauth_github_url)
  end
end
