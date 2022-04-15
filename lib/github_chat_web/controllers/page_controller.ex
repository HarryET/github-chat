defmodule GithubChatWeb.PageController do
  use GithubChatWeb, :controller

  def index(conn, _params) do
    whats_new = %{
      url: "https://github.com/HarryET/github-chat/issues/64",
      message: "Welcome to the new GithubChat",
      box_override: nil
    }

    conn
    |> render("index.html", current_user: get_session(conn, :current_user), whats_new: whats_new)
  end
end
