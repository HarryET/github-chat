<script lang="ts">
  import * as datefns from "date-fns";
  import { toHTML } from "./render";
  import type { Message } from "./types";
  import "./Message.styles.css"

  export let message: Message;

  const formatDate = (dateISOFormat: string) => {
    const date = datefns.parseISO(dateISOFormat);
    if (datefns.isToday(date) || datefns.isYesterday(date)) {
      return `${
        datefns.isToday(date) ? "Today" : "Yesterday"
      } at ${datefns.format(date, "HH:mm")}`;
    }
    return datefns.format(date, "dd/MM/yyyy");
  };

  const renderedContent = toHTML(message.content)
</script>

<div class="flex flex-row">
  <img
    src={message.user.avatar_url}
    alt={message.user.username}
    class="w-12 h-12 rounded-md"
  />
  <div class="flex flex-col ml-2 w-full">
    <div class="flex flex-row items-center content-start">
      <div class="flex flex-col items-start content-start">
        <a href={`/users/${message.user.username}`}>
          <p class="text-gray-900 font-semibold cursor-pointer hover:underline">
            {!!message.user.nickname
              ? message.user.nickname
              : message.user.username}
          </p>
        </a>
      </div>
      <p class="font-light ml-2 text-sm text-gray-500">
        {formatDate(message.created_at)}
      </p>
    </div>
    <p class="content max-w-full max-h-full break-words text-gray-800">
      {@html renderedContent}
    </p>
  </div>
</div>
