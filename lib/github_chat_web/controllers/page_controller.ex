defmodule GithubChatWeb.PageController do
  use GithubChatWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
