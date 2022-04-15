defmodule GithubChatWeb.MessageLive.Index do
  use GithubChatWeb, :live_view

  alias GithubChat.Messages
  alias GithubChat.Messages.Message

  @impl true
  def mount(_params, %{"current_user" => user}, socket) do
    {:ok, socket |> assign(:messages, list_messages()) |> assign(:current_user, user)}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    socket
    |> assign(:page_title, "Edit Message")
    |> assign(:message, Messages.get_message(id))
  end

  defp apply_action(socket, :new, _params) do
    socket
    |> assign(:page_title, "New Message")
    |> assign(:message, %Message{
      user: socket.assigns[:current_user].id
    })
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Listing Messages")
    |> assign(:message, nil)
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    message = Messages.get_message(id)
    {:ok, _} = Messages.delete_message(message)

    {:noreply, assign(socket, :messages, list_messages())}
  end

  defp list_messages do
    Messages.list_messages()
  end
end
