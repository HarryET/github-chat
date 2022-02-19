defmodule GithubChat.Utils.UserFromAuth do
  @moduledoc """
  Retrieve the user information from an auth request
  """
  require Logger
  require Jason

  alias Ueberauth.Auth
  alias GithubChat.Models.User
  alias GithubChat.Repo

  @spec find_or_create(Auth.t()) :: {:ok, User} | {:error}
  def find_or_create(auth) do
    try do
      user = Repo.get_by!(User, github_id: auth.uid)
      {:ok, user}
    rescue
      Ecto.NoResultsError -> create(auth)
      _ -> {:error}
    end
  end

  @spec create(Auth.t()) :: {:ok, User} | {:error}
  defp create(auth) do
    case Repo.insert(%User{
           github_id: auth.uid,
           username: to_string(auth.info.nickname),
           email: to_string(auth.info.email),
           avatar: avatar_from_auth(auth),
           bio: to_string(auth.info.description)
         }) do
      {:ok, user} -> {:ok, user}
      {:error, _} -> {:error}
    end
  end

  defp avatar_from_auth(%{info: %{urls: %{avatar_url: image}}}), do: image
end
