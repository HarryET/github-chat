# Github Chat

A chat room for every GitHub repository. Real-time.

<hr/>

## Sub-Projects
- [Vanity URLS](https://github.com/HarryET/github-chat-vanities)

## Development

### Run

```
yarn dev
```

## Supabase Submission

### Team

- HarryET - [GitHub](https://github.com/HarryET) [Twitter](https://twitter.com/TheHarryET)
- Hugo Cárdenas - [GitHub](https://github.com/hugo-cardenas) [Twitter](https://twitter.com/_hugocardenas)
- Victor Peralta - [GitHub](https://github.com/VictorPeralta) [Twitter](https://twitter.com/PeraltaDev)

### Instructions

#### How to enter a chat?

- Use the input in github-chat.com landing page to enter a repository owner/name and navigate to the corresponding chat room.
- Or if you are in github.com/owner/repo , just add -chat, like github-chat/owner/repo and navigate directly to the corresponding chat room.

Signed-in users will see a menu listing all the chat rooms in which they have been participating, for easy access.

### How we used supabase?

We have used all the features of supabase! They are broken down below with a more in-depth explanation for each.

#### Auth

- Github 0Auth

#### Realtime

The primary function of the app is to have a realtime chat for github repos so we have used realtime to listen for new messages and then update the messages being shown in the chat & feed.

#### Database

All of the data for the app has been store in the Supabase Postgresql database so it can be accessed through the SDKs with row level security enabled.

### Storage

Storage is used for file uploads. Users can share files in chats.
