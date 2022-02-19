defmodule GithubChatWeb.AuthController do
  use GithubChatWeb, :controller

  alias Ueberauth.Strategy.Helpers
  alias GithubChat.Utils.UserFromAuth

  def request(conn, _params) do
    conn
    |> redirect(external: Helpers.callback_url(conn))
  end

  def delete(conn, _params) do
    conn
    |> put_flash(:info, "You have been logged out!")
    |> clear_session()
    |> redirect(to: "/")
  end

  def callback(%{assigns: %{ueberauth_failure: _fails}} = conn, _params) do
    conn
    |> put_flash(:error, "Failed to authenticate.")
    |> redirect(to: "/")
  end

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    case UserFromAuth.find_or_create(auth) do
      {:ok, user} ->
        conn
        |> put_flash(:info, "Successfully authenticated.")
        |> put_session(:current_user, user)
        |> configure_session(renew: true)
        |> redirect(to: "/")

      {:error} ->
        conn
        |> put_flash(:error, "Failed to get account.")
        |> redirect(to: "/")
    end
  end
end
