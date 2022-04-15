defmodule GithubChat.Messages.Message do
  use Ecto.Schema
  import Ecto.Changeset

  schema "messages" do
    field :content, :string

    field :user_id, :integer
    belongs_to :user, GithubChat.Models.User, foreign_key: :user_id, references: :id, define_field: false

    timestamps()
  end

  @doc false
  def changeset(message, attrs) do
    message
    |> cast(attrs, [:content, :user_id])
    |> validate_required([:content, :user_id])
  end
end
