defmodule GithubChat.MessagesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `GithubChat.Messages` context.
  """

  @doc """
  Generate a message.
  """
  def message_fixture(attrs \\ %{}) do
    {:ok, message} =
      attrs
      |> Enum.into(%{
        content: "some content"
      })
      |> GithubChat.Messages.create_message()

    message
  end
end
