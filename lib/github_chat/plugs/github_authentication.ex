defmodule GithubChat.Plugs.GithubAuthentication do
  import Plug.Conn

  def init(_params) do
  end

  def call(conn, _params) do
    with {:ok, digest} <- get_signature_digest(conn),
         {:ok, secret} <- get_secret(),
         {:ok} <- valid_request?(digest, secret, conn)
    do
      conn
    else
      _ -> conn |> send_resp(401, "Couldn't Authenticate") |> halt()
    end
  end

  defp get_signature_digest(conn) do
    case get_req_header(conn, "x-hub-signature") do
      ["sha1=" <> digest] -> {:ok, digest}
      _ -> {:error, "No Github Signature Found"}
    end
  end

  defp get_secret do
    Application.get_env(:my_app, :github_secret)
  end

  defp valid_request?(digest, secret, conn) do
    hmac = :crypto.mac(:hmac, :sha, secret, conn.assigns.raw_body) |> Base.encode16(case: :lower)
    if Plug.Crypto.secure_compare(digest, hmac) do
      {:ok}
    else
      {:error}
    end
  end
end
