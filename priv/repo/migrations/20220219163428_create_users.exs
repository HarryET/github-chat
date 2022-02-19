defmodule GithubChat.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users, primary_key: false) do
      add :id, :string, primary_key: true, null: false
      add :github_id, :integer, null: false

      add :username, :string, null: false
      add :email, :string, null: false
      add :avatar, :string, null: false

      add :bio, :string, null: true

      timestamps()
    end
  end
end
