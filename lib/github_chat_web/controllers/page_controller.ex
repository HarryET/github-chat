defmodule GithubChatWeb.PageController do
  use GithubChatWeb, :controller

  def index(conn, _params) do
    conn
    |> render("index.html", current_user: get_session(conn, :current_user), gh_id: System.get_env("GITHUB_CLIENT_ID"))
  end
end
