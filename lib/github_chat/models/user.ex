defmodule GithubChat.Models.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :string, autogenerate: {GithubChat.Utils.Generators, :gen_id, []}}
  schema "users" do
    field :github_id, :integer
    field :username, :string
    field :email, :string
    field :avatar, :string

    field :bio, :string

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:id, :username, :email, :bio])
    |> validate_required([:id, :username, :email, :bio])
  end
end
